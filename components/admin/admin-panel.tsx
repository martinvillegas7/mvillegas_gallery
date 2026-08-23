"use client";

import { useState } from "react";
import LoginForm from "@/components/admin/login-form";
import PhotosTab from "@/components/admin/photos-tab";
import TextsTab from "@/components/admin/texts-tab";
import {
  clearAdminPassword,
  storeAdminPassword,
} from "@/components/admin/session";

type Tab = "fotos" | "textos";

type AdminPanelProps = {
  initiallyAuthenticated: boolean;
};

export default function AdminPanel({
  initiallyAuthenticated,
}: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [tab, setTab] = useState<Tab>("fotos");

  if (!authenticated) {
    return (
      <LoginForm
        onSuccess={(password) => {
          storeAdminPassword(password);
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-white">
      <header className="border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <p className="font-serif italic text-xl">Martín Villegas · Admin</p>
          <button
            type="button"
            onClick={() => {
              clearAdminPassword();
              setAuthenticated(false);
            }}
            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-6 border-b border-border mb-8">
          <button
            type="button"
            onClick={() => setTab("fotos")}
            className={`pb-3 text-sm tracking-wide cursor-pointer border-b ${
              tab === "fotos"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Fotos
          </button>
          <button
            type="button"
            onClick={() => setTab("textos")}
            className={`pb-3 text-sm tracking-wide cursor-pointer border-b ${
              tab === "textos"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Textos
          </button>
        </div>

        {tab === "fotos" ? <PhotosTab /> : <TextsTab />}
      </main>
    </div>
  );
}
