export interface TaskAssignmentRequestDTO {
  taskId: number
  assignedType: 'USER' | 'TEAM' // o el tipo que manejes
  assignedId: number
}

export interface TaskAssignmentResponseDTO {
  taskId: number
  assignedType: string
  assignedId: number
  message: string
}
