'use server'

import { db } from '@hogar/database'
import { orders, users, providers, carriers, shipments, products, productImages } from '@hogar/database'
import { eq, desc, count, sql, and, gte, like, or } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

// Dashboard stats
export async function getAdminStats() {
  await requireRole(['admin'])

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalOrders,
    monthlyOrders,
    totalRevenue,
    monthlyRevenue,
    totalUsers,
    totalProviders,
    totalCarriers,
    pendingShipments,
  ] = await Promise.all([
    db.select({ count: count() }).from(orders),
    db
      .select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, startOfMonth)),
    db
      .select({ total: sql<number>`COALESCE(SUM(${orders.total}::numeric), 0)` })
      .from(orders)
      .where(eq(orders.paymentStatus, 'completed')),
    db
      .select({ total: sql<number>`COALESCE(SUM(${orders.total}::numeric), 0)` })
      .from(orders)
      .where(
        and(eq(orders.paymentStatus, 'completed'), gte(orders.createdAt, startOfMonth))
      ),
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(providers),
    db.select({ count: count() }).from(carriers),
    db
      .select({ count: count() })
      .from(shipments)
      .where(eq(shipments.status, 'pending')),
  ])

  return {
    orders: {
      total: totalOrders[0]?.count || 0,
      monthly: monthlyOrders[0]?.count || 0,
    },
    revenue: {
      total: totalRevenue[0]?.total || 0,
      monthly: monthlyRevenue[0]?.total || 0,
    },
    users: totalUsers[0]?.count || 0,
    providers: totalProviders[0]?.count || 0,
    carriers: totalCarriers[0]?.count || 0,
    pendingShipments: pendingShipments[0]?.count || 0,
  }
}

// Recent orders
export async function getRecentOrders(limit = 10) {
  await requireRole(['admin'])

  return db.query.orders.findMany({
    with: {
      user: {
        columns: { id: true, name: true, email: true },
      },
    },
    orderBy: [desc(orders.createdAt)],
    limit,
  })
}

// Carriers
export async function getCarriers() {
  await requireRole(['admin'])

  return db.query.carriers.findMany({
    orderBy: [desc(carriers.createdAt)],
  })
}

export async function getCarrierById(id: string) {
  await requireRole(['admin'])

  return db.query.carriers.findFirst({
    where: eq(carriers.id, id),
    with: {
      shipments: {
        orderBy: (s, { desc }) => [desc(s.createdAt)],
        limit: 10,
      },
    },
  })
}

export async function createCarrier(data: {
  name: string
  phone: string
  whatsapp?: string
  email?: string
  dni?: string
  type: 'independent' | 'fleet' | 'partner'
  integrationLevel: 'api' | 'app' | 'whatsapp' | 'manual'
  vehicleType?: string
  vehiclePlate?: string
  districts?: string[]
  baseDistrict?: string
  baseFee?: string
  perKmFee?: string
}) {
  await requireRole(['admin'])

  const [carrier] = await db
    .insert(carriers)
    .values({
      ...data,
      vehicleType: data.vehicleType as any,
      type: data.type,
      integrationLevel: data.integrationLevel,
    })
    .returning()

  return carrier
}

export async function updateCarrier(
  id: string,
  data: Partial<{
    name: string
    phone: string
    whatsapp: string
    email: string
    dni: string
    type: 'independent' | 'fleet' | 'partner'
    integrationLevel: 'api' | 'app' | 'whatsapp' | 'manual'
    vehicleType: string
    vehiclePlate: string
    districts: string[]
    baseDistrict: string
    baseFee: string
    perKmFee: string
    isActive: boolean
    isVerified: boolean
  }>
) {
  await requireRole(['admin'])

  const [carrier] = await db
    .update(carriers)
    .set({
      ...data,
      vehicleType: data.vehicleType as any,
      updatedAt: new Date(),
    })
    .where(eq(carriers.id, id))
    .returning()

  return carrier
}

// Shipments
export async function getPendingShipments() {
  await requireRole(['admin'])

  return db.query.shipments.findMany({
    where: eq(shipments.status, 'pending'),
    with: {
      order: {
        with: {
          user: {
            columns: { id: true, name: true, phone: true },
          },
        },
      },
    },
    orderBy: [desc(shipments.createdAt)],
  })
}

export async function assignCarrierToShipment(
  shipmentId: string,
  carrierId: string,
  agreedFee?: string
) {
  await requireRole(['admin'])

  const [shipment] = await db
    .update(shipments)
    .set({
      carrierId,
      agreedFee,
      status: 'assigned',
      updatedAt: new Date(),
    })
    .where(eq(shipments.id, shipmentId))
    .returning()

  return shipment
}

export async function getAvailableCarriers(district?: string) {
  await requireRole(['admin'])

  const conditions = [
    eq(carriers.isActive, true),
    eq(carriers.isAvailable, true),
  ]

  // TODO: Filter by district coverage

  return db.query.carriers.findMany({
    where: and(...conditions),
    orderBy: [desc(carriers.rating)],
  })
}

