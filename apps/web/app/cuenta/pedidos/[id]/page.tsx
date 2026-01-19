import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getUserOrder } from '@/lib/actions/user'
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils'
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

const paymentVariants: Record<string, 'default' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'secondary',
  paid: 'success',
  failed: 'destructive',
  refunded: 'default',
}

const shipmentStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  assigned: 'Asignado',
  picked_up: 'Recogido',
  in_transit: 'En camino',
  delivered: 'Entregado',
  failed: 'Fallido',
}

export default async function UserOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getUserOrder(id)

  if (!order) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/cuenta/pedidos"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a pedidos
        </Link>
        <div className="flex items-start justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold">Pedido #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Realizado el {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariants[order.status || 'pending']}>
              {statusLabels[order.status || 'pending']}
            </Badge>
            <Badge variant={paymentVariants[order.paymentStatus || 'pending']}>
              {paymentLabels[order.paymentStatus || 'pending']}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Productos</h2>
            </div>
            <div className="p-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.productName}
                        width={80}
                        height={80}
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
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Vendido por: {item.provider?.name || 'N/A'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm">
                        {formatPrice(Number(item.unitPrice))} x {item.quantity}
                      </p>
                      <p className="font-medium">{formatPrice(Number(item.total))}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          {order.shipments && order.shipments.length > 0 && (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Envío</h2>
              </div>
              <div className="p-4">
                {order.shipments.map((shipment) => (
                  <div key={shipment.id}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">
                          {shipment.trackingCode || 'Sin código de seguimiento'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {shipment.carrier?.name || 'Transportista por asignar'}
                        </p>
                      </div>
                      <Badge variant={shipment.status === 'delivered' ? 'success' : 'default'}>
                        {shipmentStatusLabels[shipment.status || 'pending']}
                      </Badge>
                    </div>

                    {shipment.trackingCode && (
                      <Button asChild>
                        <Link href={`/tracking/${shipment.trackingCode}`}>
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Rastrear envío
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="space-y-6">
          {/* Order summary */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Resumen</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span>{formatPrice(Number(order.shippingCost))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-3 border-t">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Dirección de envío</h2>
            </div>
            <div className="p-4">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-sm text-muted-foreground mt-1">{order.shippingPhone}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {order.shippingAddress}
                {order.shippingDistrict && `, ${order.shippingDistrict}`}
              </p>
              {order.shippingReference && (
                <p className="text-sm text-muted-foreground mt-1">
                  Referencia: {order.shippingReference}
                </p>
              )}
            </div>
          </div>

          {/* Payment info */}
          {order.paymentStatus === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pago pendiente</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Coordina el pago con el administrador para procesar tu pedido.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Need help */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">¿Necesitas ayuda?</p>
                <p className="text-sm text-blue-700 mt-1">
                  Si tienes alguna pregunta sobre tu pedido, contáctanos por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
