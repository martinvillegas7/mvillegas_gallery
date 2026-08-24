"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  canonicalTag,
  parseTags,
  tagKey,
  type GalleryImage,
} from "@/lib/gallery-types";

type TagsEditorProps = {
  image: GalleryImage;
  suggestedTags: string[];
  onChange: (tags: string[]) => void;
  onClose: () => void;
};

export default function TagsEditor({
  image,
  suggestedTags,
  onChange,
  onClose,
}: TagsEditorProps) {
  const [draft, setDraft] = useState("");
  const tags = image.tags;

  const unusedSuggestions = useMemo(() => {
    const used = new Set(tags.map(tagKey));
    return suggestedTags.filter((tag) => !used.has(tagKey(tag)));
  }, [suggestedTags, tags]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const addTag = (value: string) => {
    const next = canonicalTag(value, [...suggestedTags, ...tags]);
    if (!next) {
      return;
    }
    onChange(parseTags([...tags, next]));
    setDraft("");
  };

  const removeTag = (value: string) => {
    const key = tagKey(value);
    onChange(tags.filter((tag) => tagKey(tag) !== key));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    addTag(draft);
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Etiquetas de la fotografía"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg p-5 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold">Etiquetas</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Úsalas para filtrar la galería (por ejemplo Aves, Flora, Mar).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="aspect-[3/4] max-h-48 rounded-xl overflow-hidden bg-muted mb-4">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Nueva etiqueta"
            maxLength={40}
            className="flex-1 rounded-full border border-border px-4 py-2 text-sm outline-none focus:border-foreground"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-foreground text-background text-sm rounded-full hover:opacity-85 cursor-pointer"
          >
            Añadir
          </button>
        </form>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tagKey(tag)}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={`Quitar ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Esta foto aún no tiene etiquetas. Sin ellas solo aparece en Todos.
          </p>
        )}

        {unusedSuggestions.length > 0 ? (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Ya usadas en esta categoría
            </p>
            <div className="flex flex-wrap gap-2">
              {unusedSuggestions.map((tag) => (
                <button
                  key={tagKey(tag)}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:border-foreground cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full px-4 py-2.5 bg-foreground text-background font-serif text-sm rounded-full hover:opacity-85 cursor-pointer"
        >
          Listo
        </button>
      </div>
    </div>
  );
}
