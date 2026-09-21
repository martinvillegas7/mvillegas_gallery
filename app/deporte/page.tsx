import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";
import { listCategoryImages } from "@/lib/images";

export const revalidate = 300;

export default async function DeportePage() {
  const photos = await listCategoryImages("deporte");

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
