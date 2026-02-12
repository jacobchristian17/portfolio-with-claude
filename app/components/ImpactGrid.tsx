"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// Constants
const MOBILE_BREAKPOINT = 768;
const TIMING = {
  FRAME_1_DELAY: 30,
  FRAME_2_DELAY: 420,
  EXIT_DELAY: 50,
  EXIT_CLEANUP: 500,
  CLICK_LISTENER_DELAY: 100,
} as const;

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'; // Smooth natural easing

interface ImpactItem {
  company: string;
  impact: string;
  details: string[];
}

interface ImpactGridProps {
  items: ImpactItem[];
}

type Phase = 'idle' | 'reposition' | 'details';
type FlipPhase = 'start' | 'animate' | 'exit';

export default function ImpactGrid({ items }: ImpactGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
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
    let resizeTimer: NodeJS.Timeout;
    const checkMobile = () => {
      isMobileDevice.current = window.innerWidth < MOBILE_BREAKPOINT;
    };
    const debouncedCheck = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 150);
    };
    checkMobile();
    window.addEventListener('resize', debouncedCheck, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedCheck);
    };
  }, []);

  // FLIP animation state
  const [flipState, setFlipState] = useState<{
    originalTop: number;
    originalLeft: number;
    targetTop: number;
    targetLeft: number;
    width: number;
    height: number;
    phase: FlipPhase;
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
    
    // Capture container height to prevent layout shift
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
    
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
    }, TIMING.FRAME_1_DELAY);
    
    // Frame 2: Show details
    const t1 = setTimeout(() => {
      if (isMounted.current) setPhase('details');
    }, TIMING.FRAME_2_DELAY);
    
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
    }, TIMING.EXIT_DELAY);
    
    // After position animation completes, clean up
    const t1 = setTimeout(() => {
      if (isMounted.current) {
        setSelectedIndex(null);
        setFlipState(null);
        setContainerHeight(null);
      }
    }, TIMING.EXIT_CLEANUP);
    
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

    let listenersAdded = false;

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
      if (!isMounted.current) return;
      listenersAdded = true;
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, TIMING.CLICK_LISTENER_DELAY);

    return () => {
      clearTimeout(timer);
      if (listenersAdded) {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        window.removeEventListener('scroll', handleScroll);
      }
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (selectedIndex === index) {
        handleDeselect();
      } else {
        handleSelect(index);
      }
    } else if (e.key === 'Escape' && selectedIndex !== null) {
      e.preventDefault();
      handleDeselect();
    }
  }, [selectedIndex, handleSelect, handleDeselect]);

  // Memoized transition string
  const transitionStyle = `top 0.45s ${EASING}, left 0.45s ${EASING}, height 0.45s ${EASING}`;

  const getCardStyle = useCallback((index: number): React.CSSProperties => {
    const isSelected = selectedIndex === index;
    
    if (!isSelected || !flipState) return {};
    
    const { originalTop, originalLeft, targetTop, targetLeft, width, height, phase: flipPhase } = flipState;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width,
      zIndex: 50,
      willChange: 'top, left, height',
    };
    
    if (flipPhase === 'start') {
      return {
        ...baseStyle,
        top: originalTop,
        left: originalLeft,
        height: phase === 'details' ? 'auto' : height,
        transition: 'none',
      };
    }
    
    if (flipPhase === 'animate') {
      return {
        ...baseStyle,
        top: targetTop,
        left: targetLeft,
        height: phase === 'details' ? 'auto' : height,
        transition: transitionStyle,
      };
    }
    
    if (flipPhase === 'exit') {
      return {
        ...baseStyle,
        top: originalTop,
        left: originalLeft,
        height,
        transition: transitionStyle,
      };
    }
    
    return {};
  }, [selectedIndex, flipState, phase, transitionStyle]);

  return (
    <div 
      id="impact-grid" 
      className="relative"
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      style={containerHeight ? { height: containerHeight, minHeight: containerHeight } : undefined}
    >
      {/* CSS Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHidden = selectedIndex !== null && !isSelected;
          
          return (
            <div
              key={index}
              ref={el => { cardRefs.current[index] = el; }}
              id={`impact-card-${index}`}
              role="button"
              tabIndex={isHidden ? -1 : 0}
              aria-expanded={isSelected}
              aria-label={`${item.company}: ${item.impact}`}
              onClick={() => handleCardClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onMouseEnter={() => handleMouseEnter(index)}
              className={`
                impact-card glass-card rounded-xl p-4 cursor-pointer
                h-[70px] sm:h-[98px]
                transition-all duration-[450ms] ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                active:scale-[0.98] active:opacity-90 sm:active:scale-100 sm:active:opacity-100
                ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
              style={getCardStyle(index)}
            >
              {/* Card Header */}
              <header id={`impact-card-${index}-header`} className="text-left">
                <h3 id={`impact-card-${index}-company`} className="font-bold text-white text-sm mb-1">
                  {item.company}
                </h3>
                <p 
                  id={`impact-card-${index}-impact`} 
                  className={`text-sm text-[var(--text-secondary)] ${isSelected ? 'whitespace-normal' : 'truncate'}`}
                >
                  {item.impact}
                </p>
              </header>

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
                        className="text-sm list-disc transition-colors duration-200 cursor-pointer text-[var(--text-secondary)] hover:!text-white"
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
