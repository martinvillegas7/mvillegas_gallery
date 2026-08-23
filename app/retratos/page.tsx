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

export default function RetratosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch("/api/images?category=retratos");
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
        title="Retratos"
        description="Momentos especiales y miradas sinceras: personas capturadas con autenticidad y emoción."
        photos={photos}
        loading={loading}
      />
      <Footer />
    </main>
  );
}
