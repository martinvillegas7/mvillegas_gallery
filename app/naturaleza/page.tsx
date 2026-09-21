import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryGallery from "@/components/category-gallery";
import { listCategoryImages } from "@/lib/images";

export const revalidate = 300;

export default async function NaturalezaPage() {
  const photos = await listCategoryImages("naturaleza");

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
