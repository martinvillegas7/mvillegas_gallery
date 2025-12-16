"use client"

const Hero = () => {
  const scrollToPortfolio = () => {
    const element = document.querySelector("#portfolio")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      className="relative w-full h-screen bg-neutral-950 overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=landscape photography mountains sunset)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-balance text-white">
          Fotografía que cuenta historias
        </h1>
        <p className="text-lg md:text-xl text-neutral-200 mb-12 max-w-2xl mx-auto text-balance">
          Portafolio personal de fotografía de viajes, ciudades y naturaleza
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToPortfolio}
            className="px-8 py-3 bg-white text-black font-semibold rounded hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105"
          >
            Ver mi trabajo
          </button>
          <a
            href="https://instagram.com/mi_usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-black transition-all duration-300"
          >
            Ver en Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
