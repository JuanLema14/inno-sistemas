import { useState } from "react";
import { createProject, ProjectDTO } from "@/services/project.service";

interface CreateProjectModalProps {
  userId: number;
  onClose: () => void;
  onProjectCreated: (project: ProjectDTO) => void;
}

export default function CreateProjectModal({
  userId,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreate = async () => {
    try {
      const project: ProjectDTO = {
        name,
        description,
        startDate,
        endDate,
        status: "IN_PROGRESS",
        createdById: userId,
      };

      const newProject = await createProject(project);
      onProjectCreated(newProject);
      onClose();
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-primary p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Proyecto</h2>

        <input
          type="text"
          placeholder="Nombre"
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

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-darkest text-gray-400 border border-border"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-darkest text-gray-400 border border-border"
        />

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
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}
