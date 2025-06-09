export interface FeedbackDTO {
  id?: number
  comment: string
  rating: number
  createdById: number
  submissionId: number
  createdAt?: string
}
