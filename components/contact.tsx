"use client";

import type React from "react";

import { useState } from "react";

const Contact = () => {
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
      className="w-full bg-black py-20 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Contacto
          </h2>
          <p className="text-neutral-400 text-lg text-balance">
            ¿Te gustaría trabajar conmigo o tienes alguna pregunta? Escríbeme y
            hablamos de tu proyecto.
          </p>
        </div>
        {/* Form
        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors duration-300"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors duration-300"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors duration-300 resize-none"
              placeholder="Tu mensaje..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105"
          >
            Enviar mensaje
          </button>

          {submitted && (
            <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-300 text-center">
              ¡Mensaje enviado! Me pondré en contacto pronto.
            </div>
          )}
        </form> */}
        {/* Contact Info */}
        <div className="border-t border-neutral-800 pt-12 text-center">
          {/* <p className="text-neutral-400 mb-6">O contactame directamente en:</p> */}
          <p className="text-neutral-400 mb-6">Contactame directamente en:</p>
          <p className="text-white text-lg font-semibold mb-8">
            mvillegasgallery@gmail.com
          </p>
          <a
            href="https://instagram.com/mvillegas_gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border-2 border-neutral-700 text-neutral-300 font-semibold rounded-lg hover:border-white hover:text-white transition-all duration-300"
          >
            Escríbeme por Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
