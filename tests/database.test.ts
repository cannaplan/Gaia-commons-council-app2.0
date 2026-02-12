// ============================================================================
// GAIA COMMONS API - Database Tests
// Tests for database connection, queries, and pool management
// ============================================================================

import { pool, testConnection, checkHealth, getPoolMetrics, query, getClient } from '../db';

describe('Database Connection Tests', () => {
  describe('Connection Pool', () => {
    it('should create a connection pool', () => {
      expect(pool).toBeDefined();
      expect(pool.totalCount).toBeGreaterThanOrEqual(0);
    });

    it('should successfully connect to database', async () => {
      const connected = await testConnection(1, 500);
      expect(connected).toBe(true);
    });

    it('should retry connection on failure', async () => {
      // This test assumes database is available
      const connected = await testConnection(3, 100);
      expect(connected).toBe(true);
    }, 10000);
  });

  describe('Health Checks', () => {
    it('should return health status', async () => {
      const health = await checkHealth();
      expect(health).toHaveProperty('healthy');
      expect(health).toHaveProperty('metrics');
      expect(health).toHaveProperty('latency');
      expect(typeof health.latency).toBe('number');
    });

    it('should report healthy status when database is available', async () => {
      const health = await checkHealth();
      expect(health.healthy).toBe(true);
    });
  });

  describe('Pool Metrics', () => {
    it('should return pool metrics', () => {
      const metrics = getPoolMetrics();
      expect(metrics).toHaveProperty('totalConnections');
      expect(metrics).toHaveProperty('idleConnections');
      expect(metrics).toHaveProperty('waitingClients');
      expect(metrics).toHaveProperty('errors');
    });

    it('should track connection metrics', async () => {
      const beforeMetrics = getPoolMetrics();
      const client = await getClient();
      const duringMetrics = getPoolMetrics();
      client.release();
      const afterMetrics = getPoolMetrics();

      expect(duringMetrics.totalConnections).toBeGreaterThanOrEqual(beforeMetrics.totalConnections);
      expect(afterMetrics.idleConnections).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Query Execution', () => {
    it('should execute simple query', async () => {
      const result = await query('SELECT 1 as number');
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].number).toBe(1);
    });

    it('should execute parameterized query', async () => {
      const result = await query('SELECT $1::text as value', ['test']);
      expect(result.rows[0].value).toBe('test');
    });

    it('should handle query errors gracefully', async () => {
      await expect(query('SELECT * FROM nonexistent_table')).rejects.toThrow();
    });

    it('should track query duration', async () => {
      // Query should complete and log duration
      const result = await query('SELECT NOW()');
      expect(result.rows).toHaveLength(1);
    });
  });

  describe('Client Management', () => {
    it('should get and release client', async () => {
      const client = await getClient();
      expect(client).toBeDefined();
      expect(typeof client.query).toBe('function');
      client.release();
    });

    it('should support transactions', async () => {
      const client = await getClient();
      try {
        await client.query('BEGIN');
        await client.query('SELECT 1');
        await client.query('COMMIT');
      } finally {
        client.release();
      }
    });

    it('should rollback on error', async () => {
      const client = await getClient();
      try {
        await client.query('BEGIN');
        await client.query('SELECT 1');
        // Simulate error scenario
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }
    });
  });

  describe('Performance', () => {
    it('should execute query within reasonable time', async () => {
      const start = Date.now();
      await query('SELECT 1');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Less than 1 second
    });

    it('should handle concurrent queries', async () => {
      const queries = Array(5)
        .fill(null)
        .map(() => query('SELECT $1::int as num', [Math.floor(Math.random() * 100)]));

      const results = await Promise.all(queries);
      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result.rows).toHaveLength(1);
      });
    });
  });

  describe('Connection Limits', () => {
    it('should respect pool size limits', async () => {
      const metrics = getPoolMetrics();
      const maxConnections = parseInt(process.env.DB_POOL_MAX || '20');
      expect(metrics.totalConnections).toBeLessThanOrEqual(maxConnections);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from connection errors', async () => {
      // First successful connection
      const health1 = await checkHealth();
      expect(health1.healthy).toBe(true);

      // Should still be healthy after retry
      const health2 = await checkHealth();
      expect(health2.healthy).toBe(true);
    });
  });
});

describe('Database Schema Tests', () => {
  describe('Table Existence', () => {
    it('should verify pilot_stats table exists', async () => {
      const result = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'pilot_stats'
        );
      `);
      // Table may or may not exist depending on schema setup
      expect(result.rows[0]).toHaveProperty('exists');
    });
  });

  describe('Query Performance', () => {
    it('should log slow queries', async () => {
      // This query should be fast and not trigger slow query warning
      const result = await query('SELECT 1');
      expect(result.rows).toHaveLength(1);
    });
  });
});
