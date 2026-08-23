"use client";

import ScrollReveal from "@/components/scroll-reveal";
import {
  DEFAULT_SITE_CONTENT,
  instagramProfileUrl,
} from "@/lib/site-content-types";

type AboutProps = {
  text?: string;
  instagram?: string;
};

const About = ({
  text = DEFAULT_SITE_CONTENT.about.text,
  instagram = DEFAULT_SITE_CONTENT.contact.instagram,
}: AboutProps) => {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-base md:text-lg text-muted-foreground leading-relaxed ${
                    index < paragraphs.length - 1 ? "mb-6" : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
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
              href={instagramProfileUrl(instagram)}
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
