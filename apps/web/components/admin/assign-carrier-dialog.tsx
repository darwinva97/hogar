'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { assignCarrierToShipment } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Carrier {
  id: string
  name: string
  phone: string
  whatsapp: string | null
  vehicleType: string | null
  integrationLevel: string | null
  districts: string[] | null
  baseFee: string | null
  rating: string | null
}

interface AssignCarrierDialogProps {
  shipmentId: string
  carriers: Carrier[]
}

const integrationLabels: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' }> = {
  api: { label: 'API', color: 'success' },
  app: { label: 'App', color: 'default' },
  whatsapp: { label: 'WhatsApp', color: 'secondary' },
  manual: { label: 'Manual', color: 'warning' },
}

export function AssignCarrierDialog({ shipmentId, carriers }: AssignCarrierDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCarrier, setSelectedCarrier] = useState<string>('')
  const [agreedFee, setAgreedFee] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAssign = () => {
    if (!selectedCarrier) {
      toast.error('Selecciona un transportista')
      return
    }

    startTransition(async () => {
      try {
        await assignCarrierToShipment(
          shipmentId,
          selectedCarrier,
          agreedFee || undefined
        )
        toast.success('Transportista asignado exitosamente')
        setIsOpen(false)
        router.refresh()
      } catch {
        toast.error('Error al asignar transportista')
      }
    })
  }

  const selectedCarrierData = carriers.find((c) => c.id === selectedCarrier)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Asignar transportista
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Asignar transportista</h2>
              <p className="text-sm text-muted-foreground">
                Selecciona un transportista disponible
              </p>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {carriers.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No hay transportistas disponibles
                </p>
              ) : (
                <div className="space-y-2">
                  {carriers.map((carrier) => (
                    <label
                      key={carrier.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCarrier === carrier.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="carrier"
                          value={carrier.id}
                          checked={selectedCarrier === carrier.id}
                          onChange={(e) => setSelectedCarrier(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{carrier.name}</span>
                            <Badge
                              variant={
                                integrationLabels[carrier.integrationLevel || 'manual'].color
                              }
                            >
                              {integrationLabels[carrier.integrationLevel || 'manual'].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {carrier.phone}
                            {carrier.whatsapp && carrier.whatsapp !== carrier.phone && (
                              <span className="text-green-600 ml-2">
                                WA: {carrier.whatsapp}
                              </span>
                            )}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            {carrier.vehicleType && (
                              <span>Vehículo: {carrier.vehicleType}</span>
                            )}
                            {carrier.baseFee && (
                              <span>Tarifa base: S/{carrier.baseFee}</span>
                            )}
                            {carrier.rating && Number(carrier.rating) > 0 && (
                              <span>Rating: {carrier.rating}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedCarrier && (
                <div className="mt-6 pt-6 border-t">
                  <Label htmlFor="agreedFee">Tarifa acordada (S/)</Label>
                  <Input
                    id="agreedFee"
                    type="number"
                    step="0.01"
                    placeholder={selectedCarrierData?.baseFee || '25.00'}
                    value={agreedFee}
                    onChange={(e) => setAgreedFee(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Dejar vacío para usar tarifa base del transportista
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedCarrier || isPending}
              >
                {isPending ? 'Asignando...' : 'Asignar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
