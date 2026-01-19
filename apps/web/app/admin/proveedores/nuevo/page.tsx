'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { createAdminProvider } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AdminNewProviderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await createAdminProvider({
        name: formData.get('name') as string,
        ruc: formData.get('ruc') as string || undefined,
        phone: formData.get('phone') as string || undefined,
        whatsapp: formData.get('whatsapp') as string || undefined,
        email: formData.get('email') as string || undefined,
        address: formData.get('address') as string || undefined,
        district: formData.get('district') as string || undefined,
        description: formData.get('description') as string || undefined,
      })

      toast.success('Proveedor creado exitosamente')
      router.push('/admin/proveedores')
    } catch (error) {
      toast.error('Error al crear proveedor')
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-2xl font-bold mt-4">Nuevo proveedor</h1>
        <p className="text-muted-foreground">
          Agrega un fabricante o taller a tu red de proveedores
        </p>
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
              placeholder="Ej: Muebles Don José, Taller La Esperanza"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruc">RUC</Label>
            <Input
              id="ruc"
              name="ruc"
              placeholder="20123456789"
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
              placeholder="Especialidad, notas importantes, horarios de atención..."
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
                placeholder="01 234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="51 999 888 777"
              />
              <p className="text-xs text-muted-foreground">
                Con código de país
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contacto@proveedor.com"
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
              placeholder="Ej: Villa El Salvador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección completa</Label>
            <Input
              id="address"
              name="address"
              placeholder="Av. Principal 123, Parque Industrial"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/proveedores">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear proveedor'}
          </Button>
        </div>
      </form>
    </div>
  )
}
