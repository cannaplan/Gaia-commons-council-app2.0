# Architecture Documentation

## System Architecture

The Gaia Commons API is a RESTful backend service built with Node.js, TypeScript, and PostgreSQL, designed for high reliability and scalability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Web Apps, Mobile Apps, Third-party Integrations)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Rate Limiter (100 req/15min per IP)                 │   │
│  │  Security Headers (Helmet)                           │   │
│  │  CORS Middleware                                     │   │
│  │  Request ID Middleware (UUID)                        │   │
│  │  Request Timeout (30s default)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │   Storage    │  │  Monitoring   │      │
│  │  (40+ APIs)  │  │  Interface   │  │  Endpoints    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  Health: /api/health                                         │
│  Monitoring: /api/metrics, /api/ready, /api/live           │
│  Data: /api/pilot, /api/endowment, /api/timeline, etc.     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL Connection Pool                    │   │
│  │  - Max: 20 connections                               │   │
│  │  - Idle timeout: 30s                                 │   │
│  │  - Connection timeout: 2s                            │   │
│  │  - Query timeout: 30s                                │   │
│  │  - Retry logic with exponential backoff              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL Database (39 tables)              │   │
│  │  - pilot_stats, endowment_stats, schools             │   │
│  │  - timeline_events, financial_metrics                │   │
│  │  - climate_metrics, and 33+ more tables              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Application Entry Point (index.ts)

**Responsibilities:**

- Server initialization and lifecycle management
- Middleware configuration (order matters!)
- Signal handling for graceful shutdown
- Connection tracking for active requests

**Key Features:**

- Request ID generation for tracing
- Request timeout middleware (30s default)
- Graceful shutdown with 10s force timeout
- Connection tracking for cleanup
- Error handling with stack traces in development

### 2. Database Layer (db.ts)

**Responsibilities:**

- Connection pool management
- Query execution with logging
- Health monitoring
- Retry logic for failed connections

**Key Features:**

- Connection retry logic (3 attempts, 2s delay)
- Pool metrics tracking (total, idle, waiting, errors)
- Slow query logging (>1s)
- Health check endpoint support
- Query duration logging

**Connection Pool Configuration:**

```typescript
{
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // 30 seconds
  connectionTimeoutMillis: 2000, // 2 seconds
  statement_timeout: 30000    // 30 seconds per query
}
```

### 3. Storage Abstraction (storage.ts, pgStorage.ts)

**Pattern:** Interface-based abstraction for flexibility

**Implementations:**

- **MemStorage**: In-memory storage for development/testing
- **PgStorage**: PostgreSQL storage for production

**Design Benefits:**

- Easy testing with in-memory storage
- Database-agnostic API endpoints
- Simple storage layer swapping
- Consistent Promise-based API

### 4. API Routes (routes.ts)

**Organization:**

- 40+ RESTful endpoints
- Rate limiting middleware
- Comprehensive seed data
- Monitoring endpoints

**Endpoint Categories:**

1. **Core Metrics**: /api/pilot, /api/endowment, /api/financials
2. **Data Lists**: /api/schools, /api/timeline, /api/climate
3. **Monitoring**: /api/health, /api/ready, /api/live, /api/metrics
4. **Specialized**: Domain-specific endpoints (education, economics, etc.)

## Design Patterns

### 1. Interface-Based Abstraction

All storage operations go through the `IStorage` interface:

```typescript
interface IStorage {
  getPilotStats(): Promise<PilotStats | null>;
  setPilotStats(stats: PilotStats): Promise<void>;
  // ... 40+ methods
}
```

**Benefits:**

- Testability
- Flexibility
- Loose coupling

### 2. Singleton Pattern

Storage and database pool use singleton pattern:

```typescript
export const storage = new MemStorage();
export const pool = new Pool(poolConfig);
```

### 3. Middleware Pipeline

Express middleware executes in strict order:

1. Request ID
2. Timeout
3. Helmet (security)
4. CORS
5. Morgan (logging)
6. Body parsing
7. Routes
8. 404 handler
9. Error handler (MUST be last)

### 4. Graceful Degradation

- Retry logic for database connections
- Connection health monitoring
- Timeout handling
- Error recovery

## Data Flow

### Typical Request Flow

```
1. Client Request
   ↓
2. Rate Limiter Check
   ↓
3. Request ID Generation
   ↓
4. Security Headers Applied
   ↓
5. CORS Validation
   ↓
6. Request Logging
   ↓
7. Body Parsing
   ↓
8. Route Handler
   ↓
9. Storage Interface Call
   ↓
10. Database Query (if PgStorage)
   ↓
11. Response Formation
   ↓
12. Response Headers (Request ID, etc.)
   ↓
13. Client Response
```

