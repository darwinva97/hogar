'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createAdminProduct, getAdminProviders } from '@/lib/actions/admin'
import { getAllCategories } from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export default function AdminNewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    Promise.all([getAllCategories(), getAdminProviders()]).then(([cats, provs]) => {
      setCategories(cats)
      setProviders(provs as Provider[])
    })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await createAdminProduct({
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
      })

      toast.success('Producto creado exitosamente')
      router.push('/admin/productos')
    } catch (error) {
      toast.error('Error al crear producto')
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-2xl font-bold mt-4">Nuevo producto</h1>
        <p className="text-muted-foreground">
          Agrega un nuevo producto al catálogo
        </p>
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
              placeholder="Ej: Sofá 3 cuerpos modelo Oslo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Descripción corta</Label>
            <Input
              id="shortDescription"
              name="shortDescription"
              placeholder="Una línea describiendo el producto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción completa</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Describe el producto en detalle..."
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
              >
                <option value="">Seleccionar proveedor...</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                <Link href="/admin/proveedores/nuevo" className="text-primary hover:underline">
                  + Agregar nuevo proveedor
                </Link>
              </p>
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
                placeholder="1500.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparePrice">Precio anterior (S/)</Label>
              <Input
                id="comparePrice"
                name="comparePrice"
                type="number"
                step="0.01"
                placeholder="1800.00"
              />
              <p className="text-xs text-muted-foreground">
                Para mostrar descuento
              </p>
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
                placeholder="SOF-OSL-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock disponible</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="10"
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
                placeholder="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Alto (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="85"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">Profundidad (cm)</Label>
              <Input
                id="depth"
                name="depth"
                type="number"
                placeholder="90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="45"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials">Materiales</Label>
            <Input
              id="materials"
              name="materials"
              placeholder="Ej: Madera de pino, tela de lino"
            />
          </div>
        </div>

        {/* Publish */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              className="rounded border-gray-300 h-4 w-4"
            />
            <div>
              <Label htmlFor="isPublished" className="font-medium">Publicar inmediatamente</Label>
              <p className="text-sm text-muted-foreground">
                Si no se marca, el producto se guardará como borrador
              </p>
            </div>
          </div>
        </div>

        {/* Note about images */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Las imágenes se podrán agregar después de crear el producto.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/productos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </div>
  )
}
