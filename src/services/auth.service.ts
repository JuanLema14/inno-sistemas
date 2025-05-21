import api from './api'

interface LoginPayload {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  dni: string
  role: string
  status: string
  token: string
}

export const login = async (payload: LoginPayload): Promise<User> => {
  try {
    const { data } = await api.post<User>('/auth/login', payload)

    if (typeof window !== 'undefined') {
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`
    }

    return data
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.')
      } else if (status >= 500) {
        throw new Error('Error del servidor. Intenta más tarde.')
      }
    }
    throw new Error('No se pudo conectar al servidor. Verifica tu conexión.')
  }
}

export const getCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await api.get<User>('/auth/me')
    return data
  } catch (error) {
    throw new Error('No autorizado o error al obtener el usuario')
  }
}