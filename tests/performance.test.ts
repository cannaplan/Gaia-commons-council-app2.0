// ============================================================================
// GAIA COMMONS API - Performance Tests
// Load testing and response time validation
// ============================================================================

import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { registerRoutes } from '../routes';

const app = express();
const server = createServer(app);

beforeAll(async () => {
  // Middleware setup
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Register routes
  const router = await registerRoutes(server);
  app.use(router);

  // Error handlers
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ status: 'error', message: 'Not found' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ status: 'error', message: err.message });
  });
});

describe('Performance Tests', () => {
  describe('Response Time', () => {
    it('should respond to health check within 100ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/health');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100);
    });

    it('should respond to ready check within 500ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/ready');
      const duration = Date.now() - start;

      expect(response.status).toBeLessThan(400);
      expect(duration).toBeLessThan(500);
    });

    it('should respond to liveness check within 50ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/live');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(50);
    });

    it('should respond to pilot endpoint within 200ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/pilot');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(200);
    });

    it('should respond to metrics endpoint within 300ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/metrics');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(300);
    });
  });

  describe('Throughput', () => {
    it('should handle 10 concurrent requests', async () => {
      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get('/api/health'));

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
      expect(duration).toBeLessThan(1000);
    });

    it('should handle 20 concurrent requests', async () => {
      const requests = Array(20)
        .fill(null)
        .map(() => request(app).get('/api/health'));

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
      expect(duration).toBeLessThan(2000);
    }, 10000);

    it('should handle mixed endpoint requests', async () => {
      const endpoints = [
        '/api/health',
        '/api/pilot',
        '/api/endowment',
        '/api/climate',
        '/api/financials',
      ];

      const requests = endpoints.map((endpoint) => request(app).get(endpoint));

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Load Testing', () => {
    it('should maintain performance under sustained load', async () => {
      const iterations = 5;
      const concurrentRequests = 10;
      const results: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const requests = Array(concurrentRequests)
          .fill(null)
          .map(() => request(app).get('/api/health'));

        const start = Date.now();
        const responses = await Promise.all(requests);
        const duration = Date.now() - start;

        results.push(duration);
        responses.forEach((response) => {
          expect(response.status).toBe(200);
        });
      }

      const avgDuration = results.reduce((a, b) => a + b, 0) / results.length;
      expect(avgDuration).toBeLessThan(1000);
    }, 15000);

    it('should handle burst traffic', async () => {
      // Simulate burst: 50 requests all at once
      const requests = Array(50)
        .fill(null)
        .map(() => request(app).get('/api/health'));

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      const successCount = responses.filter((r) => r.status === 200).length;
      expect(successCount).toBeGreaterThan(40); // At least 80% success
      expect(duration).toBeLessThan(5000);
    }, 15000);
  });

  describe('Payload Size', () => {
    it('should handle small responses efficiently', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/health');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100);

      const contentLength = JSON.stringify(response.body).length;
      expect(contentLength).toBeLessThan(10000);
    });

    it('should handle medium responses efficiently', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/schools');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(200);
    });

    it('should handle large responses efficiently', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/timeline');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(300);
    });
  });

  describe('Memory Efficiency', () => {
    it('should not leak memory during repeated requests', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Make 100 requests
      for (let i = 0; i < 100; i++) {
        await request(app).get('/api/health');
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }, 20000);
  });

  describe('Database Query Performance', () => {
    it('should execute database queries efficiently', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/ready');
      const duration = Date.now() - start;

      expect(response.status).toBeLessThan(400);
      expect(duration).toBeLessThan(500);
    });

    it('should handle concurrent database queries', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() => request(app).get('/api/ready'));

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      responses.forEach((response) => {
        expect(response.status).toBeLessThan(400);
      });
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Response Consistency', () => {
    it('should maintain consistent response times', async () => {
      const iterations = 10;
      const responseTimes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await request(app).get('/api/health');
        const duration = Date.now() - start;
        responseTimes.push(duration);
      }

      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxTime = Math.max(...responseTimes);
      const minTime = Math.min(...responseTimes);

      expect(avgTime).toBeLessThan(100);
      expect(maxTime - minTime).toBeLessThan(200); // Variance should be low
    }, 10000);
  });

  describe('Error Recovery Performance', () => {
    it('should handle errors without performance degradation', async () => {
      // Make some requests to non-existent endpoints
      const errorRequests = Array(5)
        .fill(null)
        .map(() => request(app).get('/api/nonexistent'));

      await Promise.all(errorRequests);

      // Subsequent valid requests should still be fast
      const start = Date.now();
      const response = await request(app).get('/api/health');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100);
    });
  });
});

describe('Performance Benchmarks', () => {
  describe('Baseline Metrics', () => {
    it('should establish baseline performance', async () => {
      const metrics = {
        health: 0,
        pilot: 0,
        endowment: 0,
        metrics: 0,
      };

      // Health check
      let start = Date.now();
      await request(app).get('/api/health');
      metrics.health = Date.now() - start;

      // Pilot endpoint
      start = Date.now();
      await request(app).get('/api/pilot');
      metrics.pilot = Date.now() - start;

      // Endowment endpoint
      start = Date.now();
      await request(app).get('/api/endowment');
      metrics.endowment = Date.now() - start;

      // Metrics endpoint
      start = Date.now();
      await request(app).get('/api/metrics');
      metrics.metrics = Date.now() - start;

      // Log metrics for reference
      console.log('Performance Baseline:', metrics);

      // All should be reasonably fast
      expect(metrics.health).toBeLessThan(100);
      expect(metrics.pilot).toBeLessThan(200);
      expect(metrics.endowment).toBeLessThan(200);
      expect(metrics.metrics).toBeLessThan(300);
    });
  });
});
