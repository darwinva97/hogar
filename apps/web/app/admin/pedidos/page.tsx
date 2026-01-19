import Link from 'next/link'
import { getAdminOrders } from '@/lib/actions/admin-orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string
    pago?: string
    buscar?: string
    pagina?: string
  }>
}

const statusLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Pendiente', color: 'warning' },
  confirmed: { label: 'Confirmado', color: 'default' },
  processing: { label: 'En proceso', color: 'secondary' },
  shipped: { label: 'Enviado', color: 'default' },
  delivered: { label: 'Entregado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'destructive' },
}

const paymentLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Por pagar', color: 'warning' },
  paid: { label: 'Pagado', color: 'success' },
  failed: { label: 'Fallido', color: 'destructive' },
  refunded: { label: 'Reembolsado', color: 'secondary' },
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const orders = await getAdminOrders({
    status: params.status,
    paymentStatus: params.pago,
    search: params.buscar,
    page: Number(params.pagina) || 1,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">
            Gestiona los pedidos y su estado de pago
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="search"
              name="buscar"
              placeholder="Buscar por # de orden..."
              defaultValue={params.buscar}
            />
          </div>

          <select
            name="status"
            className="border rounded-md px-3 py-2"
            defaultValue={params.status}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
            <option value="processing">En proceso</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>

          <select
            name="pago"
            className="border rounded-md px-3 py-2"
            defaultValue={params.pago}
          >
            <option value="">Todos los pagos</option>
            <option value="pending">Por pagar</option>
            <option value="paid">Pagado</option>
            <option value="failed">Fallido</option>
            <option value="refunded">Reembolsado</option>
          </select>

          <Button type="submit">Filtrar</Button>

          {(params.status || params.pago || params.buscar) && (
            <Button variant="ghost" asChild>
              <Link href="/admin/pedidos">Limpiar</Link>
            </Button>
          )}
        </form>
      </div>

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <p className="text-muted-foreground">No se encontraron pedidos</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Productos</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Pago</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.user?.name || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user?.phone || order.user?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">
                      {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusLabels[order.status || 'pending'].color}>
                      {statusLabels[order.status || 'pending'].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={paymentLabels[order.paymentStatus || 'pending'].color}>
                      {paymentLabels[order.paymentStatus || 'pending'].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Gestionar
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
