import {
  pgTable,
  text,
  timestamp,
  uuid,
  decimal,
  integer,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { orders, orderItems } from './orders'

// Motivo de devolución
export const returnReasonEnum = pgEnum('return_reason', [
  'defective', // Producto defectuoso
  'wrong_item', // Producto incorrecto
  'not_as_described', // No coincide con descripción
  'damaged_shipping', // Dañado en envío
  'changed_mind', // Cambio de opinión
  'size_issue', // Problema de tamaño
  'quality_issue', // Problema de calidad
  'other', // Otro
])

// Estado de la devolución
export const returnStatusEnum = pgEnum('return_status', [
  'requested', // Solicitada por cliente
  'approved', // Aprobada por admin
  'rejected', // Rechazada
  'pickup_scheduled', // Recojo programado
  'in_transit', // En camino de vuelta
  'received', // Recibida en almacén
  'inspecting', // En inspección
  'refund_pending', // Pendiente de reembolso
  'refunded', // Reembolsado
  'completed', // Completada
  'cancelled', // Cancelada
])

// Tipo de resolución
export const returnResolutionEnum = pgEnum('return_resolution', [
  'refund', // Reembolso completo
  'partial_refund', // Reembolso parcial
  'exchange', // Cambio por otro producto
  'store_credit', // Crédito en tienda
  'repair', // Reparación
])

// Solicitudes de devolución
export const returns = pgTable('returns', {
  id: uuid('id').primaryKey().defaultRandom(),
  returnNumber: text('return_number').notNull().unique(), // DEV-2024-XXXXXX
  orderId: uuid('order_id')
    .references(() => orders.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),

  // Estado
  status: returnStatusEnum('status').default('requested'),
  reason: returnReasonEnum('reason').notNull(),
  reasonDetails: text('reason_details'), // Descripción detallada

  // Resolución
  resolution: returnResolutionEnum('resolution'),
  resolutionNotes: text('resolution_notes'),

  // Montos
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),

  // Crédito en tienda (si aplica)
  storeCreditAmount: decimal('store_credit_amount', { precision: 10, scale: 2 }),
  storeCreditCode: text('store_credit_code'),

  // Dirección de recojo (snapshot)
  pickupAddress: jsonb('pickup_address').$type<{
    address: string
    district: string
    city: string
    reference?: string
    contactName: string
    contactPhone: string
  }>(),

  // Fechas
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
  rejectedAt: timestamp('rejected_at'),
  receivedAt: timestamp('received_at'),
  refundedAt: timestamp('refunded_at'),
  completedAt: timestamp('completed_at'),

  // Procesado por
  processedBy: uuid('processed_by').references(() => users.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Items de la devolución
export const returnItems = pgTable('return_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  returnId: uuid('return_id')
    .references(() => returns.id, { onDelete: 'cascade' })
    .notNull(),
  orderItemId: uuid('order_item_id')
    .references(() => orderItems.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  reason: returnReasonEnum('reason'),
  condition: text('condition'), // Estado del producto al recibir
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Imágenes de la devolución (pruebas del cliente)
export const returnImages = pgTable('return_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  returnId: uuid('return_id')
    .references(() => returns.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  description: text('description'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Historial de estado de devolución
export const returnStatusHistory = pgTable('return_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  returnId: uuid('return_id')
    .references(() => returns.id, { onDelete: 'cascade' })
    .notNull(),
  status: returnStatusEnum('status').notNull(),
  note: text('note'),
  changedBy: uuid('changed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const returnsRelations = relations(returns, ({ one, many }) => ({
  order: one(orders, {
    fields: [returns.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [returns.userId],
    references: [users.id],
  }),
  processedByUser: one(users, {
    fields: [returns.processedBy],
    references: [users.id],
  }),
  items: many(returnItems),
  images: many(returnImages),
  statusHistory: many(returnStatusHistory),
}))

export const returnItemsRelations = relations(returnItems, ({ one }) => ({
  return: one(returns, {
    fields: [returnItems.returnId],
    references: [returns.id],
  }),
  orderItem: one(orderItems, {
    fields: [returnItems.orderItemId],
    references: [orderItems.id],
  }),
}))

export const returnImagesRelations = relations(returnImages, ({ one }) => ({
  return: one(returns, {
    fields: [returnImages.returnId],
    references: [returns.id],
  }),
  uploadedByUser: one(users, {
    fields: [returnImages.uploadedBy],
    references: [users.id],
  }),
}))

export const returnStatusHistoryRelations = relations(returnStatusHistory, ({ one }) => ({
  return: one(returns, {
    fields: [returnStatusHistory.returnId],
    references: [returns.id],
  }),
  changedByUser: one(users, {
    fields: [returnStatusHistory.changedBy],
    references: [users.id],
  }),
}))
