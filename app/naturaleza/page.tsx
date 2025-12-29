"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";

export default function NaturalezaPage() {
  const photos = [
    { id: 1, src: "/guacamaya.jpg", alt: "Guacamaya" },
    { id: 2, src: "/ardilla1.jpg", alt: "Ardilla" },
    { id: 4, src: "/perico.jpg", alt: "Perico" },
    { id: 5, src: "/carpintero.jpg", alt: "Carpintero" },
    { id: 6, src: "/kingfisher.jpg", alt: "Kingfisher" },
    { id: 7, src: "/alcaravan.jpg", alt: "Alcaraván" },
    { id: 8, src: "/garza.jpg", alt: "Garza" },
    { id: 9, src: "/cormoranes.jpg", alt: "Cormoranes" },
    { id: 10, src: "/aguila.jpg", alt: "Águila" },
    { id: 11, src: "/flamingos.jpg", alt: "Flamingos" },
    { id: 12, src: "/pato.jpg", alt: "Pato" },
  ];

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <CategoryGallery
        title="Naturaleza"
        description="Fotografías de fauna, flora y vida silvestre capturadas en su hábitat natural."
        photos={photos}
      />
      <Footer />
    </main>
  );
}

