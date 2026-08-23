"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Trash2, Upload } from "lucide-react";
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_LABELS,
  type GalleryCategory,
} from "@/lib/categories";
import { parseGalleryImages, type GalleryImage } from "@/lib/gallery-types";
import { adminFetch, readApiError } from "@/components/admin/session";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type UploadStatus = {
  id: string;
  name: string;
  state: "compressing" | "uploading" | "done" | "error";
  message?: string;
};

export default function PhotosTab() {
  const [category, setCategory] = useState<GalleryCategory>("naturaleza");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statuses, setStatuses] = useState<UploadStatus[]>([]);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async (selected: GalleryCategory) => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch(`/api/images?category=${selected}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        setLoadError(
          await readApiError(response, "No se pudieron cargar las fotos")
        );
        setImages([]);
        return;
      }

      const data: unknown = await response.json();
      setImages(parseGalleryImages(data));
    } catch {
      setLoadError("Error de red al cargar las fotos de esta categoría.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImages(category);
  }, [category, loadImages]);

  const updateStatus = (id: string, patch: Partial<UploadStatus>) => {
    setStatuses((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((file) => {
      return (
        ACCEPTED_TYPES.includes(file.type) ||
        /\.(jpe?g|png|webp)$/i.test(file.name)
      );
    });

    if (files.length === 0) {
      setStatuses([
        {
          id: "invalid",
          name: "archivos",
          state: "error",
          message: "No se encontraron imágenes válidas (JPG, PNG o WebP).",
        },
      ]);
      return;
    }

    setUploading(true);
    setStatuses(
      files.map((file, index) => ({
        id: `${index}-${file.name}`,
        name: file.name,
        state: "compressing",
      }))
    );

    for (const [index, file] of files.entries()) {
      const id = `${index}-${file.name}`;
      try {
        updateStatus(id, { state: "compressing" });
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 2000,
          fileType: "image/jpeg",
          useWebWorker: true,
          initialQuality: 0.8,
        });

        updateStatus(id, { state: "uploading" });
        const formData = new FormData();
        formData.append(
          "file",
          compressed,
          file.name.replace(/\.[^.]+$/, ".jpg")
        );
        formData.append("category", category);
        formData.append("originalName", file.name);

        const response = await adminFetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          updateStatus(id, {
            state: "error",
            message: await readApiError(response, "Error al subir la imagen"),
          });
          continue;
        }

        updateStatus(id, { state: "done" });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al comprimir o subir la imagen";
        updateStatus(id, { state: "error", message });
      }
    }

    setUploading(false);
    await loadImages(category);
  };

  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(
      `¿Eliminar «${image.alt}»? Esta acción no se puede deshacer.`
    );
    if (!confirmed) {
      return;
    }

    setDeletingUrl(image.url);
    try {
      const response = await adminFetch("/api/images/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: image.url, pathname: image.pathname }),
      });

      if (!response.ok) {
        window.alert(await readApiError(response, "No se pudo eliminar la foto"));
        return;
      }

      await loadImages(category);
    } catch {
      window.alert("Error de red al eliminar la foto.");
    } finally {
      setDeletingUrl(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Categoría</p>
        <div className="flex flex-wrap gap-2">
          {GALLERY_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`px-5 py-2 rounded-full text-sm border transition-colors cursor-pointer ${
                category === item
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              }`}
            >
              {GALLERY_CATEGORY_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (event.dataTransfer.files.length > 0) {
            void processFiles(event.dataTransfer.files);
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-2xl px-6 py-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-foreground bg-secondary"
            : "border-border hover:border-foreground"
        } ${uploading ? "pointer-events-none opacity-70" : ""}`}
      >
        <Upload className="mx-auto mb-3 text-muted-foreground" size={28} />
        <p className="font-serif text-lg mb-1">
          Arrastra fotos aquí o haz clic para seleccionar
        </p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Se comprimen en el navegador (~500 KB, máx. 2000 px, JPEG) antes de
          subirlas. Usa nombres descriptivos (por ejemplo{" "}
          <span className="italic">aguila-real.jpg</span>) porque de ahí sale el
          texto alternativo SEO.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              void processFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </div>

      {statuses.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {statuses.map((status) => (
            <li key={status.id}>
              {status.state === "compressing" && (
                <span className="text-muted-foreground">
                  Comprimiendo {status.name}...
                </span>
              )}
              {status.state === "uploading" && (
                <span className="text-muted-foreground">
                  Subiendo {status.name}...
                </span>
              )}
              {status.state === "done" && (
                <span className="text-green-700">Subida: {status.name}</span>
              )}
              {status.state === "error" && (
                <span className="text-red-600" role="alert">
                  {status.name}: {status.message ?? "Error"}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <div>
        <h2 className="font-serif text-xl font-bold mb-4">
          Fotos actuales · {GALLERY_CATEGORY_LABELS[category]}
        </h2>
        {loading ? (
          <p className="text-muted-foreground">Cargando fotos...</p>
        ) : loadError ? (
          <p className="text-red-600" role="alert">
            {loadError}
          </p>
        ) : images.length === 0 ? (
          <p className="text-muted-foreground">
            Todavía no hay fotos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image) => (
              <div
                key={image.url}
                className="relative group overflow-hidden rounded-xl bg-muted aspect-[3/4]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-2 flex items-center justify-between gap-2">
                  <p className="text-white text-xs truncate">{image.alt}</p>
                  <button
                    type="button"
                    onClick={() => void handleDelete(image)}
                    disabled={deletingUrl === image.url}
                    className="text-white hover:text-red-300 disabled:opacity-50 cursor-pointer"
                    aria-label={`Eliminar ${image.alt}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
