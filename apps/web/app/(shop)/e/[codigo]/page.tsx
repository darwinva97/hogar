import { notFound } from 'next/navigation'
import { getShipmentByCode } from '@/lib/actions/carrier'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CarrierStatusUpdate } from '@/components/carrier-status-update'

interface CarrierShipmentPageProps {
  params: Promise<{ codigo: string }>
}

const statusLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Pendiente', color: 'warning' },
  assigned: { label: 'Asignado', color: 'default' },
  picked_up: { label: 'Recogido', color: 'secondary' },
  in_transit: { label: 'En camino', color: 'default' },
  delivered: { label: 'Entregado', color: 'success' },
  failed: { label: 'Fallido', color: 'destructive' },
  returned: { label: 'Devuelto', color: 'destructive' },
}

export default async function CarrierShipmentPage({ params }: CarrierShipmentPageProps) {
  const { codigo } = await params
  const shipment = await getShipmentByCode(codigo)

  if (!shipment) {
    notFound()
  }

  const canUpdateStatus = ['assigned', 'picked_up', 'in_transit'].includes(shipment.status || '')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold">Hogar - Envío</h1>
          <p className="text-primary-100 text-sm">
            Código: {shipment.trackingCode || codigo}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Status */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado actual</span>
            <Badge variant={statusLabels[shipment.status || 'pending'].color} className="text-sm">
              {statusLabels[shipment.status || 'pending'].label}
            </Badge>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-lg shadow-sm divide-y">
          {/* Origin */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Recoger en
              </span>
            </div>
            <p className="font-medium">
              {(shipment.originAddress as any)?.name || 'Proveedor'}
            </p>
            <p className="text-sm text-muted-foreground">
              {(shipment.originAddress as any)?.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {(shipment.originAddress as any)?.district}
            </p>
            {(shipment.originAddress as any)?.phone && (
              <a
                href={`tel:${(shipment.originAddress as any).phone}`}
                className="inline-flex items-center gap-2 mt-2 text-sm text-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {(shipment.originAddress as any).phone}
              </a>
            )}
          </div>

          {/* Destination */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Entregar en
              </span>
            </div>
            <p className="font-medium">
              {(shipment.destinationAddress as any)?.name || 'Cliente'}
            </p>
            <p className="text-sm text-muted-foreground">
              {(shipment.destinationAddress as any)?.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {(shipment.destinationAddress as any)?.district}
            </p>
            {(shipment.destinationAddress as any)?.reference && (
              <p className="text-sm text-blue-600 mt-1">
                Ref: {(shipment.destinationAddress as any).reference}
              </p>
            )}
            {(shipment.destinationAddress as any)?.phone && (
              <a
                href={`tel:${(shipment.destinationAddress as any).phone}`}
                className="inline-flex items-center gap-2 mt-2 text-sm text-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {(shipment.destinationAddress as any).phone}
              </a>
            )}
          </div>
        </div>

        {/* Scheduled info */}
        {shipment.scheduledDate && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Fecha programada</p>
            <p className="font-medium">
              {formatDate(shipment.scheduledDate)}
              {shipment.scheduledTimeSlot && (
                <span className="text-muted-foreground ml-2">
                  ({shipment.scheduledTimeSlot})
                </span>
              )}
            </p>
          </div>
        )}

        {/* Payment info */}
        {shipment.agreedFee && (
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tarifa acordada</span>
            <span className="font-bold text-lg">S/ {shipment.agreedFee}</span>
          </div>
        )}

        {/* Update Status */}
        {canUpdateStatus && (
          <CarrierStatusUpdate
            codigo={codigo}
            currentStatus={shipment.status || 'assigned'}
          />
        )}

        {/* Delivered state */}
        {shipment.status === 'delivered' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-green-800 mt-2">Entrega completada</p>
            {shipment.deliveredAt && (
              <p className="text-sm text-green-600">
                {formatDate(shipment.deliveredAt)}
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        {shipment.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800">Notas:</p>
            <p className="text-sm text-yellow-700 mt-1">{shipment.notes}</p>
          </div>
        )}

        {/* Tracking history */}
        {shipment.tracking && shipment.tracking.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-3">Historial</h3>
            <div className="space-y-3">
              {shipment.tracking.map((entry, index) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300'}`} />
                    {index < shipment.tracking.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="font-medium text-sm">
                      {statusLabels[entry.status].label}
                    </p>
                    {entry.note && (
                      <p className="text-sm text-muted-foreground">{entry.note}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-lg mx-auto p-4 text-center text-sm text-muted-foreground">
        <p>¿Problemas? Contacta a soporte</p>
        <a href="tel:+51999999999" className="text-primary">+51 999 999 999</a>
      </footer>
    </div>
  )
}
