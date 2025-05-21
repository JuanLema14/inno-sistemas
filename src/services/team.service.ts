import { UserDTO } from '@/types/user'
import api from './api'

export interface TeamDTO {
  id?: number
  name: string
  description?: string
  projectId: number,
  leaderId?: number
}

export type UserTeam = {
  id: {
    userId: number;
    teamId: number;
  };
  user: UserDTO
  team?: TeamDTO;
  roleInGroup?: string;
};


// Crear equipo
export const createTeam = async (team: TeamDTO): Promise<TeamDTO> => {
  const { data } = await api.post<TeamDTO>('/teams/create_team', team)
  return data
}

// Obtener equipo por ID
export const getTeamById = async (id: number): Promise<TeamDTO> => {
  const { data } = await api.get<TeamDTO>(`/teams/${id}`)
  return data
}

// Obtener equipos por ID de proyecto
export const getTeamsByProject = async (projectId: number): Promise<TeamDTO[]> => {
  const { data } = await api.get<TeamDTO[]>(`/teams/project/${projectId}/all`)
  return data
}

// Actualizar un equipo
export const updateTeam = async (id: number, team: TeamDTO): Promise<TeamDTO> => {
  const { data } = await api.put<TeamDTO>(`/teams/${id}/edit`, team)
  return data
}

// Eliminar un equipo
export const deleteTeam = async (id: number): Promise<void> => {
  await api.delete(`/teams/${id}/delete`)
}

// Agregar usuario a un equipo
export const addUserToTeam = async (
  teamId: number,
  userId: number,
  roleInGroup = 'Miembro'
): Promise<string> => {
  console.log('Adding user to team:', { teamId, userId, roleInGroup })
  const { data } = await api.post<string>(
    `/teams/${teamId}/users/${userId}?roleInGroup=${encodeURIComponent(roleInGroup)}`
  )
  return data
}

// Obtener usuarios de un equipo
export const getUsersByTeam = async (teamId: number): Promise<UserTeam[]> => {
  const { data } = await api.get<UserTeam[]>(`/teams/${teamId}/users`)
  return data
}

// Eliminar usuario de un equipo
export const removeUserFromTeam = async (
  teamId: number,
  userId: number
): Promise<string> => {
  const { data } = await api.delete<string>(`/teams/${teamId}/users/${userId}`)
  return data
}