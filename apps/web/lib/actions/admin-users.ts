'use server'

import { db } from '@hogar/database'
import { users } from '@hogar/database'
import { eq, desc, count, like, or, and } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getAdminUsers(filters?: {
  search?: string
  role?: 'customer' | 'admin' | 'provider' | 'carrier'
  page?: number
  limit?: number
}) {
  await requireRole(['admin'])

  const { page = 1, limit = 20 } = filters || {}
  const conditions = []

  if (filters?.role) {
    conditions.push(eq(users.role, filters.role))
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(users.name, `%${filters.search}%`),
        like(users.email, `%${filters.search}%`),
        like(users.phone, `%${filters.search}%`)
      )
    )
  }

  const allUsers = await db.query.users.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    columns: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      emailVerified: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: [desc(users.createdAt)],
    limit,
    offset: (page - 1) * limit,
  })

  return allUsers
}

export async function getAdminUserStats() {
  await requireRole(['admin'])

  const [total, customers, admins, providers, carriers] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(users).where(eq(users.role, 'customer')),
    db.select({ count: count() }).from(users).where(eq(users.role, 'admin')),
    db.select({ count: count() }).from(users).where(eq(users.role, 'provider')),
    db.select({ count: count() }).from(users).where(eq(users.role, 'carrier')),
  ])

  return {
    total: total[0]?.count || 0,
    customers: customers[0]?.count || 0,
    admins: admins[0]?.count || 0,
    providers: providers[0]?.count || 0,
    carriers: carriers[0]?.count || 0,
  }
}

export async function getAdminUser(id: string) {
  await requireRole(['admin'])

  return db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      email: true,
      name: true,
      phone: true,
      dni: true,
      role: true,
      emailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      addresses: true,
    },
  })
}

export async function updateAdminUser(
  id: string,
  data: Partial<{
    name: string
    phone: string
    role: 'customer' | 'admin' | 'provider' | 'carrier'
    emailVerified: boolean
  }>
) {
  await requireRole(['admin'])

  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  revalidatePath('/admin/usuarios')
  revalidatePath(`/admin/usuarios/${id}`)

  return user
}

export async function deleteAdminUser(id: string) {
  await requireRole(['admin'])

  await db.delete(users).where(eq(users.id, id))

  revalidatePath('/admin/usuarios')
}
