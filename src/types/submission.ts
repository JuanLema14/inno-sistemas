export interface SubmissionRequestDTO {
  content: string
  fileUrl?: string | null
  taskId: number
  userId: number
}

export interface SubmissionResponseDTO {
  submissionId: number
  content: string
  fileUrl?: string | null
  taskId: number
  userId: number
  submittedAt: string
  userName: string
}
