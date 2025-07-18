"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme } from "../store/themeSlice";


export default function FloatingThemeToggle() {
    const dispatch = useAppDispatch();
    const { isDarkMode } = useAppSelector((state) => state.theme);

    // Sync DOM class with Redux state
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const lightModeLogo = <div className="fixed z-99 bottom-5 right-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#1e40af] shadow cursor-pointer text-[#fbbf24] hover:text-white hover-glow">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.7em" fill="currentColor" viewBox="0 0 512 512">
            <path
                d="M 336 384 Q 353 338 385 299 L 385 299 L 385 299 Q 385 298 385 298 L 385 298 L 385 298 Q 393 287 401 276 Q 431 233 432 176 Q 430 101 380 52 Q 331 2 256 0 Q 181 2 132 52 Q 82 101 80 176 Q 81 233 111 276 Q 119 287 127 297 Q 127 298 127 298 L 127 298 L 127 298 Q 159 337 176 384 L 336 384 L 336 384 Z M 256 512 Q 290 511 313 489 L 313 489 L 313 489 Q 335 466 336 432 L 336 416 L 336 416 L 176 416 L 176 416 L 176 432 L 176 432 Q 177 466 199 489 Q 222 511 256 512 L 256 512 Z M 176 176 Q 175 191 160 192 Q 145 191 144 176 Q 145 128 177 97 Q 208 65 256 64 Q 271 65 272 80 Q 271 95 256 96 Q 222 97 199 119 Q 177 142 176 176 L 176 176 Z"
            />
        </svg>
    </div>
    const darkModeLogo = <div className="fixed z-99 bottom-5 right-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#1e40af] shadow cursor-pointer text-white hover:bg-[#fbbf24] hover:text-[#1e40af] hover-glow">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.7em" fill="currentColor" viewBox="0 0 512 512">
            <path
                d="M 55.2 57.2 L 93.6 82.8 L 55.2 57.2 L 93.6 82.8 Q 107.2 94 99.2 109.2 Q 88 122.8 72.8 114.8 L 34.4 89.2 L 34.4 89.2 Q 20.8 78 28.8 62.8 Q 40 49.2 55.2 57.2 L 55.2 57.2 Z M 477.6 89.2 L 439.2 114.8 L 477.6 89.2 L 439.2 114.8 Q 424 123.6 412.8 109.2 Q 404 94 418.4 82.8 L 456.8 57.2 L 456.8 57.2 Q 472 48.4 483.2 62.8 Q 492 78 477.6 89.2 L 477.6 89.2 Z M 19.2 182 L 70.4 182 L 19.2 182 L 70.4 182 Q 88 183.6 89.6 201.2 Q 88 218.8 70.4 220.4 L 19.2 220.4 L 19.2 220.4 Q 1.6 218.8 0 201.2 Q 1.6 183.6 19.2 182 L 19.2 182 Z M 441.6 182 L 492.8 182 L 441.6 182 L 492.8 182 Q 510.4 183.6 512 201.2 Q 510.4 218.8 492.8 220.4 L 441.6 220.4 L 441.6 220.4 Q 424 218.8 422.4 201.2 Q 424 183.6 441.6 182 L 441.6 182 Z M 93.6 319.6 L 55.2 345.2 L 93.6 319.6 L 55.2 345.2 Q 40 354 28.8 339.6 Q 20 324.4 34.4 313.2 L 72.8 287.6 L 72.8 287.6 Q 88 278.8 99.2 293.2 Q 108 308.4 93.6 319.6 L 93.6 319.6 Z M 439.2 287.6 L 477.6 313.2 L 439.2 287.6 L 477.6 313.2 Q 491.2 324.4 483.2 339.6 Q 472 353.2 456.8 345.2 L 418.4 319.6 L 418.4 319.6 Q 404.8 308.4 412.8 293.2 Q 424 279.6 439.2 287.6 L 439.2 287.6 Z M 359.2 292.4 Q 333.6 323.6 320 361.2 L 192 361.2 L 192 361.2 Q 178.4 324.4 152.8 293.2 Q 152.8 292.4 152.8 292.4 L 152.8 292.4 L 152.8 292.4 L 152.8 292.4 L 152.8 292.4 Q 146.4 283.6 140 274.8 Q 116 240.4 115.2 194.8 Q 116.8 134.8 156.8 95.6 Q 196 55.6 256 54 Q 316 55.6 355.2 95.6 Q 395.2 134.8 396.8 194.8 Q 396 240.4 372 274.8 Q 365.6 283.6 359.2 291.6 Q 359.2 292.4 359.2 292.4 L 359.2 292.4 L 359.2 292.4 L 359.2 292.4 L 359.2 292.4 Z M 320 399.6 Q 319.2 426.8 301.6 445.2 L 301.6 445.2 L 301.6 445.2 Q 283.2 462.8 256 463.6 Q 228.8 462.8 210.4 445.2 Q 192.8 426.8 192 399.6 L 192 386.8 L 192 386.8 L 320 386.8 L 320 386.8 L 320 399.6 L 320 399.6 Z M 256 130.8 Q 268 130 268.8 118 Q 268 106 256 105.2 Q 217.6 106 192.8 131.6 Q 167.2 156.4 166.4 194.8 Q 167.2 206.8 179.2 207.6 Q 191.2 206.8 192 194.8 Q 192.8 167.6 210.4 149.2 Q 228.8 131.6 256 130.8 L 256 130.8 Z"
            />
        </svg>
    </div>



    function handleToggleDarkMode() {
        dispatch(toggleTheme())
    }

    return <div onClick={handleToggleDarkMode}>
        {isDarkMode ? lightModeLogo : darkModeLogo}
    </div>
}
