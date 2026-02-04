import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { storage } from '../storage';

// Import the registerRoutes function to set up routes
// Since we don't have a direct export, we'll create a minimal test app
describe('API Endpoints Integration Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    // Create Express app
    app = express();
    app.use(express.json());

    // Seed database with test data
    await storage.setPilotStats({
      totalSchools: 6,
      totalStudents: 5630,
      greenhouseArea: 34650,
      launchDate: '2026-01-01',
      regionalHubs: 3,
      avgGreenhouseSize: 5775
    });

    await storage.setEndowmentStats({
      principal: 5000000000,
      annualDistribution: 225000000,
      greenhousesFunded: 1200,
      growthRate: '4.5-7%',
      targetYear: 2030
    });

    await storage.setFinancialMetrics({
      totalInvestment: 5000000000,
      operatingCosts: 850000000,
      revenueStreams: 1200000000,
      roi: 0.41,
      breakEvenYear: 2028,
      netPresentValue: 3200000000
    });

    await storage.setClimateMetrics({
      carbonSequestered: 12500,
      waterSaved: 45000000,
      solarGenerated: 2800000,
      biodiversityCount: 145,
      soilHealthScore: 8.7,
      wasteReduction: 78.5
    });

    // Set up minimal routes for testing
    const router = Router();

    router.get('/api/health', async (_req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    });

    router.get('/api/pilot', async (_req, res) => {
      const stats = await storage.getPilotStats();
      res.json(stats);
    });

    router.get('/api/endowment', async (_req, res) => {
      const stats = await storage.getEndowmentStats();
      res.json(stats);
    });

    router.get('/api/financials', async (_req, res) => {
      const metrics = await storage.getFinancialMetrics();
      res.json(metrics);
    });

    router.get('/api/climate', async (_req, res) => {
      const metrics = await storage.getClimateMetrics();
      res.json(metrics);
    });

    router.get('/api/timeline', async (_req, res) => {
      const events = await storage.getTimelineEvents();
      res.json(events);
    });

    router.get('/api/schools', async (_req, res) => {
      const schools = await storage.getSchools();
      res.json(schools);
    });

    router.get('/api/school-clusters', async (_req, res) => {
      const clusters = await storage.getSchoolClusters();
      res.json(clusters);
    });

    router.get('/api/k12-curriculum', async (_req, res) => {
      const curriculum = await storage.getK12Curriculums();
      res.json(curriculum);
    });

    router.get('/api/slides', async (_req, res) => {
      const slides = await storage.getSlides();
      res.json(slides);
    });

    app.use(router);
  });

  describe('Core Stats Endpoints', () => {
    it('GET /api/health - should return health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
    });

    it('GET /api/pilot - should return pilot stats', async () => {
      const response = await request(app).get('/api/pilot');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalSchools', 6);
      expect(response.body).toHaveProperty('totalStudents', 5630);
      expect(response.body).toHaveProperty('greenhouseArea');
      expect(response.body).toHaveProperty('regionalHubs', 3);
    });

    it('GET /api/endowment - should return endowment stats', async () => {
      const response = await request(app).get('/api/endowment');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('principal', 5000000000);
      expect(response.body).toHaveProperty('annualDistribution');
      expect(response.body).toHaveProperty('greenhousesFunded');
      expect(response.body).toHaveProperty('targetYear', 2030);
    });

    it('GET /api/financials - should return financial metrics', async () => {
      const response = await request(app).get('/api/financials');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalInvestment');
      expect(response.body).toHaveProperty('operatingCosts');
      expect(response.body).toHaveProperty('revenueStreams');
      expect(response.body).toHaveProperty('roi');
    });

    it('GET /api/climate - should return climate metrics', async () => {
      const response = await request(app).get('/api/climate');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('carbonSequestered');
      expect(response.body).toHaveProperty('waterSaved');
      expect(response.body).toHaveProperty('solarGenerated');
      expect(response.body).toHaveProperty('biodiversityCount');
    });
  });

  describe('Timeline Endpoints', () => {
    it('GET /api/timeline - should return timeline events as array', async () => {
      const response = await request(app).get('/api/timeline');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Education Endpoints', () => {
    it('GET /api/schools - should return schools array', async () => {
      const response = await request(app).get('/api/schools');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /api/school-clusters - should return school clusters array', async () => {
      const response = await request(app).get('/api/school-clusters');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /api/k12-curriculum - should return curriculum array', async () => {
      const response = await request(app).get('/api/k12-curriculum');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /api/slides - should return slides array', async () => {
      const response = await request(app).get('/api/slides');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Response Format Validation', () => {
    it('should return JSON for all endpoints', async () => {
      const endpoints = [
        '/api/health',
        '/api/pilot',
        '/api/endowment',
        '/api/financials',
        '/api/climate',
        '/api/timeline',
        '/api/schools',
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.type).toMatch(/json/);
      }
    });

    it('should not return 404 for valid endpoints', async () => {
      const endpoints = [
        '/api/health',
        '/api/pilot',
        '/api/endowment',
        '/api/timeline',
        '/api/schools',
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.status).not.toBe(404);
      }
    });
  });

  describe('Data Structure Validation', () => {
    it('core stats endpoints should return objects', async () => {
      const statsEndpoints = [
        '/api/pilot',
        '/api/endowment',
        '/api/financials',
        '/api/climate',
      ];

      for (const endpoint of statsEndpoints) {
        const response = await request(app).get(endpoint);
        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toBe(false);
      }
    });

    it('list endpoints should return arrays', async () => {
      const listEndpoints = [
        '/api/timeline',
        '/api/schools',
        '/api/school-clusters',
        '/api/k12-curriculum',
        '/api/slides',
      ];

      for (const endpoint of listEndpoints) {
        const response = await request(app).get(endpoint);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      }
    });
  });
});
