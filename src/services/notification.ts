import api from './api'
import { NotificationDTO } from '@/types/notification'

// Obtener notificación por ID
export const getNotificationById = async (id: number): Promise<NotificationDTO> => {
  const { data } = await api.get<NotificationDTO>(`/notifications/${id}`)
  return data
}

export const getAllNotifications = async (): Promise<NotificationDTO[]> => {
  const { data } = await api.get<NotificationDTO[]>(`/notifications/listar-todas`)
  return data
}

// Obtener todas las notificaciones de un usuario
export const getNotificationsByUserId = async (): Promise<NotificationDTO[]> => {
  const { data } = await api.get<NotificationDTO[]>(`/notifications/user/`)
  return data
}

// Eliminar una notificación por ID
export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}/delete`)
}

// Marcar una notificación como leída
export const markNotificationAsRead = async (id: number): Promise<NotificationDTO> => {
  const { data } = await api.patch<NotificationDTO>(`/notifications/${id}/read`)
  return data
}
