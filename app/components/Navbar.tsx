"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about-work", label: "Work Experience", icon: "💼" },
  { href: "/about-school", label: "Education", icon: "🎓" },
  { href: "/about-me", label: "🥷🏻 About Me", icon: "🥷🏻" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY === 0) {
        // Always show navbar at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide navbar when scrolling down (after 100px)
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show navbar when scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar-backdrop fixed top-0 left-0 right-0 z-50 px-6 py-4 ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-royal-gradient">
            Jacob&rsquo;s Space
          </div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    pathname === link.href 
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <span className={`block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 navbar-backdrop transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <ul className="flex flex-col space-y-2 p-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all duration-300 ${
                    pathname === link.href 
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