### Error Flow

```
1. Error Occurs
   ↓
2. Try-Catch or Promise Rejection
   ↓
3. Error Handler Middleware
   ↓
4. Error Logging (with stack in dev)
   ↓
5. Sanitized Error Response
   ↓
6. 500 Status Code
   ↓
7. Client Error Response
```

## Monitoring & Observability

### Health Endpoints

**`/api/health`**: Basic health check

- Returns: `{ status: 'healthy', timestamp }`

**`/api/ready`**: Kubernetes readiness probe

- Tests database connection
- Returns: `{ status: 'ready', timestamp }` or 503

**`/api/live`**: Kubernetes liveness probe

- Returns: `{ status: 'alive', uptime, timestamp }`

**`/api/metrics`**: Prometheus-style metrics

- Uptime
- Database health and latency
- Pool metrics (connections, idle, waiting)
- Memory usage (heap, total, RSS)

### Logging Strategy

**Development:**

- Verbose query logging
- Stack traces in errors
- Request/response logging

**Production:**

- Error logging only
- No stack traces exposed
- Metric-based monitoring

## Security Architecture

### Security Layers

1. **Network Level**
   - Rate limiting (100 req/15min per IP)
   - CORS configuration
   - Request timeout

2. **Application Level**
   - Helmet security headers
   - Input validation (JSON size limit: 10MB)
   - Request ID for audit trails

3. **Database Level**
   - Parameterized queries (SQL injection prevention)
   - Connection pool limits
   - Query timeout enforcement

### Security Headers (Helmet)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=15552000
```

## Performance Optimizations

### Database

- Connection pooling (max 20 connections)
- Query duration logging
- Slow query detection (>1s)
- Connection retry logic

### Application

- Request timeout (prevents hanging)
- Graceful shutdown (preserves active requests)
- Connection tracking (efficient cleanup)

### Future Optimizations

- Response compression (gzip)
- ETag caching
- Redis caching layer
- Query result caching
- Prepared statement caching

## Scalability Considerations

### Horizontal Scaling

The application is stateless and can be scaled horizontally:

```
Load Balancer
    ↓
┌────────┬────────┬────────┐
│ App 1  │ App 2  │ App 3  │
└────────┴────────┴────────┘
         ↓
   PostgreSQL
```

**Considerations:**

- Shared database connection pool
- Session-less design
- Request ID for distributed tracing
- Health check endpoints for load balancer

### Vertical Scaling

Database connection pool can be tuned:

```typescript
DB_POOL_MAX = 50; // Increase max connections
DB_IDLE_TIMEOUT = 10000; // Reduce idle timeout
```

## Deployment Architecture

### Docker Deployment

```
┌─────────────────────────────────────┐
│         Docker Host                  │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Gaia Commons API Container  │   │
│  │  - Port: 3000                │   │
│  │  - Non-root user             │   │
│  │  - Health check enabled      │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  PostgreSQL Container        │   │
│  │  - Port: 5432                │   │
│  │  - Volume mounted            │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Kubernetes Deployment

```
┌─────────────────────────────────────┐
│         Kubernetes Cluster           │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Deployment (3 replicas)     │   │
│  │  - Readiness: /api/ready     │   │
│  │  - Liveness: /api/live       │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Service (LoadBalancer)      │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  ConfigMap (env vars)        │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Secret (DB credentials)     │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Technology Decisions

### Why TypeScript?

- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

### Why PostgreSQL?

- ACID compliance
- Rich data types
- Excellent performance
- Strong community support
- Free and open source

### Why Express?

- Minimal and flexible
- Large ecosystem
- Production-proven
- Easy to understand

### Why In-Memory + PostgreSQL Storage?

- Fast development iteration
- Easy testing without DB
- Production-ready database support
- Flexible architecture

## Future Enhancements

### Planned Features

1. **Caching Layer**
   - Redis integration
   - Query result caching
   - Session management

2. **Advanced Monitoring**
   - Prometheus metrics export
   - Grafana dashboards
   - APM integration (New Relic, DataDog)

3. **Performance**
   - Response compression
   - ETag caching
   - GraphQL alternative
   - Batch operations

4. **Security**
   - API key authentication
   - JWT token support
   - OAuth2 integration
   - Advanced rate limiting per endpoint

5. **Developer Experience**
   - GraphQL playground
   - Enhanced API documentation
   - Code generation from OpenAPI
   - SDK generation

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and architectural conventions.

## Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](SECURITY.md) - Security policies
- [API.md](API.md) - API documentation
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database configuration
