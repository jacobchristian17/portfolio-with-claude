"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface ImpactItem {
  emoji?: string;
  image?: string;
  company: string;
  impact: string;
  details: string[];
}

interface ImpactGridProps {
  items: ImpactItem[];
}

type Phase = 'idle' | 'reposition' | 'details';

export default function ImpactGrid({ items }: ImpactGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobileDevice = useRef(false);
  const timeouts = useRef<NodeJS.Timeout[]>([]);
  const isMounted = useRef(true);

  const clearTimeouts = () => {
    timeouts.current.forEach(t => clearTimeout(t));
    timeouts.current = [];
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeouts();
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      isMobileDevice.current = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Store original and target positions for FLIP animation
  const [flipState, setFlipState] = useState<{
    originalTop: number;
    originalLeft: number;
    targetTop: number;
    targetLeft: number;
    width: number;
    height: number;
    phase: 'start' | 'animate' | 'exit' | 'idle';
  } | null>(null);

  // Calculate animation styles when card is selected
  const capturePositions = useCallback((index: number) => {
    const card = cardRefs.current[index];
    const container = containerRef.current;
    if (!card || !container) return null;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const originalTop = cardRect.top - containerRect.top;
    const originalLeft = cardRect.left - containerRect.left;
    const centerLeft = (containerRect.width - cardRect.width) / 2;

    return {
      originalTop,
      originalLeft,
      targetTop: 0,
      targetLeft: centerLeft,
      width: cardRect.width,
      height: cardRect.height,
      phase: 'start' as const,
    };
  }, []);

  const handleSelect = useCallback((index: number) => {
    if (!isMounted.current || selectedIndex === index) return;
    
    clearTimeouts();
    
    // FLIP: Capture original position
    const positions = capturePositions(index);
    if (!positions) return;
    
    // Set to original position first (no visual change)
    setFlipState(positions);
    setSelectedIndex(index);
    setPhase('idle');
    
    // Frame 1: Animate to center-top position
    const t0 = setTimeout(() => {
      if (isMounted.current) {
        setFlipState(prev => prev ? { ...prev, phase: 'animate' } : null);
        setPhase('reposition');
      }
    }, 30);
    
    // Frame 2: Show details
    const t1 = setTimeout(() => {
      if (isMounted.current) setPhase('details');
    }, 700);
    
    timeouts.current = [t0, t1];
  }, [selectedIndex, capturePositions]);

  const handleDeselect = useCallback(() => {
    if (!isMounted.current || selectedIndex === null) return;
    
    clearTimeouts();
    
    // Hide details first, then animate back
    setPhase('idle');
    
    // After details fade, animate position back to original
    const t0 = setTimeout(() => {
      if (isMounted.current) {
        setFlipState(prev => prev ? { ...prev, phase: 'exit' } : null);
      }
    }, 50);
    
    // After position animation completes, clean up
    const t1 = setTimeout(() => {
      if (isMounted.current) {
        setSelectedIndex(null);
        setFlipState(null);
      }
    }, 500);
    
    timeouts.current = [t0, t1];
  }, [selectedIndex]);

  const handleMouseEnter = (index: number) => {
    if (!isMobileDevice.current) handleSelect(index);
  };

  const handleMouseLeave = () => {
    if (!isMobileDevice.current) handleDeselect();
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const clickedCard = target.closest('.impact-card');
      if (!clickedCard) {
        handleDeselect();
      }
    };

    const handleScroll = () => {
      handleDeselect();
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedIndex, handleDeselect]);

  const handleCardClick = (index: number) => {
    if (isMobileDevice.current) {
      if (selectedIndex === index) {
        handleDeselect();
      } else {
        handleSelect(index);
      }
    }
    else if (selectedIndex === index) {
      handleDeselect();
    }
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const isSelected = selectedIndex === index;
    
    if (!isSelected || !flipState) return {};
    
    const { originalTop, originalLeft, targetTop, targetLeft, width, height, phase: flipPhase } = flipState;
    
    if (flipPhase === 'start') {
      // At original position (no transition yet)
      return {
        position: 'absolute',
        top: originalTop,
        left: originalLeft,
        width,
        height: phase === 'details' ? 'auto' : height,
        zIndex: 50,
        transition: 'none',
      };
    }
    
    if (flipPhase === 'animate') {
      // Animate to target position
      return {
        position: 'absolute',
        top: targetTop,
        left: targetLeft,
        width,
        height: phase === 'details' ? 'auto' : height,
        zIndex: 50,
        transition: 'all 0.45s ease-in-out',
      };
    }
    
    if (flipPhase === 'exit') {
      // Animate back to original position
      return {
        position: 'absolute',
        top: originalTop,
        left: originalLeft,
        width,
        height,
        zIndex: 50,
        transition: 'all 0.45s ease-in-out',
      };
    }
    
    return {};
  };

  return (
    <div 
      id="impact-grid" 
      className="relative"
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
    >
      {/* CSS Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHidden = selectedIndex !== null && !isSelected;
          const isAnimating = isSelected && (phase === 'reposition' || phase === 'details');
          
          return (
            <div
              key={index}
              ref={el => { cardRefs.current[index] = el; }}
              id={`impact-card-${index}`}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              className={`
                impact-card glass-card rounded-xl p-4 cursor-pointer
                h-[70px] sm:h-[98px]
                transition-all duration-[450ms] ease-in-out
                ${isAnimating ? '!h-auto' : ''}
                ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
              style={getCardStyle(index)}
            >
              {/* Card Header */}
              <div 
                id={`impact-card-${index}-header`}
                className="flex items-center justify-start w-full"
              >
                <div className="flex items-start gap-3 max-w-full">
                  {item.image ? (
                    <div id={`impact-card-${index}-icon`} className="w-8 h-8 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.company}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span id={`impact-card-${index}-emoji`} className="text-2xl flex-shrink-0">
                      {item.emoji}
                    </span>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p id={`impact-card-${index}-company`} className="font-bold text-royal-gradient-sm text-sm mb-1 text-left">
                      {item.company}
                    </p>
                    <p id={`impact-card-${index}-impact`} className="text-sm truncate sm:whitespace-normal text-left" style={{ color: "var(--text-secondary)" }}>
                      {item.impact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div 
                id={`impact-card-${index}-details`}
                className={`
                  overflow-hidden transition-all duration-500 ease-in-out text-left
                  ${isSelected && phase === 'details' 
                    ? 'max-h-[300px] opacity-100 translate-y-0' 
                    : 'max-h-0 opacity-0 -translate-y-4'
                  }
                `}
              >
                <div className="border-t border-white/10 pt-4 mt-4">
                  <ul id={`impact-card-${index}-details-list`} className="space-y-2 pl-6 text-left">
                    {item.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        id={`impact-card-${index}-detail-${detailIndex}`}
                        className="text-sm list-disc"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
