import { useState } from "react";
import { createTask } from "@/services/task.service";
import { TaskDTO } from "@/types/task";

// Definir tipos literales para status y priority
type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REVIEWED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface CreateTaskModalProps {
  projectId: number;
  createdById: number;
  onClose: () => void;
  onTaskCreated: (task: TaskDTO) => void;
}

export default function CreateTaskModal({
  projectId,
  createdById,
  onClose,
  onTaskCreated,
}: CreateTaskModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Inicializar con valores por defecto y tipo correcto
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const handleCreate = async () => {
    try {
      const dueDateFormatted = dueDate ? dueDate + "T00:00:00" : "";

      const newTask = await createTask({
        projectId,
        createdById,
        name,
        description,
        dueDate: dueDateFormatted,
        status,
        priority,
      });

      onTaskCreated(newTask);
      onClose();
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-primary p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nueva Tarea</h2>

        <input
          type="text"
          placeholder="Nombre de la tarea"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-darkest text-gray-400 placeholder:text-gray-400 border border-border"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-darkest text-gray-400 placeholder:text-gray-400 border border-border"
        />

        <label className="block mb-1 font-medium text-gray-700">
          Fecha límite
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-darkest text-gray-400 border border-border"
        />

        <label className="block mb-1 font-medium text-gray-700">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full mb-3 p-2 rounded bg-darkest text-gray-400 border border-border"
        >
          <option value="PENDING">Pendiente</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="COMPLETED">Completada</option>
          <option value="REVIEWED">Revisada</option>
        </select>

        <label className="block mb-1 font-medium text-gray-700">
          Prioridad
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="w-full mb-4 p-2 rounded bg-darkest text-gray-400 border border-border"
        >
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-third hover:text-secondary hover:cursor-pointer transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 hover:cursor-pointer transition"
            disabled={!name.trim()}
          >
            Crear Tarea
          </button>
        </div>
      </div>
    </div>
  );
}
