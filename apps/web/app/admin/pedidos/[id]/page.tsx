import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminOrderById } from '@/lib/actions/admin-orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { OrderStatusActions } from '@/components/admin/order-status-actions'
import { PaymentStatusActions } from '@/components/admin/payment-status-actions'
import { OrderNotesForm } from '@/components/admin/order-notes-form'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

const statusLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Pendiente', color: 'warning' },
  confirmed: { label: 'Confirmado', color: 'default' },
  processing: { label: 'En proceso', color: 'secondary' },
  shipped: { label: 'Enviado', color: 'default' },
  delivered: { label: 'Entregado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'destructive' },
}

const paymentLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Por pagar', color: 'warning' },
  paid: { label: 'Pagado', color: 'success' },
  failed: { label: 'Fallido', color: 'destructive' },
  refunded: { label: 'Reembolsado', color: 'secondary' },
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const order = await getAdminOrderById(id)

  if (!order) {
    notFound()
  }

  const shippingAddress = order.shippingAddress as {
    name?: string
    phone?: string
    address?: string
    district?: string
    reference?: string
  } | null

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/pedidos"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a pedidos
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pedido #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Creado el {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={statusLabels[order.status || 'pending'].color} className="text-sm">
              {statusLabels[order.status || 'pending'].label}
            </Badge>
            <Badge variant={paymentLabels[order.paymentStatus || 'pending'].color} className="text-sm">
              {paymentLabels[order.paymentStatus || 'pending'].label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Productos</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
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
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">
                        Variante: {item.variantName}
                      </p>
                    )}
                    {item.provider && (
                      <div className="text-sm text-muted-foreground mt-1 p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">Proveedor: {item.provider.name}</span>
                        {item.provider.phone && (
                          <span className="ml-2">
                            <a href={`tel:${item.provider.phone}`} className="text-primary hover:underline">
                              {item.provider.phone}
                            </a>
                          </span>
                        )}
                        {item.provider.whatsapp && (
                          <a
                            href={`https://wa.me/${item.provider.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-green-600 hover:underline"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(Number(item.price))} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(Number(item.total))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{formatPrice(Number(order.shippingCost))}</span>
                </div>
                {order.discount && Number(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-{formatPrice(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Historial</h2>
            </div>
            <div className="p-4">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {order.statusHistory.map((entry, index) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300'}`} />
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-sm">{entry.status}</p>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(entry.createdAt)}
                          {entry.changedBy && ` - por ${entry.changedBy}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin historial</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Cliente</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.user?.name || 'N/A'}</p>
              {order.user?.email && (
                <p className="text-muted-foreground">{order.user.email}</p>
              )}
              {order.user?.phone && (
                <a
                  href={`tel:${order.user.phone}`}
                  className="text-primary hover:underline block"
                >
                  {order.user.phone}
                </a>
              )}
            </div>
          </div>

          {/* Shipping address */}
          {shippingAddress && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Dirección de envío</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{shippingAddress.name}</p>
                <p className="text-muted-foreground">{shippingAddress.address}</p>
                <p className="text-muted-foreground">{shippingAddress.district}</p>
                {shippingAddress.reference && (
                  <p className="text-blue-600">Ref: {shippingAddress.reference}</p>
                )}
                {shippingAddress.phone && (
                  <a
                    href={`tel:${shippingAddress.phone}`}
                    className="text-primary hover:underline block mt-2"
                  >
                    {shippingAddress.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Payment management */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Gestión de pago</h3>
            <div className="text-sm space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método</span>
                <span className="font-medium">{order.paymentMethod || 'No definido'}</span>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Referencia</span>
                  <span className="font-mono text-xs">{order.paymentReference}</span>
                </div>
              )}
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagado el</span>
                  <span>{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
            <PaymentStatusActions
              orderId={order.id}
              currentStatus={order.paymentStatus || 'pending'}
            />
          </div>

          {/* Order status */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Estado del pedido</h3>
            <OrderStatusActions
              orderId={order.id}
              currentStatus={order.status || 'pending'}
            />
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Notas internas</h3>
            {order.notes && (
              <div className="text-sm bg-yellow-50 p-3 rounded mb-4 whitespace-pre-wrap">
                {order.notes}
              </div>
            )}
            <OrderNotesForm orderId={order.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
