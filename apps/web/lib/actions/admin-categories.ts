'use server'

import { db } from '@hogar/database'
import { categories, products } from '@hogar/database'
import { eq, desc, count, isNull, asc } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function getAdminCategories() {
  await requireRole(['admin'])

  const allCategories = await db.query.categories.findMany({
    with: {
      parent: true,
      children: true,
    },
    orderBy: [asc(categories.order), asc(categories.name)],
  })

  return allCategories
}

export async function getAdminCategoriesTree() {
  await requireRole(['admin'])

  // Get root categories with children
  const rootCategories = await db.query.categories.findMany({
    where: isNull(categories.parentId),
    with: {
      children: {
        orderBy: [asc(categories.order), asc(categories.name)],
      },
    },
    orderBy: [asc(categories.order), asc(categories.name)],
  })

  return rootCategories
}

export async function getAdminCategory(id: string) {
  await requireRole(['admin'])

  return db.query.categories.findFirst({
    where: eq(categories.id, id),
    with: {
      parent: true,
      children: true,
    },
  })
}

export async function createAdminCategory(data: {
  name: string
  description?: string
  image?: string
  parentId?: string
  order?: number
}) {
  await requireRole(['admin'])

  const slug = slugify(data.name)

  // Check if slug exists
  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  })

  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug

  const [category] = await db
    .insert(categories)
    .values({
      ...data,
      slug: finalSlug,
      isActive: true,
    })
    .returning()

  revalidatePath('/admin/categorias')

  return category
}

export async function updateAdminCategory(
  id: string,
  data: Partial<{
    name: string
    description: string
    image: string
    parentId: string | null
    order: number
    isActive: boolean
  }>
) {
  await requireRole(['admin'])

  // If name changed, update slug
  let updateData: Record<string, unknown> = { ...data }

  if (data.name) {
    const slug = slugify(data.name)
    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    })

    if (!existing || existing.id === id) {
      updateData.slug = slug
    } else {
      updateData.slug = `${slug}-${Date.now().toString(36)}`
    }
  }

  const [category] = await db
    .update(categories)
    .set(updateData)
    .where(eq(categories.id, id))
    .returning()

  revalidatePath('/admin/categorias')
  revalidatePath(`/admin/categorias/${id}`)

  return category
}

export async function deleteAdminCategory(id: string) {
  await requireRole(['admin'])

  // Check if category has products
  const productCount = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.categoryId, id))

  if ((productCount[0]?.count || 0) > 0) {
    throw new Error('No se puede eliminar una categoría con productos asociados')
  }

  // Check if category has children
  const childCount = await db
    .select({ count: count() })
    .from(categories)
    .where(eq(categories.parentId, id))

  if ((childCount[0]?.count || 0) > 0) {
    throw new Error('No se puede eliminar una categoría con subcategorías')
  }

  await db.delete(categories).where(eq(categories.id, id))

  revalidatePath('/admin/categorias')
}

export async function toggleCategoryStatus(id: string) {
  await requireRole(['admin'])

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  })

  if (!category) throw new Error('Categoría no encontrada')

  const [updated] = await db
    .update(categories)
    .set({ isActive: !category.isActive })
    .where(eq(categories.id, id))
    .returning()

  revalidatePath('/admin/categorias')

  return updated
}

export async function reorderCategories(
  orderedIds: { id: string; order: number }[]
) {
  await requireRole(['admin'])

  for (const item of orderedIds) {
    await db
      .update(categories)
      .set({ order: item.order })
      .where(eq(categories.id, item.id))
  }

  revalidatePath('/admin/categorias')
}
