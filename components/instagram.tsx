"use client";

const Instagram = () => {
  const instagramPosts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    query: [
      "instagram photo aesthetic",
      "travel photography inspiration",
      "portrait photography beautiful",
      "nature photography scenic",
      "urban photography street",
      "landscape photography sunset",
    ][i],
  }));

  return (
    <section
      id="instagram"
      className="w-full bg-neutral-900 py-20 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Instagram
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto text-balance">
            En Instagram publico fotos más espontáneas, procesos, detrás de
            cámaras y nuevos proyectos. Sígueme para ver contenido más
            frecuente.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/mvillegas_gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-lg aspect-square group"
            >
              <img
                src={`/.jpg?height=300&width=300&query=${encodeURIComponent(
                  post.query
                )}`}
                alt={`Publicación de Instagram ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="https://instagram.com/mvillegas_gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Ver mi Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Instagram;
