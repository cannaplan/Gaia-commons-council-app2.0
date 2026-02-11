# Copilot Agent Instructions - Gaia Commons API

This document provides guidance for AI coding agents working on the Gaia Commons API project. Following these instructions will help you work more efficiently and produce code that aligns with project conventions.

## Project Overview

**Gaia Commons API v5.0** is a Node.js/TypeScript RESTful backend API for the Gaia Commons Initiative - a platform transforming education through regenerative agriculture. The API manages:

- 40 REST API endpoints across education, economics, environment, and governance domains
- PostgreSQL database with 39 tables
- Integration with 6 pilot schools scaling to 10,000 by 2030
- Climate impact tracking and financial metrics

## Technology Stack

| Component       | Technology                       |
| --------------- | -------------------------------- |
| Runtime         | Node.js 18+                      |
| Language        | TypeScript 5.7 (strict mode)     |
| Framework       | Express.js 4.22                  |
| Database        | PostgreSQL 14+                   |
| Testing         | Jest 30.2 + Supertest 7.2        |
| Package Manager | npm                              |
| Security        | Helmet, CORS, express-rate-limit |

## Quick Start for Development

### Initial Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Type check without building
npm run typecheck
```

### Database Setup

The application uses PostgreSQL. For local development:

```bash
# Option 1: Docker Compose (recommended)
docker compose up -d

# Option 2: Manual PostgreSQL setup
sudo -u postgres psql -c "CREATE DATABASE gaia_commons;"
sudo -u postgres psql -c "CREATE USER gaia_user WITH PASSWORD 'gaia_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gaia_commons TO gaia_user;"
psql -U gaia_user -d gaia_commons -f schema.sql
```

### Running the Application

```bash
# Development (builds and starts)
npm run dev

# Production
npm run build
npm start
```

The server starts at `http://localhost:3000`.

### Testing

```bash
# Run all tests (runs in band to avoid race conditions)
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Important**: Tests use `--runInBand` flag to run sequentially, preventing race conditions with shared storage.

## Code Conventions and Standards

### TypeScript Conventions

- **Strict mode enabled**: All code must pass TypeScript strict type checking
- **Async/await everywhere**: Use `async/await` for all I/O operations, never callbacks
- **Promise-based APIs**: All storage operations return Promises, even in-memory ones
- **Interface-first design**: Define interfaces for all data structures
- **Null safety**: Methods return `Type | null` when data might not exist
- **No `any` type**: Use proper types or `unknown` when type is truly unknown
- **Explicit return types**: Always specify return types for functions

### Naming Conventions

- **Variables/Functions**: camelCase (e.g., `getUserById`, `pilotStats`)
- **Classes/Interfaces**: PascalCase (e.g., `PgStorage`, `IStorage`, `PilotStats`)
- **Database columns**: snake_case (PostgreSQL standard, auto-converted to camelCase in JS)
- **Files**: Currently mixed (index.ts, routes.ts, pgStorage.ts) - follow existing patterns
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_CONNECTIONS`)
- **Descriptive names**: Use `getPilotStats()` not `get()`, `setTimelineEvents()` not `set()`

### Code Style

