import { cookies } from 'next/headers'
import { cache } from 'react'
import { db } from '@hogar/database'
import { users, sessions } from '@hogar/database'
import { eq, and, gt } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// Tipos
export interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  image: string | null
  role: 'customer' | 'provider' | 'carrier' | 'admin'
  emailVerified: boolean | null
}

export interface Session {
  user: User
  sessionId: string
  expiresAt: Date
}

// Constantes
const SESSION_COOKIE_NAME = 'session-token'
const SESSION_DURATION_DAYS = 30

// Funciones de password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generar token de sesión
function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Crear sesión en BD y cookie
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return token
}

// Invalidar sesión
export async function invalidateSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token))
}

// Logout
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    await invalidateSession(token)
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Obtener sesión actual (cacheado por request)
export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.token, token),
      gt(sessions.expiresAt, new Date())
    ),
    with: {
      user: true,
    },
  })

  if (!session?.user) {
    return null
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      phone: session.user.phone,
      image: session.user.image,
      role: session.user.role!,
      emailVerified: session.user.emailVerified,
    },
    sessionId: session.id,
    expiresAt: session.expiresAt,
  }
})

// Helper para obtener usuario autenticado o lanzar error
export async function requireAuth(): Promise<User> {
  const session = await getSession()

  if (!session?.user) {
    throw new Error('No autenticado')
  }

  return session.user
}

// Helper para verificar rol
export async function requireRole(
  allowedRoles: User['role'][]
): Promise<User> {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    throw new Error('No autorizado')
  }

  return user
}

// Buscar usuario por email
export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  })
}

// Crear usuario
export async function createUser(data: {
  email: string
  password: string
  name: string
}) {
  const passwordHash = await hashPassword(data.password)

  const [user] = await db
    .insert(users)
    .values({
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
    })
    .returning()

  return user
}
