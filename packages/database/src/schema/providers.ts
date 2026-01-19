import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  decimal,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const providerTierEnum = pgEnum('provider_tier', [
  'nuevo',
  'verificado',
  'premium',
  'partner',
])

export const providers = pgTable('providers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ruc: text('ruc').unique(),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  email: text('email'),
  address: text('address'),
  district: text('district'), // Villa El Salvador, Ate, etc.
  lat: text('lat'),
  lng: text('lng'),
  description: text('description'),
  logo: text('logo'),
  coverImage: text('cover_image'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'), // 0.00 - 5.00
  totalReviews: integer('total_reviews').default(0),
  tier: providerTierEnum('tier').default('nuevo'),
  commissionRate: decimal('commission_rate', { precision: 4, scale: 2 }).default(
    '15.00'
  ), // 15% default
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),
  specialties: text('specialties').array(), // ['sofas', 'comedores', 'oficina']
  materials: text('materials').array(), // ['madera', 'melamine', 'metal']
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const providerDocuments = pgTable('provider_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  providerId: uuid('provider_id')
    .references(() => providers.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(), // 'ruc_ficha', 'dni', 'contrato', etc.
  url: text('url').notNull(),
  verified: boolean('verified').default(false),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const providerZones = pgTable('provider_zones', {
  id: uuid('id').primaryKey().defaultRandom(),
  providerId: uuid('provider_id')
    .references(() => providers.id, { onDelete: 'cascade' })
    .notNull(),
  district: text('district').notNull(),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).default('0'),
  estimatedDays: integer('estimated_days').default(1),
  isActive: boolean('is_active').default(true),
})

// Relations
export const providersRelations = relations(providers, ({ one, many }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
  documents: many(providerDocuments),
  zones: many(providerZones),
}))

export const providerDocumentsRelations = relations(
  providerDocuments,
  ({ one }) => ({
    provider: one(providers, {
      fields: [providerDocuments.providerId],
      references: [providers.id],
    }),
  })
)

export const providerZonesRelations = relations(providerZones, ({ one }) => ({
  provider: one(providers, {
    fields: [providerZones.providerId],
    references: [providers.id],
  }),
}))
