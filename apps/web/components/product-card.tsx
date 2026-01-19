import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from '@/components/favorite-button'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    basePrice: string
    comparePrice?: string | null
    images?: { url: string; alt?: string | null }[]
    provider?: {
      name: string
      slug: string
    } | null
    isFeatured?: boolean
  }
  isFavorite?: boolean
}

export function ProductCard({ product, isFavorite = false }: ProductCardProps) {
  const mainImage = product.images?.[0]
  const hasDiscount =
    product.comparePrice && Number(product.comparePrice) > Number(product.basePrice)
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.basePrice)) /
          Number(product.comparePrice)) *
          100
      )
    : 0

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <svg
                className="h-12 w-12"
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
            <Badge variant="destructive" className="absolute left-2 top-2">
              -{discountPercent}%
            </Badge>
          )}

          {product.isFeatured && !isFavorite && (
            <Badge variant="default" className="absolute right-2 top-2">
              Destacado
            </Badge>
          )}

          {/* Favorite button */}
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <FavoriteButton
              productId={product.id}
              initialFavorite={isFavorite}
              size="sm"
            />
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        {product.provider && (
          <p className="text-xs text-muted-foreground">
            {product.provider.name}
          </p>
        )}

        <Link href={`/producto/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-medium leading-tight hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(Number(product.basePrice))}
          </span>

          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(Number(product.comparePrice))}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
