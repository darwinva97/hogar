'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { ReviewStars } from './review-stars'
import { markReviewHelpful } from '@/lib/actions/reviews'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface ReviewCardProps {
  review: {
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
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0)
  const [isHelpful, setIsHelpful] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleHelpful() {
    startTransition(async () => {
      const result = await markReviewHelpful(review.id)

      if (result.success) {
        setIsHelpful(result.helpful)
        setHelpfulCount((prev) => (result.helpful ? prev + 1 : prev - 1))
      } else {
        toast.error(result.error || 'Error')
      }
    })
  }

  return (
    <div className="border-b pb-6 last:border-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            {review.user?.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name || 'Usuario'}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                {review.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.user?.name || 'Usuario'}</span>
              {review.isVerified && (
                <Badge variant="secondary" className="text-xs">
                  Compra verificada
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        <ReviewStars rating={review.rating} size="sm" />
      </div>

      {/* Content */}
      <div className="mt-4">
        {review.title && <h4 className="font-semibold">{review.title}</h4>}

        {review.body && (
          <p className="text-muted-foreground mt-2">{review.body}</p>
        )}

        {/* Pros and Cons */}
        {(review.pros || review.cons) && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {review.pros && (
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm font-medium text-green-700 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lo bueno
                </p>
                <p className="text-sm text-green-800 mt-1">{review.pros}</p>
              </div>
            )}

            {review.cons && (
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-sm font-medium text-red-700 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Lo malo
                </p>
                <p className="text-sm text-red-800 mt-1">{review.cons}</p>
              </div>
            )}
          </div>
        )}

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {review.images.map((image) => (
              <div
                key={image.id}
                className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100"
              >
                <Image
                  src={image.url}
                  alt={image.alt || 'Imagen de reseña'}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Helpful */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleHelpful}
          disabled={isPending}
          className={`text-sm flex items-center gap-1 transition-colors ${
            isHelpful
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          Útil ({helpfulCount})
        </button>
      </div>
    </div>
  )
}
