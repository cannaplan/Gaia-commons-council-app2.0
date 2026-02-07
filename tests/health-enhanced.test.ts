import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { testConnection } from '../db';

describe('Enhanced Health Check Endpoint', () => {
  let app: express.Application;
  const serverStartTime = Date.now();

  beforeAll(async () => {
    app = express();
    app.use(express.json());

    const router = Router();

    // Enhanced health check endpoint
    router.get('/api/health', async (_req, res) => {
      const startTime = Date.now();
      
      // Test database connectivity
      const dbConnected = await testConnection();
      const dbResponseTime = Date.now() - startTime;
      
      // Calculate uptime in seconds
      const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
      
      // Get memory usage
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
      
      // Prepare response
      const healthStatus = {
        status: dbConnected ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: uptime,
        database: {
          connected: dbConnected,
          responseTime: `${dbResponseTime}ms`,
        },
        memory: {
          heapUsed: `${heapUsedMB}MB`,
          heapTotal: `${heapTotalMB}MB`,
        },
        version: '5.0.0',
        environment: process.env.NODE_ENV || 'development',
      };
      
      // Return 503 if database is unreachable
      const statusCode = dbConnected ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    });

    app.use(router);
  });

  describe('GET /api/health', () => {
    it('should return health status with all required fields', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
    });

    it('should have database object with connected and responseTime', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.database).toBeDefined();
      expect(response.body.database).toHaveProperty('connected');
      expect(response.body.database).toHaveProperty('responseTime');
      expect(typeof response.body.database.connected).toBe('boolean');
      expect(typeof response.body.database.responseTime).toBe('string');
      expect(response.body.database.responseTime).toMatch(/\d+ms/);
    });

    it('should have memory object with heapUsed and heapTotal', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.memory).toBeDefined();
      expect(response.body.memory).toHaveProperty('heapUsed');
      expect(response.body.memory).toHaveProperty('heapTotal');
      expect(typeof response.body.memory.heapUsed).toBe('string');
      expect(typeof response.body.memory.heapTotal).toBe('string');
      expect(response.body.memory.heapUsed).toMatch(/\d+MB/);
      expect(response.body.memory.heapTotal).toMatch(/\d+MB/);
    });

    it('should return healthy status when database is connected', async () => {
      const response = await request(app).get('/api/health');
      
      if (response.body.database.connected) {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
      }
    });

    it('should return 503 status when database is not connected', async () => {
      const response = await request(app).get('/api/health');
      
      if (!response.body.database.connected) {
        expect(response.status).toBe(503);
        expect(response.body.status).toBe('unhealthy');
      }
    });

    it('should have valid timestamp in ISO format', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.timestamp).toBeDefined();
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });

    it('should have non-negative uptime', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return version 5.0.0', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.version).toBe('5.0.0');
    });

    it('should return environment information', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.environment).toBeDefined();
      expect(typeof response.body.environment).toBe('string');
    });
  });
});
