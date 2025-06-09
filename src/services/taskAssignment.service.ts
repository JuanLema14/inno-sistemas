import { TaskAssignmentRequestDTO, TaskAssignmentResponseDTO } from '@/types/task-assignment'
import api from './api'
import { UserDTO } from '@/types/user'

export const assignTask = async (
  assignment: TaskAssignmentRequestDTO
): Promise<TaskAssignmentResponseDTO> => {
  const { data } = await api.post<TaskAssignmentResponseDTO>(
    '/task-assignments',
    assignment
  )
  return data
}

export const getUsersAssignedToTask = async (taskId: number): Promise<UserDTO[]> => {
  const { data } = await api.get<UserDTO[]>(`/task-assignments/task/${taskId}/users`)
  return data
}