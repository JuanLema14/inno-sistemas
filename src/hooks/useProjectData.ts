import { useEffect, useState } from 'react'
import { getCurrentUser, User } from '@/services/auth.service'
import { getProjectById, ProjectDTO } from '@/services/project.service'
import { getTeamsByProject, TeamDTO } from '@/services/team.service'
import { getTasksByProject } from '@/services/task.service'
import { TaskDTO } from '@/types/task'

interface ProjectData {
  user: User | null
  project: ProjectDTO | null
  team: TeamDTO | null
  tasks: TaskDTO[]
  isLoading: boolean
  error: string | null
  setTasks: React.Dispatch<React.SetStateAction<TaskDTO[]>>;
  setTeam: React.Dispatch<React.SetStateAction<TeamDTO | null>>;
}

export function useProjectData(projectId?: number): ProjectData {
  const [user, setUser] = useState<User | null>(null)
  const [project, setProject] = useState<ProjectDTO | null>(null)
  const [team, setTeam] = useState<TeamDTO | null>(null)
  const [tasks, setTasks] = useState<TaskDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return

    setIsLoading(true)
    Promise.all([
      getCurrentUser(),
      getProjectById(projectId),
      getTeamsByProject(projectId),
      getTasksByProject(projectId),
    ])
      .then(([u, p, t_arr, tasks]) => {
        setUser(u)
        setProject(p)
        setTeam(t_arr.length > 0 ? t_arr[0] : null)
        setTasks(tasks)
      })
      .catch((err) => {
        console.error(err)
        setError('Error cargando datos')
      })
      .finally(() => setIsLoading(false))
  }, [projectId])

  return { user, project, team, tasks, isLoading, error, setTasks, setTeam };
}
