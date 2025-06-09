"use client";

import { useParams, useRouter } from "next/navigation";
import { PlusCircle, ArrowLeft, Settings } from "lucide-react";
import CreateTaskModal from "@/components/frames/modals/CreateTaskModal";
import CreateTeamModal from "@/components/frames/modals/CreateTeamModal";
import ManageTeam from "@/components/frames/ManageTeam";
import { TaskDTO } from "@/types/task";
import { useState } from "react";

import { useProjectData } from "@/hooks/useProjectData";
import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";

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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params?.id);

  const { user, project, team, tasks, isLoading, error, setTasks, setTeam } =
    useProjectData(projectId);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const filteredTasks = useFilteredTasks(tasks, filterName, filterStatus);

  const [showModal, setShowModal] = useState(false);
  const [showManageTeam, setShowManageTeam] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const handleOpenCreateTaskModal = () => {
    setShowCreateTaskModal(true);
  };

  const handleTaskCreated = (newTask: TaskDTO) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleCreateTeamClick = () => {
    setShowModal(true);
  };

  const handleTeamCreated = (newTeam: typeof team) => {
    setTeam(newTeam);
  };

  const handleGoBack = () => {
    router.back();
  };

  // Puedes poner esto arriba del componente principal o en un archivo aparte
  const PriorityBadge = ({ priority }: { priority: string }) => {
    let color = "bg-gray-200 text-gray-700";
    let label = priority;

    switch (priority) {
      case "LOW":
        color = "bg-green-100 text-green-700 border border-green-400";
        label = "Baja";
        break;
      case "MEDIUM":
        color = "bg-yellow-100 text-yellow-700 border border-yellow-400";
        label = "Media";
        break;
      case "HIGH":
        color = "bg-red-100 text-red-700 border border-red-400";
        label = "Alta";
        break;
      default:
        label = priority;
    }

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        {label}
      </span>
    );
  };

  if (isLoading)
    return <p className="text-secondary">Cargando proyecto y datos...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!project)
    return <p className="text-secondary">Proyecto no encontrado.</p>;

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
                    Prioridad
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">
                      No se encontraron tareas.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => router.push(`/main/tasks/${task.id}`)}
                    >
                      <td className="px-4 py-3">{task.name}</td>
                      <td className="px-4 py-3">{task.description}</td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={task.priority} />
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
