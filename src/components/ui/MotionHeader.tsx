"use client";

import { useLottie } from "lottie-react";
import { useEffect, useState } from "react";

// Simplified type for Lottie JSON structure partial matching
interface LottieData {
    v?: string;
    fr?: number;
    ip?: number;
    op?: number;
    w?: number;
    h?: number;
    nm?: string;
    ddd?: number;
    assets?: unknown[];
    layers?: unknown[];
    [key: string]: unknown;
}

export default function MotionHeader() {
    const [animationData, setAnimationData] = useState<LottieData | null>(null);

    useEffect(() => {
        import("../../../public/Whatido.json").then((mod) => {
            setAnimationData(mod.default || mod);
        });
    }, []);

    const options = {
        animationData: animationData,
        loop: false,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            progressiveLoad: true,
            hideOnTransparent: true,
        }
    };

    const { View } = useLottie(options, {
        height: "100%",
        width: "100%",
    });

    if (!animationData) return null;

    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#D9D9D9]">
            <div className="w-full max-w-4xl h-auto aspect-video">
                {View}
            </div>
        </div>
    );
}
