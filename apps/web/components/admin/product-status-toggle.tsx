'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleAdminProductStatus } from '@/lib/actions/admin'
import { toast } from 'sonner'

interface AdminProductStatusToggleProps {
  productId: string
  isPublished: boolean
}

export function AdminProductStatusToggle({ productId, isPublished }: AdminProductStatusToggleProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleAdminProductStatus(productId, 'isPublished')
        toast.success(isPublished ? 'Producto despublicado' : 'Producto publicado')
        router.refresh()
      } catch {
        toast.error('Error al cambiar estado')
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isPublished ? 'bg-green-500' : 'bg-gray-200'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isPublished ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
