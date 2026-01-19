'use client'

import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4041'

// Singleton para la conexión principal
let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    })
  }
  return socket
}

export function connectSocket(auth: {
  token?: string
  userId?: string
  userType?: 'customer' | 'provider' | 'carrier' | 'admin'
  carrierId?: string
  providerId?: string
}) {
  const s = getSocket()
  s.auth = auth
  s.connect()
  return s
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Namespaces específicos
export function getAdminSocket(token: string): Socket {
  return io(`${SOCKET_URL}/admin`, {
    auth: { token, userType: 'admin' },
    withCredentials: true,
  })
}

export function getProviderSocket(token: string, providerId: string): Socket {
  return io(`${SOCKET_URL}/provider`, {
    auth: { token, userType: 'provider', providerId },
    withCredentials: true,
  })
}

// Tipos para eventos (cliente)
export interface ShipmentLocation {
  shipmentId: string
  lat: string
  lng: string
  timestamp: string
}

export interface ShipmentStatus {
  shipmentId: string
  status: string
  note?: string
  timestamp: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
}

export interface OrderStatus {
  orderId: string
  status: string
  timestamp: string
}

export interface NewOrder {
  orderId: string
  providerId: string
  items: number
  total: string
}

export interface CarrierAssignment {
  shipmentId: string
  orderId: string
  pickupAddress: string
  deliveryAddress: string
  scheduledDate?: string
}
