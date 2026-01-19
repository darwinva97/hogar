import Link from 'next/link'
import Image from 'next/image'
import { getUserOrders } from '@/lib/actions/user'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const statusVariants: Record<string, 'default' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'secondary',
  confirmed: 'default',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
}

const paymentLabels: Record<string, string> = {
  pending: 'Pago pendiente',
  paid: 'Pagado',
  failed: 'Pago fallido',
  refunded: 'Reembolsado',
}

export default async function UserOrdersPage() {
  const orders = await getUserOrders()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No tienes pedidos</h3>
          <p className="text-muted-foreground mt-2">
            Explora nuestro catálogo y encuentra los muebles perfectos para tu hogar
          </p>
          <Button className="mt-4" asChild>
            <Link href="/productos">Ver productos</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pedido</p>
                    <p className="font-medium">#{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">{formatPrice(Number(order.total))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[order.status || 'pending']}>
                    {statusLabels[order.status || 'pending']}
                  </Badge>
                  {order.paymentStatus === 'pending' && (
                    <Badge variant="secondary">{paymentLabels.pending}</Badge>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="p-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-sm text-muted-foreground">{item.variantName}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(Number(item.unitPrice))} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(Number(item.total))}</p>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                {order.shipments && order.shipments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span className="text-muted-foreground">
                        {order.shipments[0].trackingCode ? (
                          <>
                            Código de seguimiento:{' '}
                            <Link
                              href={`/tracking/${order.shipments[0].trackingCode}`}
                              className="text-primary hover:underline"
                            >
                              {order.shipments[0].trackingCode}
                            </Link>
                          </>
                        ) : (
                          'Envío en preparación'
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-4 border-t flex justify-end gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cuenta/pedidos/${order.id}`}>
                      Ver detalles
                    </Link>
                  </Button>
                  {order.shipments?.[0]?.trackingCode && (
                    <Button size="sm" asChild>
                      <Link href={`/tracking/${order.shipments[0].trackingCode}`}>
                        Rastrear envío
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
