import { ReviewStars } from './review-stars'

interface ReviewSummaryProps {
  average: number
  total: number
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export function ReviewSummary({ average, total, distribution }: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <div className="flex flex-col sm:flex-row gap-8">
      {/* Average rating */}
      <div className="text-center sm:text-left">
        <div className="text-5xl font-bold">{average.toFixed(1)}</div>
        <ReviewStars rating={average} size="lg" />
        <p className="text-sm text-muted-foreground mt-1">
          {total} {total === 1 ? 'reseña' : 'reseñas'}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star as keyof typeof distribution]
          const percentage = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={star} className="flex items-center gap-2">
              <span className="w-3 text-sm text-muted-foreground">{star}</span>
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-sm text-muted-foreground text-right">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
