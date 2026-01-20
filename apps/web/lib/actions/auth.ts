'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import {
  createSession,
  createUser,
  getUserByEmail,
  verifyPassword,
  logout as logoutSession,
} from '@/lib/auth'

// Schemas de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Tipos para respuestas
type ActionResult = {
  success: boolean
  error?: string
  errors?: Record<string, string[]>
}

// Login
export async function login(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validatedFields = loginSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  const user = await getUserByEmail(email)

  if (!user || !user.passwordHash) {
    return {
      success: false,
      error: 'Credenciales incorrectas',
    }
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    return {
      success: false,
      error: 'Credenciales incorrectas',
    }
  }

  await createSession(user.id)

  // Redirigir según el rol
  const redirectUrl = getRedirectByRole(user.role!)
  redirect(redirectUrl)
}

// Register
export async function register(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  const validatedFields = registerSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  // Verificar si el email ya existe
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return {
      success: false,
      error: 'Este email ya está registrado',
    }
  }

  // Crear usuario
  const user = await createUser({ name, email, password })

  // Crear sesión
  if (!user) {
    return {
      success: false,
      error: 'Error al crear el usuario',
    }
  }
  await createSession(user.id)

  redirect('/')
}

// Logout
export async function logout(): Promise<void> {
  await logoutSession()
  redirect('/login')
}

// Helper para redirección por rol
function getRedirectByRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'provider':
      return '/proveedor'
    case 'carrier':
      return '/transportista'
    default:
      return '/'
  }
}
