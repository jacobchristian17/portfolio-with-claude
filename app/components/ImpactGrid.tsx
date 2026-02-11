"use client";
import { useState } from "react";

interface ImpactItem {
  emoji: string;
  company: string;
  impact: string;
  details: string[];
}

interface ImpactGridProps {
  items: ImpactItem[];
}

export default function ImpactGrid({ items }: ImpactGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    // Only toggle on mobile (handled via CSS media queries for hover on desktop)
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  return (
    <div id="impact-grid" className="relative">
      {/* Grid container */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${
          selectedIndex !== null ? "mobile-expanded" : ""
        }`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            id={`impact-card-${index}`}
            onClick={() => handleCardClick(index)}
            className={`
              impact-card glass-card rounded-xl p-4 cursor-pointer
              transition-all duration-300 ease-in-out
              ${selectedIndex === null ? "hover-lift" : ""}
              ${selectedIndex !== null && selectedIndex !== index ? "card-hidden" : ""}
              ${selectedIndex === index ? "card-expanded" : ""}
            `}
          >
            {/* Card Header - Always visible */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-royal-gradient text-sm mb-1">
                  {item.company}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {item.impact}
                </p>
              </div>
              
              {/* Close button - only visible when expanded on mobile */}
              {selectedIndex === index && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="md:hidden text-xl opacity-60 hover:opacity-100 transition-opacity"
                  aria-label="Close"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Details - Desktop: show on hover, Mobile: show when selected */}
            <div 
              className={`
                impact-details overflow-hidden transition-all duration-300
                ${selectedIndex === index ? "mobile-details-visible" : ""}
              `}
            >
              <ul className="mt-4 space-y-2 pl-9">
                {item.details.map((detail, detailIndex) => (
                  <li
                    key={detailIndex}
                    className="text-sm list-disc"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Backdrop for mobile expanded state */}
      {selectedIndex !== null && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 -z-10"
          onClick={handleClose}
        />
      )}
    </div>
  );
}
