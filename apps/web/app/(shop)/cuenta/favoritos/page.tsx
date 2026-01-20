import Link from 'next/link'
import Image from 'next/image'
import { getUserFavorites } from '@/lib/actions/favorites'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { RemoveFavoriteButton } from './remove-favorite-button'

export const metadata = {
  title: 'Mis favoritos',
}

export default async function FavoritesPage() {
  const favorites = await getUserFavorites()

  if (favorites.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Mis favoritos</h1>
        <div className="bg-white rounded-lg border p-12 text-center">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No tienes favoritos</h3>
          <p className="text-muted-foreground mt-2">
            Guarda los productos que te gusten para encontrarlos fácilmente
          </p>
          <Button className="mt-4" asChild>
            <Link href="/productos">Explorar productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis favoritos</h1>
        <p className="text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(({ product }) => {
          if (!product) return null

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg border overflow-hidden group"
            >
              {/* Image */}
              <Link
                href={`/producto/${product.slug}`}
                className="block relative aspect-square bg-gray-100"
              >
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
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

                {/* Remove button */}
                <div className="absolute top-2 right-2">
                  <RemoveFavoriteButton productId={product.id} />
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                {product.category && (
                  <Link
                    href={`/categoria/${product.category.slug}`}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    {product.category.name}
                  </Link>
                )}

                <Link href={`/producto/${product.slug}`}>
                  <h3 className="font-medium mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(Number(product.basePrice))}
                  </span>
                  {product.comparePrice && Number(product.comparePrice) > Number(product.basePrice) && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(Number(product.comparePrice))}
                    </span>
                  )}
                </div>

                {/* Stock status */}
                {product.stock !== null && product.stock <= 0 && (
                  <p className="text-sm text-red-600 mt-2">Agotado</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
