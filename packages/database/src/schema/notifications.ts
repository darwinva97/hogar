import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

// Tipo de notificación
export const notificationTypeEnum = pgEnum('notification_type', [
  // Pedidos
  'order_created',
  'order_confirmed',
  'order_processing',
  'order_shipped',
  'order_delivered',
  'order_cancelled',
  // Pagos
  'payment_received',
  'payment_failed',
  'refund_processed',
  // Devoluciones
  'return_approved',
  'return_rejected',
  'return_completed',
  // Productos
  'price_drop',
  'back_in_stock',
  'low_stock',
  // Reviews
  'review_approved',
  'review_helpful',
  // Promociones
  'promotion_new',
  'coupon_expiring',
  // Sistema
  'welcome',
  'password_changed',
  'account_updated',
])

// Canal de notificación
export const notificationChannelEnum = pgEnum('notification_channel', [
  'in_app', // Dentro de la aplicación
  'email',
  'sms',
  'push', // Push notification
  'whatsapp',
])

// Notificaciones
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: notificationTypeEnum('type').notNull(),
  channel: notificationChannelEnum('channel').default('in_app'),

  // Contenido
  title: text('title').notNull(),
  message: text('message').notNull(),
  imageUrl: text('image_url'),

  // Enlace/acción
  actionUrl: text('action_url'), // /cuenta/pedidos/123
  actionLabel: text('action_label'), // "Ver pedido"

  // Datos adicionales (para procesar)
  data: jsonb('data').$type<Record<string, unknown>>(),

  // Estado
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),

  // Entrega (para email, sms, etc)
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  failedAt: timestamp('failed_at'),
  failureReason: text('failure_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Preferencias de notificación del usuario
export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),

  // Canales habilitados
  emailEnabled: boolean('email_enabled').default(true),
  smsEnabled: boolean('sms_enabled').default(false),
  pushEnabled: boolean('push_enabled').default(true),
  whatsappEnabled: boolean('whatsapp_enabled').default(true),

  // Tipos de notificaciones
  orderUpdates: boolean('order_updates').default(true),
  promotions: boolean('promotions').default(true),
  priceAlerts: boolean('price_alerts').default(true),
  stockAlerts: boolean('stock_alerts').default(true),
  reviewNotifications: boolean('review_notifications').default(true),

  // Horario preferido (para no molestar)
  quietHoursStart: text('quiet_hours_start'), // "22:00"
  quietHoursEnd: text('quiet_hours_end'), // "08:00"

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Push tokens para notificaciones push
export const pushTokens = pgTable('push_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  token: text('token').notNull(),
  platform: text('platform'), // 'web', 'ios', 'android'
  deviceName: text('device_name'),
  isActive: boolean('is_active').default(true),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Alertas de precio (para productos específicos)
export const priceAlerts = pgTable('price_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id').notNull(), // Reference added in products relations
  targetPrice: text('target_price').notNull(), // Precio deseado
  currentPrice: text('current_price').notNull(), // Precio cuando se creó
  isActive: boolean('is_active').default(true),
  triggeredAt: timestamp('triggered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Alertas de stock
export const stockAlerts = pgTable('stock_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id').notNull(),
  variantId: uuid('variant_id'),
  isActive: boolean('is_active').default(true),
  triggeredAt: timestamp('triggered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
}))

export const pushTokensRelations = relations(pushTokens, ({ one }) => ({
  user: one(users, {
    fields: [pushTokens.userId],
    references: [users.id],
  }),
}))

export const priceAlertsRelations = relations(priceAlerts, ({ one }) => ({
  user: one(users, {
    fields: [priceAlerts.userId],
    references: [users.id],
  }),
}))

export const stockAlertsRelations = relations(stockAlerts, ({ one }) => ({
  user: one(users, {
    fields: [stockAlerts.userId],
    references: [users.id],
  }),
}))
