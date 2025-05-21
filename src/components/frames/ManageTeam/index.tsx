"use client";

import { useEffect, useState } from "react";
import {
  getUsersByTeam,
  addUserToTeam,
  removeUserFromTeam,
} from "@/services/team.service";
import { getAllUsers } from "@/services/user.service";
import { UserDTO } from "@/types/user";

interface ManageTeamProps {
  teamId: number;
}

export default function ManageTeam({ teamId }: ManageTeamProps) {
  const [teamUsers, setTeamUsers] = useState<UserDTO[]>([]);
  const [allUsers, setAllUsers] = useState<UserDTO[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentTeamUsers = await getUsersByTeam(teamId);
        const usersAll = await getAllUsers();

        const usersInTeam = currentTeamUsers.map((ut) => ut.user);

        setTeamUsers(usersInTeam);
        setAllUsers(usersAll);
        setFilteredUsers(usersAll);

        setTeamUsers(usersInTeam);
        setAllUsers(usersAll);
        setFilteredUsers(usersAll);
      } catch {
        setError("Error cargando usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredUsers(
      allUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(lowerSearch) ||
          (user.name && user.name.toLowerCase().includes(lowerSearch))
      )
    );
  }, [search, allUsers]);

  const refreshTeamUsers = async () => {
    const currentTeamUsers = await getUsersByTeam(teamId);
    const usersInTeam = currentTeamUsers.map((ut) => ut.user);

    setTeamUsers(usersInTeam);
  };

  const handleAddUser = async (userId: number) => {
    try {
      await addUserToTeam(teamId, userId);
      await refreshTeamUsers();
      setError(null);
    } catch {
      setError("Error agregando usuario al equipo");
    }
  };

  const handleRemoveUser = async (userId: number) => {
    try {
      await removeUserFromTeam(teamId, userId);
      await refreshTeamUsers();
      setError(null);
    } catch {
      setError("Error eliminando usuario del equipo");
    }
  };

  return (
    <div className="mt-8 p-6 border rounded-md bg-white shadow-md text-gray-800">
      <h3 className="text-xl font-bold mb-4">Gestión del Equipo</h3>

      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}

      <div className="mb-6">
        <label htmlFor="search" className="block mb-2 font-medium">
          Buscar usuario por email o nombre
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe un email o nombre..."
        />
      </div>

      <div className="mb-8 max-h-60 overflow-y-auto border rounded-md bg-gray-50 p-3">
        <p className="mb-3 font-semibold text-gray-700">
          Usuarios disponibles:
        </p>
        {loading ? (
          <p className="text-sm text-gray-500">Cargando usuarios...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No se encontraron usuarios</p>
        ) : (
          filteredUsers.map((user) => {
            const isInTeam = teamUsers.some((u) => u.id === user.id);
            return (
              <div
                key={user.id}
                className="flex justify-between items-center mb-2 p-2 bg-white rounded hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium">{user.name || "Sin nombre"}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  disabled={isInTeam}
                  onClick={() => handleAddUser(user.id)}
                  className={`px-3 py-1 text-sm rounded font-semibold transition hover:cursor-pointer ${
                    isInTeam
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isInTeam ? "Agregado" : "Agregar"}
                </button>
              </div>
            );
          })
        )}
      </div>

      <div>
        <p className="mb-3 font-semibold text-gray-700">
          Usuarios en el equipo:
        </p>
        {teamUsers.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay usuarios en este equipo
          </p>
        ) : (
          teamUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
            >
              <div>
                <p className="font-medium">{user.name || "Sin nombre"}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
