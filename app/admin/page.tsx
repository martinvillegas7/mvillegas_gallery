"use client";

import { useEffect, useState } from "react";
import AdminPanel from "@/components/admin/admin-panel";
import {
  clearAdminPassword,
  getStoredAdminPassword,
} from "@/components/admin/session";

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const stored = getStoredAdminPassword();
    if (!stored) {
      setReady(true);
      return;
    }

    const validate = async () => {
      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: stored }),
        });
        if (response.ok) {
          setAuthenticated(true);
        } else {
          clearAdminPassword();
        }
      } catch {
        clearAdminPassword();
      } finally {
        setReady(true);
      }
    };

    void validate();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return <AdminPanel initiallyAuthenticated={authenticated} />;
}
