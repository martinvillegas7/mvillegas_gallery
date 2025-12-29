"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";

export default function PaisajePage() {
  const photos = [
    { id: 3, src: "/paisaje-pirineos.jpg", alt: "Paisaje de los Pirineos" },
    // Agregar más fotos de paisaje aquí cuando estén disponibles
  ];

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <CategoryGallery
        title="Paisaje"
        description="Imágenes de paisajes naturales, montañas, valles y escenarios que inspiran."
        photos={photos}
      />
      <Footer />
    </main>
  );
}

