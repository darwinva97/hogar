import { cn } from '@/lib/utils'

interface ReviewStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function ReviewStars({
  rating,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange,
}: ReviewStarsProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (star: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(star)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= rating
        const halfFilled = !filled && star - 0.5 <= rating

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive
                ? 'cursor-pointer hover:scale-110'
                : 'cursor-default',
              filled || halfFilled ? 'text-yellow-400' : 'text-gray-300'
            )}
          >
            <svg
              className={sizes[size]}
              viewBox="0 0 20 20"
              fill={filled ? 'currentColor' : halfFilled ? 'url(#half)' : 'none'}
              stroke="currentColor"
              strokeWidth={1}
            >
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        )
      })}

      {showValue && (
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
