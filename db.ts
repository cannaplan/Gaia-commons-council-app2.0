// ============================================================================
// GAIA COMMONS API - Database Configuration
// PostgreSQL connection pool setup
// ============================================================================

import { Pool, PoolClient } from 'pg';
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
};

// Create connection pool
export const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
  process.exit(-1);
});

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    return false;
  }
}

// Execute a query with automatic client release
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (err) {
    console.error('Query error:', err);
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

// Close pool (for graceful shutdown)
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('Database pool closed');
}
