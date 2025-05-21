import api from './api'

export interface ProjectDTO {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  createdById: number;
}

export const getProjectsByUserId = async (userId: number): Promise<ProjectDTO[]> => {
  const { data } = await api.get<ProjectDTO[]>(`/project/my-projects/${userId}`);
  return data;
};

export const getAllProjects = async (): Promise<ProjectDTO[]> => {
  const { data } = await api.get<ProjectDTO[]>(`/project/all`);
  return data;
};

export const getProjectById = async (id: number): Promise<ProjectDTO> => {
  const { data } = await api.get<ProjectDTO>(`/project/${id}`);
  return data;
};

export const createProject = async (project: ProjectDTO): Promise<ProjectDTO> => {
  const { data } = await api.post<ProjectDTO>(`/project/create_project`, project);
  return data;
};

export const updateProject = async (id: number, project: ProjectDTO): Promise<ProjectDTO> => {
  const { data } = await api.put<ProjectDTO>(`/project/${id}/edit`, project);
  return data;
};

export const updateProjectStatus = async (id: number, status: string): Promise<ProjectDTO> => {
  const { data } = await api.patch<ProjectDTO>(`/project/${id}/status`, null, {
    params: { status },
  });
  return data;
};
