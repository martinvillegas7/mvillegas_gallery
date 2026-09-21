import Header from "@/components/header";
import Hero from "@/components/hero";
import Selection from "@/components/selection";
import About from "@/components/about";
import Footer from "@/components/footer";
import { GALLERY_CATEGORIES } from "@/lib/categories";
import { listAllCategoryImages } from "@/lib/images";
import { getSiteContent } from "@/lib/site-content";
import type { GalleryImage } from "@/lib/gallery-types";

export const revalidate = 300;

export default async function Home() {
  const [content, galleries] = await Promise.all([
    getSiteContent(),
    listAllCategoryImages(),
  ]);

  const heroPhotos = GALLERY_CATEGORIES.map((category) => {
    const images = galleries[category];
    return images.find((image) => image.isHero) ?? images[0] ?? null;
  }).filter((photo): photo is GalleryImage => photo !== null);

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        photos={heroPhotos}
      />
      <Selection galleries={galleries} />
      <About text={content.about.text} instagram={content.contact.instagram} />
      <Footer />
    </main>
  );
}
