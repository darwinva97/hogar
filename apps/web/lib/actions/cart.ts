'use server'

import { db } from '@hogar/database'
import { carts, cartItems, products, productVariants } from '@hogar/database'
import { eq, and } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Obtener carrito existente (solo lectura, no crea)
async function getExistingCart() {
  const session = await getSession()
  const cookieStore = await cookies()
  const guestId = cookieStore.get('guest-id')?.value

  if (session?.user.id) {
    return db.query.carts.findFirst({
      where: eq(carts.userId, session.user.id),
    })
  }

  if (guestId) {
    return db.query.carts.findFirst({
      where: eq(carts.guestId, guestId),
    })
  }

  return null
}

// Obtener o crear carrito (solo para Server Actions que modifican)
async function getOrCreateCart() {
  const session = await getSession()
  const cookieStore = await cookies()
  const guestId = cookieStore.get('guest-id')?.value

  let cart

  if (session?.user.id) {
    // Usuario autenticado
    cart = await db.query.carts.findFirst({
      where: eq(carts.userId, session.user.id),
    })

    if (!cart) {
      const [newCart] = await db
        .insert(carts)
        .values({ userId: session.user.id })
        .returning()
      cart = newCart
    }
  } else if (guestId) {
    // Usuario guest con cookie existente
    cart = await db.query.carts.findFirst({
      where: eq(carts.guestId, guestId),
    })

    if (!cart) {
      const [newCart] = await db
        .insert(carts)
        .values({ guestId })
        .returning()
      cart = newCart
    }
  } else {
    // Crear nuevo guest ID (esto solo se ejecuta en Server Actions)
    const newGuestId = crypto.randomUUID()
    cookieStore.set('guest-id', newGuestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
    })

    const [newCart] = await db
      .insert(carts)
      .values({ guestId: newGuestId })
      .returning()
    cart = newCart
  }

  return cart
}

// Obtener carrito para mostrar (lectura)
export async function getCart() {
  const cart = await getExistingCart()

  if (!cart) {
    return {
      id: null,
      items: [],
      itemCount: 0,
      subtotal: 0,
    }
  }

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cart.id),
    with: {
      product: {
        with: {
          images: {
            orderBy: (images, { asc }) => [asc(images.order)],
            limit: 1,
          },
          provider: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
      variant: true,
    },
  })

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.priceModifier
      ? Number(item.product?.basePrice || 0) + Number(item.variant.priceModifier)
      : Number(item.product?.basePrice || 0)
    return acc + price * item.quantity
  }, 0)

  return {
    id: cart.id,
    items,
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal,
  }
}

export async function addToCart(
  productId: string,
  quantity: number = 1,
  variantId?: string
) {
  const cart = await getOrCreateCart()

  // Verificar que el producto existe
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product) {
    throw new Error('Producto no encontrado')
  }

  // Verificar variante si se especifica
  if (variantId) {
    const variant = await db.query.productVariants.findFirst({
      where: eq(productVariants.id, variantId),
    })

    if (!variant || variant.productId !== productId) {
      throw new Error('Variante no válida')
    }
  }

  // Buscar si ya existe en el carrito
  const existingItem = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productId, productId),
      variantId ? eq(cartItems.variantId, variantId) : undefined
    ),
  })

  if (existingItem) {
    // Actualizar cantidad
    await db
      .update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id))
  } else {
    // Crear nuevo item
    await db.insert(cartItems).values({
      cartId: cart.id,
      productId,
      variantId,
      quantity,
    })
  }

  revalidatePath('/', 'layout')
  return getCart()
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(itemId)
  }

  await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, itemId))

  revalidatePath('/', 'layout')
  return getCart()
}

export async function removeFromCart(itemId: string) {
  await db.delete(cartItems).where(eq(cartItems.id, itemId))

  revalidatePath('/', 'layout')
  return getCart()
}

export async function clearCart() {
  const cart = await getExistingCart()
  if (cart) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))
  }

  revalidatePath('/', 'layout')
  return getCart()
}
