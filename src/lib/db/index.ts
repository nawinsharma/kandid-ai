import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

type DrizzleDb = ReturnType<typeof drizzle>;
const globalForDb = globalThis as unknown as {
  pgPool: Pool | undefined;
  drizzleDb: DrizzleDb | undefined;
};

const pool = globalForDb.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

// pg Pool manages its own connections; no explicit connect needed

export const db = globalForDb.drizzleDb ?? drizzle(pool, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pgPool = pool;
  globalForDb.drizzleDb = db;
}

export * as tables from './schema';
