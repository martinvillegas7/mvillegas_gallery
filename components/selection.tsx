"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/scroll-reveal";
import { parseGalleryImages } from "@/lib/gallery-types";

interface Photo {
  id: number;
  src: string;
  alt: string;
}

interface CategoryProject {
  slug: string;
  title: string;
  subtitle: string;
  photos: Photo[];
}

const categories = [
  {
    slug: "naturaleza",
    title: "Naturaleza",
    subtitle: "Vida silvestre y paisajes naturales.",
  },
  {
    slug: "retratos",
    title: "Retratos",
    subtitle: "Personas y momentos especiales.",
  },
  {
    slug: "deporte",
    title: "Deporte",
    subtitle: "Acción, movimiento y emoción.",
  },
];

const Selection = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<CategoryProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (cat) => {
            const res = await fetch(`/api/images?category=${cat.slug}`);
            const data = await res.json();
            const images = parseGalleryImages(data);
            const homePhotos = images
              .filter((image) => image.isHome)
              .sort((a, b) => (a.homeIndex ?? 0) - (b.homeIndex ?? 0));
            return {
              slug: cat.slug,
              title: cat.title,
              subtitle: cat.subtitle,
              photos:
                homePhotos.length > 0
                  ? homePhotos.slice(0, 2)
                  : images.slice(0, 2),
            };
          })
        );
        setProjects(results);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

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

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Cargando imágenes...</p>
          </div>
        ) : (
          <div className="space-y-20 md:space-y-28">
            {projects.map((project, index) => (
              <div key={project.slug}>
                <ScrollReveal delay={index * 80}>
                  <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
                    {project.photos.length > 0 ? (
                      project.photos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => router.push(`/${project.slug}`)}
                          className="relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[4/3] group cursor-pointer"
                        >
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        )}
      </div>
    </section>
  );
};

export default Selection;
