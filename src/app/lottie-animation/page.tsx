"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { useLottie } from "lottie-react";

// A simplified type for a Lottie asset.
interface LottieAsset {
  id: string; 
  // Other properties can exist on an asset.
  [key: string]: unknown;
}

// A simplified type for a Lottie layer.
interface LottieLayer {
  nm: string; // name
  ty: number; // type
  // Other properties can exist on a layer.
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

export default function LottieAnimationPage() {
  const lottieRef = useRef<HTMLDivElement>(null);
  const lottie2Ref = useRef<HTMLDivElement>(null);

  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  const [lottieData2, setLottieData2] = useState<LottieData | null>(null);

  useEffect(() => {
    import("../../../public/data.json").then((mod) =>
      setLottieData(mod.default || mod)
    );
    import("../../../public/data2.json").then((mod) =>
      setLottieData2(mod.default || mod)
    );
  }, []);

  const lottieOptions = { 
    animationData: lottieData || {},
    loop: false,
    autoplay: false,
    renderer: 'svg' as const,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
      progressiveLoad: true,
      hideOnTransparent: true,
      className: 'lottie-svg'
    }
  };
  const lottieObj = useLottie({
    ...lottieOptions,
    style: { width: "100%", height: "100%" },
  });

  const lottie2Options = { 
    animationData: lottieData2 || {},
    loop: true,
    autoplay: false,
    renderer: 'svg' as const,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
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

    const lenis = new Lenis();
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    lenis.on("scroll", ScrollTrigger.update);

    if (lottieRef.current && lottieObj && lottieObj.animationItem) {
      const animation = lottieObj.animationItem;
      const totalFrames = animation.totalFrames || 300;
      
      // We use the parent element as the pinning container
      const pinContainer = lottieRef.current.parentElement;

      ScrollTrigger.create({
        trigger: pinContainer,
        start: "top top",
        end: "+=3000", // This dictates how long the scroll lasts
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
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
    }

    if (lottie2Ref.current && lottie2Obj && lottie2Obj.animationItem) {
      const secondAnimation = lottie2Obj.animationItem;
      secondAnimation.play();
      gsap.set(lottie2Ref.current, { opacity: 0 });
    }

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [lottieObj, lottie2Obj]);

  return (
    <main className="relative">
      {/* Spacer to allow scrolling before the Lottie animation */}
      <div className="w-full h-[100vh] flex items-center justify-center bg-[#D9D9D9]">
        <h1 className="text-4xl font-bold tracking-widest text-[#383838]">SCROLL DOWN</h1>
      </div>

      {/* --- LOTTIE ANIMATION SECTION --- */}
      <div className="w-full bg-white relative">
        <div className="w-full h-screen relative">
          {/* First Lottie Animation (data.json) */}
          <div ref={lottieRef} className="w-full h-full">
            {lottieData && lottieObj.View}
          </div>
          
          {/* Second Lottie Animation (data2.json) - Overlay */}
          <div 
            ref={lottie2Ref} 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-0"
            style={{ backgroundColor: 'transparent' }}
          >
            {lottieData2 && lottie2Obj.View}
          </div>
        </div>
      </div>

      {/* Spacer to allow scrolling after the Lottie animation */}
      <div className="w-full h-[100vh] flex items-center justify-center bg-[#D9D9D9]">
        <h1 className="text-4xl font-bold tracking-widest text-[#383838]">END OF ANIMATION</h1>
      </div>
    </main>
  );
}
