"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutScene from "./AboutScene";

interface AboutProps {
    variant?: "default" | "reveal";
}

export default function About({ variant = "default" }: AboutProps) {
    const textRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // --- TEXT REVEAL ANIMATION ---
        // We only attach this animation in one layer (usually default) or both?
        // In page.tsx, it selected ".reveal-text" globally. Ideally we scope it.
        // If we have duplicates (one hidden, one reveal layer), we might double animate.
        // But typically the reveal layer is hidden by default mask.
        // Let's animate both to be safe and synced.

        if (textRef.current) {
            const lines = textRef.current.querySelectorAll(".reveal-text");
            lines.forEach((line) => {
                gsap.to(line, {
                    backgroundPositionX: "0%",
                    scrollTrigger: {
                        trigger: line,
                        start: "top 80%",
                        end: "bottom 20%",
                        scrub: 1,
                    },
                });
            });
        }
    }, []);

    if (variant === "reveal") {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#EB5939]">
                <div className="relative w-screen h-[100px] flex items-center">
                    <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                        ABOUT ME
                    </span>
                </div>
                <h2 className="text-8xl font-bold text-black max-w-[90%] text-center">
                    <p className="mb-[-16] leading-tight text-[80px] font-bold">
                        I’m a visual designer who brings ideas to life through{" "}
                    </p>
                    <p className="mb-[-16] leading-tight text-[80px] font-bold">
                        motion, design and storytelling.From bold{" "}
                    </p>
                    <p className="mb-[-16] leading-tight text-[80px] font-bold">
                        animations to intuitive interfaces,I help brands express{" "}
                    </p>
                    <p className="mb-[-16] leading-tight text-[80px] font-bold">
                        {" "}
                        who they are — and why they matter.
                    </p>
                </h2>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] relative overflow-hidden">
            <AboutScene />
            <div className="relative w-screen h-[100px] flex items-center z-10">
                <span
                    data-mask-size="1200"
                    className="absolute left-1/8 text-2xl text-[#383838] font-semibold tracking-[0.3em]"
                >
                    ABOUT ME
                </span>
            </div>
            <h2
                data-mask-size="1200"
                ref={textRef}
                className="text-8xl font-bold text-gray-800 max-w-[90%] text-center relative z-10"
            >
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold">
                    I’m a visual designer who brings ideas to life through{" "}
                </p>
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold">
                    motion, design and storytelling.From bold{" "}
                </p>
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold">
                    animations to intuitive interfaces,I help brands express{" "}
                </p>
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold">
                    {" "}
                    who they are — and why they matter.
                </p>
            </h2>
        </div>
    );
}
