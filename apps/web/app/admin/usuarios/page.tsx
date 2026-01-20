import { getAdminUsers, getAdminUserStats } from '@/lib/actions/admin-users'
import { Badge } from '@/components/ui/badge'

const roleLabels: Record<string, string> = {
  customer: 'Cliente',
  admin: 'Admin',
  provider: 'Proveedor',
  carrier: 'Transportista',
}

const roleColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  customer: 'default',
  admin: 'destructive',
  provider: 'secondary',
  carrier: 'outline',
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const role = params.role as 'customer' | 'admin' | 'provider' | 'carrier' | undefined
  const search = params.search
  const page = params.page ? parseInt(params.page) : 1

  const [users, stats] = await Promise.all([
    getAdminUsers({ role, search, page }),
    getAdminUserStats(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Clientes</p>
          <p className="text-2xl font-bold">{stats.customers}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Admins</p>
          <p className="text-2xl font-bold">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Proveedores</p>
          <p className="text-2xl font-bold">{stats.providers}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Transportistas</p>
          <p className="text-2xl font-bold">{stats.carriers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              placeholder="Buscar por nombre, email o teléfono..."
              defaultValue={search}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <select
            name="role"
            defaultValue={role || ''}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">Todos los roles</option>
            <option value="customer">Clientes</option>
            <option value="admin">Admins</option>
            <option value="provider">Proveedores</option>
            <option value="carrier">Transportistas</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Users table */}
      {users.length === 0 ? (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No se encontraron usuarios</h3>
          <p className="text-muted-foreground mt-2">
            {search || role
              ? 'Intenta con otros filtros de búsqueda'
              : 'No hay usuarios registrados aún'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Último acceso</th>
                <th className="px-4 py-3 font-medium">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name || 'Sin nombre'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {user.phone || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={roleColors[user.role || 'customer']}>
                      {roleLabels[user.role || 'customer']}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {user.emailVerified ? (
                      <Badge variant="success">Verificado</Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Nunca'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
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
