import api from './api'
import { FeedbackDTO } from '@/types/feedback'

// Crear feedback
export const createFeedback = async (feedback: FeedbackDTO): Promise<FeedbackDTO> => {
  const { data } = await api.post<FeedbackDTO>('/feedback/create_feedback', feedback)
  return data
}

// Actualizar feedback
export const updateFeedback = async (id: number, feedback: FeedbackDTO): Promise<FeedbackDTO> => {
  const { data } = await api.put<FeedbackDTO>(`/feedback/${id}/edit`, feedback)
  return data
}

// Obtener feedback por ID
export const getFeedbackById = async (id: number): Promise<FeedbackDTO> => {
  const { data } = await api.get<FeedbackDTO>(`/feedback/${id}`)
  return data
}

// Obtener todos los feedbacks
export const getAllFeedbacks = async (): Promise<FeedbackDTO[]> => {
  const { data } = await api.get<FeedbackDTO[]>('/feedback/all')
  return data
}

// Eliminar feedback por ID
export const deleteFeedback = async (id: number): Promise<void> => {
  await api.delete(`/feedback/${id}/delete`)
}

// Obtener retroalimantacion por el id de una entrega
export const getFeedbacksBySubmission = async (submissionId: number): Promise<FeedbackDTO[]> => {
    const { data } = await api.get<FeedbackDTO[]>(`/feedback/submission/${submissionId}`)
    return data
}
