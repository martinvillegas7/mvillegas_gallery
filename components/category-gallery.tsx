"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";

interface Photo {
  id: number;
  src: string;
  alt: string;
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

  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] ?? null : null;

  const goToPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return (current - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return (current + 1) % photos.length;
    });
  }, [photos.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

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
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Cargando imágenes...</p>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {photos.map((photo, index) => (
              <ScrollReveal key={photo.src} delay={(index % 6) * 60}>
                <button
                  onClick={() => setSelectedIndex(index)}
                  className="relative overflow-hidden aspect-[3/4] group cursor-pointer w-full"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                  />
                </button>
              </ScrollReveal>
            ))}
          </div>
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

          {photos.length > 1 && (
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
