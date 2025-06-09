import UserAssignmentPanel from "@/components/frames/UserAssignmentPanel";
import { getUsersByTeam } from "@/services/team.service";
import { UserDTO } from "@/types/user";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTaskById } from "@/services/task.service";
import { TaskDTO } from "@/types/task";
import { getCurrentUser, User } from "@/services/auth.service";
import {
  assignTask,
  getUsersAssignedToTask,
} from "@/services/taskAssignment.service";
import {
  getSubmissionsByTask,
  submitTaskDelivery,
} from "@/services/submission.service";
import { ArrowLeft } from "lucide-react";

import { useProjectData } from "@/hooks/useProjectData";
import { SubmissionResponseDTO } from "@/types/submission";

import { getFeedbacksBySubmission } from "@/services/feedbackService";
import CreateFeedbackModal from "@/components/frames/modals/CreateFeedbackModal";
import { FeedbackDTO } from "@/types/feedback";

export default function TaskView() {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState<TaskDTO | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliveryText, setDeliveryText] = useState("");
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);

  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);

  const [feedbacks, setFeedbacks] = useState<Record<number, FeedbackDTO[]>>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    number | null
  >(null);

  const projectId = task?.projectId ?? null;
  const {
    team,
    user: projectUser,
    isLoading: projectLoading,
  } = useProjectData(projectId ?? 0);

  const fetchAssignedUsers = async (taskId: number): Promise<UserDTO[]> => {
    const assignedUsers = await getUsersAssignedToTask(taskId);

    return assignedUsers;
  };

  const fetchAvailableUsers = async (): Promise<UserDTO[]> => {
    if (!team?.id) return [];
    try {
      const members = await getUsersByTeam(team.id);
      return members.map((member) => member.user); // Solo retornamos el objeto UserDTO
    } catch (error) {
      console.error("Error al obtener miembros del equipo:", error);
      return [];
    }
  };

  const handleAddUser = async (taskId: number, userId: number) => {
    await assignTask({
      taskId,
      assignedType: "USER",
      assignedId: userId,
    });
  };

  const handleRemoveUser = async (_taskId: number, _userId: number) => {};

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    setIsLoading(true);
    Promise.all([getTaskById(Number(id)), getCurrentUser()])
      .then(([taskData, currentUser]) => {
        setTask(taskData);
        setUser(currentUser);
        setError(null);
      })
      .catch(() => setError("Error cargando la tarea"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const isCreator = user && task && user.id === task.createdById;
  const isTeacher = user?.role === "TEACHER";

  const [submissions, setSubmissions] = useState<SubmissionResponseDTO[]>([]);

  useEffect(() => {
    if (task?.id) {
      getSubmissionsByTask(task.id)
        .then(setSubmissions)
        .catch((err) => console.error("Error al cargar entregas:", err));
    }
  }, [task?.id, isTeacher]);

  const canDeliver = !isTeacher;

  const handleSubmitDelivery = async () => {
    if (!deliveryText) return alert("Escribe algo para entregar");
    if (!task || !user) return alert("Tarea o usuario no definidos");

    setIsSubmittingDelivery(true);
    try {
      await submitTaskDelivery({
        content: deliveryText,
        fileUrl: null,
        taskId: task.id,
        userId: user.id,
      });
      alert("Entrega realizada con éxito");
      setDeliveryText("");
    } catch (error) {
      console.error(error);
      alert("Error al enviar la entrega");
    } finally {
      setIsSubmittingDelivery(false);
    }
  };
  useEffect(() => {
    if (!isTeacher && submissions.length === 0) return;
    const fetchAllFeedbacks = async () => {
      const feedbackMap: Record<number, FeedbackDTO[]> = {};
      for (const sub of submissions) {
        const fb = await getFeedbacksBySubmission(sub.submissionId);
        feedbackMap[sub.submissionId] = fb;
      }
      setFeedbacks(feedbackMap);
    };
    if (submissions.length > 0) fetchAllFeedbacks();
  }, [submissions, isTeacher]);

  // Función para abrir modal
  const handleOpenFeedbackModal = (submissionId: number) => {
    setSelectedSubmissionId(submissionId);
    setShowFeedbackModal(true);
  };

  // Badge component (puedes moverlo a otro archivo si lo deseas)
  const StatusBadge = ({ status }: { status: string }) => {
    let color = "bg-gray-300 text-gray-800";
    let label = status;

    // Traducción y color
    switch (status) {
      case "PENDING":
        color = "bg-yellow-100 text-yellow-700 border border-yellow-400";
        label = "Pendiente";
        break;
      case "IN_PROGRESS":
        color = "bg-blue-100 text-blue-700 border border-blue-400";
        label = "En progreso";
        break;
      case "COMPLETED":
        color = "bg-green-100 text-green-700 border border-green-400";
        label = "Completada";
        break;
      case "REVIEWED":
        color = "bg-purple-100 text-purple-700 border border-purple-400";
        label = "Revisada";
        break;
      default:
        label = status;
    }

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        {label}
      </span>
    );
  };

  // Función para agregar feedback localmente tras crear
  const handleFeedbackCreated = (feedback: FeedbackDTO) => {
    setFeedbacks((prev) => ({
      ...prev,
      [feedback.submissionId]: [
        ...(prev[feedback.submissionId] || []),
        feedback,
      ],
    }));
  };

  const [openFeedback, setOpenFeedback] = useState<Record<number, boolean>>({});

  if (isLoading || projectLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-secondary">Cargando tarea...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (!task)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-secondary">No se encontró la tarea</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-secondary">
          Debe iniciar sesión para ver esta tarea
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-primary hover:underline mb-4"
      >
        <ArrowLeft size={18} /> Volver
      </button>

      <h1 className="text-3xl font-bold text-primary mb-2">{task.name}</h1>
      <p className="text-gray-500 mb-4">{task.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <span className="font-semibold text-third">Fecha de entrega:</span>{" "}
          <span className="text-gray-700">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="font-semibold text-third">Estado:</span>{" "}
          {!isTeacher && submissions.some((s) => s.userId === user?.id) ? (
            <StatusBadge status="COMPLETED" />
          ) : (
            <StatusBadge status={task.status} />
          )}
        </div>
        <div>
          <span className="font-semibold text-third">Prioridad:</span>{" "}
          <span className="text-gray-700">{task.priority}</span>
        </div>
      </div>

      {/* Entrega visible solo si NO es profesor */}
      {canDeliver && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-primary mb-2">
            Realizar entrega
          </h2>
          <textarea
            rows={5}
            value={deliveryText}
            onChange={(e) => setDeliveryText(e.target.value)}
            placeholder="Describe tu entrega..."
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            onClick={handleSubmitDelivery}
            disabled={isSubmittingDelivery}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition disabled:opacity-60"
          >
            {isSubmittingDelivery ? "Enviando..." : "Enviar entrega"}
          </button>
        </div>
      )}

      {/* Asignación solo visible si soy el creador y hay un team */}
      {/* Panel de asignación de usuarios SOLO para TEACHER y si hay grupo */}
      {isTeacher && (
        <div className="mt-8">
          <button
            onClick={() => setShowAssignmentPanel((prev) => !prev)}
            className="mb-4 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition hover:cursor-pointer"
          >
            {showAssignmentPanel
              ? "Ocultar asignaciones"
              : "Mostrar asignaciones"}
          </button>

          {showAssignmentPanel && team ? (
            <UserAssignmentPanel
              entityId={task.id}
              fetchAssignedUsers={fetchAssignedUsers}
              fetchAvailableUsers={fetchAvailableUsers}
              onAddUser={handleAddUser}
              onRemoveUser={handleRemoveUser}
              title="Asignación de usuarios a la tarea"
            />
          ) : showAssignmentPanel && !team ? (
            <div className="p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-800 mt-4">
              No hay grupo asignado al proyecto para realizar asignaciones de
              usuarios.
            </div>
          ) : null}
        </div>
      )}

      {
        <div className="mt-8">
          <h2 className="text-xl font-bold text-primary mb-4">
            Entregas de estudiantes
          </h2>

          {submissions.length === 0 ? (
            <p className="text-gray-500">No se ha realizado ninguna entrega.</p>
          ) : (
            <ul className="space-y-4">
              {submissions.map((sub) => {
                const subFeedbacks = feedbacks[sub.submissionId] || [];
                const isOpen = openFeedback[sub.submissionId] || false;
                return (
                  <li
                    key={sub.submissionId}
                    className="border p-4 rounded-md bg-gray-50"
                  >
                    <p className="text-sm text-gray-600">
                      Entregado el {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                    <p className="text-black mt-2 whitespace-pre-line">
                      {sub.content}
                    </p>
                    {sub.fileUrl && (
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mt-2 block"
                      >
                        Ver archivo adjunto
                      </a>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Estudiante: {sub.userName}
                    </p>
                    <div className="mt-3 flex gap-2">
                      {subFeedbacks.length > 0 ? (
                        <button
                          className="px-3 py-1 rounded bg-secondary text-white hover:bg-secondary/90 text-sm hover:cursor-pointer"
                          onClick={() =>
                            setOpenFeedback((prev) => ({
                              ...prev,
                              [sub.submissionId]: !isOpen,
                            }))
                          }
                        >
                          {isOpen
                            ? "Ocultar retroalimentación"
                            : "Ver retroalimentación"}
                        </button>
                      ) : (
                        isTeacher && (
                          <button
                            className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 text-sm hover:cursor-pointer"
                            onClick={() =>
                              handleOpenFeedbackModal(sub.submissionId)
                            }
                          >
                            Agregar retroalimentación
                          </button>
                        )
                      )}
                    </div>
                    {/* Mostrar retroalimentación en HTML */}
                    {isOpen && subFeedbacks.length > 0 && (
                      <div className="mt-4 bg-white border border-primary/20 rounded p-3">
                        <h4 className="font-semibold text-primary mb-2">
                          Retroalimentación:
                        </h4>
                        {subFeedbacks.map((fb) => (
                          <div
                            key={fb.id}
                            className="mb-2 p-2 rounded bg-gray-100 border"
                          >
                            <div className="text-gray-800">
                              <span className="font-medium">Comentario:</span>{" "}
                              {fb.comment}
                            </div>
                            <div className="text-gray-700">
                              <span className="font-medium">Calificación:</span>{" "}
                              {fb.rating}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Modal para crear feedback */}
          {showFeedbackModal && selectedSubmissionId && user && (
            <CreateFeedbackModal
              submissionId={selectedSubmissionId}
              createdById={user.id}
              onClose={() => setShowFeedbackModal(false)}
              onFeedbackCreated={handleFeedbackCreated}
            />
          )}
        </div>
      }
    </div>
  );
}
