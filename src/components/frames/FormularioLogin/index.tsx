"use client";

import { useState } from "react";
import { login } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/items/LoadSpinner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });

      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email,
          dni: response.dni,
          role: response.role,
          status: response.status,
        })
      );

      router.push("/main");
    } catch (err) {
      setError("Credenciales inválidas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo y "sistemas" */}
      <div className="flex items-center justify-center mb-8 gap-3">
        <img src="/img/logo.png" alt="Logo" className="h-12 w-auto" />
        <span className="font-bold text-2xl text-primary">sistemas</span>
      </div>

      <div className="bg-white rounded-2xl p-8">
        <h1 className="text-primary font-bold text-3xl mb-2 text-center">
          Bienvenido de vuelta
        </h1>
        <p className="text-center mb-8 font-semibold text-gray-700">
          Iniciar sesión
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-primary text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center
              ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#5597F8] hover:cursor-pointer"
              }
            `}
          >
            {loading && <LoadingSpinner size={20} color="text-white mr-2" />}
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-third mt-6 cursor-pointer hover:underline select-none">
          ¿Olvidó su contraseña?
        </p>
      </div>
    </div>
  );
}
