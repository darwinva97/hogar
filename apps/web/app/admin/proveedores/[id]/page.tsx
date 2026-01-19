'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { getAdminProvider, updateAdminProvider, deleteAdminProvider } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Provider {
  id: string
  name: string
  slug: string
  ruc: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  district: string | null
  description: string | null
  isActive: boolean | null
}

export default function AdminEditProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAdminProvider(id)
      .then((p) => {
        if (!p) {
          setError('Proveedor no encontrado')
          return
        }
        setProvider(p as Provider)
      })
      .catch((err) => {
        setError(err.message || 'Error al cargar proveedor')
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await updateAdminProvider(id, {
        name: formData.get('name') as string,
        ruc: formData.get('ruc') as string || undefined,
        phone: formData.get('phone') as string || undefined,
        whatsapp: formData.get('whatsapp') as string || undefined,
        email: formData.get('email') as string || undefined,
        address: formData.get('address') as string || undefined,
        district: formData.get('district') as string || undefined,
        description: formData.get('description') as string || undefined,
        isActive: formData.get('isActive') === 'on',
      })

      toast.success('Proveedor actualizado')
    } catch {
      toast.error('Error al actualizar proveedor')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este proveedor? Solo se puede eliminar si no tiene productos asociados.')) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteAdminProvider(id)
      toast.success('Proveedor eliminado')
      router.push('/admin/proveedores')
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar proveedor')
      setIsDeleting(false)
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/proveedores">Volver a proveedores</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!provider) {
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
          href="/admin/proveedores"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a proveedores
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold">Editar proveedor</h1>
            <div className="flex items-center gap-2 mt-2">
              {provider.isActive ? (
                <Badge variant="success">Activo</Badge>
              ) : (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
          </div>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Información básica</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del proveedor *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={provider.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruc">RUC</Label>
            <Input
              id="ruc"
              name="ruc"
              defaultValue={provider.ruc || ''}
              maxLength={11}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción / Notas</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full border rounded-md px-3 py-2"
              defaultValue={provider.description || ''}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Contacto</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={provider.phone || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                defaultValue={provider.whatsapp || ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={provider.email || ''}
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Ubicación</h2>

          <div className="space-y-2">
            <Label htmlFor="district">Distrito</Label>
            <Input
              id="district"
              name="district"
              defaultValue={provider.district || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección completa</Label>
            <Input
              id="address"
              name="address"
              defaultValue={provider.address || ''}
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked={provider.isActive || false}
              className="rounded border-gray-300 h-4 w-4"
            />
            <div>
              <Label htmlFor="isActive" className="font-medium">Proveedor activo</Label>
              <p className="text-sm text-muted-foreground">
                Desactivar si ya no trabajas con este proveedor
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/proveedores">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
