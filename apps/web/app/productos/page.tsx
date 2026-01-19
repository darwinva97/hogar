import { Suspense } from 'react'
import { getProducts } from '@/lib/actions/products'
import { getAllCategories } from '@/lib/actions/categories'
import { getUserFavoriteIds } from '@/lib/actions/favorites'
import { ProductCard } from '@/components/product-card'
import { ProductFilters } from '@/components/product-filters'
import { Pagination } from '@/components/pagination'

interface ProductsPageProps {
  searchParams: Promise<{
    categoria?: string
    buscar?: string
    min?: string
    max?: string
    orden?: string
    pagina?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const page = Number(params.pagina) || 1

  const [productsData, categories, favoriteIds] = await Promise.all([
    getProducts({
      categorySlug: params.categoria,
      search: params.buscar,
      minPrice: params.min ? Number(params.min) : undefined,
      maxPrice: params.max ? Number(params.max) : undefined,
      page,
      limit: 20,
    }),
    getAllCategories(),
    getUserFavoriteIds(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {params.categoria
                  ? categories
                      .flatMap((c) => [c, ...(c.children || [])])
                      .find((c) => c.slug === params.categoria)?.name || 'Productos'
                  : 'Todos los productos'}
              </h1>
              <p className="text-muted-foreground">
                {productsData.total} productos encontrados
              </p>
            </div>

            <select
              className="border rounded-md px-3 py-2 text-sm"
              defaultValue={params.orden || 'recientes'}
            >
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
              <option value="populares">Más populares</option>
            </select>
          </div>

          {/* Products */}
          {productsData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productsData.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favoriteIds.includes(product.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {productsData.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={productsData.totalPages}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium">
                No se encontraron productos
              </h3>
              <p className="text-muted-foreground mt-2">
                Intenta con otros filtros o búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
