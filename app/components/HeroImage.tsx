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

    const viewSpeed = isMobile ? MOBILE_SPEED : SPEED;
    const currentSpeed = scrollY * viewSpeed * DIRECTION

    return (
        <div
            id="hero-image"
            className={`fixed inset-0 top-0 w-full h-full ${isMobile ? 'z-2' : 'z-0'}`}>
            <Image
                id="hero-image-dark"
                src={hero1.img}
                alt={hero1.alt}
                fill
                priority
                className={`object-contain 
                    ${isMobile ? "object-bottom" : "translate-x-[40vw]"}
                    ${isDarkMode ? "visible" : "hidden"}
                `}
                style={!isMobile ? { transform: `translateY(${currentSpeed + 100}px)` } : { transform: `translateY(${currentSpeed + 150}px)` }}
            />
            <Image
                id="hero-image-light"
                src={hero1Shadow.img}
                alt={hero1Shadow.alt}
                fill
                className={`object-contain 
                    ${isMobile ? "object-bottom" : "translate-x-[40vw]"}
                    ${isDarkMode ? "hidden" : "visible"}
                `}
                style={!isMobile ? { transform: `translateY(${currentSpeed + 100}px)` } : { transform: `translateY(${currentSpeed + 150}px)` }}
            />
        </div>
    )
}
