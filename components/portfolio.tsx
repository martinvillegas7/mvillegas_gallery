"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface Photo {
  id: number
  query: string
  alt: string
}

const Portfolio = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const photos: Photo[] = [
    { id: 1, query: "mountain landscape photography", alt: "Paisaje montañoso" },
    { id: 2, query: "city street photography urban", alt: "Fotografía urbana" },
    { id: 3, query: "portrait photography professional", alt: "Retrato profesional" },
    { id: 4, query: "nature forest photography", alt: "Fotografía de naturaleza" },
    { id: 5, query: "travel photography beach", alt: "Fotografía de viaje - playa" },
    { id: 6, query: "architecture photography building", alt: "Fotografía de arquitectura" },
    { id: 7, query: "sunset landscape photography", alt: "Fotografía de atardecer" },
    { id: 8, query: "waterfall nature photography", alt: "Fotografía de cascada" },
    { id: 9, query: "cityscape night photography", alt: "Fotografía nocturna urbana" },
  ]

  return (
    <section id="portfolio" className="w-full bg-neutral-900 py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Portfolio</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto text-balance">
            Una selección de mis fotos favoritas de viajes, ciudades, retratos y naturaleza.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer"
            >
              <img
                src={`/.jpg?height=400&width=400&query=${encodeURIComponent(photo.query)}`}
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
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors"
              aria-label="Cerrar"
            >
              <X size={32} />
            </button>
            <img
              src={`/.jpg?height=800&width=1200&query=${encodeURIComponent(selectedPhoto.query)}`}
              alt={selectedPhoto.alt}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default Portfolio
