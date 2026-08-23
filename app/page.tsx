"use client";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Selection from "@/components/selection";
import About from "@/components/about";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="w-full overflow-hidden">
      <Header />
      <Hero />
      <Selection />
      <About />
      <Footer />
    </main>
  );
}
