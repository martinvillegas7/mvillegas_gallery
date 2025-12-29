"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";

interface Photo {
  id: number;
  src: string;
  alt: string;
}

export default function PaisajePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch("/api/images?category=paisaje");
        const data = await response.json();
        setPhotos(data.images || []);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <CategoryGallery
        title="Paisaje"
        description="Imágenes de paisajes naturales, montañas, valles y escenarios que inspiran."
        photos={photos}
        loading={loading}
      />
      <Footer />
    </main>
  );
}
