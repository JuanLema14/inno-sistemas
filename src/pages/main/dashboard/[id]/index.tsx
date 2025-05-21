"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDTO, getProjectById } from "@/services/project.service";
import { TeamDTO, getTeamsByProject } from "@/services/team.service";
import { User, getCurrentUser } from "@/services/auth.service";
import { PlusCircle, ArrowLeft } from "lucide-react";
import CreateTaskModal from "@/components/frames/modals/CreateTaskModal";

import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";

import { Settings } from "lucide-react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getUserFromRequest(context.req);

  const safeUser = user
    ? {
        id: user.id ?? null,
        email: user.email ?? null,
        name: user.name ?? null,
        role: user.role ?? null,
      }
    : null;

  return {
    props: {
      user: safeUser,
    },
  };
};

import CreateTeamModal from "@/components/frames/modals/CreateTeamModal";
import ManageTeam from "@/components/frames/ManageTeam";
import { TaskDTO } from "@/types/task";
import { getTasksByProject } from "@/services/task.service";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const projectId = Number(id);
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [team, setTeam] = useState<TeamDTO | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showManageTeam, setShowManageTeam] = useState(false);

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const fetchedProject = await getProjectById(projectId);
      setProject(fetchedProject);

      const teams = await getTeamsByProject(projectId);
      if (teams.length > 0) {
        setTeam(teams[0]);
      }

      const fetchedTasks = await getTasksByProject(projectId);
      setTasks(fetchedTasks);
    };

    fetchData();
  }, [projectId]);

  const handleOpenCreateTaskModal = () => {
    setShowCreateTaskModal(true);
  };

  const handleTaskCreated = (newTask: TaskDTO) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesName = task.name
        .toLowerCase()
        .includes(filterName.toLowerCase());
      const matchesStatus = filterStatus ? task.status === filterStatus : true;
      return matchesName && matchesStatus;
    });
  }, [tasks, filterName, filterStatus]);

  const handleCreateTeamClick = () => {
    setShowModal(true);
  };

  const handleTeamCreated = (newTeam: TeamDTO) => {
    setTeam(newTeam);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!project) return <p className="text-secondary">Cargando proyecto...</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full mx-auto">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        {/* Botón volver */}
        <div className="bg-primary text-white p-3 rounded-full">
          <PlusCircle size={32} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
          <p className="text-sm text-muted-foreground text-gray-400 mt-1">
            {project.description}
          </p>
        </div>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 text-sm text-primary hover:underline hover:cursor-pointer mb-4"
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <hr className="border-border/10 my-4" />

      {/* Grupo asociado */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-third">Grupo asociado:</h2>
        {team ? (
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">{team.name}</span>

            {/* Solo muestra si el usuario actual es el líder del equipo */}
            {user?.id === team.leaderId && (
              <button
                onClick={() => setShowManageTeam(!showManageTeam)}
                className="text-primary hover:text-primary/80 hover:cursor-pointer transition"
                title="Gestionar equipo"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Este proyecto no tiene un grupo asignado.
            </span>
            <button
              onClick={handleCreateTeamClick}
              className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 hover:cursor-pointer transition"
            >
              + Crear grupo
            </button>
          </div>
        )}
      </div>

      {/* Modal de creación de equipo */}
      {showModal && (
        <CreateTeamModal
          projectId={projectId}
          onClose={() => setShowModal(false)}
          onTeamCreated={handleTeamCreated}
          userId={user?.id ?? 0}
        />
      )}

      {/* Manage team */}
      {showManageTeam && team && <ManageTeam teamId={team.id!} />}

      {!showManageTeam && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-third">
              Tareas del proyecto
            </h2>
            {/* Botón para crear nueva tarea */}
            <button
              onClick={handleOpenCreateTaskModal}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 hover:cursor-pointer transition"
            >
              + Crear tarea
            </button>
          </div>

          {/* Modal de creación de tarea */}
          {showCreateTaskModal && user && (
            <CreateTaskModal
              projectId={projectId}
              createdById={user.id}
              onClose={() => setShowCreateTaskModal(false)}
              onTaskCreated={(task) => {
                handleTaskCreated(task);
                setShowCreateTaskModal(false);
              }}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 flex-1 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-400 rounded px-3 py-2 w-48 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="REVIEWED">Revisada</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-left text-sm text-gray-600">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-900">
                    Nombre
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-900">
                    Descripción
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-900">
                    Fecha límite
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-900">
                    Estado
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-900">
                    Prioridad
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No se encontraron tareas
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {task.name}
                      </td>
                      <td
                        className="px-4 py-3 truncate max-w-xs"
                        title={task.description}
                      >
                        {task.description}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {task.status.replace("_", " ").toLowerCase()}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {task.priority.toLowerCase()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
