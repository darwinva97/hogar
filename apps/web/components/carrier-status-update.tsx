'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateShipmentStatusByCode } from '@/lib/actions/carrier'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CarrierStatusUpdateProps {
  codigo: string
  currentStatus: string
}

export function CarrierStatusUpdate({
  codigo,
  currentStatus,
}: CarrierStatusUpdateProps) {
  const [isPending, startTransition] = useTransition()
  const [note, setNote] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [showFailForm, setShowFailForm] = useState(false)
  const router = useRouter()

  const handleStatusUpdate = (status: 'picked_up' | 'in_transit' | 'delivered' | 'failed') => {
    if (status === 'delivered') {
      setShowDeliveryForm(true)
      return
    }
    if (status === 'failed') {
      setShowFailForm(true)
      return
    }

    startTransition(async () => {
      try {
        await updateShipmentStatusByCode(codigo, { status })
        toast.success('Estado actualizado')
        router.refresh()
      } catch {
        toast.error('Error al actualizar estado')
      }
    })
  }

  const handleDeliveryConfirm = () => {
    startTransition(async () => {
      try {
        await updateShipmentStatusByCode(codigo, {
          status: 'delivered',
          recipientName: recipientName || undefined,
          note: note || undefined,
        })
        toast.success('Entrega confirmada')
        setShowDeliveryForm(false)
        router.refresh()
      } catch {
        toast.error('Error al confirmar entrega')
      }
    })
  }

  const handleFailConfirm = () => {
    if (!note.trim()) {
      toast.error('Indica el motivo del fallo')
      return
    }

    startTransition(async () => {
      try {
        await updateShipmentStatusByCode(codigo, {
          status: 'failed',
          note,
        })
        toast.success('Estado actualizado')
        setShowFailForm(false)
        router.refresh()
      } catch {
        toast.error('Error al actualizar estado')
      }
    })
  }

  // Delivery confirmation form
  if (showDeliveryForm) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        <h3 className="font-medium">Confirmar entrega</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre de quien recibe
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nota (opcional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Algún comentario..."
            className="w-full border rounded-md px-3 py-2"
            rows={2}
          />
        </div>

        {/* TODO: Add photo upload */}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeliveryForm(false)}
            className="flex-1"
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeliveryConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isPending}
          >
            {isPending ? 'Confirmando...' : 'Confirmar entrega'}
          </Button>
        </div>
      </div>
    )
  }

  // Failure form
  if (showFailForm) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        <h3 className="font-medium">Reportar problema</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            Motivo del fallo *
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej: Cliente no estaba en casa, dirección incorrecta..."
            className="w-full border rounded-md px-3 py-2"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFailForm(false)}
            className="flex-1"
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFailConfirm}
            className="flex-1"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? 'Enviando...' : 'Reportar fallo'}
          </Button>
        </div>
      </div>
    )
  }

  // Status action buttons
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
      <h3 className="font-medium">Actualizar estado</h3>

      {currentStatus === 'assigned' && (
        <Button
          onClick={() => handleStatusUpdate('picked_up')}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isPending}
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          {isPending ? 'Actualizando...' : 'Marcar como recogido'}
        </Button>
      )}

      {currentStatus === 'picked_up' && (
        <Button
          onClick={() => handleStatusUpdate('in_transit')}
          className="w-full"
          disabled={isPending}
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          {isPending ? 'Actualizando...' : 'En camino'}
        </Button>
      )}

      {(currentStatus === 'picked_up' || currentStatus === 'in_transit') && (
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            onClick={() => handleStatusUpdate('delivered')}
            className="bg-green-600 hover:bg-green-700"
            disabled={isPending}
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Entregado
          </Button>
          <Button
            onClick={() => handleStatusUpdate('failed')}
            variant="destructive"
            disabled={isPending}
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Problema
          </Button>
        </div>
      )}
    </div>
  )
}
