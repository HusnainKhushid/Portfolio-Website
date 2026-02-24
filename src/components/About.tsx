"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutScene from "./AboutScene";

interface AboutProps {
    variant?: "default" | "reveal";
}

/* ─── Text segments: { text, hl? } — hl = highlighted word ──────── */
type Seg = { text: string; hl?: boolean };

const segments: Seg[] = [
    { text: "I'm a " },
    { text: "visual designer", hl: true },
    { text: " who brings ideas to life through " },
    { text: "motion", hl: true },
    { text: ", " },
    { text: "design", hl: true },
    { text: " and " },
    { text: "storytelling", hl: true },
    { text: ". From bold " },
    { text: "animations", hl: true },
    { text: " to intuitive " },
    { text: "interfaces", hl: true },
    { text: ", I help brands express who they " },
    { text: "are", hl: true },
    { text: " — and why they " },
    { text: "matter", hl: true },
    { text: "." },
];

const ORANGE = "#EB5939";
const OFF_WHITE = "#D9D9D9";

/*
 * Fluid font size:
 *   Mobile  (~375px) → ~24px
 *   Tablet  (~768px) → ~38px
 *   Desktop (~1440px) → 80px (5rem)
 */
const fluidText = "text-[clamp(2rem,5vw,5rem)]";

export default function About({ variant = "default" }: AboutProps) {
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (textRef.current) {
            gsap.to(textRef.current, {
                backgroundPositionX: "0%",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: 1,
                },
            });
        }
    }, []);

    /* ─── REVEAL layer ───────────────────────────────────────────── */
    if (variant === "reveal") {
        return (
            <div className="w-full min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center bg-[#EB5939] px-4 sm:px-8">
                <div className="relative w-full h-[60px] sm:h-[80px] md:h-[100px] flex items-center">
                    <span className="absolute left-[12.5%] text-sm sm:text-lg md:text-2xl text-black font-semibold tracking-[0.3em]">
                        ABOUT ME
                    </span>
                </div>

                <p className={`font-bold text-black w-[90%] text-center ${fluidText} leading-[1.2]`}>
                    {segments.map((seg, i) =>
                        seg.hl ? (
                            <span key={i} style={{ color: OFF_WHITE }}>
                                {seg.text}
                            </span>
                        ) : (
                            <span key={i}>{seg.text}</span>
                        )
                    )}
                </p>
            </div>
        );
    }

    /* ─── DEFAULT layer ──────────────────────────────────────────── */
    return (
        <div className="w-full min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] relative overflow-hidden px-4 sm:px-8">
            <AboutScene />

            <div className="relative w-full h-[60px] sm:h-[80px] md:h-[100px] flex items-center z-10">
                <span
                    data-mask-size="1200"
                    className="absolute left-[12.5%] text-sm sm:text-lg md:text-2xl text-[#383838] font-semibold tracking-[0.3em]"
                >
                    ABOUT ME
                </span>
            </div>

            <p
                data-mask-size="1200"
                ref={textRef}
                className={`reveal-text font-bold text-gray-800 w-[90%] text-center relative z-10 ${fluidText} leading-[1.2]`}
            >
                {segments.map((seg, i) =>
                    seg.hl ? (
                        <span key={i} style={{ color: ORANGE }}>
                            {seg.text}
                        </span>
                    ) : (
                        <span key={i}>{seg.text}</span>
                    )
                )}
            </p>
        </div>
    );
}
