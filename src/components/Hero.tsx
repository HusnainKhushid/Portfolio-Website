"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
    variant?: "default" | "reveal";
}

export default function Hero({ variant = "default" }: HeroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

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
                    className="absolute top-0 left-0 h-full min-h-screen flex flex-col justify-center"
                    style={{ paddingLeft: "15%" }}
                >
                    <h2 className="text-[#000000] text-2xl text-center tracking-[0.3em]">
                        HUSNAIN KHURSHID
                    </h2>
                    <h1 className="text-[#000000] text-[190px] font-extrabold leading-none">
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
                className="absolute top-0 left-0 h-full min-h-screen flex flex-col justify-center"
                style={{ paddingLeft: "15%" }}
            >
                <h2
                    data-mask-size="1200"
                    className="text-[#b7ab98] text-2xl text-center tracking-[0.3em]"
                >
                    HUSNAIN KHURSHID
                </h2>
                <h1
                    data-mask-size="1200"
                    className="text-[#b7ab98] text-[190px] font-extrabold leading-none"
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
