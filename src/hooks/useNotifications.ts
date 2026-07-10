'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Notification } from '@/types'
import { useSocket } from './useSocket'
import { useEffect } from 'react'

async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch('/api/notifications')
  if (!response.ok) throw new Error('Failed to fetch notifications')
  return response.json()
}

async function fetchUnreadCount(): Promise<number> {
  const response = await fetch('/api/notifications/unread-count')
  if (!response.ok) throw new Error('Failed to fetch unread count')
  const data = await response.json()
  return data.count
}

async function markAsRead(id: string): Promise<void> {
  const response = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' })
  if (!response.ok) throw new Error('Failed to mark as read')
}

async function markAllAsRead(): Promise<void> {
  const response = await fetch('/api/notifications/read-all', { method: 'PUT' })
  if (!response.ok) throw new Error('Failed to mark all as read')
}

async function deleteNotification(id: string): Promise<void> {
  const response = await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete notification')
}

export function useNotifications() {
  const queryClient = useQueryClient()
  const { on, off } = useSocket()

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000,
  })

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    refetchInterval: 30000,
  })

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })

  useEffect(() => {
    const handleNotification = (...args: unknown[]) => {
      const notification = args[0] as Notification
      queryClient.setQueryData(['notifications'], (old: Notification[]) => [
        notification,
        ...old,
      ])
      queryClient.setQueryData(['notifications', 'unread-count'], (old: number) => old + 1)
    }

    on('notification', handleNotification)

    return () => {
      off('notification', handleNotification)
    }
  }, [on, off, queryClient])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