// ==================== PRODUCTS ====================

export async function getAdminProducts(filters?: {
  search?: string
  providerId?: string
  categoryId?: string
  isActive?: boolean
  isPublished?: boolean
  page?: number
  limit?: number
}) {
  await requireRole(['admin'])

  const { page = 1, limit = 20 } = filters || {}
  const conditions = []

  if (filters?.providerId) {
    conditions.push(eq(products.providerId, filters.providerId))
  }

  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId))
  }

  if (filters?.isActive !== undefined) {
    conditions.push(eq(products.isActive, filters.isActive))
  }

  if (filters?.isPublished !== undefined) {
    conditions.push(eq(products.isPublished, filters.isPublished))
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(products.name, `%${filters.search}%`),
        like(products.sku, `%${filters.search}%`)
      )
    )
  }

  const allProducts = await db.query.products.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      images: {
        orderBy: (img, { asc }) => [asc(img.order)],
        limit: 1,
      },
      category: true,
      provider: {
        columns: { id: true, name: true },
      },
    },
    orderBy: [desc(products.createdAt)],
    limit,
    offset: (page - 1) * limit,
  })

  return allProducts
}

export async function getAdminProduct(id: string) {
  await requireRole(['admin'])

  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      images: {
        orderBy: (img, { asc }) => [asc(img.order)],
      },
      category: true,
      provider: true,
    },
  })
}

export async function createAdminProduct(data: {
  name: string
  description?: string
  shortDescription?: string
  categoryId: string
  providerId: string
  basePrice: string
  comparePrice?: string
  sku?: string
  stock?: number
  width?: number
  height?: number
  depth?: number
  weight?: number
  materials?: string
  isPublished?: boolean
}) {
  await requireRole(['admin'])

  const slug = slugify(data.name)

  // Check if slug exists
  const existing = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  })

  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug

  const [product] = await db
    .insert(products)
    .values({
      ...data,
      slug: finalSlug,
      isActive: true,
      isPublished: data.isPublished ?? false,
    })
    .returning()

  revalidatePath('/admin/productos')

  return product
}

export async function updateAdminProduct(
  id: string,
  data: Partial<{
    name: string
    description: string
    shortDescription: string
    categoryId: string
    providerId: string
    basePrice: string
    comparePrice: string
    sku: string
    stock: number
    width: number
    height: number
    depth: number
    weight: number
    materials: string
    isActive: boolean
    isPublished: boolean
  }>
) {
  await requireRole(['admin'])

  const [product] = await db
    .update(products)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning()

  revalidatePath('/admin/productos')
  revalidatePath(`/admin/productos/${id}`)

  return product
}

export async function deleteAdminProduct(id: string) {
  await requireRole(['admin'])

  await db.delete(products).where(eq(products.id, id))

  revalidatePath('/admin/productos')
}

export async function toggleAdminProductStatus(id: string, field: 'isActive' | 'isPublished') {
  await requireRole(['admin'])

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  })

  if (!product) throw new Error('Producto no encontrado')

  const [updated] = await db
    .update(products)
    .set({
      [field]: !product[field],
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning()

  revalidatePath('/admin/productos')

  return updated
}

// ==================== PROVIDERS (Internal Suppliers) ====================

export async function getAdminProviders() {
  await requireRole(['admin'])

  return db.query.providers.findMany({
    orderBy: [desc(providers.createdAt)],
  })
}

export async function getAdminProvider(id: string) {
  await requireRole(['admin'])

  return db.query.providers.findFirst({
    where: eq(providers.id, id),
  })
}

export async function createAdminProvider(data: {
  name: string
  ruc?: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  district?: string
  description?: string
}) {
  await requireRole(['admin'])

  const slug = slugify(data.name)

  // Check if slug exists
  const existing = await db.query.providers.findFirst({
    where: eq(providers.slug, slug),
  })

  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug

  const [provider] = await db
    .insert(providers)
    .values({
      ...data,
      slug: finalSlug,
      isActive: true,
    })
    .returning()

  revalidatePath('/admin/proveedores')

  return provider
}

export async function updateAdminProvider(
  id: string,
  data: Partial<{
    name: string
    ruc: string
    phone: string
    whatsapp: string
    email: string
    address: string
    district: string
    description: string
    isActive: boolean
  }>
) {
  await requireRole(['admin'])

  const [provider] = await db
    .update(providers)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(providers.id, id))
    .returning()

  revalidatePath('/admin/proveedores')
  revalidatePath(`/admin/proveedores/${id}`)

  return provider
}

export async function deleteAdminProvider(id: string) {
  await requireRole(['admin'])

  // Check if provider has products
  const productCount = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.providerId, id))

  if ((productCount[0]?.count || 0) > 0) {
    throw new Error('No se puede eliminar un proveedor con productos asociados')
  }

  await db.delete(providers).where(eq(providers.id, id))

  revalidatePath('/admin/proveedores')
}
