'use client'

import { useEffect, useCallback, useState } from 'react'
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket'
import type {
  ShipmentLocation,
  ShipmentStatus,
  Notification,
  OrderStatus,
  CarrierAssignment,
} from '@/lib/socket'

interface UseSocketOptions {
  token?: string
  userId?: string
  userType?: 'customer' | 'provider' | 'carrier' | 'admin'
  carrierId?: string
  autoConnect?: boolean
}

export function useSocket(options: UseSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!options.autoConnect) return

    const socket = connectSocket({
      token: options.token,
      userId: options.userId,
      userType: options.userType,
      carrierId: options.carrierId,
    })

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onNotification(data: Notification) {
      setNotifications((prev) => [data, ...prev])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('notification', onNotification)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('notification', onNotification)
      disconnectSocket()
    }
  }, [options.autoConnect, options.token, options.userId, options.userType, options.carrierId])

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return {
    isConnected,
    notifications,
    clearNotification,
    socket: getSocket(),
  }
}

export function useShipmentTracking(shipmentId: string | null) {
  const [location, setLocation] = useState<ShipmentLocation | null>(null)
  const [status, setStatus] = useState<ShipmentStatus | null>(null)

  useEffect(() => {
    if (!shipmentId) return

    const socket = getSocket()

    function onLocation(data: ShipmentLocation) {
      if (data.shipmentId === shipmentId) {
        setLocation(data)
      }
    }

    function onStatus(data: ShipmentStatus) {
      if (data.shipmentId === shipmentId) {
        setStatus(data)
      }
    }

    socket.emit('subscribe:shipment', shipmentId)
    socket.on('shipment:location', onLocation)
    socket.on('shipment:status', onStatus)

    return () => {
      socket.emit('unsubscribe:shipment', shipmentId)
      socket.off('shipment:location', onLocation)
      socket.off('shipment:status', onStatus)
    }
  }, [shipmentId])

  return { location, status }
}

export function useOrderTracking(orderId: string | null) {
  const [status, setStatus] = useState<OrderStatus | null>(null)

  useEffect(() => {
    if (!orderId) return

    const socket = getSocket()

    function onStatus(data: OrderStatus) {
      if (data.orderId === orderId) {
        setStatus(data)
      }
    }

    socket.emit('subscribe:order', orderId)
    socket.on('order:status', onStatus)

    return () => {
      socket.emit('unsubscribe:order', orderId)
      socket.off('order:status', onStatus)
    }
  }, [orderId])

  return { status }
}

export function useCarrierAssignments() {
  const [assignments, setAssignments] = useState<CarrierAssignment[]>([])

  useEffect(() => {
    const socket = getSocket()

    function onAssignment(data: CarrierAssignment) {
      setAssignments((prev) => [data, ...prev])
    }

    socket.emit('carrier:online')
    socket.on('carrier:assignment', onAssignment)

    return () => {
      socket.emit('carrier:offline')
      socket.off('carrier:assignment', onAssignment)
    }
  }, [])

  const clearAssignment = useCallback((shipmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.shipmentId !== shipmentId))
  }, [])

  return { assignments, clearAssignment }
}
