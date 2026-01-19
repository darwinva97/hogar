import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicTracking } from '@/lib/actions/carrier'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TrackingPageProps {
  params: Promise<{ codigo: string }>
}

const statusLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Pendiente', color: 'warning' },
  assigned: { label: 'Asignado a transportista', color: 'default' },
  picked_up: { label: 'Recogido del proveedor', color: 'secondary' },
  in_transit: { label: 'En camino', color: 'default' },
  delivered: { label: 'Entregado', color: 'success' },
  failed: { label: 'No entregado', color: 'destructive' },
  returned: { label: 'Devuelto', color: 'destructive' },
}

const statusSteps = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered']

export default async function PublicTrackingPage({ params }: TrackingPageProps) {
  const { codigo } = await params
  const tracking = await getPublicTracking(codigo)

  if (!tracking) {
    notFound()
  }

  const currentStepIndex = statusSteps.indexOf(tracking.status || 'pending')
  const isDelivered = tracking.status === 'delivered'
  const isFailed = tracking.status === 'failed' || tracking.status === 'returned'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            Hogar
          </Link>
          <span className="text-sm text-muted-foreground">
            Seguimiento de envío
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Tracking code */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">Código de seguimiento</p>
          <p className="text-2xl font-bold font-mono">{tracking.trackingCode}</p>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Estado actual</span>
            <Badge
              variant={statusLabels[tracking.status || 'pending'].color}
              className="text-sm"
            >
              {statusLabels[tracking.status || 'pending'].label}
            </Badge>
          </div>

          {/* Progress bar */}
          {!isFailed && (
            <div className="relative">
              <div className="flex justify-between mb-2">
                {statusSteps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center ${
                      index <= currentStepIndex ? 'text-primary' : 'text-gray-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStepIndex
                          ? 'bg-primary text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {index < currentStepIndex ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Delivered message */}
          {isDelivered && tracking.deliveredAt && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-green-800 mt-2">
                Entregado exitosamente
              </p>
              <p className="text-sm text-green-600">
                {formatDate(tracking.deliveredAt)}
              </p>
            </div>
          )}

          {/* Failed message */}
          {isFailed && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-center">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium text-red-800 mt-2">
                Hubo un problema con la entrega
              </p>
              <p className="text-sm text-red-600">
                Nos comunicaremos contigo pronto
              </p>
            </div>
          )}
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-medium mb-4">Información de entrega</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distrito de entrega</span>
              <span>{tracking.destinationDistrict || 'Lima'}</span>
            </div>
            {tracking.scheduledDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha programada</span>
                <span>
                  {formatDate(tracking.scheduledDate)}
                  {tracking.scheduledTimeSlot && ` (${tracking.scheduledTimeSlot})`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tracking history */}
        {tracking.tracking && tracking.tracking.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-4">Historial</h3>
            <div className="space-y-4">
              {tracking.tracking.map((entry, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                    {index < tracking.tracking.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium">
                      {statusLabels[entry.status]?.label || entry.status}
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

        {/* Help */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>¿Tienes preguntas sobre tu envío?</p>
          <Link href="/ayuda" className="text-primary hover:underline">
            Visita nuestro centro de ayuda
          </Link>
        </div>
      </main>
    </div>
  )
}
