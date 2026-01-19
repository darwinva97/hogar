import 'dotenv/config'
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { Redis } from 'ioredis'

const PORT = parseInt(process.env.SOCKET_PORT || '4041', 10)
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4040'

// Tipos para eventos
interface ServerToClientEvents {
  // Tracking
  'shipment:location': (data: {
    shipmentId: string
    lat: string
    lng: string
    timestamp: string
  }) => void
  'shipment:status': (data: {
    shipmentId: string
    status: string
    note?: string
    timestamp: string
  }) => void

  // Notificaciones
  notification: (data: {
    id: string
    type: string
    title: string
    message: string
    data?: Record<string, unknown>
  }) => void

  // Órdenes
  'order:status': (data: {
    orderId: string
    status: string
    timestamp: string
  }) => void
  'order:new': (data: {
    orderId: string
    providerId: string
    items: number
    total: string
  }) => void

  // Carrier
  'carrier:assignment': (data: {
    shipmentId: string
    orderId: string
    pickupAddress: string
    deliveryAddress: string
    scheduledDate?: string
  }) => void
}

interface ClientToServerEvents {
  // Tracking - enviado por carriers
  'location:update': (data: { lat: string; lng: string }) => void
  'status:update': (data: {
    shipmentId: string
    status: string
    note?: string
    photo?: string
  }) => void

  // Suscripciones
  'subscribe:shipment': (shipmentId: string) => void
  'unsubscribe:shipment': (shipmentId: string) => void
  'subscribe:order': (orderId: string) => void
  'unsubscribe:order': (orderId: string) => void

  // Carrier online status
  'carrier:online': () => void
  'carrier:offline': () => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  userId?: string
  userType?: 'customer' | 'provider' | 'carrier' | 'admin'
  carrierId?: string
}

async function startServer() {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >({
    cors: {
      origin: CORS_ORIGIN.split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  // Configurar Redis adapter si está disponible
  if (process.env.REDIS_URL) {
    try {
      const pubClient = new Redis(process.env.REDIS_URL)
      const subClient = pubClient.duplicate()

      await Promise.all([
        new Promise((resolve) => pubClient.once('connect', resolve)),
        new Promise((resolve) => subClient.once('connect', resolve)),
      ])

      io.adapter(createAdapter(pubClient, subClient))
      console.log('✅ Redis adapter conectado')
    } catch (error) {
      console.warn('⚠️ No se pudo conectar a Redis, usando modo standalone:', error)
    }
  } else {
    console.log('ℹ️ REDIS_URL no configurado, usando modo standalone')
  }

  // Middleware de autenticación
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    // TODO: Validar token JWT
    // Por ahora, aceptamos cualquier conexión para desarrollo
    if (token) {
      // Decodificar token y setear datos
      socket.data.userId = socket.handshake.auth.userId
      socket.data.userType = socket.handshake.auth.userType
      socket.data.carrierId = socket.handshake.auth.carrierId
    }
    next()
  })

  // Namespace principal
  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`)

    // Unir a sala según tipo de usuario
    if (socket.data.userId) {
      socket.join(`user:${socket.data.userId}`)
    }
    if (socket.data.carrierId) {
      socket.join(`carrier:${socket.data.carrierId}`)
    }

    // === Tracking de envíos ===
    socket.on('subscribe:shipment', (shipmentId) => {
      socket.join(`shipment:${shipmentId}`)
      console.log(`📦 ${socket.id} suscrito a shipment:${shipmentId}`)
    })

    socket.on('unsubscribe:shipment', (shipmentId) => {
      socket.leave(`shipment:${shipmentId}`)
    })

    socket.on('location:update', (data) => {
      if (!socket.data.carrierId) return

      // Emitir a todos los que siguen los envíos de este carrier
      // TODO: Obtener shipments activos del carrier y emitir a cada uno
      console.log(`📍 Carrier ${socket.data.carrierId} ubicación:`, data)
    })

    socket.on('status:update', async (data) => {
      if (!socket.data.carrierId && socket.data.userType !== 'admin') return

      // Emitir actualización a suscriptores del envío
      io.to(`shipment:${data.shipmentId}`).emit('shipment:status', {
        shipmentId: data.shipmentId,
        status: data.status,
        note: data.note,
        timestamp: new Date().toISOString(),
      })

      console.log(`📋 Shipment ${data.shipmentId} status: ${data.status}`)
    })

    // === Órdenes ===
    socket.on('subscribe:order', (orderId) => {
      socket.join(`order:${orderId}`)
      console.log(`🛒 ${socket.id} suscrito a order:${orderId}`)
    })

    socket.on('unsubscribe:order', (orderId) => {
      socket.leave(`order:${orderId}`)
    })

    // === Carrier status ===
    socket.on('carrier:online', () => {
      if (socket.data.carrierId) {
        socket.join('carriers:online')
        io.to('admin').emit('notification', {
          id: crypto.randomUUID(),
          type: 'carrier_online',
          title: 'Transportista conectado',
          message: `Carrier ${socket.data.carrierId} está online`,
        })
      }
    })

    socket.on('carrier:offline', () => {
      if (socket.data.carrierId) {
        socket.leave('carriers:online')
      }
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`)
    })
  })

  // Namespace para Admin (panel de control)
  const adminNamespace = io.of('/admin')

  adminNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token
    // TODO: Validar que sea admin
    if (socket.handshake.auth.userType === 'admin') {
      next()
    } else {
      next(new Error('No autorizado'))
    }
  })

  adminNamespace.on('connection', (socket) => {
    console.log(`👑 Admin conectado: ${socket.id}`)
    socket.join('admin')

    socket.on('disconnect', () => {
      console.log(`👑 Admin desconectado: ${socket.id}`)
    })
  })

  // Namespace para Providers
  const providerNamespace = io.of('/provider')

  providerNamespace.use((socket, next) => {
    if (
      socket.handshake.auth.userType === 'provider' ||
      socket.handshake.auth.userType === 'admin'
    ) {
      next()
    } else {
      next(new Error('No autorizado'))
    }
  })

  providerNamespace.on('connection', (socket) => {
    const providerId = socket.handshake.auth.providerId
    console.log(`🏭 Provider conectado: ${providerId}`)

    if (providerId) {
      socket.join(`provider:${providerId}`)
    }

    socket.on('disconnect', () => {
      console.log(`🏭 Provider desconectado: ${providerId}`)
    })
  })

  io.listen(PORT)
  console.log(`🚀 Socket.io server corriendo en puerto ${PORT}`)
}

// Funciones helper para emitir desde otros servicios (API)
export function emitToUser(
  io: Server,
  userId: string,
  event: keyof ServerToClientEvents,
  data: unknown
) {
  io.to(`user:${userId}`).emit(event, data as never)
}

export function emitToShipment(
  io: Server,
  shipmentId: string,
  event: keyof ServerToClientEvents,
  data: unknown
) {
  io.to(`shipment:${shipmentId}`).emit(event, data as never)
}

export function emitNewOrder(io: Server, providerId: string, orderData: {
  orderId: string
  providerId: string
  items: number
  total: string
}) {
  io.of('/provider').to(`provider:${providerId}`).emit('order:new', orderData)
}

export function emitCarrierAssignment(io: Server, carrierId: string, data: {
  shipmentId: string
  orderId: string
  pickupAddress: string
  deliveryAddress: string
  scheduledDate?: string
}) {
  io.to(`carrier:${carrierId}`).emit('carrier:assignment', data)
}

startServer().catch(console.error)
