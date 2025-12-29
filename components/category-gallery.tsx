"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Photo {
  id: number;
  src: string;
  alt: string;
}

interface CategoryGalleryProps {
  title: string;
  description: string;
  photos: Photo[];
}

const CategoryGallery = ({ title, description, photos }: CategoryGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <section className="w-full bg-neutral-900 py-20 md:py-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            {title}
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto text-balance">
            {description}
          </p>
        </div>

        {/* Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
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
                    Ver grande
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">
              Próximamente agregaremos más fotografías en esta categoría.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors"
              aria-label="Cerrar"
            >
              <X size={32} />
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryGallery;

