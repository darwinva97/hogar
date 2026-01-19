'use server'

import { db } from '@hogar/database'
import { users, orders, orderItems, addresses } from '@hogar/database'
import { eq, desc, and, count, sql, gte } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Get current user profile
export async function getUserProfile() {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      id: true,
      email: true,
      name: true,
      phone: true,
      dni: true,
      createdAt: true,
    },
  })

  return user
}

// Update user profile
export async function updateUserProfile(data: {
  name?: string
  phone?: string
  dni?: string
}) {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  const [updated] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))
    .returning()

  revalidatePath('/cuenta')
  revalidatePath('/cuenta/perfil')

  return updated
}

// Get user orders
export async function getUserOrders(filters?: {
  status?: string
  page?: number
  limit?: number
}) {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  const { page = 1, limit = 10 } = filters || {}
  const conditions = [eq(orders.userId, session.user.id)]

  if (filters?.status) {
    conditions.push(eq(orders.status, filters.status as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'))
  }

  const userOrders = await db.query.orders.findMany({
    where: and(...conditions),
    with: {
      items: {
        with: {
          product: {
            columns: { id: true, name: true, slug: true },
            with: {
              images: {
                orderBy: (img, { asc }) => [asc(img.order)],
                limit: 1,
              },
            },
          },
        },
      },
      shipments: {
        limit: 1,
        orderBy: (s, { desc }) => [desc(s.createdAt)],
      },
    },
    orderBy: [desc(orders.createdAt)],
    limit,
    offset: (page - 1) * limit,
  })

  return userOrders
}

// Get single order
export async function getUserOrder(orderId: string) {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.userId, session.user.id)),
    with: {
      items: {
        with: {
          product: {
            columns: { id: true, name: true, slug: true },
            with: {
              images: {
                orderBy: (img, { asc }) => [asc(img.order)],
                limit: 1,
              },
            },
          },
          provider: {
            columns: { id: true, name: true },
          },
        },
      },
      shipments: {
        with: {
          carrier: {
            columns: { id: true, name: true, phone: true },
          },
        },
        orderBy: (s, { desc }) => [desc(s.createdAt)],
      },
    },
  })

  return order
}

// Get user stats (for dashboard)
export async function getUserStats() {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalSpent,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.userId, session.user.id)),
    db
      .select({ count: count() })
      .from(orders)
      .where(
        and(
          eq(orders.userId, session.user.id),
          sql`${orders.status} NOT IN ('delivered', 'cancelled')`
        )
      ),
    db
      .select({ count: count() })
      .from(orders)
      .where(
        and(
          eq(orders.userId, session.user.id),
          eq(orders.status, 'delivered')
        )
      ),
    db
      .select({ total: sql<number>`COALESCE(SUM(${orders.total}::numeric), 0)` })
      .from(orders)
      .where(
        and(
          eq(orders.userId, session.user.id),
          eq(orders.paymentStatus, 'paid')
        )
      ),
  ])

  return {
    orders: {
      total: totalOrders[0]?.count || 0,
      pending: pendingOrders[0]?.count || 0,
      delivered: deliveredOrders[0]?.count || 0,
    },
    spent: totalSpent[0]?.total || 0,
  }
}

// Get user addresses
export async function getUserAddresses() {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  return db.query.addresses.findMany({
    where: eq(addresses.userId, session.user.id),
    orderBy: [desc(addresses.isDefault), desc(addresses.createdAt)],
  })
}

// Create address
export async function createUserAddress(data: {
  label: string
  recipientName: string
  phone: string
  street: string
  district: string
  city?: string
  reference?: string
  isDefault?: boolean
}) {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  // If this is default, unset other defaults
  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, session.user.id))
  }

  const [address] = await db
    .insert(addresses)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning()

  revalidatePath('/cuenta/direcciones')

  return address
}

// Update address
export async function updateUserAddress(
  addressId: string,
  data: Partial<{
    label: string
    recipientName: string
    phone: string
    street: string
    district: string
    city: string
    reference: string
    isDefault: boolean
  }>
) {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  // Verify ownership
  const existing = await db.query.addresses.findFirst({
    where: and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)),
  })

  if (!existing) throw new Error('Dirección no encontrada')

  // If setting as default, unset others
  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, session.user.id))
  }

  const [updated] = await db
    .update(addresses)
    .set(data)
    .where(eq(addresses.id, addressId))
    .returning()

  revalidatePath('/cuenta/direcciones')

  return updated
}

// Delete address
export async function deleteUserAddress(addressId: string) {
  const session = await getSession()
  if (!session?.user) throw new Error('No autenticado')

  // Verify ownership
  const existing = await db.query.addresses.findFirst({
    where: and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)),
  })

  if (!existing) throw new Error('Dirección no encontrada')

  await db.delete(addresses).where(eq(addresses.id, addressId))

  revalidatePath('/cuenta/direcciones')
}
