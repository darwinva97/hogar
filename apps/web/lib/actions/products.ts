'use server'

import { db } from '@hogar/database'
import { products, categories, productImages } from '@hogar/database'
import { eq, desc, like, and, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export interface ProductFilters {
  categorySlug?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  providerId?: string
  page?: number
  limit?: number
}

export async function getProducts(filters: ProductFilters = {}) {
  const { page = 1, limit = 20, ...rest } = filters

  const conditions = []

  if (rest.categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, rest.categorySlug),
    })
    if (category) {
      conditions.push(eq(products.categoryId, category.id))
    }
  }

  if (rest.search) {
    conditions.push(like(products.name, `%${rest.search}%`))
  }

  if (rest.providerId) {
    conditions.push(eq(products.providerId, rest.providerId))
  }

  if (rest.minPrice) {
    conditions.push(sql`${products.basePrice} >= ${rest.minPrice}`)
  }

  if (rest.maxPrice) {
    conditions.push(sql`${products.basePrice} <= ${rest.maxPrice}`)
  }

  // Solo productos activos
  conditions.push(eq(products.status, 'active'))

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [items, countResult] = await Promise.all([
    db.query.products.findMany({
      where: whereClause,
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1,
        },
        category: true,
        provider: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [desc(products.createdAt)],
      limit,
      offset: (page - 1) * limit,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause),
  ])

  return {
    items,
    total: Number(countResult[0]?.count || 0),
    page,
    limit,
    totalPages: Math.ceil(Number(countResult[0]?.count || 0) / limit),
  }
}

export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.order)],
      },
      variants: true,
      category: true,
      provider: {
        columns: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          rating: true,
        },
      },
    },
  })

  return product
}

export async function getFeaturedProducts(limit = 8) {
  return db.query.products.findMany({
    where: eq(products.status, 'active'),
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.order)],
        limit: 1,
      },
      provider: {
        columns: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    limit,
  })
}

export async function getProductsByProvider(providerId: string, limit = 10) {
  return db.query.products.findMany({
    where: and(
      eq(products.providerId, providerId),
      eq(products.status, 'active')
    ),
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.order)],
        limit: 1,
      },
    },
    orderBy: [desc(products.createdAt)],
    limit,
  })
}
