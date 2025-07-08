"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { hero1, hero1Shadow } from "../assets/bg-images";
import { useAppSelector } from "../store/hooks";

const SPEED = 0.5;
const MOBILE_SPEED = 0.1;
const DIRECTION = -1;
const XOFFSET = 300;

export default function HeroImage() {
    const { isDarkMode } = useAppSelector((state) => state.theme);
    const image = isDarkMode ? hero1 : hero1Shadow

    const [scrollY, setScrollY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const currentSpeed = isMobile ? MOBILE_SPEED : SPEED;
    const slowSpeed = scrollY * currentSpeed * DIRECTION + XOFFSET;

    return (
        <div
            className="fixed inset-0 w-full h-full z-0">
            {isDarkMode && <Image
                src={hero1.img}
                alt={hero1.alt}
                fill
                priority
                className={`object-contain hero-img ${
                    isMobile ? "translate-x-0" : "translate-x-1/3"
                }`}
                style={{ transform: `translateY(${slowSpeed}px)` }}
            />}
            {!isDarkMode && <Image
                src={hero1Shadow.img}
                alt={hero1Shadow.alt}
                fill
                priority
                className={`object-contain hero-img ${
                    isMobile ? "translate-x-0" : "translate-x-1/3"
                }`}
                style={{ transform: `translateY(${slowSpeed}px)` }}
            />}
        </div>
    )


}