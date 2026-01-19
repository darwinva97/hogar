import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// Para queries
const queryClient = postgres(connectionString)

// Cliente de Drizzle con schema
export const db = drizzle(queryClient, { schema })

// Re-export schema
export * from './schema'

// Export types
export type Database = typeof db
