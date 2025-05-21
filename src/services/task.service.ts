import api from './api'
import { TaskDTO } from '@/types/task'

// Obtener todas las tareas
export const getAllTasks = async (): Promise<TaskDTO[]> => {
  const { data } = await api.get<TaskDTO[]>('/tasks/all')
  return data
}

// Obtener una tarea por ID
export const getTaskById = async (id: number): Promise<TaskDTO> => {
  const { data } = await api.get<TaskDTO>(`/tasks/${id}`)
  return data
}

// Crear nueva tarea
export const createTask = async (task: Omit<TaskDTO, 'id'>): Promise<TaskDTO> => {
  const { data } = await api.post<TaskDTO>('/tasks/create_task', task)
  return data
}

// Editar tarea existente
export const updateTask = async (
  id: number,
  task: Partial<TaskDTO>
): Promise<TaskDTO> => {
  const { data } = await api.put<TaskDTO>(`/tasks/${id}/edit`, task)
  return data
}

// Actualizar estado de una tarea (PATCH)
export const updateTaskStatus = async (
  id: number,
  status: string
): Promise<TaskDTO> => {
  const { data } = await api.patch<TaskDTO>(`/tasks/${id}/status?status=${status}`)
  return data
}

// Obtener tareas por proyecto
export const getTasksByProject = async (projectId: number): Promise<TaskDTO[]> => {
  const { data } = await api.get<TaskDTO[]>(`/tasks/project/${projectId}`)
  return data
}

