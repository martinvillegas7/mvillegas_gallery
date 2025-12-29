"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setPortfolioDropdownOpen(false);
      }
    };

    if (portfolioDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [portfolioDropdownOpen]);

  const navItems = [
    { label: "Inicio", href: "#hero" },
    { label: "Selección", href: "#portfolio" },
    { label: "Sobre mí", href: "#about" },
    // { label: "Instagram", href: "#instagram" },
    { label: "Contacto", href: "#contact" },
  ];

  const portfolioCategories = [
    { label: "Naturaleza", href: "/naturaleza" },
    { label: "Deporte", href: "/deporte" },
    { label: "Paisaje", href: "/paisaje" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      // Si estamos en la página principal, hacer scroll
      if (pathname === "/") {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        // Si estamos en otra página, navegar a la página principal con el hash
        window.location.href = "/" + href;
      }
    } else {
      router.push(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="text-xl md:text-2xl font-bold tracking-tight text-white hover:text-neutral-300 transition-colors duration-300 cursor-pointer"
          >
            Martín Villegas
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-sm text-neutral-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            
            {/* Portfolio Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPortfolioDropdownOpen(!portfolioDropdownOpen)}
                className="text-sm text-neutral-300 hover:text-white transition-colors duration-300 flex items-center gap-1 cursor-pointer"
              >
                Portfolio
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    portfolioDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {portfolioDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg overflow-hidden min-w-[160px]">
                  {portfolioCategories.map((category) => (
                    <button
                      key={category.href}
                      onClick={() => {
                        handleNavClick(category.href);
                        setPortfolioDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors duration-300 cursor-pointer"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900/50 rounded transition-colors duration-300 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            
            {/* Portfolio Dropdown Mobile */}
            <div className="space-y-1">
              <div className="px-4 py-2 text-sm text-neutral-400 font-medium">
                Portfolio
              </div>
              {portfolioCategories.map((category) => (
                <button
                  key={category.href}
                  onClick={() => {
                    handleNavClick(category.href);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-6 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900/50 rounded transition-colors duration-300 cursor-pointer"
                >
                  {category.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