- **Indentation**: 2 spaces (not tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required at end of statements
- **Line length**: Prefer keeping lines under 100 characters
- **Arrow functions**: Use for inline/callback functions
- **Import organization**:
  1. External packages (express, cors, etc.)
  2. Internal modules (./routes, ./db, etc.)
  3. Type imports (interfaces, types)

### File Organization

```
Root Directory Structure:
├── index.ts              # Server entry point, middleware, startup
├── routes.ts             # All 40 API endpoints + seedDatabase()
├── storage.ts            # IStorage interface + MemStorage implementation
├── pgStorage.ts          # PgStorage class for PostgreSQL
├── db.ts                 # Database pool, query execution, connection testing
├── schema.sql            # PostgreSQL schema (39 tables)
├── tests/                # All test files
│   ├── health.test.ts
│   ├── api-endpoints.test.ts
│   └── storage.test.ts
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.cjs       # Jest configuration
└── docker-compose.yml    # Docker setup
```

### Express Application Patterns

#### Middleware Order (Critical!)

The middleware order in `index.ts` matters:

1. `helmet()` - Security headers
2. `cors()` - Cross-origin resource sharing
3. `morgan()` - Request logging
4. `express.json()` and `express.urlencoded()` - Body parsing
5. Routes (via `registerRoutes()`)
6. 404 handler
7. Global error handler (must be last!)

#### Rate Limiting

- Rate limiter: 100 requests per 15 minutes per IP
- Applied globally via `rateLimit` middleware
- Configuration in `routes.ts`

#### Response Format

- **All responses are JSON**
- **Status codes**: 200 (success), 404 (not found), 500 (errors)
- **Singleton endpoints** return objects: `/api/pilot`, `/api/endowment`
- **List endpoints** return arrays: `/api/schools`, `/api/timeline`
- **Consistent structure**: Either `{ status, message, data }` or direct data object

#### Error Handling

```typescript
// Global error handler signature (note unused params with underscore)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});
```

### Database and Storage Layer

#### Storage Architecture

The project uses an **interface-based abstraction** pattern:

- `IStorage` interface defines all storage methods
- `MemStorage` class implements in-memory storage (default, used in tests)
- `PgStorage` class implements PostgreSQL storage
- Singleton pattern: `export const storage = new MemStorage();`

#### Database Connection

**Connection Pool Configuration** (in `db.ts`):

```typescript
// Environment variables with defaults
DB_HOST = localhost;
DB_PORT = 5432;
DB_NAME = gaia_commons;
DB_USER = your_db_user;
DB_PASSWORD = your_db_password;
DB_POOL_MAX = 20;
DB_IDLE_TIMEOUT = 30000;
DB_CONNECTION_TIMEOUT = 2000;
```

**Important patterns**:

- Pool errors trigger `process.exit(-1)` (fail-fast)
- Connection testing returns boolean, logs with emoji (✅/❌)
- Server startup requires successful database connection
- Explicit `client.release()` for transaction management
- Query logging includes duration and row count

#### Storage Method Patterns

All storage methods follow these patterns:

```typescript
// Singleton stats - returns first row or null
getPilotStats(): Promise<PilotStats | null>

// List data - returns all items as array
getSchools(): Promise<School[]>

// Setters - for bulk data insertion
setPilotStats(stats: PilotStats): Promise<void>
setSchools(schools: School[]): Promise<void>
```

**Key characteristics**:

- No filtering or pagination - full datasets returned
- No individual CRUD (no update, delete, or create for single items)
- All methods are async, even in-memory implementation
- Methods return `null` when data doesn't exist, not throwing errors

### Testing Conventions

#### Test File Organization

- Location: `tests/*.test.ts` (not `.spec.ts`)
- Use `describe()` for test suites
- Use `it()` for individual tests
- Use `beforeAll()` for setup, `afterAll()` for cleanup

#### Test Structure

```typescript
describe('Endpoint Group', () => {
  beforeAll(async () => {
    // Seed data using storage.set* methods
    await storage.setPilotStats({ ... });
  });

  it('should return expected data', async () => {
    // Arrange, Act, Assert pattern
    const response = await request(app).get('/api/endpoint');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('propertyName');
    expect(typeof response.body.field).toBe('number');
  });
});
```

#### Testing Best Practices

- **No database mocking**: Use real storage (MemStorage or actual DB)
- **Data seeding**: Populate via `storage.set*` methods in `beforeAll`
- **Supertest**: Use for HTTP request testing
- **Timeout override**: Add `}, 10000)` for longer tests
- **Parallel safety**: Tests run with `--runInBand` to avoid race conditions
- **Property checks**: Use `.toHaveProperty()` and `typeof` for validation

### Server Startup and Shutdown

#### Startup Sequence

```typescript
1. Load environment variables (dotenv.config())
2. Test database connection (testConnection())
3. Seed database with initial data (seedDatabase())
4. Register routes (registerRoutes())
5. Start listening on PORT
6. Log startup message with ASCII art and emojis
```

#### Graceful Shutdown

```typescript
// Handle SIGTERM and SIGINT
process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaia_commons
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Connection Pool
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# API
API_RATE_LIMIT=100
API_RATE_WINDOW=900000

# Security
CORS_ORIGIN=*
```

## Common Development Tasks

### Adding a New API Endpoint

1. Define the TypeScript interface in `storage.ts`
2. Add getter/setter methods to `IStorage` interface
3. Implement in `MemStorage` class (in-memory)
4. Implement in `PgStorage` class (PostgreSQL)
5. Add route in `routes.ts` using the storage methods
6. Add seed data to `seedDatabase()` function
7. Create database table in `schema.sql`
8. Write tests in `tests/api-endpoints.test.ts`

### Modifying Existing Endpoints

1. Update interface if data structure changes
2. Update both storage implementations
3. Modify route handler if needed
4. Update seed data if structure changed
5. Update/add tests to cover changes
6. Update schema.sql if database structure changed

### Running Database Migrations

This project currently uses a single `schema.sql` file. For migrations:

1. Backup existing data
2. Update `schema.sql` with new schema
3. Drop and recreate database (development only!)
4. Run `psql -U gaia_user -d gaia_commons -f schema.sql`

**Note**: Production migrations should be handled more carefully with versioned migration files.

## Build and CI/CD

### Build Process

```bash
# TypeScript compilation
npm run build

# Outputs to dist/ directory
# Creates .js, .d.ts, and .js.map files
```

### Code Quality Checks

Before committing changes, run these commands to ensure code quality:

```bash
# Type checking (without building)
npm run typecheck

# Linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without modifying files
npm run format:check

# Run all validation checks (typecheck + lint + format + test)
npm run validate
```

**Required Before Each Commit**:

- Run `npm run lint:fix` to fix any linting issues
- Run `npm run format` to ensure consistent code formatting
- Run `npm run validate` for a complete check before pushing

### CI Pipeline

The project uses GitHub Actions (`.github/workflows/ci.yml`):

1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Build TypeScript (`npm run build`)
5. Start PostgreSQL service
6. Start server in background
7. Run tests (`npm test`)

**Environment for CI**:

```yaml
DB_HOST: localhost
DB_PORT: 5432
DB_NAME: gaia_commons_test
DB_USER: gaia_user
DB_PASSWORD: test_password
PORT: 3000
NODE_ENV: test
```

### Docker Support

```bash
# Build and run with Docker Compose
docker compose up

# Includes PostgreSQL service
# Health checks configured
# Non-root user for security
```

## Common Issues and Workarounds

### Issue 1: TypeScript Compilation Errors

**Problem**: Strict mode can cause type errors

**Solution**:

- Use proper types, avoid `any`
- Add type assertions only when necessary: `value as Type`
- Use `unknown` for truly unknown types, then narrow with type guards

### Issue 2: Database Connection Fails

**Problem**: Server won't start due to database connection failure

**Symptoms**: "❌ Database connection failed" message

**Solutions**:

1. Verify PostgreSQL is running: `pg_isready`
2. Check `.env` credentials match database
3. Ensure database exists: `psql -l`
4. For Docker: `docker compose up -d postgres` first
5. Check PostgreSQL logs for authentication errors

### Issue 3: Tests Hanging or Failing

**Problem**: Tests timeout or have race conditions

**Solutions**:

- Always use `--runInBand` flag (already in package.json)
- Increase timeout for slow tests: `jest.setTimeout(10000)`
- Ensure proper cleanup in `afterAll()` hooks
- Check that server is running for integration tests

### Issue 4: Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::3000`

**Solutions**:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Issue 5: Module Resolution Errors

**Problem**: `Cannot find module` errors

**Solutions**:

- Ensure `npm install` has been run
- Check `tsconfig.json` has correct `moduleResolution: "node"`
- Verify imports use correct file extensions (none for .ts files)
- Clear build cache: `rm -rf dist && npm run build`

### Issue 6: Jest Configuration Issues

**Problem**: Jest can't find TypeScript files or has transform errors

**Solution**: The project uses `ts-jest`:

```javascript
// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: true,
  testTimeout: 10000,
};
```

Don't modify without understanding ts-jest transform pipeline.

## Documentation Standards

### Code Comments

- Use `// ====...====` for major section headers
- Minimal inline comments - code should be self-documenting
- Comment complex logic or non-obvious decisions
- Use emojis in console output (✅, ❌, 🌿) for visual feedback

### JSDoc for Public APIs

While not currently used extensively, consider adding:

```typescript
/**
 * Retrieves pilot program statistics
 * @returns Promise resolving to PilotStats or null if not found
 */
async getPilotStats(): Promise<PilotStats | null>
```

### Updating Documentation

When making changes, update:

- `README.md` - For API changes, setup changes, or new features
- `CHANGELOG.md` - Following Keep a Changelog format
- `CONTRIBUTING.md` - For new development workflows or standards
- This file (`.github/copilot-instructions.md`) - For new conventions or patterns

## Security Considerations

### Current Security Measures

- **Helmet**: Security headers middleware
- **CORS**: Configured for all origins in development
- **Rate Limiting**: 100 requests per 15 minutes
- **Body Size Limit**: 10mb for JSON payloads
- **SQL Injection Prevention**: Use parameterized queries (`$1, $2, etc.`)
- **Environment Variables**: Secrets in `.env`, never committed

### Security Best Practices

1. **Never commit secrets**: Use `.env` for sensitive data
2. **Parameterized queries**: Always use `$1` placeholders in SQL
3. **Input validation**: Validate all user inputs before processing
4. **Error messages**: Don't expose sensitive information in errors
5. **Dependencies**: Run `npm audit` regularly to check for vulnerabilities

## Performance Considerations

### Database Performance

- **Connection pooling**: Max 20 connections by default
- **Query optimization**: Add indexes for frequently queried columns
- **Batch operations**: Use `set*` methods for bulk inserts
- **Logging**: Query duration logged for performance monitoring

### API Performance

- **Rate limiting**: Prevents abuse (100 req/15 min)
- **Body size limits**: 10mb prevents memory issues
- **No pagination**: Current implementation returns full datasets (consider for large datasets)

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

Examples:
feat(api): add DELETE endpoint for schools
fix(db): correct connection pool timeout
docs(readme): update installation instructions
test(api): add tests for climate endpoints
refactor(storage): simplify query logic
chore(deps): update dependencies
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent production fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring

## Additional Resources

- **README.md**: Comprehensive project overview and setup
- **DATABASE_SETUP.md**: Detailed database configuration
- **INSTALLATION_GUIDE.md**: Step-by-step installation
- **CONTRIBUTING.md**: Contributing guidelines and standards
- **REQUIREMENTS.md**: Project requirements and specifications
- **CHANGELOG.md**: Version history and changes

## Key Architectural Principles

1. **Interface-based abstraction**: Allows swapping storage implementations
2. **Promise-everywhere pattern**: Consistency even for sync operations
3. **Fail-fast on startup**: Database required before server starts
4. **Comprehensive seeding**: Full test data in `seedDatabase()`
5. **No breaking changes**: Maintain backward compatibility for API endpoints
6. **Type safety first**: TypeScript strict mode enforced
7. **Simplicity over complexity**: Prefer clear, maintainable code

## When to Ask for Help

If you encounter:

- Unclear requirements or specifications
- Complex architectural decisions
- Security concerns
- Breaking changes needed
- Performance bottlenecks
- Database migration needs

Create a GitHub issue or ask for guidance before proceeding.

---

**Remember**: This project prioritizes simplicity, testability, and consistency. When in doubt, follow existing patterns in the codebase.

🌿 **Transforming education, one greenhouse at a time.**
