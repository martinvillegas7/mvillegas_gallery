"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Contact from "@/components/contact";

export default function ContactoPage() {
  return (
    <main className="w-full overflow-hidden">
      <Header />
      <div className="pt-8 md:pt-12">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
