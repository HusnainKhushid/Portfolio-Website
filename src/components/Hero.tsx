"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAutoFitFont } from "../hooks/useAutoFitFont";

interface HeroProps {
    variant?: "default" | "reveal";
}

export default function Hero({ variant = "default" }: HeroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const defaultTextRef = useRef<HTMLDivElement>(null);
    const revealTextRef = useRef<HTMLDivElement>(null);

    useAutoFitFont(defaultTextRef, { maxFont: 190, minFont: 32, selector: "h1" });
    useAutoFitFont(revealTextRef, { maxFont: 190, minFont: 32, selector: "h1" });

    useLayoutEffect(() => {
        if (variant === "default") {
            gsap.registerPlugin(ScrollTrigger);
            const video = videoRef.current;

            const videoYTo = video
                ? gsap.quickTo(video, "y", { duration: 0.28, ease: "none" })
                : () => { };

            const updateVideoPos = () => {
                if (video) videoYTo(window.scrollY * 0.4);
            }

            window.addEventListener("scroll", updateVideoPos);

            return () => {
                window.removeEventListener("scroll", updateVideoPos);
            }
        }
    }, [variant]);

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

    return (
        <div className="w-full min-h-screen m-0 p-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/g3.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div
                ref={defaultTextRef}
                className="absolute top-0 left-0 h-full w-full min-h-screen flex flex-col justify-center px-[8%] sm:px-[12%] md:px-[15%]"
            >
                <h2
                    data-mask-size="1200"
                    className="text-[#b7ab98] text-sm sm:text-lg md:text-2xl tracking-[0.3em] mb-2 w-fit"
                >
                    HUSNAIN KHURSHID
                </h2>
                <h1
                    data-mask-size="1200"
                    className="text-[#b7ab98] text-[1em] font-extrabold leading-none whitespace-nowrap w-fit"
                >
                    MAKING
                    <br />
                    GOOD
                    <br />
                    <span className="text-[#EB5939]">SHIT SINCE</span>
                    <br />
                    2019
                </h1>
            </div>
        </div>
    );
}
