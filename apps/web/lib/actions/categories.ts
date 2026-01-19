'use server'

import { db } from '@hogar/database'
import { categories } from '@hogar/database'
import { eq, isNull, asc } from 'drizzle-orm'

export async function getMainCategories() {
  return db.query.categories.findMany({
    where: isNull(categories.parentId),
    orderBy: [asc(categories.order)],
  })
}

export async function getCategoryWithChildren(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      children: {
        orderBy: (children, { asc }) => [asc(children.order)],
      },
      parent: true,
    },
  })

  return category
}

export async function getAllCategories() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.order)],
  })

  // Construir árbol de categorías
  const mainCategories = allCategories.filter((c) => !c.parentId)

  return mainCategories.map((main) => ({
    ...main,
    children: allCategories.filter((c) => c.parentId === main.id),
  }))
}

export async function getCategoryBreadcrumb(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      parent: {
        with: {
          parent: true,
        },
      },
    },
  })

  if (!category) return []

  const breadcrumb = [category]
  let current = category.parent

  while (current) {
    breadcrumb.unshift(current)
    current = (current as typeof category).parent
  }

  return breadcrumb
}
