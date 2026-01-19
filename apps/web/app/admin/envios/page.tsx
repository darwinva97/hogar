import { getPendingShipments, getAvailableCarriers } from '@/lib/actions/admin'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AssignCarrierDialog } from '@/components/admin/assign-carrier-dialog'

export default async function ShipmentsPage() {
  const [pendingShipments, availableCarriers] = await Promise.all([
    getPendingShipments(),
    getAvailableCarriers(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Asignación de envíos</h1>
        <p className="text-muted-foreground">
          Asigna transportistas a los envíos pendientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">Pendientes por asignar</p>
          <p className="text-3xl font-bold text-yellow-900">{pendingShipments.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">Transportistas disponibles</p>
          <p className="text-3xl font-bold text-green-900">{availableCarriers.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">En tránsito hoy</p>
          <p className="text-3xl font-bold text-blue-900">0</p>
        </div>
      </div>

      {pendingShipments.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">
            No hay envíos pendientes
          </h3>
          <p className="text-muted-foreground mt-2">
            Todos los envíos han sido asignados
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="bg-white rounded-lg border p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="warning">Pendiente</Badge>
                    <span className="text-sm text-muted-foreground">
                      Código: {shipment.trackingCode || shipment.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Origin */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Origen (Proveedor)
                      </p>
                      <p className="font-medium">
                        {(shipment.originAddress as any)?.name || 'Por definir'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(shipment.originAddress as any)?.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(shipment.originAddress as any)?.district}
                      </p>
                      {(shipment.originAddress as any)?.phone && (
                        <p className="text-sm mt-1">
                          Tel: {(shipment.originAddress as any).phone}
                        </p>
                      )}
                    </div>

                    {/* Destination */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Destino (Cliente)
                      </p>
                      <p className="font-medium">
                        {(shipment.destinationAddress as any)?.name || shipment.order?.user?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(shipment.destinationAddress as any)?.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(shipment.destinationAddress as any)?.district}
                      </p>
                      {((shipment.destinationAddress as any)?.reference) && (
                        <p className="text-sm text-blue-600">
                          Ref: {(shipment.destinationAddress as any).reference}
                        </p>
                      )}
                      <p className="text-sm mt-1">
                        Tel: {(shipment.destinationAddress as any)?.phone || shipment.order?.user?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order info */}
                  <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pedido:</span>{' '}
                      <span className="font-medium">#{shipment.order?.orderNumber}</span>
                    </div>
                    {shipment.scheduledDate && (
                      <div>
                        <span className="text-muted-foreground">Programado:</span>{' '}
                        <span className="font-medium">
                          {formatDate(shipment.scheduledDate)}
                          {shipment.scheduledTimeSlot && ` (${shipment.scheduledTimeSlot})`}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Creado:</span>{' '}
                      <span>{formatDate(shipment.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Assign button */}
                <div className="shrink-0">
                  <AssignCarrierDialog
                    shipmentId={shipment.id}
                    carriers={availableCarriers}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
