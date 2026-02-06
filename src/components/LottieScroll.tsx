"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLottie } from "lottie-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// A simplified type for a Lottie asset.
interface LottieAsset {
    id: string;
    [key: string]: unknown;
}

// A simplified type for a Lottie layer.
interface LottieLayer {
    nm: string;
    ty: number;
    [key: string]: unknown;
}

interface LottieData {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: string;
    ddd: number;
    assets: LottieAsset[];
    layers: LottieLayer[];
}

export default function LottieScroll() {
    const lottieRef = useRef<HTMLDivElement>(null);
    const lottie2Ref = useRef<HTMLDivElement>(null);

    // --- State for Lottie animation data ---
    const [lottieData, setLottieData] = useState<LottieData | null>(null);
    const [lottieData2, setLottieData2] = useState<LottieData | null>(null);

    // --- Effect to load Lottie data dynamically ---
    useEffect(() => {
        import("../../public/data.json").then((mod) =>
            setLottieData(mod.default || mod)
        );
        import("../../public/data2.json").then((mod) =>
            setLottieData2(mod.default || mod)
        );
    }, []);

    // --- Lottie component setup ---
    const lottieOptions = {
        animationData: lottieData || {},
        loop: false,
        autoplay: false,
        renderer: 'svg' as const,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            progressiveLoad: true,
            hideOnTransparent: true,
            className: 'lottie-svg'
        }
    };
    const lottieObj = useLottie({
        ...lottieOptions,
        style: { width: "100%", height: "100%" },
    });

    // --- Second Lottie component setup ---
    const lottie2Options = {
        animationData: lottieData2 || {},
        loop: true,
        autoplay: false,
        renderer: 'svg' as const,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            progressiveLoad: true,
            hideOnTransparent: true,
            className: 'lottie-svg-2'
        }
    };
    const lottie2Obj = useLottie({
        ...lottie2Options,
        style: { width: "100%", height: "100%" },
    });

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // --- LOTTIE ANIMATION SCROLLTRIGGER ---
        if (lottieRef.current && lottieObj && lottieObj.animationItem) {
            const animation = lottieObj.animationItem;
            const totalFrames = animation.totalFrames || 300;

            ScrollTrigger.create({
                trigger: lottieRef.current.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                invalidateOnRefresh: true,
                refreshPriority: -1,
                onUpdate: (self) => {
                    const frame = self.progress * (totalFrames - 1);
                    animation.goToAndStop(frame, true);

                    if (lottie2Ref.current) {
                        let overlayOpacity = 0;
                        let overlayScale = 0.4;

                        if (self.progress >= 0.90) {
                            const progressNormalized = (self.progress - 0.90) / 0.10;
                            overlayOpacity = progressNormalized;
                            overlayScale = 0.4 + (progressNormalized * 0.6);
                        }

                        gsap.set(lottie2Ref.current, {
                            opacity: overlayOpacity,
                            scale: overlayScale
                        });
                    }
                },
            });

            ScrollTrigger.create({
                trigger: lottieRef.current.parentElement,
                start: "center center",
                end: "bottom top",
                pin: true,
                pinSpacing: true,
                // markers: true,
                refreshPriority: 0,
                invalidateOnRefresh: true
            });
        }

        // --- SECOND LOTTIE ANIMATION CONTROL ---
        if (lottie2Ref.current && lottie2Obj && lottie2Obj.animationItem) {
            const secondAnimation = lottie2Obj.animationItem;
            secondAnimation.play();
            gsap.set(lottie2Ref.current, { opacity: 0 });
        }
    }, [lottieObj, lottie2Obj]); // Added dependencies to re-run if instances change

    return (
        <div className="w-full min-h-[100vh] bg-white relative" >
            <div className="w-full sticky top-0 h-screen relative">
                <div ref={lottieRef} className="w-full h-full">
                    {lottieData && lottieObj.View}
                </div>

                <div
                    ref={lottie2Ref}
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
                    style={{ backgroundColor: 'transparent' }}
                >
                    {lottieData2 && lottie2Obj.View}
                </div>
            </div>
        </div>
    );
}
