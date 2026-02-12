"use client";
import Image from "next/image";
import { memo } from "react";

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

const TechItemCard = memo(({ tech }: { tech: TechItem }) => (
  <div className="group flex flex-col items-center justify-center w-20 h-24 cursor-pointer">
    <div className="w-14 h-14 rounded-xl hover-lift transition-all duration-300 flex items-center justify-center mb-2">
      <Image
        src={tech.logo}
        alt={tech.alt}
        width={44}
        height={44}
        className="object-contain w-full h-full lg:grayscale group-hover:grayscale-0 transition-all duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-xs font-semibold text-gray-700 text-center px-1">${tech.name}</span>`;
          }
        }}
      />
    </div>
    <span className="text-xs font-semibold text-center px-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
      {tech.name}
    </span>
  </div>
));

TechItemCard.displayName = 'TechItemCard';

export default function TechCarousel({
  title,
  subtitle,
  techItems,
  className = ""
}: TechCarouselProps) {
  return (
    <section 
      id="tech-carousel" 
      aria-labelledby="tech-carousel-title"
      className={`w-full backdrop-blur-sm py-6 relative z-3 ${className}`} 
      style={{ backgroundColor: 'var(--carousel-bg)' }}
    >
      <div id="tech-carousel-header" className="text-center mb-6">
        <h3 id="tech-carousel-title" className="text-2xl font-bold text-royal-gradient">{title}</h3>
        {subtitle && (
          <p id="tech-carousel-subtitle" className="mt-2" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        )}
      </div>

      <div id="tech-carousel-container" role="list" className="flex flex-wrap items-center justify-center gap-4 px-4">
        {techItems.map((tech, index) => (
          <div key={tech.name} role="listitem">
            <TechItemCard tech={tech} />
          </div>
        ))}
      </div>
    </section>
  );
}
