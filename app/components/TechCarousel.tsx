"use client";
import Image from "next/image";

export interface TechItem {
  name: string;
  logo: string;
  alt: string;
}

interface TechCarouselProps {
  title?: string;
  subtitle?: string;
  techItems: TechItem[];
  className?: string;
}

export default function TechCarousel({ 
  title,
  subtitle,
  techItems,
  className = ""
}: TechCarouselProps) {
  return (
    <div className={`w-full overflow-hidden backdrop-blur-sm py-6 relative z-3 ${className}`} style={{ backgroundColor: 'var(--carousel-bg)' }}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-royal-gradient">{title}</h3>
        {subtitle && (
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        )}
      </div>
      
      <div className="relative h-40 overflow-hidden">
        <div className="logo-carousel">
          <div className="logo-carousel-track">
            {/* First set of items */}
            {techItems.map((tech, index) => (
              <div
                key={`first-${index}`}
                className="group flex flex-col items-center justify-center w-28 h-36 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl hover-lift transition-all duration-300 shadow-soft flex items-center justify-center mb-3">
                  <Image
                    src={tech.logo}
                    alt={tech.alt}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-sm font-semibold text-gray-700 text-center px-2">${tech.name}</span>`;
                      }
                    }}
                  />
                </div>
                {/* Name below logo */}
                <span className="text-xs font-semibold text-center px-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {tech.name}
                </span>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {techItems.map((tech, index) => (
              <div
                key={`duplicate-${index}`}
                className="group flex flex-col items-center justify-center w-28 h-36 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl hover-lift transition-all duration-300 shadow-soft flex items-center justify-center mb-3">
                  <Image
                    src={tech.logo}
                    alt={tech.alt}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-sm font-semibold text-gray-700 text-center px-2">${tech.name}</span>`;
                      }
                    }}
                  />
                </div>
                {/* Name below logo */}
                <span className="text-xs font-semibold text-center px-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}