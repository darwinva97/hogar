'use client'

import { useState } from 'react'
import { ReviewSummary } from './review-summary'
import { ReviewCard } from './review-card'
import { ReviewForm } from './review-form'
import { Button } from '@/components/ui/button'

interface Review {
  id: string
  rating: number
  title: string | null
  body: string | null
  pros: string | null
  cons: string | null
  isVerified: boolean | null
  helpfulCount: number | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
  } | null
  images?: {
    id: string
    url: string
    alt: string | null
  }[]
}

interface ProductReviewsProps {
  productId: string
  productName: string
  reviews: Review[]
  total: number
  stats: {
    average: number
    distribution: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
  canReview: boolean
  hasReviewed: boolean
}

export function ProductReviews({
  productId,
  productName,
  reviews,
  total,
  stats,
  canReview,
  hasReviewed,
}: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reseñas de clientes</h2>

        {canReview && !hasReviewed && !showForm && (
          <Button onClick={() => setShowForm(true)}>Escribir reseña</Button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <ReviewForm
            productId={productId}
            productName={productName}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Already reviewed message */}
      {hasReviewed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            Ya has dejado una reseña para este producto. ¡Gracias por compartir tu experiencia!
          </p>
        </div>
      )}

      {/* Summary */}
      {total > 0 ? (
        <>
          <ReviewSummary
            average={stats.average}
            total={total}
            distribution={stats.distribution}
          />

          {/* Reviews list */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Load more would go here */}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
          <h3 className="mt-4 text-lg font-medium">Sin reseñas todavía</h3>
          <p className="text-muted-foreground mt-2">
            Sé el primero en compartir tu experiencia con este producto
          </p>

          {canReview && !showForm && (
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              Escribir la primera reseña
            </Button>
          )}

          {!canReview && !hasReviewed && (
            <p className="text-sm text-muted-foreground mt-4">
              Compra este producto para poder dejar una reseña
            </p>
          )}
        </div>
      )}
    </div>
  )
}
