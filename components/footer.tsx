"use client";

import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Martín Villegas
            </h3>
            <p className="text-neutral-400 text-sm">Fotógrafo profesional</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Enlaces
            </h4>
            <div className="space-y-2">
              <a
                href="https://instagram.com/mvillegas_gallery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 text-sm hover:text-white transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="#portfolio"
                className="block text-neutral-400 text-sm hover:text-white transition-colors duration-300"
              >
                Portfolio
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Sígueme
            </h4>
            <a
              href="https://instagram.com/mvillegas_gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 hover:border-white hover:text-white transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-8">
          <p className="text-center text-neutral-500 text-sm">
            © 2025 Martín Villegas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
