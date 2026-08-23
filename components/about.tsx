"use client";

import ScrollReveal from "@/components/scroll-reveal";

const About = () => {
  return (
    <section
      id="about"
      className="w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-border"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal>
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                Sobre mí
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                Soy Martín, fotógrafo apasionado por la naturaleza, los retratos
                y el deporte. Me fascina observar, esperar y capturar la vida en
                su entorno: aves en pleno vuelo, la quietud de un paisaje al
                amanecer o ese instante fugaz en que un animal deja entrever su
                personalidad.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                También me mueve retratar a las personas, congelar momentos
                especiales y plasmar en imágenes lo que a veces cuesta poner en
                palabras: una sonrisa espontánea, una mirada sincera, un gesto
                que dice más que mil palabras.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Y me apasiona capturar la energía del deporte — la tensión de una
                carrera, el esfuerzo de un atleta en plena acción. Busco imágenes
                honestas que transmitan emoción y permanezcan en el recuerdo.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120} direction="right">
            <div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-md mx-auto md:max-w-none">
                <img
                  src="/autoretrato.jpg"
                  alt="Martín Villegas - Fotógrafo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={80}>
          <div className="flex justify-center mt-16 md:mt-20">
            <a
              href="https://instagram.com/mvillegas_gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-3 border border-foreground text-sm rounded-full hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Ver mi Instagram
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
