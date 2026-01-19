'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createOrder } from '@/lib/actions/orders'
import { createUserAddress } from '@/lib/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    basePrice: string
    images: { url: string }[]
    provider: { id: string; name: string } | null
  } | null
  variant: {
    id: string
    name: string
    price: string
  } | null
}

interface Address {
  id: string
  label: string | null
  recipientName: string
  phone: string
  street: string
  district: string
  city: string | null
  reference: string | null
  isDefault: boolean | null
}

interface CheckoutFormProps {
  cart: {
    id: string
    items: CartItem[]
    itemCount: number
    subtotal: number
  }
  addresses: Address[]
  userEmail: string
}

const PAYMENT_METHODS = [
  {
    id: 'yape',
    name: 'Yape',
    description: 'Paga con tu app Yape',
    icon: '📱',
  },
  {
    id: 'plin',
    name: 'Plin',
    description: 'Paga con tu app Plin',
    icon: '📱',
  },
  {
    id: 'transfer',
    name: 'Transferencia bancaria',
    description: 'BCP, Interbank, BBVA, Scotiabank',
    icon: '🏦',
  },
  {
    id: 'cash',
    name: 'Contra entrega',
    description: 'Paga al recibir tu pedido',
    icon: '💵',
  },
] as const

const SHIPPING_COST = 25 // S/25 fijo por ahora

export function CheckoutForm({ cart, addresses, userEmail }: CheckoutFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address')
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null
  )
  const [isAddingAddress, setIsAddingAddress] = useState(addresses.length === 0)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)
  const total = cart.subtotal + SHIPPING_COST

  async function handleAddAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const newAddress = await createUserAddress({
        label: formData.get('label') as string || 'Mi dirección',
        recipientName: formData.get('recipientName') as string,
        phone: formData.get('phone') as string,
        street: formData.get('street') as string,
        district: formData.get('district') as string,
        reference: formData.get('reference') as string || undefined,
        isDefault: addresses.length === 0,
      })

      setSelectedAddressId(newAddress.id)
      setIsAddingAddress(false)
      toast.success('Dirección agregada')
      // Reload to get updated addresses
      router.refresh()
    } catch {
      toast.error('Error al agregar dirección')
    }
  }

  async function handleSubmitOrder() {
    if (!selectedAddressId || !selectedPayment) {
      toast.error('Completa todos los campos')
      return
    }

    setIsSubmitting(true)

    try {
      const order = await createOrder({
        shippingAddressId: selectedAddressId,
        paymentMethod: selectedPayment as 'yape' | 'plin' | 'transfer' | 'cash',
        notes: notes || undefined,
      })

      router.push(`/checkout/confirmacion/${order.orderNumber}`)
    } catch (error) {
      toast.error('Error al crear el pedido')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Shipping Address */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">
                1
              </span>
              Dirección de envío
            </h2>
            {step !== 'address' && selectedAddress && (
              <Button variant="ghost" size="sm" onClick={() => setStep('address')}>
                Cambiar
              </Button>
            )}
          </div>

          {step === 'address' ? (
            <div className="space-y-4">
              {/* Existing addresses */}
              {addresses.length > 0 && !isAddingAddress && (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {address.label || 'Dirección'}
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">
                              Predeterminada
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.recipientName}</p>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.street}, {address.district}
                        </p>
                        {address.reference && (
                          <p className="text-sm text-muted-foreground">Ref: {address.reference}</p>
                        )}
                      </div>
                    </label>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsAddingAddress(true)}
                  >
                    + Agregar nueva dirección
                  </Button>
                </div>
              )}

              {/* Add address form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="label">Etiqueta</Label>
                      <Input
                        id="label"
                        name="label"
                        placeholder="Ej: Casa, Oficina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Nombre del destinatario *</Label>
                      <Input id="recipientName" name="recipientName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="999 888 777"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Dirección *</Label>
                    <Input
                      id="street"
                      name="street"
                      required
                      placeholder="Av. Principal 123, Dpto 4B"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Distrito *</Label>
                    <Input
                      id="district"
                      name="district"
                      required
                      placeholder="Ej: Miraflores"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Referencia</Label>
                    <Input
                      id="reference"
                      name="reference"
                      placeholder="Frente al parque, portón verde"
                    />
                  </div>

                  <div className="flex gap-3">
                    {addresses.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingAddress(false)}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit">Guardar dirección</Button>
                  </div>
                </form>
              )}

              {/* Continue button */}
              {selectedAddressId && !isAddingAddress && (
                <Button className="w-full" onClick={() => setStep('payment')}>
                  Continuar al pago
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {selectedAddress && (
                <div>
                  <p className="font-medium text-foreground">{selectedAddress.recipientName}</p>
                  <p>{selectedAddress.street}, {selectedAddress.district}</p>
                  <p>{selectedAddress.phone}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Payment Method */}
        <div className={`bg-white rounded-lg border p-6 ${step === 'address' ? 'opacity-50' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                  step !== 'address' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </span>
              Método de pago
            </h2>
            {step === 'review' && selectedPayment && (
              <Button variant="ghost" size="sm" onClick={() => setStep('payment')}>
                Cambiar
              </Button>
            )}
          </div>

          {step === 'payment' || step === 'review' ? (
            step === 'payment' ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedPayment && (
                  <Button className="w-full" onClick={() => setStep('review')}>
                    Revisar pedido
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.name}
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Primero selecciona una dirección de envío
            </p>
          )}
        </div>

        {/* Step 3: Review & Notes */}
        <div className={`bg-white rounded-lg border p-6 ${step !== 'review' ? 'opacity-50' : ''}`}>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                step === 'review' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </span>
            Revisar y confirmar
          </h2>

          {step === 'review' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notas del pedido (opcional)</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Instrucciones especiales, horario de entrega preferido, etc."
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Importante:</strong> Al confirmar el pedido recibirás las instrucciones
                  de pago por correo a <strong>{userEmail}</strong>. Tu pedido será procesado una
                  vez confirmemos el pago.
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : `Confirmar pedido - ${formatPrice(total)}`}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Completa los pasos anteriores
            </p>
          )}
        </div>
      </div>

      {/* Order Summary - Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border p-6 sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                  {item.product?.images?.[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <p className="text-sm font-medium line-clamp-2">{item.product?.name}</p>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground">{item.variant.name}</p>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Cant: {item.quantity}</span>
                    <span className="text-sm font-medium">
                      {formatPrice(
                        Number(item.variant?.price || item.product?.basePrice || 0) * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{formatPrice(SHIPPING_COST)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Incluye IGV</p>
            </div>
          </div>

          <Link
            href="/carrito"
            className="block text-center text-sm text-primary hover:underline mt-4"
          >
            Editar carrito
          </Link>
        </div>
      </div>
    </div>
  )
}
