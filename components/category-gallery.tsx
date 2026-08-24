"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import {
  focalPointStyle,
  photoHasTag,
  uniquePhotoTags,
  tagKey,
  type FocalPoint,
} from "@/lib/gallery-types";

interface Photo {
  id: number;
  src: string;
  alt: string;
  focalPoint?: FocalPoint;
  tags?: string[];
}

interface CategoryGalleryProps {
  title: string;
  description: string;
  photos: Photo[];
  loading?: boolean;
}

const CategoryGallery = ({
  title,
  description,
  photos,
  loading = false,
}: CategoryGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const availableTags = useMemo(
    () =>
      uniquePhotoTags(photos.map((photo) => ({ tags: photo.tags ?? [] }))).filter(
        (tag) => tagKey(tag) !== "todos"
      ),
    [photos]
  );

  const visiblePhotos = useMemo(() => {
    if (!activeTag) {
      return photos;
    }
    return photos.filter((photo) =>
      photoHasTag({ tags: photo.tags ?? [] }, activeTag)
    );
  }, [photos, activeTag]);

  const selectedPhoto =
    selectedIndex !== null ? visiblePhotos[selectedIndex] ?? null : null;

  const goToPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || visiblePhotos.length === 0) return current;
      return (current - 1 + visiblePhotos.length) % visiblePhotos.length;
    });
  }, [visiblePhotos.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || visiblePhotos.length === 0) return current;
      return (current + 1) % visiblePhotos.length;
    });
  }, [visiblePhotos.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    setSelectedIndex(null);
  }, [activeTag]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeLightbox, goToPrevious, goToNext]);

  const filters = ["Todos", ...availableTags];

  return (
    <section className="w-full pt-28 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-balance">
              {description}
            </p>
            {!loading && availableTags.length > 0 ? (
              <div
                className="flex flex-wrap justify-center gap-2 mt-8"
                aria-label="Filtrar fotografías"
              >
                {filters.map((label) => {
                  const value = label === "Todos" ? null : label;
                  const isActive = activeTag === value;
                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveTag(value)}
                      className={`px-4 py-1.5 rounded-full text-sm tracking-wide border transition-colors duration-300 cursor-pointer ${
                        isActive
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Cargando imágenes...</p>
          </div>
        ) : photos.length > 0 ? (
          visiblePhotos.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {visiblePhotos.map((photo, index) => (
                <ScrollReveal key={photo.src} delay={(index % 6) * 60}>
                  <button
                    onClick={() => setSelectedIndex(index)}
                    className="relative overflow-hidden aspect-[3/4] group cursor-pointer w-full"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                      style={focalPointStyle(photo.focalPoint)}
                    />
                  </button>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No hay fotografías con esta etiqueta.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Próximamente agregaremos más fotografías en esta categoría.
            </p>
          </div>
        )}
      </div>

      {selectedPhoto && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotografías"
        >
          <button
            onClick={closeLightbox}
            className="fixed top-6 right-6 md:top-8 md:right-8 text-white/80 hover:text-white transition-colors cursor-pointer z-[101]"
            aria-label="Cerrar"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          {visiblePhotos.length > 1 && (
            <>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer z-[101] p-2"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer z-[101] p-2"
                aria-label="Foto siguiente"
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>
            </>
          )}

          <div
            className="flex items-center justify-center w-full h-full px-16 md:px-24 py-16"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="max-h-[85vh] max-w-full object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryGallery;
