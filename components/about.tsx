"use client";

const About = () => {
  return (
    <section
      id="about"
      className="w-full bg-black py-20 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight text-white">
          Sobre mí
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-lg overflow-hidden aspect-square">
              <img
                src="/autoretrato.jpg"
                alt="Martín Villegas - Fotógrafo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              Soy Martín, fotógrafo apasionado por capturar momentos auténticos,
              luces inesperadas y detalles que muchas veces pasan
              desapercibidos. Combino mi lado creativo con mi formación en
              tecnología para crear imágenes cuidadas, nítidas y llenas de
              intención.
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Cada proyecto es una oportunidad para contar historias desde
              ángulos únicos. Me encanta trabajar con clientes que valoran la
              autenticidad y buscan imágenes que trasciendan el momento para
              convertirse en recuerdos atemporales.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16 md:mt-20">
        <a
          href="https://instagram.com/mvillegas_gallery"
          target="_blank"
          rel="noopener noreferrer"
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Ver mi Instagram
        </a>
      </div>
    </section>
  );
};

export default About;
