"use client"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Portfolio from "@/components/portfolio"
import About from "@/components/about"
import Instagram from "@/components/instagram"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="w-full overflow-hidden">
      <Header />
      <Hero />
      <Portfolio />
      <About />
      <Instagram />
      <Contact />
      <Footer />
    </main>
  )
}
