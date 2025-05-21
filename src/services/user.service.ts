import api from './api'
import { UserDTO } from '@/types/user'

// Obtener todos los usuarios
export const getAllUsers = async (): Promise<UserDTO[]> => {
  const { data } = await api.get<UserDTO[]>('/users/all')
  return data
}

// Obtener usuario por ID
export const getUserById = async (id: number): Promise<UserDTO> => {
  const { data } = await api.get<UserDTO>(`/users/${id}`)
  return data
}

// Registrar nuevo usuario (solo ADMIN)
export const createUser = async (user: Omit<UserDTO, 'id'>): Promise<UserDTO> => {
  const { data } = await api.post<UserDTO>('/users/register', user)
  return data
}

// Editar usuario (solo ADMIN)
export const updateUser = async (
  id: number,
  user: Partial<UserDTO>
): Promise<UserDTO> => {
  const { data } = await api.put<UserDTO>(`/users/${id}/edit`, user)
  return data
}

// Cambiar estado del usuario a INACTIVE (solo ADMIN)
export const deactivateUser = async (id: number): Promise<void> => {
  await api.put(`/users/${id}/status`)
}
