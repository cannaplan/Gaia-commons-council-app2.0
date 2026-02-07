import request from 'supertest';
import express from 'express';
import { Router, Request, Response, NextFunction } from 'express';

describe('Error Handling Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    const router = Router();

    // Valid endpoint
    router.get('/api/health', (_req, res) => {
      res.json({ status: 'ok' });
    });

    // Endpoint that throws an error
    router.get('/api/error', (_req, _res) => {
      throw new Error('Test error');
    });

    // Endpoint that returns null
    router.get('/api/null-data', async (_req, res) => {
      res.json(null);
    });

    app.use(router);

    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found`,
      });
    });

    // Global error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
      });
    });
  });

  describe('404 Not Found Errors', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('error');
    });

    it('should return 404 with descriptive message', async () => {
      const response = await request(app).get('/api/invalid-endpoint');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should return 404 for wrong HTTP method', async () => {
      const response = await request(app).post('/api/health');
      expect(response.status).toBe(404);
    });

    it('should include route path in 404 error message', async () => {
      const response = await request(app).get('/api/does-not-exist');
      expect(response.body.message).toContain('/api/does-not-exist');
    });
  });

  describe('500 Internal Server Errors', () => {
    it('should return 500 when endpoint throws error', async () => {
      const response = await request(app).get('/api/error');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('error');
    });

    it('should include error message in 500 response', async () => {
      const response = await request(app).get('/api/error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Test error');
    });
  });

  describe('Malformed Request Handling', () => {
    it('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/health')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      // Should return an error status
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should handle requests with missing content-type', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Null and Empty Data Handling', () => {
    it('should handle null data responses gracefully', async () => {
      const response = await request(app).get('/api/null-data');
      expect(response.status).toBe(200);
      expect(response.body).toBeNull();
    });
  });

  describe('CORS and Headers', () => {
    it('should include proper content-type header', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return JSON for error responses', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Rate Limiting Edge Cases', () => {
    it('should handle multiple rapid requests', async () => {
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(request(app).get('/api/health'));
      }

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect(response.status).toBeLessThan(500);
      });
    });
  });

  describe('Data Validation', () => {
    it('should return consistent error structure for 404', async () => {
      const response = await request(app).get('/api/missing');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
    });

    it('should return consistent error structure for 500', async () => {
      const response = await request(app).get('/api/error');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Special Characters in URLs', () => {
    it('should handle URL-encoded characters', async () => {
      const response = await request(app).get('/api/test%20space');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status');
    });

    it('should handle special characters in path', async () => {
      const response = await request(app).get('/api/test@special');
      expect(response.status).toBe(404);
    });
  });

  describe('Response Time and Performance', () => {
    it('should respond to valid requests quickly', async () => {
      const startTime = Date.now();
      await request(app).get('/api/health');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should respond to 404 errors quickly', async () => {
      const startTime = Date.now();
      await request(app).get('/api/nonexistent');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(1000);
    });
  });
});
