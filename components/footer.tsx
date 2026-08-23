"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif italic text-lg">Martín Villegas</p>
          <p className="text-muted-foreground text-sm mt-1">
            Fotógrafo profesional
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <Link
            href="/naturaleza"
            className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
          >
            Naturaleza
          </Link>
          <Link
            href="/retratos"
            className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
          >
            Retratos
          </Link>
          <Link
            href="/deporte"
            className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
          >
            Deporte
          </Link>
          <Link
            href="/contacto"
            className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
          >
            Contacto
          </Link>
          <a
            href="https://instagram.com/martinvillegas_ph"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        </div>

        <p className="text-muted-foreground text-xs">
          © 2025 Martín Villegas
        </p>
      </div>
    </footer>
  );
};

export default Footer;
