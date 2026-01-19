import { redirect } from 'next/navigation'
import { getCart } from '@/lib/actions/cart'
import { getUserAddresses } from '@/lib/actions/user'
import { getSession } from '@/lib/auth'
import { CheckoutForm } from '@/components/checkout/checkout-form'

export const metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login?redirect=/checkout')
  }

  const [cart, addresses] = await Promise.all([
    getCart(),
    getUserAddresses(),
  ])

  if (cart.items.length === 0) {
    redirect('/carrito')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Finalizar compra</h1>

      <CheckoutForm
        cart={cart}
        addresses={addresses}
        userEmail={session.user.email}
      />
    </div>
  )
}
