import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryWithChildren, getCategoryBreadcrumb } from '@/lib/actions/categories'
import { getProducts } from '@/lib/actions/products'
import { ProductCard } from '@/components/product-card'
import { Pagination } from '@/components/pagination'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ pagina?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryWithChildren(slug)

  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  return {
    title: `${category.name} - Muebles`,
    description: `Encuentra los mejores ${category.name.toLowerCase()} para tu hogar. Directo del fabricante con los mejores precios.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params
  const { pagina } = await searchParams
  const page = Number(pagina) || 1

  const category = await getCategoryWithChildren(slug)

  if (!category) {
    notFound()
  }

  const [productsData, breadcrumb] = await Promise.all([
    getProducts({
      categorySlug: slug,
      page,
      limit: 20,
    }),
    getCategoryBreadcrumb(slug),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/productos" className="hover:text-foreground">
          Productos
        </Link>
        {breadcrumb.map((cat, index) => (
          <span key={cat.id} className="flex items-center gap-2">
            <span>/</span>
            {index === breadcrumb.length - 1 ? (
              <span className="text-foreground font-medium">{cat.name}</span>
            ) : (
              <Link
                href={`/categoria/${cat.slug}`}
                className="hover:text-foreground"
              >
                {cat.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-2">
          {productsData.total} productos encontrados
        </p>
      </div>

      {/* Subcategories */}
      {category.children && category.children.length > 0 && (
        <div className="mb-8">
          <h2 className="font-medium mb-4">Subcategorías</h2>
          <div className="flex flex-wrap gap-2">
            {category.children.map((sub) => (
              <Link
                key={sub.id}
                href={`/categoria/${sub.slug}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {productsData.items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsData.items.map((product) => (
              <ProductCard key={product.id} product={product} />
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
            No hay productos en esta categoría
          </h3>
          <p className="text-muted-foreground mt-2">
            Pronto agregaremos más productos
          </p>
          <Link
            href="/productos"
            className="inline-block mt-4 text-primary hover:underline"
          >
            Ver todos los productos
          </Link>
        </div>
      )}
    </div>
  )
}
