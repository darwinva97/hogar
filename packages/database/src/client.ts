import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

type DbSchema = typeof schema;

// Lazy initialization to allow env vars to be loaded before first use
let _db: NodePgDatabase<DbSchema> | null = null;

function getDb(): NodePgDatabase<DbSchema> {
  if (!_db) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _db = drizzle(DATABASE_URL, { schema });
  }
  return _db;
}

// Export db as a proxy that lazily initializes the connection
export const db = new Proxy({} as NodePgDatabase<DbSchema>, {
  get(_, prop) {
    const instance = getDb();
    const value = instance[prop as keyof typeof instance];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

// Re-export schema for convenience
export { schema };

// Export type helper for transactions
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Database = typeof db;
