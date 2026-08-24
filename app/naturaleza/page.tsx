"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";
import { parseGalleryImages, type GalleryImage } from "@/lib/gallery-types";

export default function NaturalezaPage() {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch("/api/images?category=naturaleza");
        const data: unknown = await response.json();
        setPhotos(parseGalleryImages(data));
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
