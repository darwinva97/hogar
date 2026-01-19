'use client'

import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import type { User } from '@/lib/auth'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <div className="relative group">
      <Button variant="ghost" size="sm" className="gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {initials}
        </div>
        <span className="hidden md:inline max-w-[100px] truncate">
          {user.name || user.email.split('@')[0]}
        </span>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[200px]">
          <div className="px-4 py-2 border-b">
            <p className="font-medium truncate">{user.name || 'Usuario'}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/cuenta"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Mi cuenta
            </Link>
            <Link
              href="/cuenta/pedidos"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Mis pedidos
            </Link>
            <Link
              href="/favoritos"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Favoritos
            </Link>
          </div>

          {(user.role === 'admin' || user.role === 'provider') && (
            <div className="py-1 border-t">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Panel Admin
                </Link>
              )}
              {user.role === 'provider' && (
                <Link
                  href="/proveedor"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Panel Proveedor
                </Link>
              )}
            </div>
          )}

          <div className="py-1 border-t">
            <form action={logout}>
              <button
                type="submit"
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
