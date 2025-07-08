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

  return (
    <nav className={`navbar-backdrop fixed top-0 left-0 right-0 z-50 px-6 py-4 ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-royal-gradient">
            Jacob&rsquo;s Space
          </div>
          
          <ul className="flex space-x-8">
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
                  {/* <span className="text-lg">{link.icon}</span> */}
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
