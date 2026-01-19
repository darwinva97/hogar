import {
  pgTable,
  text,
  timestamp,
  uuid,
  decimal,
  integer,
  jsonb,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { providers } from './providers'
import { products, productVariants } from './products'

export const orderStatusEnum = pgEnum('order_status', [
  'pending', // Esperando pago
  'paid', // Pagado
  'processing', // En preparación
  'ready_to_ship', // Listo para envío
  'shipped', // Enviado
  'delivered', // Entregado
  'cancelled', // Cancelado
  'refunded', // Reembolsado
  'return_requested', // Devolución solicitada
  'return_completed', // Devolución completada
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
])

export const paymentMethodEnum = pgEnum('payment_method', [
  'card',
  'yape',
  'plin',
  'transfer',
  'cash',
  'pagoefectivo',
])

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(), // HOG-2024-XXXXXX
  userId: uuid('user_id').references(() => users.id),
  guestEmail: text('guest_email'), // Para pedidos sin cuenta
  status: orderStatusEnum('status').default('pending'),
  // Totales
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal('shipping_fee', { precision: 10, scale: 2 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'), // IGV
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  // Direcciones (snapshot)
  shippingAddress: jsonb('shipping_address').$type<{
    address: string
    district: string
    city: string
    reference?: string
    lat?: string
    lng?: string
    recipientName: string
    recipientPhone: string
  }>(),
  billingAddress: jsonb('billing_address').$type<{
    ruc?: string
    razonSocial?: string
    address?: string
    district?: string
  }>(),
  // Pago
  paymentMethod: paymentMethodEnum('payment_method'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  paymentId: text('payment_id'), // ID de Culqi/MercadoPago
  paidAt: timestamp('paid_at'),
  // Notas
  customerNotes: text('customer_notes'),
  internalNotes: text('internal_notes'),
  // Cupón
  couponCode: text('coupon_code'),
  couponDiscount: decimal('coupon_discount', { precision: 10, scale: 2 }),
  // Entrega
  estimatedDeliveryDate: timestamp('estimated_delivery_date'),
  deliveredAt: timestamp('delivered_at'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id').references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  providerId: uuid('provider_id')
    .references(() => providers.id)
    .notNull(),
  // Snapshot del producto
  name: text('name').notNull(),
  sku: text('sku'),
  variantName: text('variant_name'),
  image: text('image'),
  // Cantidades y precios
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  // Estado de este item específico
  status: text('status').default('pending'), // Para tracking por item si viene de diferentes proveedores
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  status: orderStatusEnum('status').notNull(),
  note: text('note'),
  changedBy: uuid('changed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Carrito (para usuarios logueados y guests)
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  guestId: text('guest_id').unique(), // Para usuarios no logueados
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cartId: uuid('cart_id')
      .references(() => carts.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id, {
      onDelete: 'cascade',
    }),
    quantity: integer('quantity').notNull().default(1),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('cart_items_cart_product_variant_unique').on(
      table.cartId,
      table.productId,
      table.variantId
    ),
  ]
)

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
  provider: one(providers, {
    fields: [orderItems.providerId],
    references: [providers.id],
  }),
}))

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),
    changedByUser: one(users, {
      fields: [orderStatusHistory.changedBy],
      references: [users.id],
    }),
  })
)

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}))
