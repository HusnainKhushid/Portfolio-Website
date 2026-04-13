"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lottie from "lottie-react";
import catAnimation from "../../../public/cat.json";

interface SplashScreenProps {
    onBegin?: () => void;    // fires immediately on button click
    onComplete?: () => void; // fires after overlay fully fades
}

// ─── Assets to preload ────────────────────────────────────────────────────────
// Add any image/video URLs you want tracked in the loading bar here.
// Keeping this minimal (only hero) ensures the page loads fast.
const PRELOAD_ASSETS = [
    "/hero.mp4",
];

/** Returns a promise that resolves once a URL has been partially fetched (headers received). */
function preloadAsset(url: string): Promise<void> {
    return new Promise((resolve) => {
        if (/\.(mp4|webm|mov)$/i.test(url)) {
            // For video: create a hidden <video> and wait for metadata
            const vid = document.createElement("video");
            vid.preload = "metadata";
            vid.src = url;
            vid.onloadedmetadata = () => resolve();
            vid.onerror = () => resolve(); // don't block on error
        } else {
            // For images
            const img = new Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => resolve();
        }
    });
}

export default function SplashScreen({ onBegin, onComplete }: SplashScreenProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const ringSvgRef = useRef<SVGSVGElement>(null);
    const ringRef = useRef<SVGCircleElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const btnWrapRef = useRef<HTMLDivElement>(null);
    const catWrapRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    const [ready, setReady] = useState(false);      // true when all assets loaded
    const [lottieReady, setLottieReady] = useState(false); // true after first lottie frame

    const RADIUS = 150;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~942.5
    const SIZE = 420;

    // ── 1. LOCK SCROLL on mount, UNLOCK when overlay is gone ─────────────────
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`; // prevent layout jump

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, []);

    // ── 2. PRELOAD ASSETS — drive counter smoothly ────────────────────────────
    useEffect(() => {
        let cancelled = false;
        const total = PRELOAD_ASSETS.length + 1; // +1 for fonts
        let loaded = 0;
        const progress = { val: 0 };

        const renderProgress = () => {
            if (cancelled) return;
            const pct = Math.round(progress.val);
            if (ringRef.current) {
                // Using gsap.set for immediate fluid updates
                gsap.set(ringRef.current, {
                    strokeDashoffset: CIRCUMFERENCE * (1 - pct / 100),
                });
            }
            if (counterRef.current) {
                counterRef.current.textContent = `${pct}%`;
            }
        };

        // 1. Kick off a fluid fake progress towards 85%
        // This ensures the loader never stalls abruptly at 0% or 50%
        const loaderTween = gsap.to(progress, {
            val: 85,
            duration: 3,
            ease: "power2.out",
            onUpdate: renderProgress,
        });

        const tick = () => {
            if (cancelled) return;
            loaded += 1;
            
            if (loaded >= total) {
                // 2. All essential assets loaded! 
                // Kill the slow tween and smoothly accelerate to 100%
                loaderTween.kill();
                gsap.to(progress, {
                    val: 100,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onUpdate: renderProgress,
                    onComplete: () => {
                        if (!cancelled) setReady(true);
                    },
                });
            }
        };

        // Fonts
        document.fonts.ready.then(tick);
        
        // Assets
        if (PRELOAD_ASSETS.length === 0) {
            tick();
        } else {
            PRELOAD_ASSETS.forEach((url) => preloadAsset(url).then(tick));
        }

        return () => { 
            cancelled = true; 
            loaderTween.kill();
            gsap.killTweensOf(progress);
        };
    }, [CIRCUMFERENCE]);

    // ── 3. GSAP SEQUENCE — run once assets are ready ─────────────────────────
    useLayoutEffect(() => {
        if (!ready || !visible) return;

        gsap.set(ringRef.current, { strokeDashoffset: 0 }); // ensure ring is full
        gsap.set(btnWrapRef.current, { y: 40, opacity: 0, scale: 0.92 });

        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, delay: 0.3 });

        // 1. Ring + counter fades out; cat stays
        tl.to([ringSvgRef.current, counterRef.current], {
            opacity: 0,
            scale: 0.85,
            duration: 0.45,
            ease: "power2.in",
        });

        // 2. "Let's Begin" slides up beneath the cat
        tl.to(
            btnWrapRef.current,
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
            "-=0.1"
        );

        return () => { tl.kill(); };
    }, [ready, visible]);

    // ── 4. INITIAL GSAP STATE ─────────────────────────────────────────────────
    useLayoutEffect(() => {
        if (!visible) return;
        gsap.set(ringRef.current, { strokeDashoffset: CIRCUMFERENCE });
        gsap.set(btnWrapRef.current, { y: 40, opacity: 0, scale: 0.92 });
    }, [visible, CIRCUMFERENCE]);

    // ── 5. HANDLE "LET'S BEGIN" ───────────────────────────────────────────────
    const handleBegin = () => {
        onBegin?.();   // triggers Hero animations immediately

        // Restore scroll BEFORE overlay fades so content is interactive
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

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
            className="flex flex-col items-center justify-center"
            style={{
                position: "fixed",
                inset: 0,
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                minWidth: "100vw",
                minHeight: "100vh",
                zIndex: 9999,
                backgroundColor: "#0d0d0d",
                touchAction: "none",
                overflow: "hidden",
            }}
        >
            {/* ── Ring + cat + counter ── */}
            <div className="relative flex items-center justify-center">
                <svg
                    ref={ringSvgRef}
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
                    {/* Progress arc */}
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

                {/* Cat (always visible) + counter beneath it */}
                <div
                    ref={catWrapRef}
                    className="absolute flex flex-col items-center justify-center pointer-events-none"
                >
                    <div
                        className="w-[200px] h-[200px] sm:w-[210px] sm:h-[210px] flex items-center justify-center"
                        style={{ opacity: lottieReady ? 1 : 0, transition: "opacity 0.2s ease" }}
                    >
                        <Lottie
                            animationData={catAnimation}
                            loop={true}
                            onDOMLoaded={() => setLottieReady(true)}
                        />
                    </div>
                    <span
                        ref={counterRef}
                        className="text-[#b7ab98] text-[clamp(1.1rem,2.5vw,1.6rem)] font-thin tracking-widest mt-1"
                    >
                        0%
                    </span>
                </div>
            </div>

            {/* ── Let's Begin — floats beneath the cat ── */}
            <div
                ref={btnWrapRef}
                className="absolute"
                style={{ opacity: 0, transform: "translateY(40px) scale(0.92)" }}
            >
                {/* Spacer so the button settles below the cat */}
                <div className="flex flex-col items-center gap-6" style={{ marginTop: "220px" }}>
                    <button
                        onClick={handleBegin}
                        className="
                            group relative
                            px-8 py-3
                            rounded-full
                            border border-[#3a3a3a]
                            hover:border-[#EB5939]
                            text-[#b7ab98] hover:text-[#EB5939]
                            text-[13px] tracking-[0.2em] uppercase font-light
                            transition-colors duration-400
                            cursor-pointer select-none
                            flex items-center gap-2
                        "
                    >
                        Let&apos;s Begin
                        <svg
                            className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
