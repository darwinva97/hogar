import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  decimal,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

// Configuración general del sistema
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedBy: uuid('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Zonas de envío y tarifas
export const shippingZones = pgTable('shipping_zones', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "Lima Centro", "Lima Norte", "Callao"
  districts: text('districts').array(), // Lista de distritos incluidos

  // Tarifas
  baseFee: decimal('base_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  freeShippingMinimum: decimal('free_shipping_minimum', { precision: 10, scale: 2 }),
  extraKgFee: decimal('extra_kg_fee', { precision: 10, scale: 2 }).default('0'), // Por kg adicional

  // Tiempos estimados
  estimatedDaysMin: integer('estimated_days_min').default(1),
  estimatedDaysMax: integer('estimated_days_max').default(3),

  // Estado
  isActive: boolean('is_active').default(true),
  priority: integer('priority').default(0), // Para ordenar

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Métodos de pago configurados
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // 'yape', 'plin', 'transfer', 'culqi'
  name: text('name').notNull(), // "Yape", "Plin"
  description: text('description'),
  icon: text('icon'), // URL del ícono

  // Configuración
  config: jsonb('config').$type<{
    phoneNumber?: string // Para Yape/Plin
    bankName?: string
    accountNumber?: string
    cci?: string
    accountHolder?: string
    // Para pasarelas
    publicKey?: string
    // No almacenar secretKey aquí, usar env vars
  }>(),

  // Instrucciones para el usuario
  instructions: text('instructions'),

  // Estado
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Páginas de contenido (FAQ, políticas, etc)
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(), // 'terminos', 'privacidad', 'faq'
  title: text('title').notNull(),
  content: text('content').notNull(), // HTML o Markdown
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  isPublished: boolean('is_published').default(true),
  publishedAt: timestamp('published_at'),
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Banners para homepage y categorías
export const banners = pgTable('banners', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title'),
  subtitle: text('subtitle'),
  imageUrl: text('image_url').notNull(),
  mobileImageUrl: text('mobile_image_url'),
  linkUrl: text('link_url'),
  linkText: text('link_text'), // "Ver ofertas"

  // Ubicación
  position: text('position').notNull().default('home'), // 'home', 'category', 'checkout'
  categoryId: uuid('category_id'), // Si es para una categoría específica

  // Programación
  startsAt: timestamp('starts_at'),
  expiresAt: timestamp('expires_at'),

  // Estado
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Registro de actividad del sistema (audit log)
export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(), // 'order.created', 'product.updated', 'user.login'
  entityType: text('entity_type'), // 'order', 'product', 'user'
  entityId: uuid('entity_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Crédito en tienda
export const storeCredits = pgTable('store_credits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  code: text('code').unique(), // Código único si es un gift card
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  usedAmount: decimal('used_amount', { precision: 10, scale: 2 }).default('0'),
  reason: text('reason'), // 'refund', 'gift_card', 'compensation', 'promotion'
  sourceType: text('source_type'), // 'return', 'order', 'manual'
  sourceId: uuid('source_id'), // ID de la devolución u orden
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const settingsRelations = relations(settings, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [settings.updatedBy],
    references: [users.id],
  }),
}))

export const pagesRelations = relations(pages, ({ one }) => ({
  createdByUser: one(users, {
    fields: [pages.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [pages.updatedBy],
    references: [users.id],
  }),
}))

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
}))

export const storeCreditsRelations = relations(storeCredits, ({ one }) => ({
  user: one(users, {
    fields: [storeCredits.userId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [storeCredits.createdBy],
    references: [users.id],
  }),
}))
