"use client";

import { useRouter } from "next/navigation";

interface Photo {
  id: number;
  src: string;
  alt: string;
  category: "naturaleza" | "deporte" | "paisaje";
}

const Selection = () => {
  const router = useRouter();

  const photos: Photo[] = [
    {
      id: 1,
      src: "/guacamaya.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 2,
      src: "/ardilla1.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 3,
      src: "/paisaje-pirineos.jpg",
      alt: "Fotografía de paisaje",
      category: "paisaje",
    },
    {
      id: 4,
      src: "/perico.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 5,
      src: "/carpintero.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 6,
      src: "/kingfisher.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 7,
      src: "/alcaravan.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 8,
      src: "/garza.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 9,
      src: "/cormoranes.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 10,
      src: "/aguila.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 11,
      src: "/flamingos.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
    {
      id: 12,
      src: "/pato.jpg",
      alt: "Fotografía de fauna",
      category: "naturaleza",
    },
  ];

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
      </div>
    </section>
  );
};

export default Selection;
