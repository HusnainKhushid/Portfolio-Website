"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAutoFitFont } from "../hooks/useAutoFitFont";

interface HeroProps {
    variant?: "default" | "reveal";
    /** Set to true when splash screen finishes — triggers entrance animations */
    splashDone?: boolean;
}

export default function Hero({ variant = "default", splashDone = false }: HeroProps) {
    const videoWrapRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const defaultTextRef = useRef<HTMLDivElement>(null);
    const revealTextRef = useRef<HTMLDivElement>(null);

    useAutoFitFont(defaultTextRef, { maxFont: 182, minFont: 32, selector: "h1" });
    useAutoFitFont(revealTextRef, { maxFont: 182, minFont: 32, selector: "h1" });

    useLayoutEffect(() => {
        if (variant !== "default") return;


        /* ── Parallax on scroll — synced with Lenis via ScrollTrigger ── */
        if (videoRef.current) {
            gsap.to(videoRef.current, {
                y: () => window.innerHeight * 0.4,
                ease: "none",
                scrollTrigger: {
                    trigger: videoRef.current.closest("div"),
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });
        }
    }, [variant]);

    /* ── Entrance animations — fire when splashDone flips true ── */
    useLayoutEffect(() => {
        if (variant !== "default" || !splashDone) return;

        /* Video zoom-out */
        if (videoWrapRef.current) {
            gsap.fromTo(
                videoWrapRef.current,
                { scale: 1.5 },
                { scale: 1, duration: 1.5, ease: "power3.out" }
            );
        }

        /* Word-by-word fade-up */
        if (defaultTextRef.current) {
            const words = defaultTextRef.current.querySelectorAll<HTMLElement>(".hero-word");
            gsap.fromTo(
                words,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 2, stagger: 0.15, ease: "power3.out", delay: 0.1 }
            );
        }
    }, [variant, splashDone]);

    /* ── REVEAL VARIANT ── */
    if (variant === "reveal") {
        return (
            <div className="w-full min-h-screen m-0 p-0 relative overflow-hidden bg-[#EB5939]">
                <div
                    ref={revealTextRef}
                    className="absolute top-0 left-0 h-full w-full min-h-screen flex flex-col justify-center px-[8%] sm:px-[12%] md:px-[15%]"
                >
                    <h2 className="text-[#000000] text-sm sm:text-lg md:text-2xl tracking-[0.3em] mb-2">
                        HUSNAIN KHURSHID
                    </h2>
                    <h1 className="text-[#000000] text-[1em] font-extrabold leading-none whitespace-nowrap">
                        HIDING
                        <br />
                        BAD <br />
                        SHIT SINCE
                        <br />
                        2019
                    </h1>
                </div>
            </div>
        );
    }

    /* ── DEFAULT VARIANT ── */
    return (
        <div className="w-full min-h-screen m-0 p-0 relative overflow-hidden">
            {/* Video — wrapped for clean scale transform */}
            <div
                ref={videoWrapRef}
                className="absolute top-0 left-0 w-full h-full will-change-transform"
            >
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/g3.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Text overlay */}
            <div
                ref={defaultTextRef}
                className="absolute top-0 left-0 h-full w-full min-h-screen flex flex-col justify-center px-[8%] sm:px-[12%] md:px-[15%]"
            >
                {/* Subtitle — each word wrapped */}
                <h2 className="text-[#b7ab98] text-sm sm:text-lg md:text-2xl tracking-[0.3em] mb-2 w-fit flex gap-[0.35em] flex-wrap"
                    data-mask-size="1200"
                >
                    {["HUSNAIN", "KHURSHID"].map((w) => (
                        <span key={w} className="hero-word inline-block opacity-0">{w}</span>
                    ))}
                </h2>

                {/* Main headline — each word/line wrapped */}
                <h1
                    data-mask-size="1200"
                    className="text-[#b7ab98] text-[1em] font-extrabold leading-none whitespace-nowrap w-fit"
                >
                    {/* Each visual "line" is its own block so layout stays identical */}
                    <span className="block">
                        <span className="hero-word inline-block opacity-0">MAKING</span>
                    </span>
                    <span className="block">
                        <span className="hero-word inline-block opacity-0">GOOD</span>
                    </span>
                    <span className="block">
                        <span className="hero-word inline-block opacity-0 text-[#EB5939]">SHIT&nbsp;SINCE</span>
                    </span>
                    <span className="block">
                        <span className="hero-word inline-block opacity-0">2019</span>
                    </span>
                </h1>
            </div>
        </div>
    );
}
