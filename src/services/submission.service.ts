import api from './api'
import { SubmissionRequestDTO, SubmissionResponseDTO } from '@/types/submission'

export const submitTaskDelivery = async (
  submission: SubmissionRequestDTO
): Promise<SubmissionResponseDTO> => {
  const { data } = await api.post<SubmissionResponseDTO>(
    '/submissions',
    submission
  )
  return data
}

export const getSubmissionsByTask = async (taskId: number): Promise<SubmissionResponseDTO[]> => {
  const res = await api.get(`/submissions/by-task/${taskId}`);
  return res.data;
};