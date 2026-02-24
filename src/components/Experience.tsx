"use client";

import { useLayoutEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ExperienceProps {
    variant?: "default" | "reveal";
}

/* ── Fluid heading size (same axis as About) ─────────────── */
const fluidText = "text-[clamp(2rem,5.5vw,72px)]";

/* ── Text segments with highlight support ────────────────── */
type Seg = { text: string; hl?: boolean };

const segments: Seg[] = [
    { text: "Over " },
    { text: "a decade", hl: true },
    { text: " of experience in " },
    { text: "interactive design", hl: true },
    { text: " and working with some of the most " },
    { text: "talented people", hl: true },
    { text: " in the business." },
];

/* ─────────────────────────────────────────────────────────── */
/*  Shared inner content — identical JSX in both variants     */
/*  This guarantees pixel-perfect overlay alignment.          */
/* ─────────────────────────────────────────────────────────── */
function ExperienceContent({
    labelColor,
    textRef,
    bodyClass,
    hlColor,
    isReveal,
}: {
    labelColor: string;
    textRef?: RefObject<HTMLParagraphElement | null>;
    bodyClass: string;
    hlColor: string;
    isReveal?: boolean;
}) {
    return (
        /* One block: label directly above body, left-aligned, vertically centred */
        <div className="flex-1 flex items-center w-full pl-[12.5%] pr-[5%]">
            <div className="max-w-[75%]">
                {/* Label — directly above body text */}
                <p
                    className="text-sm sm:text-lg md:text-2xl font-semibold tracking-[0.3em] mb-4 w-fit"
                    style={{ color: labelColor }}
                    data-mask-size="1200"
                >
                    EXPERIENCE
                </p>

                {/* Body text — left-aligned */}
                <p
                    ref={textRef}
                    className={`${bodyClass} ${fluidText} font-bold leading-[1.1] m-0 text-left w-fit`}
                    data-mask-size="1200"
                >
                    {segments.map((seg, i) =>
                        seg.hl ? (
                            <span key={i} style={{ color: hlColor }}>
                                {seg.text}
                            </span>
                        ) : (
                            isReveal
                                ? <span key={i} style={{ color: "#1a1a1a" }}>{seg.text}</span>
                                : <span key={i}>{seg.text}</span>
                        )
                    )}
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── */
export default function Experience({ variant = "default" }: ExperienceProps) {
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        /* About-style reveal: gradient slides left-to-right on scroll */
        if (variant === "default" && textRef.current) {
            gsap.to(textRef.current, {
                backgroundPositionX: "0%",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1,
                },
            });
        }
    }, [variant]);

    /* ── REVEAL LAYER ──────────────────────────────────────── */
    if (variant === "reveal") {
        return (
            <div className="w-full min-h-[60vh] md:min-h-screen flex flex-col bg-[#EB5939]">
                <ExperienceContent
                    labelColor="#1a1a1a"
                    bodyClass=""
                    hlColor="#131313"
                    isReveal
                />
            </div>
        );
    }

    /* ── DEFAULT LAYER ─────────────────────────────────────── */
    return (
        <div className="w-full min-h-[60vh] md:min-h-screen flex flex-col bg-[#131313] relative overflow-hidden">
            <ExperienceContent
                labelColor="#b7ab98"
                textRef={textRef}
                bodyClass="reveal-text-light"
                hlColor="#EB5939"
            />
        </div>
    );
}
