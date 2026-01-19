'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus } from '@/lib/actions/admin-orders'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface OrderStatusActionsProps {
  orderId: string
  currentStatus: string
}

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status as any)
        toast.success('Estado actualizado')
        router.refresh()
      } catch {
        toast.error('Error al actualizar estado')
      }
    })
  }

  const currentIndex = statusFlow.indexOf(currentStatus)
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    processing: 'En proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }

  if (currentStatus === 'delivered' || currentStatus === 'cancelled') {
    return (
      <p className="text-sm text-muted-foreground text-center py-2">
        Pedido finalizado
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {nextStatus && (
        <Button
          size="sm"
          onClick={() => handleStatusChange(nextStatus)}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Actualizando...' : `Marcar como ${statusLabels[nextStatus]}`}
        </Button>
      )}

      {/* Quick actions */}
      <div className="flex gap-2">
        {currentStatus !== 'cancelled' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('cancelled')}
            disabled={isPending}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Cancelar pedido
          </Button>
        )}
      </div>

      {/* Status selector for manual override */}
      <div className="pt-2 border-t mt-2">
        <label className="text-xs text-muted-foreground">Cambiar estado manualmente:</label>
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isPending}
          className="w-full border rounded-md px-3 py-2 text-sm mt-1"
        >
          {statusFlow.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
    </div>
  )
}
