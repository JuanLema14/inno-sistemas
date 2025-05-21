"use client";

import { useEffect, useState } from "react";
import { getProjectsByUserId, ProjectDTO } from "@/services/project.service";
import { getCurrentUser, User } from "@/services/auth.service";
import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";
import CreateProjectModal from "@/components/frames/modals/CreateProjectModal";
import { useRouter } from "next/navigation";

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const projectsData = await getProjectsByUserId(currentUser.id);
        setProjects(projectsData);
      } catch {
        setError("Error al cargar los datos. Por favor, inicia sesión.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white border border-border/30 rounded-2xl shadow-md p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Mis proyectos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          + Crear proyecto
        </button>
      </div>

      {loading && <p className="text-secondary mb-4">Cargando proyectos...</p>}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="text-third mb-4 text-center">
          No tienes proyectos aún.
        </div>
      )}

      {isModalOpen && user && (
        <CreateProjectModal
          userId={user.id}
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={(newProject) => {
            setProjects((prev) => [newProject, ...prev]);
            setIsModalOpen(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => router.push(`dashboard/${project.id}`)}
            className="bg-gray-100 border border-border/30 rounded-2xl hover:bg-gray-200 hover:cursor-pointer p-5"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-primary">
                {project.name}
              </h2>
                <span
                className={`text-sm px-2 py-1 rounded-full ${
                  project.status === "IN_PROGRESS"
                  ? "bg-teal-500 text-teal-600 font-bold"
                  : project.status === "COMPLETED"
                  ? "bg-secondary text-primary font-bold"
                  : project.status === "CANCELLED"
                  ? "bg-red-400 text-red-900 font-bold"
                  : "bg-gray-200 text-gray-800"
                }`}
                >
                {project.status === "IN_PROGRESS"
                  ? "En progreso"
                  : project.status === "COMPLETED"
                  ? "Completado"
                  : project.status === "CANCELLED"
                  ? "Cancelado"
                  : project.status}
                </span>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-3 text-gray-400">
              {project.description}
            </p>
            <div className="text-xs text-muted-foreground text-secondary">
              <p>Inicio: {project.startDate}</p>
              <p>Fin: {project.endDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
