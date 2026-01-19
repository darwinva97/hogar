import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = [
  '/cuenta',
  '/checkout',
  '/favoritos',
  '/proveedor',
  '/admin',
  '/transportista',
]

// Rutas solo para usuarios no autenticados
const authRoutes = ['/login', '/registro', '/recuperar-password']

// Rutas según rol
const roleRoutes: Record<string, string[]> = {
  admin: ['/admin'],
  provider: ['/proveedor'],
  carrier: ['/transportista'],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('session-token')?.value

  // Verificar si es ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Verificar si es ruta de auth
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Si no hay sesión y es ruta protegida, redirigir a login
  if (!sessionToken && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si hay sesión y es ruta de auth, redirigir a home
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // TODO: Verificar roles cuando tengamos acceso a la sesión en middleware
  // Por ahora, la verificación de roles se hace en las páginas server-side

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
