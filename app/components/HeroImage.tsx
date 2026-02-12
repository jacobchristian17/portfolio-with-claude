"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { hero1, hero1Shadow } from "../assets/bg-images";
import { useAppSelector } from "../store/hooks";

const SPEED = 0.05;
const MOBILE_SPEED = 0.01;
const DIRECTION = 1;

export default function HeroImage() {
    const { isDarkMode } = useAppSelector((state) => state.theme);

    const [scrollY, setScrollY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        setIsMobile(window.innerWidth < 768);
        
        const handleScroll = () => setScrollY(window.scrollY);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const viewSpeed = isMobile ? MOBILE_SPEED : SPEED;
    const currentSpeed = scrollY * viewSpeed * DIRECTION;

    // Use CSS classes for responsive positioning, JS only for scroll effect
    const getTransformStyle = () => {
        if (!hasMounted) return {};
        return { 
            transform: `translateY(${currentSpeed + (isMobile ? 150 : 100)}px)` 
        };
    };

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
