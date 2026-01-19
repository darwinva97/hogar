'use client'

import { useTransition } from 'react'
import { updateCartItem, removeFromCart } from '@/lib/actions/cart'
import { toast } from 'sonner'

interface CartItemActionsProps {
  itemId: string
  quantity: number
}

export function CartItemActions({ itemId, quantity }: CartItemActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleUpdateQuantity = (newQuantity: number) => {
    startTransition(async () => {
      try {
        await updateCartItem(itemId, newQuantity)
      } catch {
        toast.error('Error al actualizar cantidad')
      }
    })
  }

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await removeFromCart(itemId)
        toast.success('Producto eliminado')
      } catch {
        toast.error('Error al eliminar producto')
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      {/* Quantity */}
      <div className="flex items-center border rounded-md">
        <button
          type="button"
          onClick={() => handleUpdateQuantity(quantity - 1)}
          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
          disabled={isPending || quantity <= 1}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="px-3 py-1 min-w-[2.5rem] text-center text-sm font-medium">
          {isPending ? '...' : quantity}
        </span>
        <button
          type="button"
          onClick={() => handleUpdateQuantity(quantity + 1)}
          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
          disabled={isPending}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700 p-1"
        disabled={isPending}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
