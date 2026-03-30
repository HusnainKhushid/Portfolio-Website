"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "../../hooks/useIsMobile";

interface ShowreelProps {
    variant?: "default" | "reveal";
}

export default function Showreel({ variant = "default" }: ShowreelProps) {
    const showreelVideoRef = useRef<HTMLVideoElement>(null);
    const isMobile = useIsMobile();
    const videoSrc = isMobile ? "/Showreel-vertical.mp4" : "/Showreel-2025.mp4";

    // --- Showreel Logic ---
    const handleShowreelClick = async () => {
        const video = showreelVideoRef.current;
        if (!video) return;

        try {
            if (!document.fullscreenElement) {
                await video.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        } catch (error) {
            console.error('Error attempting to toggle fullscreen:', error);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const video = showreelVideoRef.current;
            if (!video) return;

            if (document.fullscreenElement) {
                // In fullscreen: unmuted (sound on)
                video.muted = false;
            } else {
                // Out of fullscreen: muted (no sound)
                video.muted = true;
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useLayoutEffect(() => {
        if (variant === "default") {

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
            <div className="w-full min-h-[60vh] md:min-h-screen items-center justify-center bg-[#EB5939] ">
                <div className="relative top-0 left-0 w-full h-[100px] flex items-center">
                    <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em] test">
                        SHOWREEL
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] relative overflow-hidden" data-mask-size="300">
            <div className="absolute top-0 left-0 w-full h-[100px] flex items-center">
                <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                    SHOWREEL
                </span>
            </div>

            <div className="absolute inset-0 w-full h-full">
                <video
                    key={videoSrc}
                    ref={showreelVideoRef}
                    className="w-full h-full object-cover showreel-video cursor-pointer"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    src={videoSrc}
                    style={{ pointerEvents: 'auto' }}
                    onClick={handleShowreelClick}
                />
            </div>
        </div>
    );
}
