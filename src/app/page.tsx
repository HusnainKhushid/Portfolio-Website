"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { useState, useEffect } from "react";
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
  // Define the structure of your Lottie JSON data here
  // This is a basic structure, you might need to adjust it
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

// =================================================================================================
// HOME PAGE COMPONENT
// =================================================================================================
export default function HomePage() {
  // --- Refs for DOM elements ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const visualMaskRef = useRef<HTMLDivElement>(null);
  const motionMaskRef = useRef<HTMLDivElement>(null);
  const productMaskRef = useRef<HTMLDivElement>(null);
  const promoMaskRef = useRef<HTMLDivElement>(null);

  // --- State for Lottie animation data ---
  const [lottieData, setLottieData] = useState<LottieData | null>(null);

  // --- Effect to load Lottie data dynamically ---
  useEffect(() => {
    import("../../public/test3.json").then((mod) =>
      setLottieData(mod.default || mod)
    );
  }, []);

  // --- Lottie component setup ---
  const lottieOptions = { 
    animationData: lottieData || {},
    loop: false,
    autoplay: false, // Disable autoplay to let GSAP control it
  };
  const lottieObj = useLottie({
    ...lottieOptions,
    style: { width: "100%", height: "100%" },
  });

  // --- Fullscreen functionality ---
  const handleShowreelClick = async () => {
    const video = showreelVideoRef.current;
    if (!video) return;

          try {
        if (!document.fullscreenElement) {
          // Enter fullscreen
          await video.requestFullscreen();
          video.controls = true;
        }
      } catch (error) {
      console.error('Error attempting to enable fullscreen:', error);
    }
  };

  // --- Handle fullscreen change events ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      const video = showreelVideoRef.current;
      if (!document.fullscreenElement && video) {
        // Exited fullscreen
        video.controls = false;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // --- Main layout effect for all animations ---
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. SETUP ---
    const video = videoRef.current;
    const reveal = revealRef.current;
    const lines = textRef.current?.querySelectorAll("p");
    if (!reveal || !lines) return;

    // Smooth scrolling setup
    const lenis = new Lenis();
    gsap.ticker.add((t) => lenis.raf(t * 1000));

    // --- 2. HIGH-PERFORMANCE GSAP SETTERS ---
    const videoYTo = video
      ? gsap.quickTo(video, "y", { duration: 0.28, ease: "none" })
      : () => {};
    const cursorXTo = gsap.quickTo(reveal, "--cursor-x", {
      duration: 0.25,
      ease: "slow(0.1, 0.4, true)",
    });
    const cursorYTo = gsap.quickTo(reveal, "--cursor-y", {
      duration: 0.25,
      ease: "slow(0.1, 0.4, true)",
    });
    const maskScaleTo = gsap.quickTo(reveal, "--mask-scale", {
      duration: 0.3,
      ease: "power2.out",
    });

    // --- 3. EVENT HANDLERS & ANIMATION LOGIC ---
    let pointerClientX = 0;
    let pointerClientY = 0;
    let hasPointerMoved = false;
    let currentHoverTarget: Element | null = null; // Track the currently hovered element

    const syncCursorPosition = () => {
      cursorXTo(pointerClientX + window.scrollX);
      cursorYTo(pointerClientY + window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;

      if (!hasPointerMoved) {
        hasPointerMoved = true;
        gsap.set(reveal, {
          "--cursor-x": pointerClientX + window.scrollX,
          "--cursor-y": pointerClientY + window.scrollY,
        });
        gsap.to(reveal, { opacity: 1, duration: 0.3 });
        maskScaleTo(1); // Animate to default size
      }

      const hoverElement = target.closest("[data-mask-size]");
      if (hoverElement !== currentHoverTarget) {
        currentHoverTarget = hoverElement;
        if (hoverElement) {
          const newSize = parseFloat(
            hoverElement.getAttribute("data-mask-size") || "100"
          );
          maskScaleTo(newSize / 100); // Animate to new scale relative to base size of 100px
        } else {
          maskScaleTo(1); // Animate back to default scale
        }
      }

      syncCursorPosition();
    };

    // --- 4. ATTACH LISTENERS ---
    window.addEventListener("mousemove", handleMouseMove);
    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", (e: { scroll: number }) => {
      syncCursorPosition();
      if (video) videoYTo(e.scroll * 0.4);
    });

    // --- 5. TEXT REVEAL ANIMATION ---
    const allRevealTextElements = document.querySelectorAll(".reveal-text");
    allRevealTextElements.forEach((line) => {
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

    // --- 6. MASK HOVER ANIMATION ---
    // Reusable function for hover effects
    const setupMaskAnimation = (
      maskRef: React.RefObject<HTMLDivElement | null>
    ) => {
      if (maskRef.current) {
        const maskElement = maskRef.current;
        const spanTag = maskElement.querySelector("span") as HTMLElement;

        if (spanTag) {
          // Set initial state
          gsap.set(maskElement, {
            maskSize: "100% 0%",
            WebkitMaskSize: "100% 0%",
          });

          // Create timeline for smooth animation
          const maskTimeline = gsap.timeline({ paused: true });
          maskTimeline.to(maskElement, {
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            duration: 0.6,
            ease: "power2.out",
          });

          // Add hover event listeners
          spanTag.addEventListener("mouseenter", () => {
            maskTimeline.play();
          });

          spanTag.addEventListener("mouseleave", () => {
            maskTimeline.reverse();
          });
        }
      }
    };

    // Setup mask animations for all sections
    setupMaskAnimation(visualMaskRef);
    setupMaskAnimation(motionMaskRef);
    setupMaskAnimation(productMaskRef);
    setupMaskAnimation(promoMaskRef);

    // --- 7. LOTTIE ANIMATION SCROLLTRIGGER ---
    // Control Lottie animation with GSAP ScrollTrigger
    if (lottieRef.current && lottieObj && lottieObj.animationItem) {
      const animation = lottieObj.animationItem;
      const totalFrames = animation.totalFrames || 300; // Fallback to 300 frames
      
      ScrollTrigger.create({
        trigger: lottieRef.current.parentElement,
        start: "top bottom",
        end: "bottom top", 
        scrub: 1,
        onUpdate: (self) => {
          // Calculate the current frame based on scroll progress
          const frame = Math.floor(self.progress * totalFrames);
          animation.goToAndStop(frame, true);
          console.log(`GSAP Scroll Progress: ${(self.progress * 100).toFixed(1)}% - Frame: ${frame}`);
        },
      });

      // Pin the section for sticky scroll effect
      ScrollTrigger.create({
        trigger: lottieRef.current.parentElement,
        start: "center center",
        end: "bottom top",
        pin: true,
        pinSpacing: true,
      });
    }

    // --- 8. SHOWREEL VIDEO SCALE ANIMATION ---
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

    // --- 9. BANNER PARALLAX ANIMATION ---
    const bannerElement = document.querySelector(".parallax-banner");
    if (bannerElement) {
      gsap.fromTo(bannerElement, {
        y: "-30%", // Start position - moved up
      }, {
        y: "0%", // End position - perfect fit
        ease: "none",
        scrollTrigger: {
          trigger: bannerElement.parentElement?.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }

    // --- 10. CLEANUP ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [showreelVideoRef, lottieObj]);



  // =================================================================================================
  // JSX RENDER
  // =================================================================================================
  return (
    <>
      <div className={`main relative`}>
        {/* ================================================================================================= */}
        {/* === BACKGROUND CONTENT (Layer 1) === */}
        {/* ================================================================================================= */}
        <div>
          {/* --- HERO SECTION --- */}
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
                <source src="/hero.mp4" type="video/mp4" />
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

          {/* --- ABOUT ME SECTION --- */}
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9]">
            <div className="relative w-screen h-[100px] flex items-center">
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
              className="text-8xl font-bold text-gray-800 max-w-[90%] text-center"
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

          {/* --- WHAT I DO SECTION (with hover masks) --- */}
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9]">
            <div className="bg-[#D9D9D9]">
              <div className="relative w-screen h-[100px] flex items-center">
                <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                  WHAT I DO
                </span>
              </div>

              <div className="w-full flex justify-center">
                <div className="w-[100%]">
                  <div className="border-t-1 border-gray-500">
                    <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0"> VISUAL</span>
                    </p>
                  </div>
                  <div className="border-t-1 border-gray-500">
                    <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0"> MOTION</span>
                    </p>
                  </div>
                  <div className="border-t-1 border-gray-500">
                    <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0">PRODUCT</span>
                    </p>
                  </div>
                  <div className="border-t-1 border-gray-500 border-b-1">
                    <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0">PROMO</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute ">
              <div className="relative w-screen h-[100px] flex items-center">
                <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                  WHAT I DO
                </span>
              </div>

              <div className="w-full flex justify-center">
                <div className="w-[100%]">
                  <div
                    ref={visualMaskRef}
                    className="border-t-1 border-gray-500 bg-[#EB5939] mask-reveal"
                  >
                    <p className="text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0"> VISUAL</span>
                    </p>
                  </div>

                  <div
                    ref={motionMaskRef}
                    className="border-t-1 border-gray-500 bg-[#EB5939] mask-reveal"
                  >
                    <p className="text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0"> MOTION</span>
                    </p>
                  </div>
                  <div
                    ref={productMaskRef}
                    className="border-t-1 border-gray-500 bg-[#EB5939] mask-reveal"
                  >
                    <p className="text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0">PRODUCT</span>
                    </p>
                  </div>
                  <div
                    ref={promoMaskRef}
                    className="border-t-1 border-gray-500 border-b-1 bg-[#EB5939] mask-reveal"
                  >
                    <p className="text-[120px] font-bold text-gray-800 ml-[15%]">
                      <span data-mask-size="0">PROMO</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SHOWREEL SECTION --- */}
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] relative overflow-hidden" data-mask-size="300">
          {/* Section title positioned at top */}
          <div className="absolute top-0 left-0 w-full h-[100px] flex items-center">
            <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
              SHOWREEL
            </span>
          </div>
          
          {/* Video background that scales with scroll */}
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
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* --- NEW EMPTY SECTION --- */}
        <div className="w-full h-[100vh] flex flex-col items-center justify-center relative overflow-hidden" data-mask-size="100">
          {/* Parallax Background Image */}
          <div className="absolute inset-0 w-full h-full -z-10">
            <img
              src="/banner-bottom-1200.jpg"
              alt="Banner Background"
              className="w-full h-[120%] object-cover parallax-banner"
              style={{ transform: 'translateY(-20%)' }}
            />
          </div>
          
          {/* Section title positioned at top */}
          <div className="relative w-screen h-[100px] flex items-center z-10">
                <span className="absolute left-1/8 pt-40 text-2xl text-[#D9D9D9] font-semibold tracking-[0.3em]">
                  MY MOTTO
                </span>
          </div>
          
          {/* Empty content area - can be filled with content later */}
          <div className="flex items-center justify-center h-full z-10">
            <div className="text-center">
              <h2 className="text-[80px] font-bold text-[#D9D9D9]">
                GOOD DESIGN
              </h2>
              <h2 className="text-[80px] font-bold text-[#D9D9D9]">
                IS HONEST
              </h2>
            </div>
          </div>
        </div>

        {/* --- LOTTIE ANIMATION SECTION --- */}
        <div className="w-full min-h-[400vh] bg-white relative" >
          <div className="w-full sticky top-0 h-screen">
            <div ref={lottieRef} className="w-full h-full">
              {lottieData && lottieObj.View}
            </div>
          </div>
        </div>

        {/* ================================================================================================= */}
        {/* === REVEAL OVERLAY (Layer 2) === */}
        {/* ================================================================================================= */}
        <div
          ref={revealRef}
          className="reveal absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{
            opacity: 0, // Start fully transparent
            maskImage: 'url("/test-mask.svg")',
            maskRepeat: "no-repeat",
            maskSize: "calc(var(--mask-scale, 0) * 50px)",
            maskPosition:
              "calc(var(--cursor-x, -100) * 1px - var(--mask-scale, 0) * 25px) calc(var(--cursor-y, -100) * 1px - var(--mask-scale, 0) * 25px)",
            WebkitMaskImage: 'url("/test-mask.svg")',
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "calc(var(--mask-scale, 0) * 50px)",
            WebkitMaskPosition:
              "calc(var(--cursor-x, -100) * 1px - var(--mask-scale, 0) * 25px) calc(var(--cursor-y, -100) * 1px - var(--mask-scale, 0) * 25px)",
          }}
        >
          {/* --- REVEALED HERO SECTION --- */}
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

          {/* --- REVEALED ABOUT ME SECTION --- */}
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

          {/* --- REVEALED WHAT I DO SECTION --- */}
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#EB5939]">
           
              <div className="relative w-screen h-[100px] flex items-center">
                <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                  WHAT I DO
                </span>
              </div>

              <div className="w-full flex justify-center">
                <div className="w-[100%]">
                  <div className="border-t-1 border-gray-500">
                    <p className="text-[120px] font-bold text-black ml-[15%]">
                      <span data-mask-size="0"> VISUAL</span>
                    </p>
                  </div>
                  <div className="border-t-1 border-gray-500">
                    <p className="text-[120px] font-bold text-black ml-[15%]">
                      <span data-mask-size="0"> MOTION</span>
                    </p>
                  </div>
                  <div className="border-t-1 border-gray-500">
                    <p className="text-[120px] font-bold text-black ml-[15%]">
                      <span data-mask-size="0">PRODUCT</span>
                    </p>
                  </div>
                  <div className="border-t-1 border-gray-500 border-b-1">
                    <p className="text-[120px] font-bold text-black ml-[15%]">
                      <span data-mask-size="0">PROMO</span>
                    </p>
                  </div>
                </div>
              </div>
          </div>

          {/* --- REVEALED SHOWREEL SECTION --- */}
          <div className="w-full min-h-screen items-center justify-center bg-[#EB5939]">
          <div className="relative top-0 left-0 w-full h-[100px] flex items-center">
            <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em] test">
              SHOWREEL
            </span>
          </div>

          </div>

          {/* --- REVEALED NEW EMPTY SECTION --- */}
          <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#EB5939]">
            {/* Section title positioned at top */}
            <div className="relative w-screen h-[100px] flex items-center">
              <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                MY MOTTO
              </span>
            </div>
            
            {/* Revealed content area */}
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-[80px] font-bold text-black">
                  TEST MY MOTTO
                </h2>
                <p className="text-2xl text-black mt-4">
                  This is the revealed version of the new section
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}