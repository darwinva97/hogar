'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteReview } from '@/lib/actions/reviews'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface DeleteReviewButtonProps {
  reviewId: string
}

export function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) return

    startTransition(async () => {
      const result = await deleteReview(reviewId)

      if (result.success) {
        toast.success('Reseña eliminada')
        router.refresh()
      } else {
        toast.error(result.error || 'Error al eliminar')
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </Button>
  )
}
