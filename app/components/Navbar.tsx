"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";

const links = [
  { href: "/", label: "Home", icon: "🏠" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close menu on scroll down
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav id="navbar" className={`navbar-backdrop fixed top-0 left-0 right-0 z-50 px-6 py-4 ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div id="navbar-container" className="max-w-7xl mx-auto">
        <div id="navbar-content" className="flex items-center justify-between">
          <Link
            href="/"
            id="navbar-logo-link"
          >
            <span id="navbar-logo-text" className="text-2xl font-bold text-royal-gradient">
              Jacob&rsquo;s Space
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul id="navbar-desktop-menu" className="hidden md:flex justify-center align-center space-x-8">
            {links.map((link) => (
              <li key={link.href} id={`navbar-item-${link.label.toLowerCase()}`}>
                <Link
                  href={link.href}
                  id={`navbar-link-${link.label.toLowerCase()}`}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-100 hover:scale-105 hover:shadow-soft ${pathname === link.href
                    ? "bg-royal-gradient text-white shadow-royal"
                    : ""
                    }`}
                  style={pathname !== link.href ? { color: 'var(--text-primary)' } : {}}
                >
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            id="navbar-mobile-toggle"
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="navbar-mobile-menu"
          >
            <span className={`block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div id="navbar-mobile-menu" className={`md:hidden absolute top-full left-0 right-0 navbar-backdrop transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <ul id="navbar-mobile-menu-list" className="flex flex-col space-y-2 p-4">
            {links.map((link) => (
              <li key={link.href} id={`navbar-mobile-item-${link.label.toLowerCase()}`}>
                <Link
                  href={link.href}
                  id={`navbar-mobile-link-${link.label.toLowerCase()}`}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all duration-300 ${pathname === link.href
                    ? "bg-royal-gradient text-white shadow-royal"
                    : "hover:bg-glass-card hover:shadow-soft"
                    }`}
                  style={pathname !== link.href ? { color: 'var(--text-primary)' } : {}}
                >
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
