export interface NotificationDTO {
  id: number
  userId: number
  message: string
  type: string
  isRead: boolean
  createdAt: string
  readAt?: string | null
}
