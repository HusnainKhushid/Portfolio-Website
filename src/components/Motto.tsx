"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

interface MottoProps {
    variant?: "default" | "reveal";
}

export default function Motto({ variant = "default" }: MottoProps) {
    const mottoRef = useRef<HTMLDivElement>(null);
    const mottoImageRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (variant === "default") {
            // --- MOTTO WORDS ENTRY ANIMATION ---
            if (mottoRef.current) {
                const words = mottoRef.current.querySelectorAll('.motto-word');
                if (words.length) {
                    gsap.fromTo(words, {
                        y: 30,
                        opacity: 0
                    }, {
                        y: 0,
                        opacity: 1,
                        stagger: 0.06,
                        duration: 0.45,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: mottoRef.current,
                            start: 'top 80%',
                            end: 'bottom 100%',
                            toggleActions: 'play none none reverse',
                        }
                    });
                }
            }

            // --- MOTTO IMAGE PARALLAX ---
            // Optimization: Use gsap.quickTo inside the onUpdate loop logic if high perf needed.
            // But for a single element, direct tween/set is usually fine or setup parallax via scrub.
            // The original code used quickTo for `mottoYTo`.

            if (mottoImageRef.current) {
                const mottoYTo = gsap.quickTo(mottoImageRef.current, "y", { duration: 0.45, ease: "power1.out" });
                const mottoShift = window.innerHeight * 0.12;

                ScrollTrigger.create({
                    trigger: mottoImageRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const y = -self.progress * mottoShift;
                        mottoYTo(y);
                    },
                });
            }
        }
    }, [variant]);

    if (variant === "reveal") {
        return (
            <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#EB5939] relative">
                <div className="flex items-center justify-center h-full w-full z-1 relative">
                    <div className="text-center w-full">
                        <div className="mb-6 text-2xl text-black font-semibold tracking-[0.1em]">
                            MY MOTTO
                        </div>
                        <h2 className="text-[100px] font-bold text-black tracking-[-0.02em] leading-[0.9em] m-0">
                            <span>NOT ALL GOOD DESIGN</span>
                        </h2>
                        <h2 className="text-[100px] font-bold text-black tracking-[-0.02em] leading-[0.9em] m-0">
                            <span>IS HONEST</span>
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[100vh] flex flex-col items-center justify-center relative overflow-hidden" >
            {/* Simple Background Image */}
            <div className="motto-wrap absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <div ref={mottoImageRef} className="absolute inset-0 w-full h-full motto-image">
                    <Image
                        src="/mymotto.jpg"
                        alt="Banner Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="flex items-center justify-center h-full w-full z-1 relative">
                <div ref={mottoRef} className="text-center w-full">
                    <div className="mb-6 text-2xl text-[#b7ab98] font-semibold tracking-[0.1em]">
                        MY MOTTO
                    </div>
                    <h2 className="text-[100px] font-bold text-[#b7ab98] tracking-[-0.02em] leading-[0.9em] m-0">
                        <span className="motto-word inline-block text-[#EB5939]" data-mask-size="1200">GOOD</span>
                        <span className="motto-word inline-block ml-4" data-mask-size="1200">DESIGN</span>
                    </h2>
                    <h2 className="text-[100px] font-bold text-[#b7ab98] tracking-[-0.02em] leading-[0.9em] m-0">
                        <span className="motto-word inline-block" data-mask-size="1200">IS</span>
                        <span className="motto-word inline-block ml-4 text-[#EB5939]" data-mask-size="1200">HONEST</span>
                    </h2>
                </div>
            </div>
        </div>
    );
}
