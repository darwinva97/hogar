'use server'

import { db } from '@hogar/database'
import { favorites } from '@hogar/database'
import { eq, and, desc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(productId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { success: false, error: 'Debes iniciar sesión', isFavorite: false }
  }

  // Check if already favorited
  const existing = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, session.user.id),
      eq(favorites.productId, productId)
    ),
  })

  if (existing) {
    // Remove from favorites
    await db.delete(favorites).where(eq(favorites.id, existing.id))
    revalidatePath('/', 'layout')
    return { success: true, isFavorite: false }
  } else {
    // Add to favorites
    await db.insert(favorites).values({
      userId: session.user.id,
      productId,
    })
    revalidatePath('/', 'layout')
    return { success: true, isFavorite: true }
  }
}

export async function isFavorite(productId: string): Promise<boolean> {
  const session = await getSession()

  if (!session?.user) {
    return false
  }

  const existing = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, session.user.id),
      eq(favorites.productId, productId)
    ),
  })

  return !!existing
}

export async function getUserFavorites() {
  const session = await getSession()

  if (!session?.user) {
    return []
  }

  const userFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, session.user.id),
    with: {
      product: {
        with: {
          images: {
            orderBy: (img, { asc }) => [asc(img.order)],
            limit: 1,
          },
          category: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: [desc(favorites.createdAt)],
  })

  return userFavorites
}

export async function getUserFavoriteIds(): Promise<string[]> {
  const session = await getSession()

  if (!session?.user) {
    return []
  }

  const userFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, session.user.id),
    columns: {
      productId: true,
    },
  })

  return userFavorites.map((f) => f.productId)
}

export async function removeFavorite(productId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { success: false, error: 'Debes iniciar sesión' }
  }

  await db
    .delete(favorites)
    .where(
      and(
        eq(favorites.userId, session.user.id),
        eq(favorites.productId, productId)
      )
    )

  revalidatePath('/cuenta/favoritos')
  return { success: true }
}
