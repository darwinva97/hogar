'use client'

import { useEffect, useState } from 'react'
import { getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress } from '@/lib/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Address {
  id: string
  label: string | null
  recipientName: string
  phone: string
  street: string
  district: string
  city: string | null
  reference: string | null
  isDefault: boolean | null
}

export default function UserAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadAddresses()
  }, [])

  async function loadAddresses() {
    const data = await getUserAddresses()
    setAddresses(data as Address[])
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await createUserAddress({
        label: formData.get('label') as string,
        recipientName: formData.get('recipientName') as string,
        phone: formData.get('phone') as string,
        street: formData.get('street') as string,
        district: formData.get('district') as string,
        reference: formData.get('reference') as string || undefined,
        isDefault: formData.get('isDefault') === 'on',
      })

      toast.success('Dirección agregada')
      setIsAdding(false)
      loadAddresses()
    } catch {
      toast.error('Error al agregar dirección')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await updateUserAddress(id, {
        label: formData.get('label') as string,
        recipientName: formData.get('recipientName') as string,
        phone: formData.get('phone') as string,
        street: formData.get('street') as string,
        district: formData.get('district') as string,
        reference: formData.get('reference') as string || undefined,
        isDefault: formData.get('isDefault') === 'on',
      })

      toast.success('Dirección actualizada')
      setEditingId(null)
      loadAddresses()
    } catch {
      toast.error('Error al actualizar dirección')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return

    try {
      await deleteUserAddress(id)
      toast.success('Dirección eliminada')
      loadAddresses()
    } catch {
      toast.error('Error al eliminar dirección')
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await updateUserAddress(id, { isDefault: true })
      toast.success('Dirección predeterminada actualizada')
      loadAddresses()
    } catch {
      toast.error('Error al actualizar')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis direcciones</h1>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva dirección
          </Button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="font-semibold mb-4">Nueva dirección</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <AddressFormFields />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses list */}
      {addresses.length === 0 && !isAdding ? (
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No tienes direcciones</h3>
          <p className="text-muted-foreground mt-2">
            Agrega una dirección para facilitar tus compras
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            Agregar dirección
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg border">
              {editingId === address.id ? (
                <div className="p-6">
                  <h2 className="font-semibold mb-4">Editar dirección</h2>
                  <form onSubmit={(e) => handleUpdate(e, address.id)} className="space-y-4">
                    <AddressFormFields address={address} />
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{address.label || 'Sin etiqueta'}</p>
                        {address.isDefault && (
                          <Badge variant="secondary">Predeterminada</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">{address.recipientName}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {address.street}, {address.district}
                      </p>
                      {address.reference && (
                        <p className="text-sm text-muted-foreground">
                          Ref: {address.reference}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Predeterminar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(address.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(address.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddressFormFields({ address }: { address?: Address }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="label">Etiqueta</Label>
          <Input
            id="label"
            name="label"
            defaultValue={address?.label || ''}
            placeholder="Ej: Casa, Oficina"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipientName">Nombre del destinatario *</Label>
          <Input
            id="recipientName"
            name="recipientName"
            required
            defaultValue={address?.recipientName || ''}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={address?.phone || ''}
          placeholder="999 888 777"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Dirección *</Label>
        <Input
          id="street"
          name="street"
          required
          defaultValue={address?.street || ''}
          placeholder="Av. Principal 123, Dpto 4B"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="district">Distrito *</Label>
        <Input
          id="district"
          name="district"
          required
          defaultValue={address?.district || ''}
          placeholder="Ej: Miraflores"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Referencia</Label>
        <Input
          id="reference"
          name="reference"
          defaultValue={address?.reference || ''}
          placeholder="Frente al parque, portón verde"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          defaultChecked={address?.isDefault || false}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isDefault" className="font-normal">
          Usar como dirección predeterminada
        </Label>
      </div>
    </>
  )
}
