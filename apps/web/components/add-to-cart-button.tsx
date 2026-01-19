'use client'

import { useState, useTransition } from 'react'
import { addToCart } from '@/lib/actions/cart'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  productId: string
  variantId?: string
}

export function AddToCartButton({ productId, variantId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(productId, quantity, variantId)
        toast.success('Producto agregado al carrito')
      } catch {
        toast.error('Error al agregar al carrito')
      }
    })
  }

  return (
    <div className="flex items-center gap-4">
      {/* Quantity selector */}
      <div className="flex items-center border rounded-md">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={quantity <= 1}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-2 hover:bg-gray-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Add to cart button */}
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Agregando...
          </>
        ) : (
          <>
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Agregar al carrito
          </>
        )}
      </Button>
    </div>
  )
}
