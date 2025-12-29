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

export default function NaturalezaPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch("/api/images?category=naturaleza");
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
        title="Naturaleza"
        description="Fotografías de fauna, flora y vida silvestre capturadas en su hábitat natural."
        photos={photos}
        loading={loading}
      />
      <Footer />
    </main>
  );
}
