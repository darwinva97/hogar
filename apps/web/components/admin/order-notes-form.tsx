'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addOrderNote } from '@/lib/actions/admin-orders'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface OrderNotesFormProps {
  orderId: string
}

export function OrderNotesForm({ orderId }: OrderNotesFormProps) {
  const [note, setNote] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return

    startTransition(async () => {
      try {
        await addOrderNote(orderId, note.trim())
        toast.success('Nota agregada')
        setNote('')
        router.refresh()
      } catch {
        toast.error('Error al agregar nota')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Agregar nota interna..."
        className="w-full border rounded-md px-3 py-2 text-sm resize-none"
        rows={2}
      />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={!note.trim() || isPending}
        className="w-full"
      >
        {isPending ? 'Agregando...' : 'Agregar nota'}
      </Button>
    </form>
  )
}
