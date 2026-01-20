'use server'

import { db } from '@hogar/database'
import { orders, orderItems, orderStatusHistory, shipments } from '@hogar/database'
import { eq, desc, and, or, like } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getAdminOrders(filters?: {
  status?: string
  paymentStatus?: string
  search?: string
  page?: number
  limit?: number
}) {
  await requireRole(['admin'])

  const { page = 1, limit = 20 } = filters || {}
  const conditions = []

  if (filters?.status) {
    conditions.push(eq(orders.status, filters.status as any))
  }

  if (filters?.paymentStatus) {
    conditions.push(eq(orders.paymentStatus, filters.paymentStatus as any))
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(orders.orderNumber, `%${filters.search}%`),
        like(orders.id, `%${filters.search}%`)
      )
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const items = await db.query.orders.findMany({
    where: whereClause,
    with: {
      user: {
        columns: { id: true, name: true, email: true, phone: true },
      },
      items: {
        with: {
          product: {
            columns: { id: true, name: true, slug: true },
          },
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
    limit,
    offset: (page - 1) * limit,
  })

  return items
}

export async function getAdminOrderById(orderId: string) {
  await requireRole(['admin'])

  return db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      user: {
        columns: { id: true, name: true, email: true, phone: true },
      },
      items: {
        with: {
          product: {
            with: {
              images: { limit: 1 },
            },
          },
          provider: {
            columns: { id: true, name: true, phone: true, whatsapp: true },
          },
        },
      },
      statusHistory: {
        orderBy: (h, { desc }) => [desc(h.createdAt)],
      },
    },
  })
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  note?: string
) {
  await requireRole(['admin'])

  await db
    .update(orders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  await db.insert(orderStatusHistory).values({
    orderId,
    status,
    note,
    changedBy: 'admin',
  })

  revalidatePath(`/admin/pedidos/${orderId}`)
  revalidatePath('/admin/pedidos')
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
  data?: {
    paymentReference?: string
    paymentMethod?: string
    note?: string
  }
) {
  await requireRole(['admin'])

  const updateData: Record<string, unknown> = {
    paymentStatus,
    updatedAt: new Date(),
  }

  if (data?.paymentReference) {
    updateData.paymentReference = data.paymentReference
  }

  if (data?.paymentMethod) {
    updateData.paymentMethod = data.paymentMethod
  }

  if (paymentStatus === 'completed') {
    updateData.paidAt = new Date()
  }

  await db
    .update(orders)
    .set(updateData)
    .where(eq(orders.id, orderId))

  // Add to history
  await db.insert(orderStatusHistory).values({
    orderId,
    status: `payment_${paymentStatus}` as any,
    note: data?.note || `Pago marcado como ${paymentStatus}`,
    changedBy: 'admin',
  })

  // If paid and status is pending, auto-confirm
  if (paymentStatus === 'completed') {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    })

    if (order?.status === 'pending') {
      await updateOrderStatus(orderId, 'confirmed', 'Auto-confirmado por pago recibido')
    }
  }

  revalidatePath(`/admin/pedidos/${orderId}`)
  revalidatePath('/admin/pedidos')
}

export async function createShipmentForOrder(
  orderId: string,
  data: {
    originAddress: {
      name: string
      address: string
      district: string
      phone: string
    }
    destinationAddress: {
      name: string
      address: string
      district: string
      reference?: string
      phone: string
    }
    scheduledDate?: Date
    scheduledTimeSlot?: string
    notes?: string
  }
) {
  await requireRole(['admin'])

  // Generate tracking code
  const trackingCode = `HOG${Date.now().toString(36).toUpperCase()}`

  const [shipment] = await db
    .insert(shipments)
    .values({
      orderId,
      trackingCode,
      status: 'pending',
      originAddress: data.originAddress,
      destinationAddress: data.destinationAddress,
      scheduledDate: data.scheduledDate,
      scheduledTimeSlot: data.scheduledTimeSlot,
      notes: data.notes,
    })
    .returning()

  // Update order status
  await db
    .update(orders)
    .set({
      status: 'processing',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  await db.insert(orderStatusHistory).values({
    orderId,
    status: 'processing',
    note: `Envío creado: ${trackingCode}`,
    changedBy: 'admin',
  })

  revalidatePath(`/admin/pedidos/${orderId}`)

  return shipment
}

export async function addOrderNote(orderId: string, note: string) {
  await requireRole(['admin'])

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  })

  if (!order) throw new Error('Orden no encontrada')

  const currentNotes = order.notes || ''
  const timestamp = new Date().toLocaleString('es-PE')
  const newNotes = currentNotes
    ? `${currentNotes}\n\n[${timestamp}] ${note}`
    : `[${timestamp}] ${note}`

  await db
    .update(orders)
    .set({
      notes: newNotes,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  revalidatePath(`/admin/pedidos/${orderId}`)
}
