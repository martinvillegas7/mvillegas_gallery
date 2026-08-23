"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  ChevronLeft,
  ChevronRight,
  House,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_LABELS,
  type GalleryCategory,
} from "@/lib/categories";
import {
  MAX_HOME_IMAGES,
  parseGalleryImages,
  type GalleryImage,
} from "@/lib/gallery-types";
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
  const [actionError, setActionError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statuses, setStatuses] = useState<UploadStatus[]>([]);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
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

  const persistLayout = async (nextImages: GalleryImage[]) => {
    setSaving(true);
    setActionError("");
    setSaveMessage("");

    try {
      const response = await adminFetch("/api/images/layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          order: nextImages.map((image) => image.pathname),
          hero: nextImages.find((image) => image.isHero)?.pathname ?? null,
          home: nextImages
            .filter((image) => image.isHome)
            .sort((a, b) => (a.homeIndex ?? 0) - (b.homeIndex ?? 0))
            .map((image) => image.pathname),
        }),
      });

      if (!response.ok) {
        setActionError(
          await readApiError(response, "No se pudo guardar el orden")
        );
        await loadImages(category);
        return;
      }

      setSaveMessage("Cambios guardados.");
    } catch {
      setActionError("Error de red al guardar el orden.");
      await loadImages(category);
    } finally {
      setSaving(false);
    }
  };

  const applyImages = (nextImages: GalleryImage[]) => {
    setImages(nextImages);
    void persistLayout(nextImages);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) {
      return;
    }
    const next = [...images];
    const [item] = next.splice(index, 1);
    if (!item) {
      return;
    }
    next.splice(target, 0, item);
    applyImages(next);
  };

  const reorderTo = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= images.length || to >= images.length) {
      return;
    }
    const next = [...images];
    const [item] = next.splice(from, 1);
    if (!item) {
      return;
    }
    next.splice(to, 0, item);
    applyImages(next);
  };

  const toggleHero = (pathname: string) => {
    applyImages(
      images.map((image) => ({
        ...image,
        isHero: image.pathname === pathname ? !image.isHero : false,
      }))
    );
  };

  const toggleHome = (pathname: string) => {
    const current = images.find((image) => image.pathname === pathname);
    if (!current) {
      return;
    }

    if (!current.isHome) {
      const homeCount = images.filter((image) => image.isHome).length;
      if (homeCount >= MAX_HOME_IMAGES) {
        setActionError(
          `Solo puedes elegir ${MAX_HOME_IMAGES} fotos para Proyectos en el inicio. Quita una primero.`
        );
        return;
      }

      applyImages(
        images.map((image) =>
          image.pathname === pathname
            ? { ...image, isHome: true, homeIndex: homeCount }
            : image
        )
      );
      return;
    }

    applyImages(
      images
        .map((image) =>
          image.pathname === pathname
            ? { ...image, isHome: false, homeIndex: null }
            : image
        )
        .map((image) => {
          if (!image.isHome || image.homeIndex === null) {
            return image;
          }
          const removedIndex = current.homeIndex ?? 0;
          return {
            ...image,
            homeIndex:
              image.homeIndex > removedIndex
                ? image.homeIndex - 1
                : image.homeIndex,
          };
        })
    );
  };

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
          if (event.dataTransfer.types.includes("Files")) {
            setIsDraggingFiles(true);
          }
        }}
        onDragLeave={() => setIsDraggingFiles(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingFiles(false);
          if (event.dataTransfer.files.length > 0) {
            void processFiles(event.dataTransfer.files);
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-2xl px-6 py-12 text-center cursor-pointer transition-colors ${
          isDraggingFiles
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
          subirlas. Las nuevas se añaden al final y no aparecen en el inicio
          hasta que las marques.
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
        <h2 className="font-serif text-xl font-bold mb-2">
          Fotos actuales · {GALLERY_CATEGORY_LABELS[category]}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Arrastra las tarjetas o usa las flechas para ordenar la galería.
          Estrella = foto de Bienvenidos. Casa = foto en Proyectos del inicio
          (máximo {MAX_HOME_IMAGES}).
        </p>
        {saving ? (
          <p className="text-sm text-muted-foreground mb-3">Guardando...</p>
        ) : null}
        {saveMessage ? (
          <p className="text-sm text-green-700 mb-3">{saveMessage}</p>
        ) : null}
        {actionError ? (
          <p className="text-sm text-red-600 mb-3" role="alert">
            {actionError}
          </p>
        ) : null}
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
            {images.map((image, index) => (
              <div
                key={image.url}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (dragIndex !== null) {
                    reorderTo(dragIndex, index);
                    setDragIndex(null);
                  }
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`relative overflow-hidden rounded-xl bg-muted aspect-[3/4] cursor-grab active:cursor-grabbing ${
                  dragIndex === index ? "opacity-60" : ""
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => void handleDelete(image)}
                  disabled={deletingUrl === image.url}
                  className="absolute top-2 right-2 bg-black/60 text-white hover:text-red-300 disabled:opacity-50 cursor-pointer rounded-full p-1.5"
                  aria-label={`Eliminar ${image.alt}`}
                >
                  <Trash2 size={14} />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-2 space-y-2">
                  <p className="text-white text-xs truncate">{image.alt}</p>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="text-white disabled:opacity-30 cursor-pointer p-1"
                        aria-label="Mover a la izquierda"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                        className="text-white disabled:opacity-30 cursor-pointer p-1"
                        aria-label="Mover a la derecha"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => toggleHero(image.pathname)}
                        className={`rounded-full p-1.5 cursor-pointer ${
                          image.isHero
                            ? "bg-white text-foreground"
                            : "text-white/80 hover:text-white"
                        }`}
                        aria-label="Usar en Bienvenidos"
                        title="Bienvenidos"
                      >
                        <Star
                          size={14}
                          fill={image.isHero ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleHome(image.pathname)}
                        className={`rounded-full p-1.5 cursor-pointer ${
                          image.isHome
                            ? "bg-white text-foreground"
                            : "text-white/80 hover:text-white"
                        }`}
                        aria-label="Usar en Proyectos del inicio"
                        title="Proyectos en el inicio"
                      >
                        <House
                          size={14}
                          fill={image.isHome ? "currentColor" : "none"}
                        />
                        {image.isHome ? (
                          <span className="sr-only">
                            Proyectos {(image.homeIndex ?? 0) + 1}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
