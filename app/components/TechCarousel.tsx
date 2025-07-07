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
  title = "🛠️ Technologies & Tools I Love",
  subtitle,
  techItems,
  className = ""
}: TechCarouselProps) {
  return (
    <div className={`w-full overflow-hidden bg-white bg-opacity-30 backdrop-blur-sm py-12 mb-12 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-royal-gradient">{title}</h3>
        {subtitle && (
          <p className="text-gray-600 mt-2">{subtitle}</p>
        )}
      </div>
      
      <div className="relative h-20 overflow-hidden">
        <div className="logo-carousel">
          <div className="logo-carousel-track">
            {/* First set of items */}
            {techItems.map((tech, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl hover-lift transition-all duration-300 shadow-soft"
                title={tech.name}
              >
                <Image
                  src={tech.logo}
                  alt={tech.alt}
                  width={48}
                  height={48}
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-semibold text-gray-700 text-center px-2">${tech.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {techItems.map((tech, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl hover-lift transition-all duration-300 shadow-soft"
                title={tech.name}
              >
                <Image
                  src={tech.logo}
                  alt={tech.alt}
                  width={48}
                  height={48}
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-semibold text-gray-700 text-center px-2">${tech.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}