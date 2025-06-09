"use client";

import { useEffect, useState } from "react";
import { UserDTO } from "@/types/user";

interface UserAssignmentPanelProps {
  entityId: number;
  fetchAssignedUsers: (entityId: number) => Promise<UserDTO[]>;
  fetchAvailableUsers: () => Promise<UserDTO[]>;
  onAddUser: (entityId: number, userId: number) => Promise<void>;
  onRemoveUser: (entityId: number, userId: number) => Promise<void>;
  title?: string;
}

export default function UserAssignmentPanel({
  entityId,
  fetchAssignedUsers,
  fetchAvailableUsers,
  onAddUser,
  onRemoveUser,
  title = "Gestión de Asignación de Usuarios",
}: UserAssignmentPanelProps) {
  const [assignedUsers, setAssignedUsers] = useState<UserDTO[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserDTO[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assigned, available] = await Promise.all([
        fetchAssignedUsers(entityId),
        fetchAvailableUsers(),
      ]);

      setAssignedUsers(assigned);
      setAvailableUsers(available);
      setFilteredUsers(available);
    } catch {
      setError("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) fetchData();
  }, [entityId]);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredUsers(
      availableUsers.filter(
        (u) =>
          u.email.toLowerCase().includes(lower) ||
          (u.name && u.name.toLowerCase().includes(lower))
      )
    );
  }, [search, availableUsers]);

  const refreshAssigned = async () => {
    const assigned = await fetchAssignedUsers(entityId);
    setAssignedUsers(assigned);
  };

  const handleAdd = async (userId: number) => {
    try {
      await onAddUser(entityId, userId);
      await refreshAssigned();
      setError(null);
    } catch {
      setError("Error asignando usuario");
    }
  };

  const handleRemove = async (userId: number) => {
    try {
      await onRemoveUser(entityId, userId);
      await refreshAssigned();
      setError(null);
    } catch {
      setError("Error removiendo usuario");
    }
  };

  return (
    <div className="mt-8 p-6 border rounded-md bg-white shadow-md text-gray-800">
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}

      <div className="mb-6">
        <label htmlFor="search" className="block mb-2 font-medium">
          Buscar usuario
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar por nombre o email..."
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
            const alreadyAssigned = assignedUsers.some((u) => u.userId === user.userId);
            return (
              <div
                key={user.userId}
                className="flex justify-between items-center mb-2 p-2 bg-white rounded hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium">{user.name || "Sin nombre"}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  disabled={alreadyAssigned || user.userId === undefined}
                  onClick={() => {
                    if (user.userId !== undefined) handleAdd(user.userId);
                  }}
                  className={`px-3 py-1 text-sm rounded font-semibold transition ${
                    alreadyAssigned
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {alreadyAssigned ? "Asignado" : "Asignar"}
                </button>
              </div>
            );
          })
        )}
      </div>

      <div>
        <p className="mb-3 font-semibold text-gray-700">Usuarios asignados:</p>
        {assignedUsers.length === 0 ? (
          <p className="text-sm text-gray-500">Ningún usuario asignado</p>
        ) : (
          assignedUsers.map((user) => (
            <div
              key={user.userId}
              className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
            >
              <div>
                <p className="font-medium">{user.name || "Sin nombre"}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                disabled={user.userId === undefined}
                onClick={() => {
                  if (user.userId !== undefined) handleRemove(user.userId);
                }}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Quitar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
