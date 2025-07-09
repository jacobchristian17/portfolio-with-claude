"use client";
import { useState, useEffect } from "react";

interface FloatingPDFButtonProps {
  targetId: string;
  className?: string;
}

export default function FloatingPDFButton({ targetId, className = "" }: FloatingPDFButtonProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrollingToPDF, setIsScrollingToPDF] = useState(false);

  useEffect(() => {
    const pdfElement = document.getElementById(targetId);
    if (!pdfElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide button when PDF is in view
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1, // Show/hide when 10% of PDF is visible
        rootMargin: '-100px 0px' // Add some margin to trigger earlier
      }
    );

    observer.observe(pdfElement);

    // Initial check for visibility based on scroll position
    const checkInitialVisibility = () => {
      const pdfRect = pdfElement.getBoundingClientRect();
      const pdfPosition = pdfRect.top + window.scrollY;
      // Show button when scrolled past 300px but PDF is not in view
      setIsVisible(pdfRect.top > 500);
    };

    checkInitialVisibility();
    window.addEventListener('scroll', checkInitialVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkInitialVisibility);
    };
  }, [targetId]);

  const scrollToPDF = () => {
    const pdfElement = document.getElementById(targetId);
    if (pdfElement) {
      setIsScrollingToPDF(true);
      pdfElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });

      // Reset scrolling state after animation
      setTimeout(() => {
        setIsScrollingToPDF(false);
      }, 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToPDF}
      className={`fixed top-30 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-1000 hover:scale-110 active:scale-95 cursor-pointer ${isScrollingToPDF ? 'animate-pulse' : ''
        } bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium ${className}`}
      aria-label="Scroll to PDF viewer"
      title="View Resume PDF"
    >
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${isScrollingToPDF ? 'animate-bounce' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="hidden sm:inline">Resume</span>
    </button>
  );
}