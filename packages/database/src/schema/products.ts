import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  decimal,
  integer,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { providers } from './providers'

export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'active',
  'out_of_stock',
  'discontinued',
])

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  parentId: uuid('parent_id').references(() => categories.id),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  providerId: uuid('provider_id')
    .references(() => providers.id)
    .notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }), // Para calcular margen
  stock: integer('stock').default(0),
  sku: text('sku'),
  status: productStatusEnum('status').default('draft'),
  fabricationDays: integer('fabrication_days').default(0), // 0 = en stock
  // Dimensiones
  width: decimal('width', { precision: 6, scale: 2 }), // cm
  height: decimal('height', { precision: 6, scale: 2 }), // cm
  depth: decimal('depth', { precision: 6, scale: 2 }), // cm
  weight: decimal('weight', { precision: 6, scale: 2 }), // kg
  // Dimensiones del empaque
  packageWidth: decimal('package_width', { precision: 6, scale: 2 }),
  packageHeight: decimal('package_height', { precision: 6, scale: 2 }),
  packageDepth: decimal('package_depth', { precision: 6, scale: 2 }),
  packageWeight: decimal('package_weight', { precision: 6, scale: 2 }),
  // Atributos
  materials: text('materials').array(),
  colors: text('colors').array(),
  style: text('style'), // moderno, rustico, industrial, etc.
  // Características
  features: jsonb('features').$type<string[]>(),
  specifications: jsonb('specifications').$type<Record<string, string>>(),
  careInstructions: text('care_instructions'),
  // 3D/AR
  has3dModel: boolean('has_3d_model').default(false),
  model3dUrl: text('model_3d_url'),
  // SEO
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  // Stats
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').default(0),
  totalSales: integer('total_sales').default(0),
  viewCount: integer('view_count').default(0),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
})

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  alt: text('alt'),
  order: integer('order').default(0),
  isPrimary: boolean('is_primary').default(false),
  is3dModel: boolean('is_3d_model').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  sku: text('sku'),
  name: text('name'), // "Gris oscuro - Grande"
  color: text('color'),
  size: text('size'),
  material: text('material'),
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default(
    '0'
  ),
  stock: integer('stock').default(0),
  image: text('image'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'parent_child',
  }),
  children: many(categories, { relationName: 'parent_child' }),
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  provider: one(providers, {
    fields: [products.providerId],
    references: [providers.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
)
