"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

interface SplashScreenProps {
    onBegin?: () => void;    // fires immediately on button click
    onComplete?: () => void; // fires after overlay fully fades
}

export default function SplashScreen({ onBegin, onComplete }: SplashScreenProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const ringGroupRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGCircleElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const btnWrapRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

    const RADIUS = 150;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~565.5
    const SIZE = 420; // SVG viewBox / rendered px

    useLayoutEffect(() => {
        if (!visible) return;

        // Initial states
        gsap.set(ringRef.current, { strokeDashoffset: CIRCUMFERENCE });
        gsap.set(btnWrapRef.current, { y: 40, opacity: 0, scale: 0.92 });

        const counter = { val: 0 };
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        // 1. Ring fills + counter ticks to 100 over 2.4 s
        tl.to(
            ringRef.current,
            { strokeDashoffset: 0, duration: 2.4, ease: "power1.inOut" },
            0
        ).to(
            counter,
            {
                val: 100,
                duration: 2.4,
                ease: "power1.inOut",
                onUpdate() {
                    if (counterRef.current) {
                        counterRef.current.textContent = `${Math.round(counter.val)}%`;
                    }
                },
            },
            0
        );

        // 2. Ring group fades out
        tl.to(ringGroupRef.current, { opacity: 0, scale: 0.85, duration: 0.45, ease: "power2.in" });

        // 3. "Let's Begin" slides + fades into centre
        tl.to(
            btnWrapRef.current,
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
            "-=0.1"
        );

        return () => { tl.kill(); };
    }, [visible, CIRCUMFERENCE]);

    const handleBegin = () => {
        onBegin?.();   // ← triggers Hero animations immediately
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.in",
            onComplete: () => {
                setVisible(false);
                onComplete?.();
            },
        });
    };

    if (!visible) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0d0d]"
        >
            {/* ── Ring + counter ── */}
            <div ref={ringGroupRef} className="relative flex items-center justify-center">
                <svg
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    className="-rotate-90"
                >
                    {/* Dim track */}
                    <circle
                        cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                        fill="none" stroke="#1e1e1e" strokeWidth="2.5"
                    />
                    {/* Animated fill */}
                    <circle
                        ref={ringRef}
                        cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                        fill="none"
                        stroke="#EB5939"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={CIRCUMFERENCE}
                    />
                </svg>

                {/* Counter centred inside ring */}
                <span
                    ref={counterRef}
                    className="absolute text-[#b7ab98] text-[clamp(1.5rem,4vw,2.25rem)] font-thin tracking-normal"
                >
                    0%
                </span>
            </div>

            {/* ── Let's Begin button ── */}
            <div
                ref={btnWrapRef}
                className="absolute"          /* absolute so it lands at true centre */
                style={{ opacity: 0, transform: "translateY(40px) scale(0.92)" }}
            >
                <button
                    onClick={handleBegin}
                    className="
                        group relative
                        px-14 py-5
                        rounded-full
                        border border-[#3a3a3a]
                        hover:border-[#EB5939]
                        text-[#b7ab98] hover:text-[#EB5939]
                        text-base tracking-[0.25em] uppercase font-medium
                        transition-colors duration-400
                        cursor-pointer select-none
                        flex items-center gap-3
                    "
                >
                    Let&apos;s Begin
                    <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
