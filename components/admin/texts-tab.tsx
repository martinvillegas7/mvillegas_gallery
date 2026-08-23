"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminFetch, readApiError } from "@/components/admin/session";
import type { ExtraSocial, SiteContent } from "@/lib/site-content-types";

const EMPTY_CONTENT: SiteContent = {
  hero: { title: "", subtitle: "" },
  about: { text: "" },
  contact: { email: "", instagram: "", extraSocials: [] },
};

export default function TextsTab() {
  const [content, setContent] = useState<SiteContent>(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/site-content", { cache: "no-store" });
        if (!response.ok) {
          setError(
            await readApiError(response, "No se pudo cargar el contenido")
          );
          return;
        }
        const data = (await response.json()) as SiteContent;
        setContent(data);
      } catch {
        setError("Error de red al cargar los textos.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const updateExtraSocial = (
    index: number,
    field: keyof ExtraSocial,
    value: string
  ) => {
    setContent((current) => ({
      ...current,
      contact: {
        ...current.contact,
        extraSocials: current.contact.extraSocials.map((social, i) =>
          i === index ? { ...social, [field]: value } : social
        ),
      },
    }));
  };

  const addExtraSocial = () => {
    setContent((current) => ({
      ...current,
      contact: {
        ...current.contact,
        extraSocials: [
          ...current.contact.extraSocials,
          { name: "", url: "" },
        ],
      },
    }));
  };

  const removeExtraSocial = (index: number) => {
    setContent((current) => ({
      ...current,
      contact: {
        ...current.contact,
        extraSocials: current.contact.extraSocials.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: SiteContent = {
        ...content,
        contact: {
          ...content.contact,
          extraSocials: content.contact.extraSocials.filter(
            (social) => social.name.trim() && social.url.trim()
          ),
        },
      };

      const response = await adminFetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError(await readApiError(response, "No se pudieron guardar los textos"));
        return;
      }

      const saved = (await response.json()) as SiteContent;
      setContent(saved);
      setSuccess("Textos guardados correctamente.");
    } catch {
      setError("Error de red al guardar. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Cargando textos...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold">Hero</h2>
        <div>
          <label htmlFor="hero-title" className="block text-sm font-serif mb-2">
            Título
          </label>
          <input
            id="hero-title"
            type="text"
            value={content.hero.title}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero: { ...current.hero, title: event.target.value },
              }))
            }
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label htmlFor="hero-subtitle" className="block text-sm font-serif mb-2">
            Subtítulo
          </label>
          <textarea
            id="hero-subtitle"
            rows={3}
            value={content.hero.subtitle}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                hero: { ...current.hero, subtitle: event.target.value },
              }))
            }
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground resize-y"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold">Sobre mí</h2>
        <div>
          <label htmlFor="about-text" className="block text-sm font-serif mb-2">
            Texto
          </label>
          <textarea
            id="about-text"
            rows={10}
            value={content.about.text}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                about: { text: event.target.value },
              }))
            }
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground resize-y"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Separa los párrafos con una línea en blanco.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold">Contacto</h2>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-serif mb-2">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={content.contact.email}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                contact: { ...current.contact, email: event.target.value },
              }))
            }
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label
            htmlFor="contact-instagram"
            className="block text-sm font-serif mb-2"
          >
            Instagram
          </label>
          <input
            id="contact-instagram"
            type="text"
            value={content.contact.instagram}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                contact: { ...current.contact, instagram: event.target.value },
              }))
            }
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground"
            placeholder="usuario (sin @)"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-serif">Otras redes</p>
          {content.contact.extraSocials.map((social, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={social.name}
                onChange={(event) =>
                  updateExtraSocial(index, "name", event.target.value)
                }
                placeholder="Nombre (p. ej. YouTube)"
                className="sm:w-40 px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground"
              />
              <input
                type="url"
                value={social.url}
                onChange={(event) =>
                  updateExtraSocial(index, "url", event.target.value)
                }
                placeholder="https://..."
                className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-foreground"
              />
              <button
                type="button"
                onClick={() => removeExtraSocial(index)}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExtraSocial}
            className="text-sm border border-border rounded-full px-4 py-2 hover:border-foreground cursor-pointer"
          >
            Añadir otra red
          </button>
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={saving}
          className="px-10 py-3 bg-foreground text-background font-serif text-sm rounded-full hover:opacity-85 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Guardando..." : "Guardar textos"}
        </button>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-green-700">{success}</p>
        ) : null}
      </div>
    </form>
  );
}
