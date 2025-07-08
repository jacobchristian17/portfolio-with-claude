"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { hero1, hero1Shadow } from "../assets/bg-images";

const SPEED = 0.5;
const DIRECTION = -1;
const XOFFSET = 300;
interface HeroImageProps {
    shadow?: boolean;
}
export default function HeroImage({ shadow }: HeroImageProps) {
    let isDarkMode = false
    if (typeof window !== "undefined") {
        isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    const image = isDarkMode ? hero1Shadow : hero1



    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const slowSpeed = scrollY * SPEED * DIRECTION + XOFFSET

    return (
        <div
            className="fixed right-0 bottom-0 w-full aspect-[16/9]">
            <Image
                src={image.img}
                alt={image.alt}
                fill
                className="object-contain translate-x-1/3"
                style={{ transform: `translateY(${slowSpeed}px)` }}
            />
        </div>
    )


}