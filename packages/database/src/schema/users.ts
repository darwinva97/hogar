import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const userRoleEnum = pgEnum('user_role', [
  'customer',
  'admin',
  'provider',
  'carrier',
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  emailVerified: boolean('email_verified').default(false),
  name: text('name'),
  phone: text('phone'),
  dni: text('dni'), // DNI del usuario
  image: text('image'),
  role: userRoleEnum('role').default('customer'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  label: text('label'), // "Casa", "Oficina"
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),
  street: text('street').notNull(), // Dirección completa
  district: text('district').notNull(), // Miraflores, Surco, etc.
  city: text('city').default('Lima'),
  reference: text('reference'), // "Frente al parque"
  lat: text('lat'),
  lng: text('lng'),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Alias para compatibilidad
export const addresses = userAddresses

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(userAddresses),
  sessions: many(sessions),
}))

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
