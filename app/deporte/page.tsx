"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";

export default function DeportePage() {
  const photos: { id: number; src: string; alt: string }[] = [
    // Agregar fotos de deporte aquí cuando estén disponibles
  ];

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <CategoryGallery
        title="Deporte"
        description="Capturas de momentos deportivos, acción y movimiento en su máxima expresión."
        photos={photos}
      />
      <Footer />
    </main>
  );
}

