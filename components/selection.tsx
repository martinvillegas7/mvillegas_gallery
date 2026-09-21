"use client";

import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/scroll-reveal";
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_LABELS,
  type GalleryCategory,
} from "@/lib/categories";
import {
  focalPointStyle,
  type GalleryImage,
} from "@/lib/gallery-types";

const CATEGORY_SUBTITLES: Record<GalleryCategory, string> = {
  naturaleza: "Vida silvestre y paisajes naturales.",
  retratos: "Personas y momentos especiales.",
  deporte: "Acción, movimiento y emoción.",
};

type SelectionProps = {
  galleries: Record<GalleryCategory, GalleryImage[]>;
};

const Selection = ({ galleries }: SelectionProps) => {
  const router = useRouter();

  const projects = GALLERY_CATEGORIES.map((slug) => {
    const images = galleries[slug] ?? [];
    const homePhotos = images
      .filter((image) => image.isHome)
      .sort((a, b) => (a.homeIndex ?? 0) - (b.homeIndex ?? 0));

    return {
      slug,
      title: GALLERY_CATEGORY_LABELS[slug],
      subtitle: CATEGORY_SUBTITLES[slug],
      photos:
        homePhotos.length > 0 ? homePhotos.slice(0, 2) : images.slice(0, 2),
    };
  });

  return (
    <section id="portfolio" className="w-full pt-10 pb-16 md:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Proyectos Fotográficos
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-balance">
              Una selección de mis series favoritas, organizadas por categoría.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-20 md:space-y-28">
          {projects.map((project, index) => (
            <div key={project.slug}>
              <ScrollReveal delay={index * 80}>
                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
                  {project.photos.length > 0 ? (
                    project.photos.map((photo) => (
                      <button
                        key={photo.src}
                        onClick={() => router.push(`/${project.slug}`)}
                        className="relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[4/3] group cursor-pointer"
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          style={focalPointStyle(photo.focalPoint)}
                        />
                      </button>
                    ))
                  ) : (
                    <>
                      <div className="bg-secondary rounded-2xl aspect-[4/5] sm:aspect-[4/3]" />
                      <div className="bg-secondary rounded-2xl aspect-[4/5] sm:aspect-[4/3]" />
                    </>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={index * 80 + 100}>
                <div className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left gap-4">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold mb-1">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {project.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/${project.slug}`)}
                    className="px-8 py-2.5 border border-foreground text-sm rounded-full hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
                  >
                    Ver
                  </button>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Selection;
