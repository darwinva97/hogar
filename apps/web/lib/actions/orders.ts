'use server'

import { db } from '@hogar/database'
import {
  orders,
  orderItems,
  orderStatusHistory,
  carts,
  cartItems,
  userAddresses,
} from '@hogar/database'
import { eq, desc, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { generateOrderNumber } from '@/lib/utils'

interface CreateOrderInput {
  shippingAddressId: string
  paymentMethod: 'yape' | 'plin' | 'transfer' | 'cash'
  notes?: string
}

export async function createOrder(input: CreateOrderInput) {
  const user = await requireAuth()

  // Obtener dirección de envío
  const address = await db.query.userAddresses.findFirst({
    where: and(
      eq(userAddresses.id, input.shippingAddressId),
      eq(userAddresses.userId, user.id)
    ),
  })

  if (!address) {
    throw new Error('Dirección no encontrada')
  }

  // Obtener carrito
  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
    with: {
      items: {
        with: {
          product: {
            with: {
              images: {
                orderBy: (img, { asc }) => [asc(img.order)],
                limit: 1,
              },
            },
          },
          variant: true,
        },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    throw new Error('El carrito está vacío')
  }

  // Calcular totales
  const subtotal = cart.items.reduce((acc, item) => {
    const price = item.variant?.price || item.product?.basePrice || '0'
    return acc + Number(price) * item.quantity
  }, 0)

  // TODO: Calcular shipping basado en dirección
  const shippingCost = 25 // S/25 por defecto

  const total = subtotal + shippingCost

  // Crear snapshot de la dirección
  const shippingAddressSnapshot = {
    recipientName: address.recipientName,
    recipientPhone: address.phone,
    address: address.street,
    district: address.district,
    city: address.city || 'Lima',
    reference: address.reference || undefined,
  }

  // Crear orden principal
  const [order] = await db
    .insert(orders)
    .values({
      userId: user.id,
      orderNumber: generateOrderNumber(),
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: input.paymentMethod,
      shippingAddress: shippingAddressSnapshot,
      subtotal: subtotal.toFixed(2),
      shippingFee: shippingCost.toFixed(2),
      total: total.toFixed(2),
      customerNotes: input.notes,
    })
    .returning()

  // Crear items de la orden
  for (const item of cart.items) {
    const price = item.variant?.price || item.product?.basePrice || '0'
    const itemTotal = Number(price) * item.quantity

    await db.insert(orderItems).values({
      orderId: order.id,
      productId: item.productId,
      variantId: item.variantId,
      providerId: item.product?.providerId!,
      name: item.product?.name || '',
      sku: item.product?.sku,
      variantName: item.variant?.name,
      image: item.product?.images?.[0]?.url,
      quantity: item.quantity,
      unitPrice: price,
      total: itemTotal.toFixed(2),
    })
  }

  // Crear historial de estado
  await db.insert(orderStatusHistory).values({
    orderId: order.id,
    status: 'pending',
    note: 'Pedido creado - Esperando pago',
  })

  // Limpiar carrito
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))

  revalidatePath('/', 'layout')

  return order
}

export async function getUserOrders() {
  const user = await requireAuth()

  return db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    with: {
      items: {
        with: {
          product: {
            with: {
              images: {
                limit: 1,
              },
            },
          },
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
  })
}

export async function getOrderById(orderId: string) {
  const user = await requireAuth()

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.userId, user.id)),
    with: {
      items: {
        with: {
          product: {
            with: {
              images: true,
            },
          },
          variant: true,
        },
      },
      statusHistory: {
        orderBy: (history, { desc }) => [desc(history.createdAt)],
      },
    },
  })

  return order
}

export async function getOrderByNumber(orderNumber: string) {
  const user = await requireAuth()

  return db.query.orders.findFirst({
    where: and(
      eq(orders.orderNumber, orderNumber),
      eq(orders.userId, user.id)
    ),
    with: {
      items: {
        with: {
          product: {
            with: {
              images: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: (history, { desc }) => [desc(history.createdAt)],
      },
    },
  })
}
