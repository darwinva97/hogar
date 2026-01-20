import Link from 'next/link'
import Image from 'next/image'
import { getCart } from '@/lib/actions/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CartItemActions } from '@/components/cart-item-actions'

export const metadata = {
  title: 'Carrito de compras',
}

export default async function CartPage() {
  const cart = await getCart()

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="mt-6 text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="mt-2 text-muted-foreground">
            Explora nuestros productos y encuentra los muebles perfectos para tu hogar
          </p>
          <Button className="mt-6" asChild>
            <Link href="/productos">Ver productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Carrito de compras</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg bg-white"
            >
              {/* Image */}
              <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                {item.product?.images?.[0] ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/producto/${item.product?.slug}`}
                  className="font-medium hover:text-primary line-clamp-2"
                >
                  {item.product?.name}
                </Link>

                {item.product?.provider && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.product.provider.name}
                  </p>
                )}

                {item.variant && (
                  <p className="text-sm text-muted-foreground">
                    Variante: {item.variant.name}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <CartItemActions
                    itemId={item.id}
                    quantity={item.quantity}
                  />

                  <p className="font-bold text-lg">
                    {formatPrice(
                      Number(item.variant?.price || item.product?.basePrice || 0) *
                        item.quantity
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-white sticky top-24">
            <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'producto' : 'productos'})
                </span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-green-600">Por calcular</span>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(cart.subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Incluye IGV
                </p>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">Continuar al pago</Link>
            </Button>

            <Link
              href="/productos"
              className="block text-center text-sm text-primary hover:underline mt-4"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
