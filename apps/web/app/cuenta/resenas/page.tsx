import Link from 'next/link'
import Image from 'next/image'
import { getUserReviews, deleteReview } from '@/lib/actions/reviews'
import { formatDate } from '@/lib/utils'
import { ReviewStars } from '@/components/reviews'
import { Button } from '@/components/ui/button'
import { DeleteReviewButton } from './delete-review-button'

export const metadata = {
  title: 'Mis reseñas',
}

export default async function UserReviewsPage() {
  const reviews = await getUserReviews()

  if (reviews.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Mis reseñas</h1>
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No tienes reseñas</h3>
          <p className="text-muted-foreground mt-2">
            Compra productos para poder dejar reseñas
          </p>
          <Button className="mt-4" asChild>
            <Link href="/productos">Ver productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis reseñas</h1>
        <p className="text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg border p-6">
            <div className="flex gap-4">
              {/* Product image */}
              <Link
                href={`/producto/${review.product?.slug}`}
                className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0"
              >
                {review.product?.images?.[0] ? (
                  <Image
                    src={review.product.images[0].url}
                    alt={review.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="h-8 w-8"
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
              </Link>

              {/* Review content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/producto/${review.product?.slug}`}
                      className="font-medium hover:text-primary line-clamp-1"
                    >
                      {review.product?.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <ReviewStars rating={review.rating} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <DeleteReviewButton reviewId={review.id} />
                </div>

                {review.title && (
                  <h4 className="font-medium mt-2">{review.title}</h4>
                )}

                {review.body && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {review.body}
                  </p>
                )}

                <Link
                  href={`/producto/${review.product?.slug}#reviews`}
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Ver reseña completa
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
