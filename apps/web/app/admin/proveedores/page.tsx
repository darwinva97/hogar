import Link from 'next/link'
import { getAdminProviders } from '@/lib/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function AdminProvidersPage() {
  const providers = await getAdminProviders()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona tus proveedores/fabricantes internos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/proveedores/nuevo">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo proveedor
          </Link>
        </Button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-800">
              <strong>Los proveedores son tus fabricantes/talleres internos.</strong> Cuando recibes un pedido,
              puedes ver de qué proveedor viene cada producto para coordinar con ellos.
            </p>
          </div>
        </div>
      </div>

      {providers.length === 0 ? (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No hay proveedores</h3>
          <p className="text-muted-foreground mt-2">
            Agrega tus fabricantes y talleres para asociarlos a los productos
          </p>
          <Button className="mt-4" asChild>
            <Link href="/admin/proveedores/nuevo">Agregar proveedor</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Proveedor</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Ubicación</th>
                <th className="px-4 py-3 font-medium">RUC</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      {provider.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {provider.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {provider.phone && <p>{provider.phone}</p>}
                      {provider.whatsapp && (
                        <p className="text-green-600">WA: {provider.whatsapp}</p>
                      )}
                      {provider.email && (
                        <p className="text-muted-foreground">{provider.email}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {provider.district || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {provider.ruc || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {provider.isActive ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/proveedores/${provider.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Editar
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
