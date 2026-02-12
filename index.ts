// ============================================================================
// GAIA COMMONS API v5.0 - Server Entry Point
// ============================================================================

import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { registerRoutes } from './routes';
import { testConnection, closePool } from './db';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Track active connections for graceful shutdown
let connections = new Set<any>();

server.on('connection', (conn) => {
  connections.add(conn);
  conn.on('close', () => {
    connections.delete(conn);
  });
});

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Request ID middleware for tracing
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  res.setHeader('X-Request-Id', requestId);
  // Store request ID for logging
  (req as any).requestId = requestId;
  next();
});

// Request timeout middleware (30 seconds default)
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || '30000');
app.use((_req: Request, res: Response, next: NextFunction) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        status: 'error',
        message: 'Request timeout',
      });
    }
  }, REQUEST_TIMEOUT);

  res.on('finish', () => {
    clearTimeout(timeout);
  });

  next();
});

// Security headers
app.use(helmet());

// CORS - allow all origins in development
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// API DOCUMENTATION
// ============================================================================

// Load OpenAPI specification
const openapiPath = join(__dirname, '..', 'openapi.yaml');
const openapiFile = readFileSync(openapiPath, 'utf8');
const openapiSpec = YAML.parse(openapiFile);

// Serve Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Gaia Commons API Documentation',
  })
);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Cannot start server without database connection');
      process.exit(1);
    }

    // Register all API routes (this also seeds the database)
    const router = await registerRoutes(server);
    app.use(router);

    // ============================================================================
    // ERROR HANDLING (must be after routes)
    // ============================================================================

    // ============================================================================
    // ERROR HANDLING (must be after routes)
    // ============================================================================

    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found`,
      });
    });

    // Global error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error('❌ Error:', err);
      
      // Log stack trace in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Stack trace:', err.stack);
      }
      
      res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    });

    server.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════════════════════╗');
      console.log('║                                                              ║');
      console.log('║           🌿 GAIA COMMONS API v5.0 🌿                        ║');
      console.log('║                                                              ║');
      console.log('║   Transforming education through regenerative agriculture    ║');
      console.log('║                                                              ║');
      console.log(`║   Server running on http://localhost:${PORT}                 ║`);
      console.log('║                                                              ║');
      console.log('║   Endpoints:                                                 ║');
      console.log('║   • GET  /api/health           - Health check                ║');
      console.log('║   • GET  /api/pilot            - Pilot program stats         ║');
      console.log('║   • GET  /api/endowment        - Endowment metrics           ║');
      console.log('║   • GET  /api/timeline         - Timeline events             ║');
      console.log('║   • GET  /api/financials       - Financial metrics           ║');
      console.log('║   • GET  /api/climate          - Climate metrics             ║');
      console.log('║   • ... and 34+ more endpoints                               ║');
      console.log('║                                                              ║');
      console.log(`║   📚 API Documentation: http://localhost:${PORT}/api-docs    ║`);
      console.log('║                                                              ║');
      console.log('╚══════════════════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  // Stop accepting new connections
  server.close(async () => {
    console.log('Server stopped accepting new connections');
    
    // Close database pool
    await closePool();
    
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
  
  // Close existing connections
  connections.forEach((conn) => conn.destroy());
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  
  // Stop accepting new connections
  server.close(async () => {
    console.log('Server stopped accepting new connections');
    
    // Close database pool
    await closePool();
    
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
  
  // Close existing connections
  connections.forEach((conn) => conn.destroy());
});
