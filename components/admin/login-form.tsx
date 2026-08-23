"use client";

import { useState, type FormEvent } from "react";
import { readApiError } from "@/components/admin/session";

type LoginFormProps = {
  onSuccess: (password: string) => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError(await readApiError(response, "No se pudo iniciar sesión"));
        return;
      }

      onSuccess(password);
    } catch {
      setError("Error de red. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-serif italic text-2xl text-center mb-2">
          Martín Villegas
        </p>
        <h1 className="font-serif text-3xl font-bold text-center mb-8">
          Administración
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="admin-password" className="block text-sm font-serif">
            Contraseña
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoFocus
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground"
            placeholder="Introduce la contraseña"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-foreground text-background font-serif text-sm rounded-full hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Comprobando..." : "Entrar"}
          </button>
          {error ? (
            <p className="text-sm text-red-600 text-center" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
