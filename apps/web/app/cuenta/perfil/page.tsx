'use client'

import { useEffect, useState } from 'react'
import { getUserProfile, updateUserProfile } from '@/lib/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  dni: string | null
  createdAt: Date
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getUserProfile().then((u) => setUser(u as User))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await updateUserProfile({
        name: formData.get('name') as string || undefined,
        phone: formData.get('phone') as string || undefined,
        dni: formData.get('dni') as string || undefined,
      })

      toast.success('Perfil actualizado')
    } catch {
      toast.error('Error al actualizar')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground">
              El correo electrónico no se puede cambiar
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name || ''}
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone || ''}
              placeholder="999 888 777"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              name="dni"
              defaultValue={user.dni || ''}
              placeholder="12345678"
              maxLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Tu DNI es necesario para la facturación y envío
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>

      {/* Account info */}
      <div className="mt-8 pt-8 border-t">
        <h2 className="font-semibold mb-4">Información de la cuenta</h2>
        <div className="text-sm space-y-2">
          <p className="text-muted-foreground">
            Cuenta creada el {formatDate(user.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
