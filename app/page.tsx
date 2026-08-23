import Header from "@/components/header";
import Hero from "@/components/hero";
import Selection from "@/components/selection";
import About from "@/components/about";
import Footer from "@/components/footer";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <Hero title={content.hero.title} subtitle={content.hero.subtitle} />
      <Selection />
      <About text={content.about.text} instagram={content.contact.instagram} />
      <Footer />
    </main>
  );
}
