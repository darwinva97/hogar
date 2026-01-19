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
import { orders } from './orders'
import { products } from './products'
import { categories } from './products'

// Tipo de descuento
export const discountTypeEnum = pgEnum('discount_type', [
  'percentage', // Porcentaje del total
  'fixed', // Monto fijo
  'free_shipping', // Envío gratis
])

// Ámbito del cupón
export const couponScopeEnum = pgEnum('coupon_scope', [
  'all', // Todo el pedido
  'category', // Categoría específica
  'product', // Producto específico
  'first_order', // Primera compra
])

// Cupones / Códigos de descuento
export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // VERANO20, BIENVENIDO10
  name: text('name').notNull(), // Nombre interno para admin
  description: text('description'), // Descripción para mostrar al usuario

  // Tipo y valor del descuento
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(), // 20.00 = 20% o S/20

  // Ámbito de aplicación
  scope: couponScopeEnum('scope').default('all'),
  categoryId: uuid('category_id').references(() => categories.id), // Si scope = category
  productId: uuid('product_id').references(() => products.id), // Si scope = product

  // Restricciones
  minOrderAmount: decimal('min_order_amount', { precision: 10, scale: 2 }), // Monto mínimo de compra
  maxDiscountAmount: decimal('max_discount_amount', { precision: 10, scale: 2 }), // Tope máximo de descuento

  // Límites de uso
  usageLimit: integer('usage_limit'), // Uso total permitido (null = ilimitado)
  usageLimitPerUser: integer('usage_limit_per_user').default(1), // Uso por usuario
  usageCount: integer('usage_count').default(0), // Veces usado

  // Vigencia
  startsAt: timestamp('starts_at'),
  expiresAt: timestamp('expires_at'),

  // Estado
  isActive: boolean('is_active').default(true),

  // Auditoría
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Historial de uso de cupones
export const couponUsage = pgTable('coupon_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id')
    .references(() => coupons.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'set null' }),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Promociones automáticas (sin código)
export const promotions = pgTable('promotions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),

  // Tipo de promoción
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),

  // Condiciones
  scope: couponScopeEnum('scope').default('all'),
  categoryId: uuid('category_id').references(() => categories.id),
  productId: uuid('product_id').references(() => products.id),
  minOrderAmount: decimal('min_order_amount', { precision: 10, scale: 2 }),
  minQuantity: integer('min_quantity'), // Cantidad mínima de productos

  // Vigencia
  startsAt: timestamp('starts_at'),
  expiresAt: timestamp('expires_at'),

  // Prioridad (para cuando hay múltiples promociones)
  priority: integer('priority').default(0),

  // Estado
  isActive: boolean('is_active').default(true),

  // Banner/imagen de la promoción
  bannerImage: text('banner_image'),
  badgeText: text('badge_text'), // "20% OFF", "2x1"

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations
export const couponsRelations = relations(coupons, ({ one, many }) => ({
  category: one(categories, {
    fields: [coupons.categoryId],
    references: [categories.id],
  }),
  product: one(products, {
    fields: [coupons.productId],
    references: [products.id],
  }),
  createdByUser: one(users, {
    fields: [coupons.createdBy],
    references: [users.id],
  }),
  usage: many(couponUsage),
}))

export const couponUsageRelations = relations(couponUsage, ({ one }) => ({
  coupon: one(coupons, {
    fields: [couponUsage.couponId],
    references: [coupons.id],
  }),
  user: one(users, {
    fields: [couponUsage.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [couponUsage.orderId],
    references: [orders.id],
  }),
}))

export const promotionsRelations = relations(promotions, ({ one }) => ({
  category: one(categories, {
    fields: [promotions.categoryId],
    references: [categories.id],
  }),
  product: one(products, {
    fields: [promotions.productId],
    references: [products.id],
  }),
}))
