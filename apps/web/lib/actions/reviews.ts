'use server'

import { db } from '@hogar/database'
import { reviews, reviewHelpful, orderItems, orders } from '@hogar/database'
import { eq, and, desc, sql, count } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

interface CreateReviewInput {
  productId: string
  rating: number
  title?: string
  body?: string
  pros?: string
  cons?: string
}

// Check if user can review a product (must have purchased it)
export async function canReviewProduct(productId: string): Promise<{
  canReview: boolean
  hasReviewed: boolean
  orderId?: string
}> {
  const session = await getSession()

  if (!session?.user) {
    return { canReview: false, hasReviewed: false }
  }

  // Check if already reviewed
  const existingReview = await db.query.reviews.findFirst({
    where: and(
      eq(reviews.productId, productId),
      eq(reviews.userId, session.user.id)
    ),
  })

  if (existingReview) {
    return { canReview: false, hasReviewed: true }
  }

  // Check if user has purchased this product (delivered orders only)
  const purchasedItem = await db
    .select({ orderId: orderItems.orderId })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orderItems.productId, productId),
        eq(orders.userId, session.user.id),
        eq(orders.status, 'delivered')
      )
    )
    .limit(1)

  if (purchasedItem.length === 0) {
    return { canReview: false, hasReviewed: false }
  }

  return {
    canReview: true,
    hasReviewed: false,
    orderId: purchasedItem[0].orderId,
  }
}

// Create a new review
export async function createReview(input: CreateReviewInput) {
  const session = await getSession()

  if (!session?.user) {
    return { success: false, error: 'Debes iniciar sesión' }
  }

  // Validate rating
  if (input.rating < 1 || input.rating > 5) {
    return { success: false, error: 'La calificación debe ser entre 1 y 5' }
  }

  // Check if can review
  const { canReview, hasReviewed, orderId } = await canReviewProduct(input.productId)

  if (hasReviewed) {
    return { success: false, error: 'Ya has reseñado este producto' }
  }

  if (!canReview) {
    return { success: false, error: 'Debes comprar el producto para poder reseñarlo' }
  }

  try {
    const [review] = await db
      .insert(reviews)
      .values({
        productId: input.productId,
        userId: session.user.id,
        orderId,
        rating: input.rating,
        title: input.title || null,
        body: input.body || null,
        pros: input.pros || null,
        cons: input.cons || null,
        isVerified: true, // Verified purchase
        isApproved: true, // Auto-approve for now
      })
      .returning()

    revalidatePath(`/producto`)

    return { success: true, review }
  } catch (error) {
    console.error('Create review error:', error)
    return { success: false, error: 'Error al crear la reseña' }
  }
}

// Get reviews for a product
export async function getProductReviews(
  productId: string,
  options?: { page?: number; limit?: number }
) {
  const { page = 1, limit = 10 } = options || {}

  const [productReviews, totalResult, statsResult] = await Promise.all([
    db.query.reviews.findMany({
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.isApproved, true)
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        images: {
          orderBy: (img, { asc }) => [asc(img.order)],
        },
      },
      orderBy: [desc(reviews.createdAt)],
      limit,
      offset: (page - 1) * limit,
    }),
    db
      .select({ count: count() })
      .from(reviews)
      .where(
        and(eq(reviews.productId, productId), eq(reviews.isApproved, true))
      ),
    db
      .select({
        avgRating: sql<number>`ROUND(AVG(${reviews.rating})::numeric, 1)`,
        count1: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 1)`,
        count2: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 2)`,
        count3: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 3)`,
        count4: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 4)`,
        count5: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 5)`,
      })
      .from(reviews)
      .where(
        and(eq(reviews.productId, productId), eq(reviews.isApproved, true))
      ),
  ])

  const total = totalResult[0]?.count || 0
  const stats = statsResult[0] || {
    avgRating: 0,
    count1: 0,
    count2: 0,
    count3: 0,
    count4: 0,
    count5: 0,
  }

  return {
    reviews: productReviews,
    total,
    stats: {
      average: Number(stats.avgRating) || 0,
      distribution: {
        1: Number(stats.count1) || 0,
        2: Number(stats.count2) || 0,
        3: Number(stats.count3) || 0,
        4: Number(stats.count4) || 0,
        5: Number(stats.count5) || 0,
      },
    },
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// Mark a review as helpful
export async function markReviewHelpful(reviewId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { success: false, error: 'Debes iniciar sesión' }
  }

  // Check if already marked
  const existing = await db.query.reviewHelpful.findFirst({
    where: and(
      eq(reviewHelpful.reviewId, reviewId),
      eq(reviewHelpful.userId, session.user.id)
    ),
  })

  if (existing) {
    // Remove helpful mark
    await db.delete(reviewHelpful).where(eq(reviewHelpful.id, existing.id))
    await db
      .update(reviews)
      .set({ helpfulCount: sql`${reviews.helpfulCount} - 1` })
      .where(eq(reviews.id, reviewId))

    return { success: true, helpful: false }
  }

  // Add helpful mark
  await db.insert(reviewHelpful).values({
    reviewId,
    userId: session.user.id,
  })

  await db
    .update(reviews)
    .set({ helpfulCount: sql`${reviews.helpfulCount} + 1` })
    .where(eq(reviews.id, reviewId))

  return { success: true, helpful: true }
}

// Get user's reviews
export async function getUserReviews() {
  const session = await getSession()

  if (!session?.user) {
    return []
  }

  return db.query.reviews.findMany({
    where: eq(reviews.userId, session.user.id),
    with: {
      product: {
        columns: {
          id: true,
          name: true,
          slug: true,
        },
        with: {
          images: {
            orderBy: (img, { asc }) => [asc(img.order)],
            limit: 1,
          },
        },
      },
    },
    orderBy: [desc(reviews.createdAt)],
  })
}

// Delete a review (only own reviews)
export async function deleteReview(reviewId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { success: false, error: 'Debes iniciar sesión' }
  }

  const review = await db.query.reviews.findFirst({
    where: and(
      eq(reviews.id, reviewId),
      eq(reviews.userId, session.user.id)
    ),
  })

  if (!review) {
    return { success: false, error: 'Reseña no encontrada' }
  }

  await db.delete(reviews).where(eq(reviews.id, reviewId))

  revalidatePath(`/producto`)

  return { success: true }
}
