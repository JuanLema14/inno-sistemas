import { useMemo } from 'react'
import { TaskDTO } from '@/types/task'

export function useFilteredTasks(
  tasks: TaskDTO[],
  filterName: string,
  filterStatus: string
): TaskDTO[] {
  return useMemo(() => {
    return tasks.filter((task) => {
      const matchesName = task.name
        .toLowerCase()
        .includes(filterName.toLowerCase())
      const matchesStatus = filterStatus
        ? task.status === filterStatus
        : true
      return matchesName && matchesStatus
    })
  }, [tasks, filterName, filterStatus])
}
