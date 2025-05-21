import { useState } from "react";
import { createTeam, TeamDTO } from "@/services/team.service";

interface CreateTeamModalProps {
  projectId: number;
  userId: number;
  onClose: () => void;
  onTeamCreated: (team: TeamDTO) => void;
}

export default function CreateTeamModal({
  projectId,
  userId,
  onClose,
  onTeamCreated,
}: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      const newTeam = await createTeam({
        name,
        description,
        projectId,
        leaderId: userId,
      });

      onTeamCreated(newTeam);
      onClose();
    } catch (error) {
      console.error("Error al crear el equipo:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-primary p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Equipo</h2>

        <input
          type="text"
          placeholder="Nombre del equipo"
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
            Crear Equipo
          </button>
        </div>
      </div>
    </div>
  );
}
