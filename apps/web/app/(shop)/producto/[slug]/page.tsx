import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getProductsByProvider } from '@/lib/actions/products'
import { getCategoryBreadcrumb } from '@/lib/actions/categories'
import { isFavorite } from '@/lib/actions/favorites'
import { getProductReviews, canReviewProduct } from '@/lib/actions/reviews'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { FavoriteButton } from '@/components/favorite-button'
import { ProductCard } from '@/components/product-card'
import { ProductReviews, ReviewStars } from '@/components/reviews'
import { Badge } from '@/components/ui/badge'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Producto no encontrado' }
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const [breadcrumb, relatedProducts, isProductFavorite, reviewsData, reviewPermission] = await Promise.all([
    product.category?.slug
      ? getCategoryBreadcrumb(product.category.slug)
      : Promise.resolve([]),
    product.provider?.id
      ? getProductsByProvider(product.provider.id, 4)
      : Promise.resolve([]),
    isFavorite(product.id),
    getProductReviews(product.id),
    canReviewProduct(product.id),
  ])

  const hasDiscount =
    product.comparePrice &&
    Number(product.comparePrice) > Number(product.basePrice)
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.basePrice)) /
          Number(product.comparePrice)) *
          100
      )
    : 0

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
        {breadcrumb.map((cat) => (
          <span key={cat.id} className="flex items-center gap-2">
            <span>/</span>
            <Link
              href={`/categoria/${cat.slug}`}
              className="hover:text-foreground"
            >
              {cat.name}
            </Link>
          </span>
        ))}
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <svg
                  className="h-24 w-24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 shrink-0 ${
                    index === 0 ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Provider */}
          {product.provider && (
            <Link
              href={`/tienda/${product.provider.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {product.provider.name}
            </Link>
          )}

          <div className="flex items-center justify-between gap-4 mt-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <FavoriteButton
              productId={product.id}
              initialFavorite={isProductFavorite}
              size="lg"
            />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <ReviewStars rating={reviewsData.stats.average} size="md" />
            <Link href="#reviews" className="text-sm text-muted-foreground hover:text-primary">
              ({reviewsData.total} {reviewsData.total === 1 ? 'reseña' : 'reseñas'})
            </Link>
          </div>

          {/* Price */}
          <div className="mt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(Number(product.basePrice))}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Precio incluye IGV
            </p>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-muted-foreground mt-4">
              {product.shortDescription}
            </p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Variantes</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="px-4 py-2 border rounded-md text-sm hover:border-primary"
                  >
                    {variant.name}
                    {variant.price !== product.basePrice && (
                      <span className="ml-2 text-muted-foreground">
                        {formatPrice(Number(variant.price))}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dimensions */}
          {(product.width || product.height || product.depth) && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Dimensiones</h3>
              <div className="flex gap-4 text-sm">
                {product.width && (
                  <span>
                    Ancho: <strong>{product.width} cm</strong>
                  </span>
                )}
                {product.height && (
                  <span>
                    Alto: <strong>{product.height} cm</strong>
                  </span>
                )}
                {product.depth && (
                  <span>
                    Profundidad: <strong>{product.depth} cm</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-8">
            <AddToCartButton productId={product.id} />
          </div>

          {/* Shipping info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-medium">Envío a todo Lima</p>
                <p className="text-sm text-muted-foreground">
                  Coordinamos la entrega directamente contigo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="font-medium">Compra protegida</p>
                <p className="text-sm text-muted-foreground">
                  Recibe el producto que esperabas o te devolvemos tu dinero
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Descripción</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div id="reviews" className="mt-12 scroll-mt-8">
        <ProductReviews
          productId={product.id}
          productName={product.name}
          reviews={reviewsData.reviews}
          total={reviewsData.total}
          stats={reviewsData.stats}
          canReview={reviewPermission.canReview}
          hasReviewed={reviewPermission.hasReviewed}
        />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 1 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">
            Más de {product.provider?.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
