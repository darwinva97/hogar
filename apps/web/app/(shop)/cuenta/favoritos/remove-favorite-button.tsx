'use client'

import { useTransition } from 'react'
import { removeFavorite } from '@/lib/actions/favorites'
import { toast } from 'sonner'

interface RemoveFavoriteButtonProps {
  productId: string
}

export function RemoveFavoriteButton({ productId }: RemoveFavoriteButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleRemove() {
    startTransition(async () => {
      const result = await removeFavorite(productId)

      if (result.success) {
        toast.success('Eliminado de favoritos')
      } else {
        toast.error(result.error || 'Error al eliminar')
      }
    })
  }

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
      title="Quitar de favoritos"
    >
      <svg
        className="w-4 h-4 text-red-500"
        fill="currentColor"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
