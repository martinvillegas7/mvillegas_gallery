"use client";

import type React from "react";

import { useState } from "react";
import {
  DEFAULT_SITE_CONTENT,
  type ExtraSocial,
} from "@/lib/site-content-types";

type ContactProps = {
  email?: string;
  extraSocials?: ExtraSocial[];
};

const Contact = ({
  email = DEFAULT_SITE_CONTENT.contact.email,
  extraSocials = [],
}: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      id="contact"
      className="w-full min-h-[calc(100dvh-8rem)] py-20 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Contáctame
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              ¿Te gustaría trabajar conmigo o tienes alguna pregunta? Escríbeme
              y hablamos de tu proyecto.
            </p>
            <a
              href={`mailto:${email}`}
              className="font-serif text-lg md:text-xl hover:opacity-70 transition-opacity"
            >
              {email}
            </a>
            {extraSocials.length > 0 ? (
              <div className="mt-6 space-y-2">
                {extraSocials.map((social) => (
                  <a
                    key={`${social.name}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-serif mb-2"
                >
                  Tu nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-300"
                  placeholder="Escribe tu nombre aquí"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-serif mb-2"
                >
                  Tu correo electrónico*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-300"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-serif mb-2"
                >
                  Tu mensaje*
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-300 resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                className="px-10 py-3 bg-foreground text-background font-serif text-sm rounded-full hover:opacity-85 transition-opacity duration-300 cursor-pointer"
              >
                Enviar mensaje
              </button>

              {submitted && (
                <div className="p-4 border border-border rounded-xl text-muted-foreground text-center text-sm">
                  ¡Mensaje enviado! Me pondré en contacto pronto.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
