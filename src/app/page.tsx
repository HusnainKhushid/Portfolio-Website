"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { useState, useEffect } from "react";
import { useLottie } from "lottie-react";
import Image from "next/image";

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
  const mottoRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const lottie2Ref = useRef<HTMLDivElement>(null);
  const visualMaskRef = useRef<HTMLDivElement>(null);
  const motionMaskRef = useRef<HTMLDivElement>(null);
  const productMaskRef = useRef<HTMLDivElement>(null);
  const promoMaskRef = useRef<HTMLDivElement>(null);
  const mottoImageRef = useRef<HTMLDivElement>(null);

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

  // --- Lottie component setup with performance optimizations ---
  const lottieOptions = { 
    animationData: lottieData || {},
    loop: false,
    autoplay: false, // Disable autoplay to let GSAP control it
    renderer: 'svg' as const, // Use SVG renderer for better performance
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true, // Load progressively for better performance
      hideOnTransparent: true,
      className: 'lottie-svg' // Add class for potential CSS optimizations
    }
  };
  const lottieObj = useLottie({
    ...lottieOptions,
    style: { width: "100%", height: "100%" },
  });

  // --- Second Lottie component setup for data2.json ---
  const lottie2Options = { 
    animationData: lottieData2 || {},
    loop: true, // Loop for continuous play
    autoplay: false, // Will be controlled by ScrollTrigger
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

    const mottoYTo = mottoImageRef.current
  ? gsap.quickTo(mottoImageRef.current, "y", { duration: 0.45, ease: "power1.out" })
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

    // --- 5b. MOTTO WORDS ENTRY ANIMATION ---
  if (mottoRef && mottoRef.current) {
      const words = mottoRef.current.querySelectorAll('.motto-word');
      if (words.length) {
        gsap.fromTo(words, {
          y: 30,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
      stagger: 0.06,
      duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mottoRef.current,
            start: 'top 80%',
            end: 'bottom 100%',
            toggleActions: 'play none none reverse',
            // markers: true,
          }
        });
      }
    }
    
    // --- NAVIGATION HOVER ANIMATION ---
    // Using a simple, reliable underline animation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      const el = item as HTMLElement;
      
      // Create the underline element if it doesn't exist
      if (!el.querySelector('.nav-underline')) {
        const underline = document.createElement('span');
        underline.className = 'nav-underline';
        el.appendChild(underline);
        
        // Set initial state
        gsap.set(underline, {
          width: 0,
          left: "50%",
          bottom: "-5px",
          position: "absolute",
          height: "1px",
          backgroundColor: "#EB5939",
        });
      }
      
      // Simple hover animations
      el.addEventListener('mouseenter', () => {
        gsap.to(el, { 
          color: "#EB5939", 
          duration: 0.3, 
          ease: "power1.out" 
        });
        gsap.to(el.querySelector('.nav-underline'), { 
          width: "100%", 
          left: "0", 
          duration: 0.3, 
          ease: "power1.out" 
        });
      });
      
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { 
          color: "#b7ab98", 
          duration: 0.3, 
          ease: "power1.out" 
        });
        gsap.to(el.querySelector('.nav-underline'), { 
          width: 0, 
          left: "50%", 
          duration: 0.3, 
          ease: "power1.out" 
        });
      });
    });

    // --- 6. MASK HOVER ANIMATION (FIXED FOR COMPLETE ANIMATIONS) ---
    // Reusable function for hover effects with proper completion handling
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

          // Track animation state to prevent interruptions
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          let isAnimating = false;
          let currentTween: gsap.core.Tween | null = null;

          // Function to animate to target state
          const animateToState = (targetHeight: string, onComplete?: () => void) => {
            // Kill any existing animation
            if (currentTween) {
              currentTween.kill();
            }

            isAnimating = true;
            currentTween = gsap.to(maskElement, {
              maskSize: `100% ${targetHeight}`,
              WebkitMaskSize: `100% ${targetHeight}`,
              duration: 0.6,
              ease: "power1.out",
              onComplete: () => {
                isAnimating = false;
                currentTween = null;
                if (onComplete) onComplete();
              },
              onInterrupt: () => {
                isAnimating = false;
                currentTween = null;
              }
            });
          };

          // Add hover event listeners with proper state management
          spanTag.addEventListener("mouseenter", () => {
            animateToState("100%");
          });

          spanTag.addEventListener("mouseleave", () => {
            animateToState("0%");
          });
        }
      }
    };

    // Setup mask animations for all sections
    setupMaskAnimation(visualMaskRef);
    setupMaskAnimation(motionMaskRef);
    setupMaskAnimation(productMaskRef);
    setupMaskAnimation(promoMaskRef);

    // --- MOTTO IMAGE PARALLAX (starts when motto top hits bottom of viewport) ---
    if (mottoImageRef.current) {
      // reduce the shift to make parallax subtler
      const mottoShift = window.innerHeight * 0.12; // smaller movement for subtle effect
      ScrollTrigger.create({
        trigger: mottoImageRef.current,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // progress goes 0 -> 1 while the element passes through the viewport
          const y = -self.progress * mottoShift; // negative to move up as we scroll down
          mottoYTo(y);
        },
      });
    }

    // --- 7. LOTTIE ANIMATION SCROLLTRIGGER (OPTIMIZED FOR SMOOTH PERFORMANCE) ---
    // Control Lottie animation with GSAP ScrollTrigger
    if (lottieRef.current && lottieObj && lottieObj.animationItem) {
      const animation = lottieObj.animationItem;
      const totalFrames = animation.totalFrames || 300; // Fallback to 300 frames
      
      ScrollTrigger.create({
        trigger: lottieRef.current.parentElement,
        start: "top bottom",
        end: "bottom top", 
        scrub: 1.2, // Slightly higher for smoother feel
        invalidateOnRefresh: true, // Recalculate on window resize
        refreshPriority: -1, // Lower refresh priority for better performance
        onUpdate: (self) => {
          // SMOOTH FRAME INTERPOLATION - No Math.floor for buttery smooth animation!
          const frame = self.progress * (totalFrames - 1); // -1 because frames are 0-indexed
          animation.goToAndStop(frame, true);
          
          // Control data2.json overlay opacity and scale based on scroll progress
          if (lottie2Ref.current) {
            let overlayOpacity = 0;
            let overlayScale = 0.4; // Start smaller
            
            if (self.progress >= 0.90) {
              // Fade in and scale up when progress is 90% or more
              const progressNormalized = (self.progress - 0.90) / 0.10; // Maps 0.90-1.0 to 0-1
              overlayOpacity = progressNormalized;
              overlayScale = 0.4 + (progressNormalized * 0.6); // Scale from 0.8 to 1.0
            }
            
            gsap.set(lottie2Ref.current, { 
              opacity: overlayOpacity,
              scale: overlayScale
            });
          }
          
          // Optional: Uncomment for debugging (but remove for production performance)
          // console.log(`Smooth Progress: ${(self.progress * 100).toFixed(1)}% - Frame: ${frame.toFixed(2)}`);
        },
      });

      // Pin the section for sticky scroll effect
      ScrollTrigger.create({
        trigger: lottieRef.current.parentElement,
        start: "center center",
        end: "bottom top",
        pin: true,
        pinSpacing: true,
        markers: true,
        refreshPriority: 0, // Normal priority for pinning
        invalidateOnRefresh: true // Recalculate pin positioning on resize
      });
    }

    // --- SECOND LOTTIE ANIMATION CONTROL (SIMPLE OVERLAY) ---
    if (lottie2Ref.current && lottie2Obj && lottie2Obj.animationItem) {
      const secondAnimation = lottie2Obj.animationItem;
      
      // Start the second animation immediately and keep it looping
      secondAnimation.play();
      
      // Start with overlay hidden (opacity will be controlled by scroll progress)
      gsap.set(lottie2Ref.current, { opacity: 0 });
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
        {/* Navigation Menu (Sticky) */}
        <nav className="fixed top-10 right-10 z-20">
          <ul  data-mask-size="0" className="flex flex-col items-end space-y-2">
            {["ABOUT", "WORK", "CONTACT"].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="text-[#b7ab98] hover:text-[#EB5939] text-xl tracking-[0.1em] font-bold relative nav-item"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

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
                  
                </span>
              </div>
              {/* * reveal section { special case , <motionMaskRef> has to be in same div} * */}
              <div className="w-full flex justify-center">
                <div className="w-[100%]">
                 <div
                    ref={visualMaskRef}
                    className="border-t border-gray-500 bg-[#EB5939] mask-reveal flex items-center justify-between px-[15%]"
                  >
                    <p className="text-[120px] font-bold text-black">
                      <span data-mask-size="0">VISUAL</span>
                    </p>

                    <p className="text-[30px] font-medium text-black/90">
                      <span data-mask-size="0">DESIGN</span>
                    </p>
                 </div>

                  <div
                    ref={motionMaskRef}
                    className="border-t-1 border-gray-500 bg-[#EB5939] mask-reveal flex items-center justify-between px-[15%]"
                  >
                    <p className="text-[120px] font-bold text-black">
                      <span data-mask-size="0"> MOTION</span>
                    </p>

                    <p className="text-[30px] font-medium text-black/90">
                      <span data-mask-size="0">GRAPHICS</span>
                    </p>
                  </div>
                  <div
                    ref={productMaskRef}
                    className="border-t-1 border-gray-500 bg-[#EB5939] mask-reveal flex items-center justify-between px-[15%]"
                  >
                    <p className="text-[120px] font-bold text-black">
                      <span data-mask-size="0">PRODUCT</span>
                    </p>

                    <p className="text-[30px] font-medium text-black/90">
                      <span data-mask-size="0">INTERFACES</span>
                    </p>
                  </div>
                  <div
                    ref={promoMaskRef}
                    className="border-t-1 border-gray-500 border-b-1 bg-[#EB5939] mask-reveal flex items-center justify-between px-[15%]"
                  >
                    <p className="text-[120px] font-bold text-black">
                      <span data-mask-size="0">PROMO</span>
                    </p>

                    <p className="text-[30px] font-medium text-black/90">
                      <span data-mask-size="0">VIDEOS</span>
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



        {/* --- MOTTO SECTION --- */}
        <div className="w-full h-[100vh] flex flex-col items-center justify-center relative overflow-hidden" >
          {/* Simple Background Image */}
          <div className="motto-wrap absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <div ref={mottoImageRef} className="absolute inset-0 w-full h-full motto-image">
            <Image
              src="/mymotto.jpg"
              alt="Banner Background"
              
              fill
              className="object-cover"
              priority
            />
            </div>
          </div>
          
          {/* Section content area */}
          <div className="flex items-center justify-center h-full w-full z-1 relative">
            <div ref={mottoRef} className="text-center w-full">
              <div className="mb-6 text-2xl text-[#b7ab98] font-semibold tracking-[0.1em]">
                MY MOTTO
              </div>
              <h2 className="text-[100px] font-bold text-[#b7ab98] tracking-[-0.02em] leading-[0.9em] m-0">
                <span className="motto-word inline-block text-[#EB5939]" data-mask-size="1200">GOOD</span>
                <span className="motto-word inline-block ml-4" data-mask-size="1200">DESIGN</span>
              </h2>
              <h2 className="text-[100px] font-bold text-[#b7ab98] tracking-[-0.02em] leading-[0.9em] m-0">
                <span className="motto-word inline-block" data-mask-size="1200">IS</span>
                <span className="motto-word inline-block ml-4 text-[#EB5939]" data-mask-size="1200">HONEST</span>
              </h2>
            </div>
          </div>
        </div>

        {/* --- LOTTIE ANIMATION SECTION --- */}
        <div className="w-full min-h-[400vh] bg-white relative" >
          <div className="w-full sticky top-0 h-screen relative">
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

        {/* ================================================================================================= */}
        {/* === REVEAL OVERLAY (Layer 2) === */}
        {/* ================================================================================================= */}
        <div
          ref={revealRef}
          className="reveal absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            opacity: 0, // Start fully transparent
            zIndex: 2,
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

          {/* --- REVEALED WHAT I DO SECTION ( USE LESS JUST THERE TO FILL OUT STUFF--- */}
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
          <div className="w-full min-h-screen items-center justify-center bg-[#EB5939] ">
          <div className="relative top-0 left-0 w-full h-[100px] flex items-center">
            <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em] test">
              SHOWREEL
            </span>
          </div>

          </div>

          {/* --- REVEALED Motto Section --- */}
          <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#EB5939] relative">
            {/* Revealed content area */}
            <div className="flex items-center justify-center h-full w-full z-1 relative">
              <div className="text-center w-full">
                <div className="mb-6 text-2xl text-black font-semibold tracking-[0.1em]">
                  MY MOTTO
                </div>
                <h2 className="text-[100px] font-bold text-black tracking-[-0.02em] leading-[0.9em] m-0">
                  <span>NOT ALL GOOD DESIGN</span>
                </h2>
                <h2 className="text-[100px] font-bold text-black tracking-[-0.02em] leading-[0.9em] m-0">
                  <span>IS HONEST</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}