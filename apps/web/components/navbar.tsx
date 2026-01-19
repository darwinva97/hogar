import Link from 'next/link'
import { Suspense } from 'react'
import { getMainCategories } from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NavbarUser } from './navbar-user'
import { NavbarCart } from './navbar-cart'

const CategoriesSkeleton = () => {
  return (
    <nav className="flex h-10 items-center gap-6 overflow-x-auto text-sm">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-4 w-20 animate-pulse rounded bg-muted"
        />
      ))}
    </nav>
  )
}

const Categories = async () => {
  const categories = await getMainCategories()

  return (
    <nav className="flex h-10 items-center gap-6 overflow-x-auto text-sm">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categoria/${category.slug}`}
          className="whitespace-nowrap text-muted-foreground hover:text-foreground"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  )
}

export async function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-xs">
          <span>Envío gratis en compras mayores a S/299</span>
          <div className="flex items-center gap-4">
            <Link href="/ayuda" className="hover:underline">
              Ayuda
            </Link>
            <Link href="/vender" className="hover:underline">
              Vende en Hogar
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Hogar</span>
          </Link>

          {/* Search */}
          <form action="/buscar" className="flex flex-1 items-center gap-2 px-4">
            <div className="relative w-full max-w-xl">
              <Input
                type="search"
                name="q"
                placeholder="Buscar muebles, decoración..."
                className="w-full pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favoritos">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>
            </Button>

            <Suspense fallback={<CartIconSkeleton />}>
              <NavbarCart />
            </Suspense>

            <Suspense fallback={<UserSkeleton />}>
              <NavbarUser />
            </Suspense>
          </div>
        </div>

        {/* Categories */}
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>
      </div>
    </header>
  )
}

function CartIconSkeleton() {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/carrito">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </Link>
    </Button>
  )
}

function UserSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-16 animate-pulse rounded bg-muted" />
    </div>
  )
}
