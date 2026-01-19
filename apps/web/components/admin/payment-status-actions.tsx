'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updatePaymentStatus } from '@/lib/actions/admin-orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface PaymentStatusActionsProps {
  orderId: string
  currentStatus: string
}

export function PaymentStatusActions({ orderId, currentStatus }: PaymentStatusActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [reference, setReference] = useState('')
  const router = useRouter()

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      try {
        await updatePaymentStatus(orderId, 'paid', {
          paymentMethod: paymentMethod || undefined,
          paymentReference: reference || undefined,
          note: `Pago confirmado manualmente${paymentMethod ? ` via ${paymentMethod}` : ''}`,
        })
        toast.success('Pago marcado como recibido')
        setShowForm(false)
        router.refresh()
      } catch {
        toast.error('Error al actualizar pago')
      }
    })
  }

  const handleStatusChange = (status: 'pending' | 'failed' | 'refunded') => {
    startTransition(async () => {
      try {
        await updatePaymentStatus(orderId, status)
        toast.success('Estado de pago actualizado')
        router.refresh()
      } catch {
        toast.error('Error al actualizar pago')
      }
    })
  }

  if (showForm) {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="paymentMethod" className="text-xs">Método de pago</Label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm mt-1"
          >
            <option value="">Seleccionar...</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
          </select>
        </div>

        <div>
          <Label htmlFor="reference" className="text-xs">Referencia/Operación</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ej: 12345678"
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(false)}
            disabled={isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleMarkAsPaid}
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isPending ? 'Guardando...' : 'Confirmar pago'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {currentStatus !== 'paid' && (
        <Button
          size="sm"
          onClick={() => setShowForm(true)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Marcar como pagado
        </Button>
      )}

      {currentStatus === 'paid' && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('refunded')}
            disabled={isPending}
            className="flex-1"
          >
            Reembolsar
          </Button>
        </div>
      )}

      {currentStatus === 'pending' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('failed')}
          disabled={isPending}
          className="w-full text-red-600 hover:text-red-700"
        >
          Marcar como fallido
        </Button>
      )}

      {(currentStatus === 'failed' || currentStatus === 'refunded') && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('pending')}
          disabled={isPending}
          className="w-full"
        >
          Volver a pendiente
        </Button>
      )}
    </div>
  )
}
