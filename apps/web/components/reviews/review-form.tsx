'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ReviewStars } from './review-stars'
import { createReview } from '@/lib/actions/reviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ReviewFormProps {
  productId: string
  productName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({ productId, productName, onSuccess, onCancel }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Por favor selecciona una calificación')
      return
    }

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createReview({
        productId,
        rating,
        title: formData.get('title') as string || undefined,
        body: formData.get('body') as string || undefined,
        pros: formData.get('pros') as string || undefined,
        cons: formData.get('cons') as string || undefined,
      })

      if (result.success) {
        toast.success('Reseña publicada')
        router.refresh()
        onSuccess?.()
      } else {
        toast.error(result.error || 'Error al publicar reseña')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Escribe tu reseña</h3>
        <p className="text-sm text-muted-foreground">
          Comparte tu experiencia con &quot;{productName}&quot;
        </p>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label>Calificación *</Label>
        <div className="flex items-center gap-2">
          <ReviewStars
            rating={rating}
            size="lg"
            interactive
            onRatingChange={setRating}
          />
          <span className="text-sm text-muted-foreground">
            {rating === 0 && 'Selecciona una calificación'}
            {rating === 1 && 'Muy malo'}
            {rating === 2 && 'Malo'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Bueno'}
            {rating === 5 && 'Excelente'}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título de tu reseña</Label>
        <Input
          id="title"
          name="title"
          placeholder="Resume tu experiencia en una frase"
          maxLength={100}
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <Label htmlFor="body">Tu reseña</Label>
        <textarea
          id="body"
          name="body"
          rows={4}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Cuéntanos más sobre tu experiencia con el producto..."
        />
      </div>

      {/* Pros and Cons */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pros" className="flex items-center gap-1 text-green-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Lo bueno
          </Label>
          <textarea
            id="pros"
            name="pros"
            rows={2}
            className="w-full border rounded-md px-3 py-2"
            placeholder="¿Qué te gustó del producto?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cons" className="flex items-center gap-1 text-red-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Lo malo
          </Label>
          <textarea
            id="cons"
            name="cons"
            rows={2}
            className="w-full border rounded-md px-3 py-2"
            placeholder="¿Qué podría mejorar?"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending || rating === 0}>
          {isPending ? 'Publicando...' : 'Publicar reseña'}
        </Button>
      </div>
    </form>
  )
}
