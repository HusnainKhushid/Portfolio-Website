"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register the plugin (safe to call multiple times)
gsap.registerPlugin(ScrollTrigger);

interface MottoProps {
    variant?: "default" | "reveal";
}

export default function Motto({ variant = "default" }: MottoProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const mottoRef = useRef<HTMLDivElement>(null);
    const mottoImageRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (variant !== "default") return;

        const ctx = gsap.context(() => {
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

            // --- MOTTO IMAGE PARALLAX (scrub-based, GSAP best practice) ---
            if (mottoImageRef.current) {
                gsap.fromTo(
                    mottoImageRef.current,
                    {
                        yPercent: -20,
                        scale: 1.05,
                    },
                    {
                        yPercent: 20,
                        scale: 1.15,
                        ease: "none",
                        force3D: true,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 0.6,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert(); // Proper GSAP cleanup
    }, [variant]);

    if (variant === "reveal") {
        return (
            <div className="w-full min-h-[60vh] md:h-[100vh] flex flex-col items-center justify-center bg-[#EB5939] relative">
                <div className="flex items-center justify-center h-full w-full z-1 relative">
                    <div className="text-center w-full">
                        <div className="mb-4 sm:mb-6 text-sm sm:text-lg md:text-2xl text-black font-semibold tracking-[0.1em]">
                            MY MOTTO
                        </div>
                        <h2 className="text-[clamp(2.5rem,10vw,100px)] font-bold text-black tracking-[-0.02em] leading-[0.9em] m-0">
                            <span>NOT ALL GOOD DESIGN</span>
                        </h2>
                        <h2 className="text-[clamp(2.5rem,10vw,100px)] font-bold text-black tracking-[-0.02em] leading-[0.9em] m-0">
                            <span>IS HONEST</span>
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={sectionRef} className="w-full min-h-[60vh] md:h-[100vh] flex flex-col items-center justify-center relative overflow-hidden" >
            {/* Background Image — oversized for parallax headroom */}
            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
                <div
                    ref={mottoImageRef}
                    className="absolute left-0 w-full motto-image"
                    style={{
                        top: '-20%',
                        height: '140%',
                        willChange: 'transform',
                    }}
                >
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
                    <div className="mb-4 sm:mb-6 text-sm sm:text-lg md:text-2xl text-[#b7ab98] font-semibold tracking-[0.1em]">
                        MY MOTTO
                    </div>
                    <h2 className="text-[clamp(2.5rem,10vw,100px)] font-bold text-[#b7ab98] tracking-[-0.02em] leading-[0.9em] m-0">
                        <span className="motto-word inline-block text-[#EB5939]" data-mask-size="1200">GOOD</span>
                        <span className="motto-word inline-block ml-4" data-mask-size="1200">DESIGN</span>
                    </h2>
                    <h2 className="text-[clamp(2.5rem,10vw,100px)] font-bold text-[#b7ab98] tracking-[-0.02em] leading-[0.9em] m-0">
                        <span className="motto-word inline-block" data-mask-size="1200">IS</span>
                        <span className="motto-word inline-block ml-4 text-[#EB5939]" data-mask-size="1200">HONEST</span>
                    </h2>
                </div>
            </div>
        </div>
    );
}
