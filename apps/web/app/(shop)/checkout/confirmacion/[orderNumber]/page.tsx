import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getOrderByNumber } from '@/lib/actions/orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ orderNumber: string }>
}

const PAYMENT_INSTRUCTIONS = {
  yape: {
    title: 'Pago con Yape',
    icon: '📱',
    instructions: [
      'Abre tu app Yape',
      'Escanea el QR o busca el número: 999 888 777',
      'Ingresa el monto exacto del pedido',
      'En el concepto, escribe tu número de pedido',
      'Envía el comprobante por WhatsApp al 999 888 777',
    ],
    note: 'Tu pedido será procesado una vez confirmemos el pago (máximo 2 horas en horario laboral).',
  },
  plin: {
    title: 'Pago con Plin',
    icon: '📱',
    instructions: [
      'Abre tu app bancaria con Plin',
      'Busca el número: 999 888 777',
      'Ingresa el monto exacto del pedido',
      'En el concepto, escribe tu número de pedido',
      'Envía el comprobante por WhatsApp al 999 888 777',
    ],
    note: 'Tu pedido será procesado una vez confirmemos el pago (máximo 2 horas en horario laboral).',
  },
  transfer: {
    title: 'Transferencia bancaria',
    icon: '🏦',
    instructions: [
      'Realiza una transferencia a:',
      'BCP: 191-12345678-0-12',
      'CCI: 00219112345678012345',
      'Titular: HOGAR SAC',
      'En el concepto, escribe tu número de pedido',
      'Envía el voucher por WhatsApp al 999 888 777',
    ],
    note: 'Tu pedido será procesado una vez confirmemos el pago (máximo 24 horas).',
  },
  cash: {
    title: 'Pago contra entrega',
    icon: '💵',
    instructions: [
      'Prepara el monto exacto en efectivo',
      'El transportista solo acepta efectivo',
      'Recibirás tu boleta/factura al momento de la entrega',
    ],
    note: 'Coordinaremos la entrega contigo por WhatsApp.',
  },
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params
  const order = await getOrderByNumber(orderNumber)

  if (!order) {
    notFound()
  }

  const paymentInfo = PAYMENT_INSTRUCTIONS[order.paymentMethod as keyof typeof PAYMENT_INSTRUCTIONS]
  const shippingAddress = order.shippingAddress as {
    recipientName: string
    recipientPhone: string
    address: string
    district: string
    city: string
    reference?: string
  } | null

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600">¡Pedido registrado!</h1>
        <p className="text-muted-foreground mt-2">
          Gracias por tu compra. Tu número de pedido es:
        </p>
        <p className="text-2xl font-mono font-bold mt-2">{order.orderNumber}</p>
      </div>

      {/* Payment instructions */}
      {paymentInfo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <span className="text-2xl">{paymentInfo.icon}</span>
            {paymentInfo.title}
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {paymentInfo.instructions.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm font-medium text-amber-800">{paymentInfo.note}</p>
        </div>
      )}

      {/* Order details */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="font-semibold mb-4">Detalles del pedido</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping address */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Dirección de envío</h3>
            {shippingAddress && (
              <div className="text-sm">
                <p className="font-medium">{shippingAddress.recipientName}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.district}, {shippingAddress.city}</p>
                {shippingAddress.reference && <p>Ref: {shippingAddress.reference}</p>}
                <p>{shippingAddress.recipientPhone}</p>
              </div>
            )}
          </div>

          {/* Order info */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Información</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Fecha:</span>{' '}
                {formatDate(order.createdAt)}
              </p>
              <p>
                <span className="text-muted-foreground">Estado:</span>{' '}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Esperando pago
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Productos</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground">{item.variantName}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} x {formatPrice(Number(item.unitPrice))}
                  </p>
                </div>
                <p className="text-sm font-medium">{formatPrice(Number(item.total))}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío</span>
            <span>{formatPrice(Number(order.shippingFee || 0))}</span>
          </div>
          {order.discount && Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(Number(order.discount))}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total a pagar</span>
              <span className="text-primary">{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/cuenta/pedidos">Ver mis pedidos</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/productos">Seguir comprando</Link>
        </Button>
      </div>

      {/* Help */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>
          ¿Tienes dudas?{' '}
          <a
            href="https://wa.me/51999888777"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}
