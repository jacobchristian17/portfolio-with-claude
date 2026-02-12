"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { hero1, hero1Shadow } from "../assets/bg-images";
import { useAppSelector } from "../store/hooks";

const SPEED = 0.05;
const MOBILE_SPEED = 0.01;
const MOBILE_BREAKPOINT = 768;

export default function HeroImage() {
    const { isDarkMode } = useAppSelector((state) => state.theme);

    const [scrollY, setScrollY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const prefersReducedMotion = useRef(false);
    const resizeTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setHasMounted(true);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const handleScroll = () => {
            if (!prefersReducedMotion.current) {
                setScrollY(window.scrollY);
            }
        };
        
        const handleResize = () => {
            if (resizeTimer.current) clearTimeout(resizeTimer.current);
            resizeTimer.current = setTimeout(() => {
                setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
            }, 150);
        };
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            if (resizeTimer.current) clearTimeout(resizeTimer.current);
        };
    }, []);

    const viewSpeed = isMobile ? MOBILE_SPEED : SPEED;
    const parallaxOffset = scrollY * viewSpeed;
    const baseOffset = isMobile ? 150 : 100;

    // Use CSS classes for responsive positioning, JS only for scroll effect
    const getTransformStyle = useCallback((): React.CSSProperties => {
        if (!hasMounted) return {};
        return { 
            transform: `translateY(${parallaxOffset + baseOffset}px)`,
            willChange: 'transform',
        };
    }, [hasMounted, parallaxOffset, baseOffset]);

    return (
        <div
            id="hero-image"
            className="fixed inset-0 top-0 w-full h-full -z-10">
            <Image
                id="hero-image-dark"
                src={hero1.img}
                alt={hero1.alt}
                fill
                priority
                className={`object-contain 
                    object-bottom md:object-center md:translate-x-[40vw]
                    ${isDarkMode ? "visible" : "hidden"}
                `}
                style={getTransformStyle()}
            />
            <Image
                id="hero-image-light"
                src={hero1Shadow.img}
                alt={hero1Shadow.alt}
                fill
                className={`object-contain 
                    object-bottom md:object-center md:translate-x-[40vw]
                    ${isDarkMode ? "hidden" : "visible"}
                `}
                style={getTransformStyle()}
            />
        </div>
    )
}
