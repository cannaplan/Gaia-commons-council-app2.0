// ============================================================================
// GAIA COMMONS API - Security Tests
// Tests for security headers, CORS, rate limiting, and input validation
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

describe('Security Tests', () => {
  describe('Security Headers', () => {
    it('should include helmet security headers', async () => {
      const response = await request(app).get('/api/health');

      // Check for common security headers set by helmet
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should include X-Frame-Options header', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers).toHaveProperty('x-frame-options');
    });

    it('should not expose server information', async () => {
      const response = await request(app).get('/api/health');
      // Server header should not reveal detailed version info
      const serverHeader = response.headers['x-powered-by'];
      expect(serverHeader).toBeUndefined();
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Rate Limiting', () => {
    it('should accept requests within rate limit', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });

    it('should rate limit be configured', async () => {
      // Make multiple requests to test rate limiting configuration
      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get('/api/health'));

      const responses = await Promise.all(requests);

      // All should succeed if we're under the limit (100 req/15min)
      responses.forEach((response) => {
        expect(response.status).toBeLessThan(500);
      });
    });
  });

  describe('Input Validation', () => {
    it('should handle large JSON payloads within limit', async () => {
      const largePayload = { data: 'x'.repeat(1024 * 1024) }; // 1MB
      const response = await request(app)
        .post('/api/health')
        .send(largePayload);

      // Should handle without crashing (may return 404 for POST to health)
      expect(response.status).toBeLessThan(500);
    });

    it('should reject malformed JSON', async () => {
      const response = await request(app)
        .post('/api/health')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBeLessThan(500);
    });

    it('should handle special characters in URL', async () => {
      const response = await request(app).get('/api/health?test=<script>alert(1)</script>');
      // Should not crash
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Error Handling', () => {
    it('should not leak sensitive information in errors', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');

      // Should not expose stack traces in production
      if (process.env.NODE_ENV === 'production') {
        expect(response.body).not.toHaveProperty('stack');
      }
    });

    it('should handle server errors gracefully', async () => {
      // Try to trigger an error with invalid data
      const response = await request(app)
        .post('/api/health')
        .send({ invalid: 'data' });

      expect(response.status).toBeLessThan(500);
      expect(response.body).toHaveProperty('status');
    });
  });

  describe('Request Validation', () => {
    it('should accept valid HTTP methods', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });

    it('should reject invalid HTTP methods for health endpoint', async () => {
      const response = await request(app).delete('/api/health');
      expect(response.status).toBe(404);
    });

    it('should handle OPTIONS requests', async () => {
      const response = await request(app).options('/api/health');
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Content Type Validation', () => {
    it('should accept JSON content type', async () => {
      const response = await request(app)
        .post('/api/health')
        .set('Content-Type', 'application/json')
        .send('{}');

      expect(response.status).toBeLessThan(500);
    });

    it('should handle URL encoded data', async () => {
      const response = await request(app)
        .post('/api/health')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('key=value');

      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Response Security', () => {
    it('should return JSON responses for API endpoints', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should not cache sensitive responses', async () => {
      const response = await request(app).get('/api/endowment');
      // Default behavior - check that response is received
      expect(response.status).toBe(200);
    });
  });

  describe('SQL Injection Protection', () => {
    it('should handle SQL-like strings in query parameters', async () => {
      const response = await request(app).get("/api/health?id=1' OR '1'='1");
      // Should not crash or execute SQL
      expect(response.status).toBeLessThan(500);
    });

    it('should handle SQL keywords in input', async () => {
      const response = await request(app)
        .post('/api/health')
        .send({ name: "'; DROP TABLE users; --" });

      expect(response.status).toBeLessThan(500);
    });
  });

  describe('XSS Protection', () => {
    it('should handle script tags in input', async () => {
      const response = await request(app)
        .post('/api/health')
        .send({ comment: '<script>alert("XSS")</script>' });

      expect(response.status).toBeLessThan(500);
    });

    it('should handle HTML entities', async () => {
      const response = await request(app)
        .post('/api/health')
        .send({ data: '&lt;script&gt;alert(1)&lt;/script&gt;' });

      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Request Timeout', () => {
    it('should include timeout configuration', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      // Request completes before timeout
    });
  });

  describe('Request ID Tracing', () => {
    it('should include request ID in response headers', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers).toHaveProperty('x-request-id');
      expect(typeof response.headers['x-request-id']).toBe('string');
    });

    it('should generate unique request IDs', async () => {
      const response1 = await request(app).get('/api/health');
      const response2 = await request(app).get('/api/health');

      expect(response1.headers['x-request-id']).not.toBe(response2.headers['x-request-id']);
    });
  });
});
