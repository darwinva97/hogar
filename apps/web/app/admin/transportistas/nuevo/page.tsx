'use client'

import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import Link from 'next/link'
import { createCarrier } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const districts = [
  'Miraflores',
  'San Isidro',
  'Surco',
  'La Molina',
  'San Borja',
  'Barranco',
  'Surquillo',
  'Chorrillos',
  'Lince',
  'Jesús María',
  'Magdalena',
  'Pueblo Libre',
  'San Miguel',
  'Breña',
  'Lima Centro',
  'La Victoria',
  'Ate',
  'Santa Anita',
  'El Agustino',
  'San Juan de Lurigancho',
  'Independencia',
  'Los Olivos',
  'San Martín de Porres',
  'Comas',
  'Callao',
  'Ventanilla',
]

export default function NewCarrierPage() {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    try {
      const selectedDistricts = formData.getAll('districts') as string[]

      await createCarrier({
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        whatsapp: formData.get('whatsapp') as string || undefined,
        email: formData.get('email') as string || undefined,
        dni: formData.get('dni') as string || undefined,
        type: formData.get('type') as 'independent' | 'fleet' | 'partner',
        integrationLevel: formData.get('integrationLevel') as 'api' | 'app' | 'whatsapp' | 'manual',
        vehicleType: formData.get('vehicleType') as string || undefined,
        vehiclePlate: formData.get('vehiclePlate') as string || undefined,
        districts: selectedDistricts.length > 0 ? selectedDistricts : undefined,
        baseDistrict: formData.get('baseDistrict') as string || undefined,
        baseFee: formData.get('baseFee') as string || undefined,
        perKmFee: formData.get('perKmFee') as string || undefined,
      })

      toast.success('Transportista creado exitosamente')
      router.push('/admin/transportistas')
    } catch (error) {
      toast.error('Error al crear transportista')
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/transportistas"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a transportistas
        </Link>
        <h1 className="text-2xl font-bold mt-4">Agregar transportista</h1>
        <p className="text-muted-foreground">
          Registra un nuevo transportista para asignar envíos
        </p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Información básica</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input id="name" name="name" required placeholder="Juan Pérez" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" name="dni" placeholder="12345678" maxLength={8} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input id="phone" name="phone" required placeholder="987654321" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" name="whatsapp" placeholder="987654321" />
              <p className="text-xs text-muted-foreground">Dejar vacío si es el mismo que el teléfono</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@ejemplo.com" />
            </div>
          </div>
        </div>

        {/* Tipo e integración */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Tipo de transportista</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <select
                id="type"
                name="type"
                required
                className="w-full border rounded-md px-3 py-2"
                defaultValue="independent"
              >
                <option value="independent">Independiente</option>
                <option value="fleet">Empresa con flota</option>
                <option value="partner">Courier asociado</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="integrationLevel">Nivel de integración *</Label>
              <select
                id="integrationLevel"
                name="integrationLevel"
                required
                className="w-full border rounded-md px-3 py-2"
                defaultValue="whatsapp"
              >
                <option value="manual">Manual (solo llamadas)</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="app">Usa nuestra app</option>
                <option value="api">Integración API</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Define cómo se coordinará con este transportista
              </p>
            </div>
          </div>
        </div>

        {/* Vehículo */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Vehículo</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Tipo de vehículo</Label>
              <select
                id="vehicleType"
                name="vehicleType"
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Seleccionar...</option>
                <option value="moto">Moto</option>
                <option value="auto">Auto</option>
                <option value="camioneta">Camioneta</option>
                <option value="van">Van</option>
                <option value="camion_3t">Camión 3 toneladas</option>
                <option value="camion_5t">Camión 5 toneladas</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiclePlate">Placa</Label>
              <Input id="vehiclePlate" name="vehiclePlate" placeholder="ABC-123" />
            </div>
          </div>
        </div>

        {/* Cobertura */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Zona de cobertura</h2>

          <div className="space-y-2">
            <Label htmlFor="baseDistrict">Distrito base</Label>
            <select
              id="baseDistrict"
              name="baseDistrict"
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Seleccionar...</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">Donde inicia su día normalmente</p>
          </div>

          <div className="space-y-2">
            <Label>Distritos que cubre</Label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {districts.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="districts" value={d} className="rounded" />
                  {d}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Tarifas */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Tarifas</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseFee">Tarifa base (S/)</Label>
              <Input id="baseFee" name="baseFee" type="number" step="0.01" placeholder="15.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perKmFee">Tarifa por km (S/)</Label>
              <Input id="perKmFee" name="perKmFee" type="number" step="0.01" placeholder="2.00" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/transportistas">Cancelar</Link>
          </Button>
          <Button type="submit">Crear transportista</Button>
        </div>
      </form>
    </div>
  )
}
