'use server'

import { db } from '@hogar/database'
import { shipments, shipmentTracking, carriers } from '@hogar/database'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// Get shipment by tracking code (public, no auth required)
export async function getShipmentByCode(code: string) {
  // Try to find by tracking code first
  let shipment = await db.query.shipments.findFirst({
    where: eq(shipments.trackingCode, code),
    with: {
      order: {
        columns: {
          id: true,
          orderNumber: true,
        },
      },
      carrier: {
        columns: {
          id: true,
          name: true,
          phone: true,
        },
      },
      tracking: {
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      },
    },
  })

  // If not found, try by ID (first 8 chars)
  if (!shipment) {
    const allShipments = await db.query.shipments.findMany({
      with: {
        order: {
          columns: {
            id: true,
            orderNumber: true,
          },
        },
        carrier: {
          columns: {
            id: true,
            name: true,
            phone: true,
          },
        },
        tracking: {
          orderBy: (t, { desc }) => [desc(t.createdAt)],
        },
      },
    })

    shipment = allShipments.find((s) => s.id.startsWith(code))
  }

  return shipment
}

// Update shipment status (by carrier, no auth - uses tracking code)
export async function updateShipmentStatusByCode(
  code: string,
  data: {
    status: 'picked_up' | 'in_transit' | 'delivered' | 'failed'
    note?: string
    photo?: string
    lat?: string
    lng?: string
    recipientName?: string
  }
) {
  const shipment = await getShipmentByCode(code)

  if (!shipment) {
    throw new Error('Envío no encontrado')
  }

  // Update shipment status
  const updateData: Record<string, unknown> = {
    status: data.status,
    updatedAt: new Date(),
  }

  if (data.lat && data.lng) {
    updateData.currentLat = data.lat
    updateData.currentLng = data.lng
    updateData.lastLocationUpdate = new Date()
  }

  if (data.status === 'picked_up') {
    updateData.pickedUpAt = new Date()
  }

  if (data.status === 'delivered') {
    updateData.deliveredAt = new Date()
    if (data.photo) updateData.deliveryPhoto = data.photo
    if (data.recipientName) updateData.recipientName = data.recipientName
  }

  if (data.status === 'failed' && data.note) {
    updateData.failureReason = data.note
  }

  await db
    .update(shipments)
    .set(updateData)
    .where(eq(shipments.id, shipment.id))

  // Add tracking entry
  await db.insert(shipmentTracking).values({
    shipmentId: shipment.id,
    status: data.status,
    note: data.note,
    photo: data.photo,
    lat: data.lat,
    lng: data.lng,
    createdBy: 'carrier',
  })

  revalidatePath(`/e/${code}`)
  revalidatePath(`/tracking/${code}`)

  return { success: true }
}

// Get public tracking info
export async function getPublicTracking(code: string) {
  const shipment = await getShipmentByCode(code)

  if (!shipment) {
    return null
  }

  // Return limited public info
  return {
    trackingCode: shipment.trackingCode || shipment.id.slice(0, 8),
    status: shipment.status,
    destinationDistrict: (shipment.destinationAddress as any)?.district,
    scheduledDate: shipment.scheduledDate,
    scheduledTimeSlot: shipment.scheduledTimeSlot,
    deliveredAt: shipment.deliveredAt,
    tracking: shipment.tracking.map((t) => ({
      status: t.status,
      note: t.note,
      createdAt: t.createdAt,
    })),
  }
}
