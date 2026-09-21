import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";
import { listCategoryImages } from "@/lib/images";

export const revalidate = 300;

export default async function RetratosPage() {
  const photos = await listCategoryImages("retratos");

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <CategoryGallery
        title="Retratos"
        description="Momentos especiales y miradas sinceras: personas capturadas con autenticidad y emoción."
        photos={photos}
      />
      <Footer />
    </main>
  );
}
