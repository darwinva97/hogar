'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleFavorite } from '@/lib/actions/favorites'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  productId: string
  initialFavorite?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({
  productId,
  initialFavorite = false,
  className,
  size = 'md',
}: FavoriteButtonProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isPending, startTransition] = useTransition()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  async function handleToggle() {
    startTransition(async () => {
      const result = await toggleFavorite(productId)

      if (!result.success) {
        if (result.error === 'Debes iniciar sesión') {
          toast.error('Inicia sesión para guardar favoritos')
          router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
        } else {
          toast.error(result.error || 'Error al actualizar favoritos')
        }
        return
      }

      setIsFavorite(result.isFavorite)
      toast.success(result.isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos')
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'flex items-center justify-center rounded-full bg-white shadow-md transition-all',
        'hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <svg
        className={cn(
          iconSizes[size],
          'transition-colors',
          isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'
        )}
        fill={isFavorite ? 'currentColor' : 'none'}
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
