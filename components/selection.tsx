"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Photo {
  id: number;
  src: string;
  alt: string;
  category: "naturaleza" | "deporte" | "paisaje";
}

const Selection = () => {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        // Cargar imágenes de todas las categorías para determinar a qué categoría pertenece cada imagen de selection
        const [selectionRes, naturalezaRes, deporteRes, paisajeRes] =
          await Promise.all([
            fetch("/api/images?category=selection"),
            fetch("/api/images?category=naturaleza"),
            fetch("/api/images?category=deporte"),
            fetch("/api/images?category=paisaje"),
          ]);

        const [selectionData, naturalezaData, deporteData, paisajeData] =
          await Promise.all([
            selectionRes.json(),
            naturalezaRes.json(),
            deporteRes.json(),
            paisajeRes.json(),
          ]);

        // Crear mapas de nombres de archivo a categorías
        const naturalezaFiles = new Set(
          naturalezaData.images.map((img: Photo) => img.src.split("/").pop())
        );
        const deporteFiles = new Set(
          deporteData.images.map((img: Photo) => img.src.split("/").pop())
        );
        const paisajeFiles = new Set(
          paisajeData.images.map((img: Photo) => img.src.split("/").pop())
        );

        // Asignar categorías a las imágenes de selection
        const photosWithCategory = selectionData.images.map((photo: Photo) => {
          const fileName = photo.src.split("/").pop() || "";
          let category: "naturaleza" | "deporte" | "paisaje" = "naturaleza";

          if (naturalezaFiles.has(fileName)) {
            category = "naturaleza";
          } else if (deporteFiles.has(fileName)) {
            category = "deporte";
          } else if (paisajeFiles.has(fileName)) {
            category = "paisaje";
          }

          return { ...photo, category };
        });

        setPhotos(photosWithCategory);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const handlePhotoClick = (category: string) => {
    router.push(`/${category}`);
  };

  return (
    <section
      id="portfolio"
      className="w-full bg-neutral-900 py-20 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Selección
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto text-balance">
            Una selección de mis fotos favoritas de viajes, ciudades, retratos y
            naturaleza.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">Cargando imágenes...</p>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handlePhotoClick(photo.category)}
                className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-semibold text-sm px-6 py-2 border border-white rounded">
                    Ver más
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">
              No hay imágenes disponibles en la selección.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Selection;
