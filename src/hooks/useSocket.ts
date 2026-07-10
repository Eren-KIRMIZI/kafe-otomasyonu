'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  namespace?: string
  autoConnect?: boolean
  userId?: string
  role?: string
}

export function useSocket({ namespace = '', autoConnect = true, userId, role }: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
    const socket = io(`${socketUrl}${namespace}`, {
      auth: { userId, role },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('connect_err', (err) => {
      setError(err as unknown as Error)
      setIsConnected(false)
    })

    socketRef.current = socket
  }, [namespace, userId, role])

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect()
    socketRef.current = null
    setIsConnected(false)
  }, [])

  const emit = useCallback((event: string, ...args: unknown[]) => {
    socketRef.current?.emit(event, ...args)
  }, [])

  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    socketRef.current?.on(event, callback)
  }, [])

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    socketRef.current?.off(event, callback)
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  }
}
