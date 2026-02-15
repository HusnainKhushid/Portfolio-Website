"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface WhatIDoProps {
    variant?: "default" | "reveal";
}

export default function WhatIDo({ variant = "default" }: WhatIDoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (variant === "default" && containerRef.current) {
            const items = containerRef.current.querySelectorAll(".mask-reveal");
            items.forEach((maskElement: Element) => {
                const el = maskElement as HTMLElement;
                const spanTag = el.querySelector("span") as HTMLElement;
                if (spanTag) {
                    // placeholder
                }
            });
        }
    }, [variant]);

    useLayoutEffect(() => {
        if (variant === "default" && containerRef.current) {
            const grayItems = containerRef.current.querySelectorAll('.gray-item');
            const orangeItems = containerRef.current.querySelectorAll('.mask-reveal');

            grayItems.forEach((grayEl, index) => {
                const orangeEl = orangeItems[index] as HTMLElement;
                if (!orangeEl) return;

                gsap.set(orangeEl, {
                    maskSize: "100% 0%",
                    WebkitMaskSize: "100% 0%",
                });

                const animateTo = (height: string) => {
                    gsap.to(orangeEl, {
                        maskSize: `100% ${height}`,
                        WebkitMaskSize: `100% ${height}`,
                        duration: 0.6,
                        ease: "power1.out",
                    });
                }

                grayEl.addEventListener('mouseenter', () => animateTo("100%"));
                grayEl.addEventListener('mouseleave', () => animateTo("0%"));

                orangeEl.addEventListener('mouseenter', () => animateTo("100%"));
                orangeEl.addEventListener('mouseleave', () => animateTo("0%"));
            });
        }
    }, [variant]);

    /* ─── Responsive text size classes ──────────────────────────── */
    const bigText = "text-[clamp(2.5rem,10vw,120px)]";
    const smallText = "text-[clamp(0.875rem,2.5vw,30px)]";

    if (variant === "reveal") {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#EB5939]">
                <div className="relative w-full h-[60px] sm:h-[80px] md:h-[100px] flex items-center">
                    <span className="absolute left-[12.5%] text-sm sm:text-lg md:text-2xl text-black font-semibold tracking-[0.3em]">
                        WHAT I DO
                    </span>
                </div>

                <div className="w-full flex justify-center">
                    <div className="w-full">
                        <div className="border-t-1 border-gray-500">
                            <p className={`${bigText} font-bold text-black ml-[15%]`}>
                                <span data-mask-size="0"> VISUAL</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500">
                            <p className={`${bigText} font-bold text-black ml-[15%]`}>
                                <span data-mask-size="0"> MOTION</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500">
                            <p className={`${bigText} font-bold text-black ml-[15%]`}>
                                <span data-mask-size="0">PRODUCT</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500 border-b-1">
                            <p className={`${bigText} font-bold text-black ml-[15%]`}>
                                <span data-mask-size="0">PROMO</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // DEFAULT VARIANT
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] relative" ref={containerRef}>
            <div className="bg-[#D9D9D9] w-full">
                <div className="relative w-full h-[60px] sm:h-[80px] md:h-[100px] flex items-center">
                    <span className="absolute left-[12.5%] text-sm sm:text-lg md:text-2xl text-black font-semibold tracking-[0.3em]">
                        WHAT I DO
                    </span>
                </div>

                <div className="w-full flex justify-center relative">

                    {/* BASE: Gray Text */}
                    <div className="w-full">
                        <div className="border-t-1 border-gray-500 gray-item cursor-pointer">
                            <p className={`reveal-text ${bigText} font-bold text-gray-800 ml-[15%]`}>
                                <span data-mask-size="0"> VISUAL</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500 gray-item cursor-pointer">
                            <p className={`reveal-text ${bigText} font-bold text-gray-800 ml-[15%]`}>
                                <span data-mask-size="0"> MOTION</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500 gray-item cursor-pointer">
                            <p className={`reveal-text ${bigText} font-bold text-gray-800 ml-[15%]`}>
                                <span data-mask-size="0">PRODUCT</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500 border-b-1 gray-item cursor-pointer">
                            <p className={`reveal-text ${bigText} font-bold text-gray-800 ml-[15%]`}>
                                <span data-mask-size="0">PROMO</span>
                            </p>
                        </div>
                    </div>

                    {/* OVERLAY: Orange Bars (Absolutely positioned on top) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="w-full h-full flex flex-col">
                            <div className="border-t border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className={`${bigText} font-bold text-black`}>
                                    <span data-mask-size="0">VISUAL</span>
                                </p>
                                <p className={`${smallText} font-medium text-black/90 ml-auto mr-[5%] sm:mr-[10%] md:mr-[15%]`}>
                                    <span data-mask-size="0">DESIGN</span>
                                </p>
                            </div>

                            <div className="border-t border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className={`${bigText} font-bold text-black`}>
                                    <span data-mask-size="0"> MOTION</span>
                                </p>
                                <p className={`${smallText} font-medium text-black/90 ml-auto mr-[5%] sm:mr-[10%] md:mr-[15%]`}>
                                    <span data-mask-size="0">GRAPHICS</span>
                                </p>
                            </div>

                            <div className="border-t border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className={`${bigText} font-bold text-black`}>
                                    <span data-mask-size="0">PRODUCT</span>
                                </p>
                                <p className={`${smallText} font-medium text-black/90 ml-auto mr-[5%] sm:mr-[10%] md:mr-[15%]`}>
                                    <span data-mask-size="0">INTERFACES</span>
                                </p>
                            </div>

                            <div className="border-t border-gray-500 border-b border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className={`${bigText} font-bold text-black`}>
                                    <span data-mask-size="0">PROMO</span>
                                </p>
                                <p className={`${smallText} font-medium text-black/90 ml-auto mr-[5%] sm:mr-[10%] md:mr-[15%]`}>
                                    <span data-mask-size="0">VIDEOS</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
