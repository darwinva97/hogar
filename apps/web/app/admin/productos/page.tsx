import Link from 'next/link'
import Image from 'next/image'
import { getAdminProducts, getAdminProviders, toggleAdminProductStatus } from '@/lib/actions/admin'
import { getAllCategories } from '@/lib/actions/categories'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminProductStatusToggle } from '@/components/admin/product-status-toggle'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const [products, providers, categories] = await Promise.all([
    getAdminProducts({
      search: params.search,
      providerId: params.provider,
      categoryId: params.category,
      isPublished: params.published === 'true' ? true : params.published === 'false' ? false : undefined,
    }),
    getAdminProviders(),
    getAllCategories(),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo producto
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              placeholder="Buscar por nombre o SKU..."
              defaultValue={params.search}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <select
            name="provider"
            defaultValue={params.provider}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Todos los proveedores</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={params.category}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <optgroup key={cat.id} label={cat.name}>
                {cat.children?.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <select
            name="published"
            defaultValue={params.published}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Todos los estados</option>
            <option value="true">Publicados</option>
            <option value="false">Borradores</option>
          </select>
          <Button type="submit">Filtrar</Button>
        </form>
      </div>

      {products.length === 0 ? (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No hay productos</h3>
          <p className="text-muted-foreground mt-2">
            Comienza agregando tu primer producto al catálogo
          </p>
          <Button className="mt-4" asChild>
            <Link href="/admin/productos/nuevo">Crear producto</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Proveedor</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Publicado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
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
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku || '-'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {product.provider?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{formatPrice(Number(product.basePrice))}</p>
                    {product.comparePrice && Number(product.comparePrice) > Number(product.basePrice) && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(Number(product.comparePrice))}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.stock !== null ? (
                      <span className={product.stock <= 5 ? 'text-red-600 font-medium' : ''}>
                        {product.stock}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.isActive ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="destructive">Inactivo</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <AdminProductStatusToggle
                      productId={product.id}
                      isPublished={product.isPublished || false}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/productos/${product.id}`}
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
