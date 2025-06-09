import { useState } from "react";
import { createFeedback } from "@/services/feedbackService";
import { FeedbackDTO } from "@/types/feedback";

interface Props {
  submissionId: number;
  createdById: number;
  onClose: () => void;
  onFeedbackCreated: (feedback: FeedbackDTO) => void;
}

export default function CreateFeedbackModal({
  submissionId,
  createdById,
  onClose,
  onFeedbackCreated,
}: Props) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const feedback = await createFeedback({
        comment,
        rating,
        createdById,
        submissionId,
      });
      onFeedbackCreated(feedback);
      onClose();
    } catch {
      alert("Error al crear retroalimentación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-primary p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agregar Retroalimentación</h2>

        <label className="block mb-1 font-medium text-gray-700">
          Comentario
        </label>
        <textarea
          className="w-full mb-3 p-2 rounded bg-darkest text-gray-700 placeholder:text-gray-400 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
          rows={4}
          placeholder="Escribe tu comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <label className="block mb-1 font-medium text-gray-700">
          Calificación
        </label>
        <input
          type="number"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full mb-4 p-2 rounded bg-darkest text-gray-700 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-third hover:text-secondary hover:cursor-pointer transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 hover:cursor-pointer transition"
            disabled={loading || !comment.trim()}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}