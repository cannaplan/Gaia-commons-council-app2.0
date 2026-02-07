import { storage } from '../storage';

describe('Storage Layer Tests', () => {
  describe('Core Stats - Singleton Getters', () => {
    it('should get pilot stats', async () => {
      const stats = await storage.getPilotStats();
      expect(stats).toBeDefined();
      if (stats) {
        expect(stats).toHaveProperty('totalSchools');
        expect(stats).toHaveProperty('totalStudents');
        expect(stats).toHaveProperty('greenhouseArea');
      }
    });

    it('should get endowment stats', async () => {
      const stats = await storage.getEndowmentStats();
      expect(stats).toBeDefined();
      if (stats) {
        expect(stats).toHaveProperty('principal');
        expect(stats).toHaveProperty('annualDistribution');
      }
    });

    it('should get financial metrics', async () => {
      const metrics = await storage.getFinancialMetrics();
      expect(metrics).toBeDefined();
      if (metrics) {
        expect(metrics).toHaveProperty('totalInvestment');
        expect(metrics).toHaveProperty('operatingCosts');
      }
    });

    it('should get climate metrics', async () => {
      const metrics = await storage.getClimateMetrics();
      expect(metrics).toBeDefined();
      if (metrics) {
        expect(metrics).toHaveProperty('carbonSequestered');
        expect(metrics).toHaveProperty('waterSaved');
      }
    });
  });

  describe('List Getters', () => {
    it('should get timeline events as array', async () => {
      const events = await storage.getTimelineEvents();
      expect(Array.isArray(events)).toBe(true);
    });

    it('should get schools as array', async () => {
      const schools = await storage.getSchools();
      expect(Array.isArray(schools)).toBe(true);
    });

    it('should get school clusters as array', async () => {
      const clusters = await storage.getSchoolClusters();
      expect(Array.isArray(clusters)).toBe(true);
    });

    it('should get slides as array', async () => {
      const slides = await storage.getSlides();
      expect(Array.isArray(slides)).toBe(true);
    });
  });

  describe('Setters', () => {
    it('should set pilot stats', async () => {
      const testStats = {
        totalSchools: 10,
        totalStudents: 1000,
        greenhouseArea: 50000,
        launchDate: '2026-01-01',
        regionalHubs: 2,
        avgGreenhouseSize: 5000,
      };

      await expect(storage.setPilotStats(testStats)).resolves.not.toThrow();
    });

    it('should set and get timeline events', async () => {
      const testEvents = [
        {
          id: 1,
          year: 2026,
          quarter: 'Q1',
          milestone: 'Test Milestone',
          description: 'Test Description',
          status: 'completed',
          impact: 'high',
        },
      ];

      await storage.setTimelineEvents(testEvents);
      const events = await storage.getTimelineEvents();
      expect(events.length).toBeGreaterThan(0);
    });
  });
});
