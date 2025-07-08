"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { hero1, hero1Shadow } from "../assets/bg-images";
import { useAppSelector } from "../store/hooks";

const SPEED = 0.5;
const DIRECTION = -1;
const XOFFSET = 300;

export default function HeroImage() {
    const { isDarkMode } = useAppSelector((state) => state.theme);
    const image = isDarkMode ? hero1 : hero1Shadow


    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const slowSpeed = scrollY * SPEED * DIRECTION + XOFFSET

    return (
        <div
            className="fixed right-0 bottom-0 w-full aspect-[16/9] z-0">
            {isDarkMode && <Image
                src={hero1.img}
                alt={hero1.alt}
                fill
                className="object-contain translate-x-1/3 hero-img"
                style={{ transform: `translateY(${slowSpeed}px)` }}
            />}
            {!isDarkMode && <Image
                src={hero1Shadow.img}
                alt={hero1Shadow.alt}
                fill
                className="object-contain translate-x-1/3 hero-img"
                style={{ transform: `translateY(${slowSpeed}px)` }}
            />}
        </div>
    )


}