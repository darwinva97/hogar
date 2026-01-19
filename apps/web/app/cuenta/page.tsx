import Link from 'next/link'
import Image from 'next/image'
import { getUserStats, getUserOrders } from '@/lib/actions/user'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const statusVariants: Record<string, 'default' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'secondary',
  confirmed: 'default',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
}

export default async function AccountPage() {
  const [stats, recentOrders] = await Promise.all([
    getUserStats(),
    getUserOrders({ limit: 3 }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mi cuenta</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Pedidos totales</p>
          <p className="text-2xl font-bold mt-1">{stats.orders.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Pedidos activos</p>
          <p className="text-2xl font-bold mt-1">{stats.orders.pending}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total gastado</p>
          <p className="text-2xl font-bold mt-1">{formatPrice(stats.spent)}</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Pedidos recientes</h2>
          <Link href="/cuenta/pedidos" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium">No tienes pedidos</h3>
            <p className="text-muted-foreground mt-2">
              Explora nuestro catálogo y encuentra los muebles perfectos para tu hogar
            </p>
            <Button className="mt-4" asChild>
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">Pedido #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={statusVariants[order.status || 'pending']}>
                    {statusLabels[order.status || 'pending']}
                  </Badge>
                </div>

                <div className="flex gap-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      +{order.items.length - 3} más
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="font-medium">{formatPrice(Number(order.total))}</p>
                  <Link
                    href={`/cuenta/pedidos/${order.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Link
          href="/cuenta/direcciones"
          className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Mis direcciones</p>
            <p className="text-sm text-muted-foreground">Gestiona tus direcciones de envío</p>
          </div>
        </Link>

        <Link
          href="/cuenta/perfil"
          className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Mi perfil</p>
            <p className="text-sm text-muted-foreground">Actualiza tu información personal</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
