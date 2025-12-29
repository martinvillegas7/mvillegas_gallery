"use client";
import { useEffect } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Selection from "@/components/selection";
import About from "@/components/about";
import Instagram from "@/components/instagram";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Manejar scroll a secciones cuando hay hash en la URL
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <Hero />
      <Selection />
      <About />
      {/* <Instagram /> */}
      <Contact />
      <Footer />
    </main>
  );
}
