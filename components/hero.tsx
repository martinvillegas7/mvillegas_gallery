"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-types";

interface Photo {
  id: number;
  src: string;
  alt: string;
}

type HeroProps = {
  title?: string;
  subtitle?: string;
};

const Hero = ({
  title = DEFAULT_SITE_CONTENT.hero.title,
  subtitle = DEFAULT_SITE_CONTENT.hero.subtitle,
}: HeroProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadHeroPhotos = async () => {
      try {
        const categories = ["naturaleza", "retratos", "deporte"];
        const results = await Promise.all(
          categories.map(async (category) => {
            const res = await fetch(`/api/images?category=${category}`);
            const data = await res.json();
            return (data.images || [])[0] ?? null;
          })
        );
        setPhotos(results.filter(Boolean) as Photo[]);
      } catch (error) {
        console.error("Error loading hero images:", error);
      }
    };

    loadHeroPhotos();
    setMounted(true);
  }, []);

  const scrollToPortfolio = () => {
    document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  const displayPhotos =
    photos.length > 0 ? photos : [null, null, null] as (Photo | null)[];

  return (
    <section
      id="hero"
      className="w-full pt-24 pb-4 md:pb-8 px-4 sm:px-6 lg:px-8 lg:min-h-[calc(100dvh-2.5rem)] lg:flex lg:flex-col"
    >
      <div className="max-w-screen-2xl mx-auto w-full lg:flex-1 lg:min-h-0">
        <div className="bg-secondary rounded-3xl md:rounded-[2rem] p-6 md:p-10 lg:p-12 overflow-hidden lg:h-full lg:min-h-[calc(100dvh-9rem)] lg:flex lg:items-center">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 w-full h-full items-center">
            <div
              className={`flex flex-col justify-center transition-all duration-700 ease-out ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-balance leading-tight">
                {title}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-md">
                {subtitle}
              </p>
              <button
                onClick={scrollToPortfolio}
                className="self-start px-10 py-3 bg-foreground text-background font-serif text-sm rounded-full hover:opacity-85 transition-opacity duration-300 cursor-pointer"
              >
                Ver
              </button>
            </div>

            <div
              className={`grid grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 md:gap-4 w-full h-[260px] sm:h-[300px] md:h-[360px] lg:h-[min(560px,calc(100dvh-14rem))] min-h-0 transition-all duration-700 ease-out delay-150 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <div className="row-span-2 min-h-0 rounded-2xl overflow-hidden bg-muted">
                {displayPhotos[0] && (
                  <img
                    src={displayPhotos[0].src}
                    alt={displayPhotos[0].alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {displayPhotos.slice(1, 3).map((photo, index) => (
                <div
                  key={photo?.id ?? index}
                  className="min-h-0 rounded-2xl overflow-hidden bg-muted"
                >
                  {photo && (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
