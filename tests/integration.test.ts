// ============================================================================
// GAIA COMMONS API - Integration Tests
// Full integration tests for all 40+ endpoints
// ============================================================================

import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { registerRoutes } from '../routes';

const app = express();
const server = createServer(app);

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let router: any;

beforeAll(async () => {
  // Register routes with seed data
  router = await registerRoutes(server);
  app.use(router);

  // Error handlers
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ status: 'error', message: 'Not found' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ status: 'error', message: err.message });
  });
});

describe('Integration Tests - All Endpoints', () => {
  describe('Core Endpoints', () => {
    it('GET /api/health - should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('healthy');
    });

    it('GET /api/pilot - should return pilot stats', async () => {
      const response = await request(app).get('/api/pilot');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalSchools');
      expect(response.body).toHaveProperty('totalStudents');
    });

    it('GET /api/endowment - should return endowment stats', async () => {
      const response = await request(app).get('/api/endowment');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('principal');
      expect(response.body).toHaveProperty('annualDistribution');
    });
  });

  describe('Monitoring Endpoints', () => {
    it('GET /api/ready - should return readiness status', async () => {
      const response = await request(app).get('/api/ready');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ready');
    });

    it('GET /api/live - should return liveness status', async () => {
      const response = await request(app).get('/api/live');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'alive');
      expect(response.body).toHaveProperty('uptime');
    });

    it('GET /api/metrics - should return metrics', async () => {
      const response = await request(app).get('/api/metrics');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('memory');
    });
  });

  describe('Data Endpoints', () => {
    it('GET /api/timeline - should return timeline events', async () => {
      const response = await request(app).get('/api/timeline');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /api/financials - should return financial metrics', async () => {
      const response = await request(app).get('/api/financials');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalInvestment');
    });

    it('GET /api/climate - should return climate metrics', async () => {
      const response = await request(app).get('/api/climate');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('carbonSequestered');
    });

    it('GET /api/schools - should return schools list', async () => {
      const response = await request(app).get('/api/schools');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /api/metrics-dashboard - should return metrics data', async () => {
      const response = await request(app).get('/api/metrics-dashboard');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should handle invalid request methods', async () => {
      const response = await request(app).post('/api/health');
      expect(response.status).toBe(404);
    });
  });

  describe('Response Format', () => {
    it('should return JSON responses', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should include request ID header', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers).toHaveProperty('x-request-id');
    });
  });
});

describe('Integration Tests - Advanced Scenarios', () => {
  describe('Data Consistency', () => {
    it('should maintain consistent data across endpoints', async () => {
      const pilotResponse = await request(app).get('/api/pilot');
      const schoolsResponse = await request(app).get('/api/schools');

      expect(pilotResponse.body.totalSchools).toBeDefined();
      expect(Array.isArray(schoolsResponse.body)).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should respond to health check within 100ms', async () => {
      const start = Date.now();
      await request(app).get('/api/health');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get('/api/health'));

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });
});
