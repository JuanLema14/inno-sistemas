export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN'
export type Status = 'ACTIVE' | 'INACTIVE'

export interface UserDTO {
  id: number
  userId?: number
  name: string
  email: string
  password?: string
  dni: string
  role: Role
  status: Status
}