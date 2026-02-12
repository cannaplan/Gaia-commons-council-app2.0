// ============================================================================
// GAIA COMMONS API - Database Configuration
// PostgreSQL connection pool setup with retry logic and health monitoring
// ============================================================================

import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'gaia_commons',
  user: process.env.DB_USER || 'gaia_user',
  password: process.env.DB_PASSWORD || 'gaia_password',
  // Connection pool settings
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
  // Query timeout
  statement_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
};

// Create connection pool
export const pool = new Pool(poolConfig);

// Pool metrics
let poolMetrics = {
  totalConnections: 0,
  idleConnections: 0,
  waitingClients: 0,
  errors: 0,
};

// Update pool metrics
function updatePoolMetrics() {
  poolMetrics = {
    totalConnections: pool.totalCount,
    idleConnections: pool.idleCount,
    waitingClients: pool.waitingCount,
    errors: poolMetrics.errors,
  };
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err);
  poolMetrics.errors++;
  // Don't exit immediately, let retry logic handle it
});

// Pool connection event
pool.on('connect', () => {
  updatePoolMetrics();
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ New database connection established');
  }
});

// Pool remove event
pool.on('remove', () => {
  updatePoolMetrics();
  if (process.env.NODE_ENV === 'development') {
    console.log('ℹ️  Database connection removed from pool');
  }
});

// Test connection with retry logic
export async function testConnection(maxRetries: number = 3, retryDelay: number = 2000): Promise<boolean> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('✅ Database connected:', result.rows[0].now);
      console.log(`📊 Pool metrics: ${pool.totalCount} total, ${pool.idleCount} idle, ${pool.waitingCount} waiting`);
      client.release();
      return true;
    } catch (err) {
      lastError = err as Error;
      console.error(`❌ Database connection attempt ${attempt}/${maxRetries} failed:`, err instanceof Error ? err.message : err);
      
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error('❌ Database connection failed after', maxRetries, 'attempts');
  if (lastError) {
    console.error('Last error:', lastError.message);
  }
  return false;
}

// Health check for monitoring
export async function checkHealth(): Promise<{ healthy: boolean; metrics: typeof poolMetrics; latency: number }> {
  const start = Date.now();
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    const latency = Date.now() - start;
    updatePoolMetrics();
    return { healthy: true, metrics: poolMetrics, latency };
  } catch (err) {
    const latency = Date.now() - start;
    updatePoolMetrics();
    return { healthy: false, metrics: poolMetrics, latency };
  }
}

// Execute a query with automatic client release and better error context
export async function query(text: string, params?: unknown[]): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn(`⚠️  Slow query detected (${duration}ms):`, text.substring(0, 100));
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
    }
    
    return result;
  } catch (err) {
    const duration = Date.now() - start;
    console.error('❌ Query error:', {
      error: err instanceof Error ? err.message : err,
      query: text.substring(0, 100),
      duration,
      params: params?.length,
    });
    throw err;
  }
}

// Get a client for transactions
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

// Initialize database (run schema)
export async function initializeDatabase(): Promise<void> {
  console.log('Initializing database...');

  // Check if tables exist
  const result = await query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'pilot_stats'
    );
  `);

  const tablesExist = result.rows[0].exists;

  if (!tablesExist) {
    console.log('Tables not found. Please run schema.sql to create tables.');
    console.log('psql -U your_user -d your_db -f schema.sql');
  } else {
    console.log('✅ Database tables verified');
  }
}

// Get pool metrics
export function getPoolMetrics() {
  updatePoolMetrics();
  return poolMetrics;
}

// Close pool (for graceful shutdown)
export async function closePool(): Promise<void> {
  console.log('Closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
}
