"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  House,
  Star,
  Tags,
  Trash2,
  Upload,
} from "lucide-react";
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_LABELS,
  type GalleryCategory,
} from "@/lib/categories";
import {
  focalPointStyle,
  MAX_HOME_IMAGES,
  parseGalleryImages,
  uniquePhotoTags,
  type GalleryImage,
} from "@/lib/gallery-types";
import FocalPointEditor from "@/components/admin/focal-point-editor";
import TagsEditor from "@/components/admin/tags-editor";
import { sha256Blob } from "@/lib/file-hash";
import { parseKnownHashes } from "@/lib/gallery-hashes";
import { adminFetch, readApiError } from "@/components/admin/session";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= list.length ||
    to >= list.length
  ) {
    return list;
  }

  const next = [...list];
  const [item] = next.splice(from, 1);
  if (!item) {
    return list;
  }
  next.splice(to, 0, item);
  return next;
}

function slotIndexFromPoint(
  slots: DOMRect[],
  x: number,
  y: number
): number | null {
  for (let index = 0; index < slots.length; index += 1) {
    const rect = slots[index];
    if (!rect) {
      continue;
    }
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return index;
    }
  }
  return null;
}

type UploadStatus = {
  id: string;
  name: string;
  state:
    | "checking"
    | "compressing"
    | "uploading"
    | "done"
    | "duplicate"
    | "error";
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
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [focalImage, setFocalImage] = useState<GalleryImage | null>(null);
  const [tagsImage, setTagsImage] = useState<GalleryImage | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<GalleryImage[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragFromRef = useRef<number | null>(null);
  const hoverIndexRef = useRef<number | null>(null);
  const slotRectsRef = useRef<DOMRect[]>([]);

  imagesRef.current = images;

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
          focalPoints: Object.fromEntries(
            nextImages.map((image) => [image.pathname, image.focalPoint])
          ),
          tags: Object.fromEntries(
            nextImages.map((image) => [image.pathname, image.tags ?? []])
          ),
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
    applyImages(moveItem(images, index, target));
  };

  const previewImages =
    dragFrom !== null && hoverIndex !== null
      ? moveItem(images, dragFrom, hoverIndex)
      : images;

  const previewIndexByUrl = new Map(
    previewImages.map((image, index) => [image.url, index])
  );

  const finishDrag = () => {
    const from = dragFromRef.current;
    const to = hoverIndexRef.current;
    dragFromRef.current = null;
    hoverIndexRef.current = null;
    slotRectsRef.current = [];
    setDragFrom(null);
    setHoverIndex(null);

    if (from === null || to === null || from === to) {
      return;
    }

    applyImages(moveItem(imagesRef.current, from, to));
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
        state: "checking",
      }))
    );

    const existingHashes = new Set<string>();
    try {
      const hashesResponse = await adminFetch("/api/images/hashes");
      if (hashesResponse.ok) {
        const hashesData: unknown = await hashesResponse.json();
        for (const hash of parseKnownHashes(hashesData)) {
          existingHashes.add(hash);
        }
      }
    } catch {
      // If hashes cannot be loaded, the server still rejects duplicates.
    }

    const seenInBatch = new Set<string>();

    for (const [index, file] of files.entries()) {
      const id = `${index}-${file.name}`;
      try {
        updateStatus(id, { state: "checking" });
        const originalHash = await sha256Blob(file);

        if (existingHashes.has(originalHash) || seenInBatch.has(originalHash)) {
          updateStatus(id, {
            state: "duplicate",
            message: "Ya estaba en la galería, se omitió.",
          });
          continue;
        }

        seenInBatch.add(originalHash);
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
        formData.append("originalHash", originalHash);

        const response = await adminFetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (response.status === 409) {
          existingHashes.add(originalHash);
          updateStatus(id, {
            state: "duplicate",
            message: await readApiError(
              response,
              "Ya estaba en la galería, se omitió."
            ),
          });
          continue;
        }

        if (!response.ok) {
          seenInBatch.delete(originalHash);
          updateStatus(id, {
            state: "error",
            message: await readApiError(response, "Error al subir la imagen"),
          });
          continue;
        }

        existingHashes.add(originalHash);
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
          subirlas. Si una foto ya está en la galería, se omite.
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
              {status.state === "checking" && (
                <span className="text-muted-foreground">
                  Comprobando {status.name}...
                </span>
              )}
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
              {status.state === "duplicate" && (
                <span className="text-amber-700">
                  {status.name}: {status.message ?? "Duplicada, se omitió."}
                </span>
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
          Arrastra las tarjetas para ver cómo queda el orden antes de soltar.
          La mira ajusta qué parte se ve en la miniatura. Etiquetas = filtros de
          la galería. Estrella = Bienvenidos. Casa = Proyectos en el inicio
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
          <div
            ref={gridRef}
            onDragOver={(event) => {
              if (event.dataTransfer.types.includes("Files")) {
                return;
              }
              if (dragFromRef.current === null) {
                return;
              }
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              const overIndex = slotIndexFromPoint(
                slotRectsRef.current,
                event.clientX,
                event.clientY
              );
              if (overIndex === null || overIndex === hoverIndexRef.current) {
                return;
              }
              hoverIndexRef.current = overIndex;
              setHoverIndex(overIndex);
            }}
            onDrop={(event) => {
              event.preventDefault();
              finishDrag();
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {images.map((image, index) => {
              const previewIndex = previewIndexByUrl.get(image.url) ?? index;
              const origin = slotRectsRef.current[index];
              const target = slotRectsRef.current[previewIndex];
              const isDragging = dragFrom === index;
              const dx =
                origin && target ? target.left - origin.left : 0;
              const dy = origin && target ? target.top - origin.top : 0;
              const isPreviewing = dragFrom !== null && (dx !== 0 || dy !== 0);

              return (
              <div
                key={image.url}
                data-slot="true"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(index));
                  const cards =
                    gridRef.current?.querySelectorAll<HTMLElement>(
                      "[data-slot]"
                    );
                  slotRectsRef.current = cards
                    ? Array.from(cards, (card) => card.getBoundingClientRect())
                    : [];
                  dragFromRef.current = index;
                  hoverIndexRef.current = index;
                  setDragFrom(index);
                  setHoverIndex(index);
                }}
                onDragEnd={finishDrag}
                className={`relative overflow-hidden rounded-xl bg-muted aspect-[3/4] cursor-grab active:cursor-grabbing ${
                  isDragging ? "opacity-40 ring-2 ring-foreground/30 z-10" : ""
                }`}
                style={{
                  transform: isPreviewing
                    ? `translate(${dx}px, ${dy}px)`
                    : undefined,
                  transition:
                    dragFrom === null
                      ? undefined
                      : "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                  zIndex: isDragging ? 10 : isPreviewing ? 2 : 1,
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover pointer-events-none"
                  style={focalPointStyle(image.focalPoint)}
                  draggable={false}
                />
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {previewIndex + 1}
                </span>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setFocalImage(image);
                    }}
                    className="bg-black/60 text-white hover:text-white cursor-pointer rounded-full p-1.5"
                    aria-label={`Ajustar recorte de ${image.alt}`}
                    title="Ajustar recorte"
                  >
                    <Crosshair size={14} />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setTagsImage(image);
                    }}
                    className={`bg-black/60 cursor-pointer rounded-full p-1.5 ${
                      image.tags?.length
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                    }`}
                    aria-label={`Etiquetas de ${image.alt}`}
                    title="Etiquetas"
                  >
                    <Tags size={14} />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => void handleDelete(image)}
                    disabled={deletingUrl === image.url}
                    className="bg-black/60 text-white hover:text-red-300 disabled:opacity-50 cursor-pointer rounded-full p-1.5"
                    aria-label={`Eliminar ${image.alt}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div
                  className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-2 space-y-2"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <p className="text-white text-xs truncate">{image.alt}</p>
                  {image.tags?.length ? (
                    <p className="text-white/75 text-[10px] truncate">
                      {image.tags.join(" · ")}
                    </p>
                  ) : null}
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
              );
            })}
          </div>
        )}
      </div>
      {focalImage ? (
        <FocalPointEditor
          image={
            images.find((item) => item.url === focalImage.url) ?? focalImage
          }
          onChange={(point) => {
            setImages((current) =>
              current.map((item) =>
                item.url === focalImage.url
                  ? { ...item, focalPoint: point }
                  : item
              )
            );
          }}
          onClose={() => {
            setFocalImage(null);
            void persistLayout(imagesRef.current);
          }}
        />
      ) : null}
      {tagsImage ? (
        <TagsEditor
          image={
            images.find((item) => item.url === tagsImage.url) ?? tagsImage
          }
          suggestedTags={uniquePhotoTags(images)}
          onChange={(tags) => {
            setImages((current) =>
              current.map((item) =>
                item.url === tagsImage.url ? { ...item, tags } : item
              )
            );
          }}
          onClose={() => {
            setTagsImage(null);
            void persistLayout(imagesRef.current);
          }}
        />
      ) : null}
    </div>
  );
}
