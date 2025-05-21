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

export default function HomeContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-accent p-6 rounded-xl text-white shadow-md">
        <h2 className="text-lg font-semibold text-secondary">Bienvenido</h2>
        <p className="text-sm text-secondary mt-1">Esta es tu vista principal.</p>
      </div>
      <div className="bg-secondary p-6 rounded-xl shadow-md text-white">
        <h2 className="text-lg font-semibold">Notificaciones</h2>
        <p className="text-sm mt-1">Tienes 2 nuevas notificaciones.</p>
      </div>
      <div className="bg-primary p-6 rounded-xl shadow-md text-white">
        <h2 className="text-lg font-semibold">Actividades recientes</h2>
        <ul className="text-sm list-disc ml-5 mt-1">
          <li>Actualizaste tu perfil</li>
          <li>Revisaste una notificación</li>
        </ul>
      </div>
    </div>
  );
}
