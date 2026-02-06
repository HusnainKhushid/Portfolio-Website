"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ShowreelProps {
    variant?: "default" | "reveal";
}

export default function Showreel({ variant = "default" }: ShowreelProps) {
    const showreelVideoRef = useRef<HTMLVideoElement>(null);

    // --- Showreel Logic ---
    const handleShowreelClick = async () => {
        const video = showreelVideoRef.current;
        if (!video) return;

        try {
            if (!document.fullscreenElement) {
                await video.requestFullscreen();
                video.controls = true;
            }
        } catch (error) {
            console.error('Error attempting to enable fullscreen:', error);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const video = showreelVideoRef.current;
            if (!document.fullscreenElement && video) {
                video.controls = false;
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useLayoutEffect(() => {
        if (variant === "default") {
            gsap.registerPlugin(ScrollTrigger);
            if (showreelVideoRef.current) {
                gsap.fromTo(
                    showreelVideoRef.current,
                    { scale: 0.5 },
                    {
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: showreelVideoRef.current.parentElement,
                            start: "top bottom",
                            end: "center center",
                            scrub: 1,
                        },
                    }
                );
            }
        }
    }, [variant]);

    if (variant === "reveal") {
        return (
            <div className="w-full min-h-screen items-center justify-center bg-[#EB5939] ">
                <div className="relative top-0 left-0 w-full h-[100px] flex items-center">
                    <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em] test">
                        SHOWREEL
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] relative overflow-hidden" data-mask-size="300">
            <div className="absolute top-0 left-0 w-full h-[100px] flex items-center">
                <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                    SHOWREEL
                </span>
            </div>

            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={showreelVideoRef}
                    className="w-full h-full object-cover showreel-video cursor-pointer"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    style={{ pointerEvents: 'auto' }}
                    onClick={handleShowreelClick}
                >
                    <source src="/showreel.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    );
}
