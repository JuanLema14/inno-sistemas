export interface TaskDTO {
  id: number
  name: string
  description: string
  dueDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  projectId: number
  createdById: number
}
