"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about-work", label: "Work Experience", icon: "💼" },
  { href: "/about-school", label: "Education", icon: "🎓" },
  { href: "/about-me", label: "About Me", icon: "🥷🏻" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar-backdrop fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-royal-gradient">
            Jacob's Space
          </div>
          
          <ul className="flex space-x-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    pathname === link.href 
                      ? "bg-royal-gradient text-white shadow-royal" 
                      : "text-gray-700 hover:bg-glass-card hover:shadow-soft"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
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
