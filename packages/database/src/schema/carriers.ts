import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  decimal,
  integer,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { orders } from './orders'

export const carrierTypeEnum = pgEnum('carrier_type', [
  'independent', // Persona natural
  'fleet', // Empresa con flota
  'partner', // Courier asociado (Olva, etc.)
])

export const integrationLevelEnum = pgEnum('integration_level', [
  'api', // Integración completa con API
  'app', // Usa nuestra app
  'whatsapp', // Coordina por WhatsApp
  'manual', // Solo llamadas/coordinación manual
])

export const vehicleTypeEnum = pgEnum('vehicle_type', [
  'moto',
  'auto',
  'camioneta',
  'van',
  'camion_3t',
  'camion_5t',
])

export const shipmentStatusEnum = pgEnum('shipment_status', [
  'pending', // Pendiente de asignar
  'assigned', // Asignado a transportista
  'picked_up', // Recogido del proveedor
  'in_transit', // En camino
  'delivered', // Entregado
  'failed', // Fallido
  'returned', // Devuelto
])

export const carriers = pgTable('carriers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  dni: text('dni'),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  email: text('email'),
  type: carrierTypeEnum('type').default('independent'),
  integrationLevel: integrationLevelEnum('integration_level').default('manual'),
  // Vehículo
  vehicleType: vehicleTypeEnum('vehicle_type'),
  vehiclePlate: text('vehicle_plate'),
  vehicleBrand: text('vehicle_brand'),
  vehicleModel: text('vehicle_model'),
  vehicleYear: text('vehicle_year'),
  vehicleCapacity: jsonb('vehicle_capacity').$type<{
    volume_m3: number
    weight_kg: number
  }>(),
  vehiclePhoto: text('vehicle_photo'),
  // Documentos
  dniPhoto: text('dni_photo'),
  licensePhoto: text('license_photo'),
  soatPhoto: text('soat_photo'),
  // Cobertura
  districts: text('districts').array(), // ['Miraflores', 'Surco', ...]
  baseDistrict: text('base_district'), // Donde empieza el día
  // Tarifas
  baseFee: decimal('base_fee', { precision: 10, scale: 2 }).default('0'),
  perKmFee: decimal('per_km_fee', { precision: 10, scale: 2 }).default('0'),
  // Stats
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'), // 0.00 - 5.00
  totalDeliveries: integer('total_deliveries').default(0),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('0'),
  // Estado
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),
  isAvailable: boolean('is_available').default(true), // Disponible para asignaciones
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const shipments = pgTable('shipments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id)
    .notNull(),
  carrierId: uuid('carrier_id').references(() => carriers.id),
  trackingCode: text('tracking_code').unique(), // Código público para cliente
  status: shipmentStatusEnum('status').default('pending'),
  // Direcciones
  originAddress: jsonb('origin_address').$type<{
    name: string
    address: string
    district: string
    phone: string
    lat?: string
    lng?: string
  }>(),
  destinationAddress: jsonb('destination_address').$type<{
    name: string
    address: string
    district: string
    reference?: string
    phone: string
    lat?: string
    lng?: string
  }>(),
  // Programación
  scheduledDate: timestamp('scheduled_date'),
  scheduledTimeSlot: text('scheduled_time_slot'), // "14:00-18:00"
  // Tarifa
  agreedFee: decimal('agreed_fee', { precision: 10, scale: 2 }),
  paymentMethod: text('payment_method'), // 'yape', 'cash', 'transfer'
  isPaid: boolean('is_paid').default(false),
  // Tracking
  currentLat: text('current_lat'),
  currentLng: text('current_lng'),
  lastLocationUpdate: timestamp('last_location_update'),
  // Entrega
  pickedUpAt: timestamp('picked_up_at'),
  deliveredAt: timestamp('delivered_at'),
  deliveryPhoto: text('delivery_photo'),
  deliverySignature: text('delivery_signature'),
  recipientName: text('recipient_name'),
  // Notas
  notes: text('notes'),
  failureReason: text('failure_reason'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const shipmentTracking = pgTable('shipment_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id')
    .references(() => shipments.id, { onDelete: 'cascade' })
    .notNull(),
  status: shipmentStatusEnum('status').notNull(),
  lat: text('lat'),
  lng: text('lng'),
  note: text('note'),
  photo: text('photo'),
  createdBy: text('created_by'), // 'carrier', 'admin', 'system'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const carrierPayments = pgTable('carrier_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  carrierId: uuid('carrier_id')
    .references(() => carriers.id)
    .notNull(),
  shipmentId: uuid('shipment_id').references(() => shipments.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull(), // 'yape', 'plin', 'transfer'
  reference: text('reference'), // Número de operación
  proofPhoto: text('proof_photo'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const carriersRelations = relations(carriers, ({ one, many }) => ({
  user: one(users, {
    fields: [carriers.userId],
    references: [users.id],
  }),
  shipments: many(shipments),
  payments: many(carrierPayments),
}))

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
  carrier: one(carriers, {
    fields: [shipments.carrierId],
    references: [carriers.id],
  }),
  tracking: many(shipmentTracking),
}))

export const shipmentTrackingRelations = relations(
  shipmentTracking,
  ({ one }) => ({
    shipment: one(shipments, {
      fields: [shipmentTracking.shipmentId],
      references: [shipments.id],
    }),
  })
)

export const carrierPaymentsRelations = relations(
  carrierPayments,
  ({ one }) => ({
    carrier: one(carriers, {
      fields: [carrierPayments.carrierId],
      references: [carriers.id],
    }),
    shipment: one(shipments, {
      fields: [carrierPayments.shipmentId],
      references: [shipments.id],
    }),
  })
)
