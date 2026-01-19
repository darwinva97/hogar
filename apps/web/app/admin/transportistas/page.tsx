import Link from 'next/link'
import { getCarriers } from '@/lib/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const integrationLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' }> = {
  api: { label: 'API', color: 'success' },
  app: { label: 'App', color: 'default' },
  whatsapp: { label: 'WhatsApp', color: 'secondary' },
  manual: { label: 'Manual', color: 'warning' },
}

const vehicleLabels: Record<string, string> = {
  moto: 'Moto',
  auto: 'Auto',
  camioneta: 'Camioneta',
  van: 'Van',
  camion_3t: 'Camión 3T',
  camion_5t: 'Camión 5T',
}

export default async function CarriersPage() {
  const carriers = await getCarriers()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Transportistas</h1>
          <p className="text-muted-foreground">
            Gestiona los transportistas para envíos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/transportistas/nuevo">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar transportista
          </Link>
        </Button>
      </div>

      {carriers.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No hay transportistas</h3>
          <p className="text-muted-foreground mt-2">
            Agrega transportistas para poder asignar envíos
          </p>
          <Button className="mt-4" asChild>
            <Link href="/admin/transportistas/nuevo">Agregar primer transportista</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Transportista</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Vehículo</th>
                <th className="px-4 py-3 font-medium">Integración</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Entregas</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {carriers.map((carrier) => (
                <tr key={carrier.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{carrier.name}</p>
                    {carrier.dni && (
                      <p className="text-sm text-muted-foreground">
                        DNI: {carrier.dni}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p>{carrier.phone}</p>
                    {carrier.whatsapp && carrier.whatsapp !== carrier.phone && (
                      <p className="text-sm text-green-600">WA: {carrier.whatsapp}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {carrier.vehicleType ? (
                      <>
                        <p>{vehicleLabels[carrier.vehicleType] || carrier.vehicleType}</p>
                        {carrier.vehiclePlate && (
                          <p className="text-sm text-muted-foreground">
                            {carrier.vehiclePlate}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={integrationLabels[carrier.integrationLevel || 'manual'].color}>
                      {integrationLabels[carrier.integrationLevel || 'manual'].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {carrier.isActive ? (
                        <Badge variant="success">Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                      {carrier.isVerified && (
                        <Badge variant="default">Verificado</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{carrier.totalDeliveries || 0}</p>
                    {carrier.successRate && Number(carrier.successRate) > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {Number(carrier.successRate).toFixed(0)}% éxito
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/transportistas/${carrier.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
