'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { getAdminProduct, updateAdminProduct, deleteAdminProduct, getAdminProviders } from '@/lib/actions/admin'
import { getAllCategories } from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/admin/image-upload'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

interface Provider {
  id: string
  name: string
}

interface ProductImage {
  id: string
  url: string
  alt: string | null
  order: number
}

interface Product {
  id: string
  name: string
  description: string | null
  shortDescription: string | null
  categoryId: string | null
  providerId: string | null
  basePrice: string
  comparePrice: string | null
  sku: string | null
  stock: number | null
  width: number | null
  height: number | null
  depth: number | null
  weight: number | null
  materials: string | null
  isActive: boolean | null
  isPublished: boolean | null
  images: ProductImage[]
  category: { id: string; name: string } | null
  provider: { id: string; name: string } | null
}

export default function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getAdminProduct(id), getAllCategories(), getAdminProviders()])
      .then(([prod, cats, provs]) => {
        if (!prod) {
          setError('Producto no encontrado')
          return
        }
        setProduct(prod as Product)
        setCategories(cats)
        setProviders(provs as Provider[])
      })
      .catch((err) => {
        setError(err.message || 'Error al cargar producto')
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await updateAdminProduct(id, {
        name: formData.get('name') as string,
        description: formData.get('description') as string || undefined,
        shortDescription: formData.get('shortDescription') as string || undefined,
        categoryId: formData.get('categoryId') as string,
        providerId: formData.get('providerId') as string,
        basePrice: formData.get('basePrice') as string,
        comparePrice: formData.get('comparePrice') as string || undefined,
        sku: formData.get('sku') as string || undefined,
        stock: formData.get('stock') ? Number(formData.get('stock')) : undefined,
        width: formData.get('width') ? Number(formData.get('width')) : undefined,
        height: formData.get('height') ? Number(formData.get('height')) : undefined,
        depth: formData.get('depth') ? Number(formData.get('depth')) : undefined,
        weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
        materials: formData.get('materials') as string || undefined,
        isPublished: formData.get('isPublished') === 'on',
        isActive: formData.get('isActive') === 'on',
      })

      toast.success('Producto actualizado')
    } catch {
      toast.error('Error al actualizar producto')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteAdminProduct(id)
      toast.success('Producto eliminado')
      router.push('/admin/productos')
    } catch {
      toast.error('Error al eliminar producto')
      setIsDeleting(false)
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/productos">Volver a productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/productos"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a productos
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold">Editar producto</h1>
            <div className="flex items-center gap-2 mt-2">
              {product.isPublished ? (
                <Badge variant="success">Publicado</Badge>
              ) : (
                <Badge variant="secondary">Borrador</Badge>
              )}
              {!product.isActive && <Badge variant="destructive">Inactivo</Badge>}
            </div>
          </div>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>

      {/* Images - outside form because it has its own upload logic */}
      <div className="bg-white rounded-lg border p-6 space-y-4 mb-8">
        <h2 className="font-semibold text-lg">Imágenes</h2>
        <ImageUpload
          productId={product.id}
          images={product.images}
          onImagesChange={(newImages) => setProduct({ ...product, images: newImages })}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic info */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Información básica</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del producto *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={product.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Descripción corta</Label>
            <Input
              id="shortDescription"
              name="shortDescription"
              defaultValue={product.shortDescription || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción completa</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full border rounded-md px-3 py-2"
              defaultValue={product.description || ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría *</Label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full border rounded-md px-3 py-2"
                defaultValue={product.categoryId || ''}
              >
                <option value="">Seleccionar categoría...</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    {cat.children?.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                    {(!cat.children || cat.children.length === 0) && (
                      <option value={cat.id}>{cat.name}</option>
                    )}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerId">Proveedor *</Label>
              <select
                id="providerId"
                name="providerId"
                required
                className="w-full border rounded-md px-3 py-2"
                defaultValue={product.providerId || ''}
              >
                <option value="">Seleccionar proveedor...</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Precio</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Precio de venta (S/) *</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="0.01"
                required
                defaultValue={product.basePrice}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparePrice">Precio anterior (S/)</Label>
              <Input
                id="comparePrice"
                name="comparePrice"
                type="number"
                step="0.01"
                defaultValue={product.comparePrice || ''}
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Inventario</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                defaultValue={product.sku || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock disponible</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={product.stock || ''}
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Dimensiones y peso</h2>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Ancho (cm)</Label>
              <Input
                id="width"
                name="width"
                type="number"
                defaultValue={product.width || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Alto (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                defaultValue={product.height || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">Profundidad (cm)</Label>
              <Input
                id="depth"
                name="depth"
                type="number"
                defaultValue={product.depth || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                defaultValue={product.weight || ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials">Materiales</Label>
            <Input
              id="materials"
              name="materials"
              defaultValue={product.materials || ''}
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Estado</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                defaultChecked={product.isPublished || false}
                className="rounded border-gray-300 h-4 w-4"
              />
              <div>
                <Label htmlFor="isPublished" className="font-medium">Publicado</Label>
                <p className="text-sm text-muted-foreground">
                  Visible para los clientes en la tienda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={product.isActive || false}
                className="rounded border-gray-300 h-4 w-4"
              />
              <div>
                <Label htmlFor="isActive" className="font-medium">Activo</Label>
                <p className="text-sm text-muted-foreground">
                  Desactivar para ocultar temporalmente sin eliminar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/productos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
