"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { useState, useEffect } from "react";
import { useLottie, useLottieInteractivity } from "lottie-react";

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

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  const visualMaskRef = useRef<HTMLDivElement>(null);
  const motionMaskRef = useRef<HTMLDivElement>(null);
  const productMaskRef = useRef<HTMLDivElement>(null);
  const promoMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("../../public/data.json").then((mod) => setLottieData(mod.default || mod));
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. SETUP ---
    
    const video = videoRef.current;
    const reveal = revealRef.current;
    const lines = textRef.current?.querySelectorAll('p');
    if (!reveal || !lines) return;

    console.log(lines)
    const lenis = new Lenis();
    gsap.ticker.add(t => lenis.raf(t * 1000));

    // --- 2. HIGH-PERFORMANCE SETTERS ---
    const videoYTo = video ? gsap.quickTo(video, "y", { duration: 0.28, ease: "none" }) : () => {};
    const cursorXTo = gsap.quickTo(reveal, "--cursor-x", { duration: 0.25, ease: "slow(0.1, 0.4, true)" });
    const cursorYTo = gsap.quickTo(reveal, "--cursor-y", { duration: 0.25, ease: "slow(0.1, 0.4, true)" });
    const maskScaleTo = gsap.quickTo(reveal, "--mask-scale", { duration: 0.3, ease: 'power2.out' });

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
        gsap.set(reveal, { '--cursor-x': pointerClientX + window.scrollX, '--cursor-y': pointerClientY + window.scrollY });
        gsap.to(reveal, { opacity: 1, duration: 0.3 });
        maskScaleTo(1); // Animate to default size
      }
      
      const hoverElement = target.closest('[data-mask-size]');
      if (hoverElement !== currentHoverTarget) {
        currentHoverTarget = hoverElement;
        if (hoverElement) {
          const newSize = parseFloat(hoverElement.getAttribute('data-mask-size') || '100');
          maskScaleTo(newSize / 100); // Animate to new scale relative to base size of 100px
        } else {
          maskScaleTo(1); // Animate back to default scale
        }
      }

      syncCursorPosition();
    };

    // --- 4. ATTACH LISTENERS ---
    window.addEventListener("mousemove", handleMouseMove);
    lenis.on('scroll', ScrollTrigger.update);
    lenis.on("scroll", (e: Lenis) => {
      syncCursorPosition();
      if(video) videoYTo(e.scroll * 0.4);
    });

    // --- New Animation ---
    const allRevealTextElements = document.querySelectorAll('.reveal-text');
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
    
    // Mask animation function for reusable hover effects
    const setupMaskAnimation = (maskRef: React.RefObject<HTMLDivElement | null>) => {
      if (maskRef.current) {
        const maskElement = maskRef.current;
        const spanTag = maskElement.querySelector('span') as HTMLElement;
        
        if (spanTag) {
          // Set initial state
          gsap.set(maskElement, {
            maskSize: '100% 0%',
            WebkitMaskSize: '100% 0%',
          });
          
          // Create timeline for smooth animation
          const maskTimeline = gsap.timeline({ paused: true });
          maskTimeline.to(maskElement, {
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            duration: 0.6,
            ease: 'power2.out',
          });
          
          // Add hover event listeners to the span tag
          spanTag.addEventListener('mouseenter', () => {
            maskTimeline.play();
          });
          
          spanTag.addEventListener('mouseleave', () => {
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

    // --- LOTTIE ANIMATION SCROLLTRIGGER ---
    if (lottieRef.current) {
      gsap.fromTo(
        lottieRef.current,
        { opacity: 1, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: lottieRef.current.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: 2,
            pin: true,
            pinSpacing: true,
          },
        }
      );
    }

    // --- 5. CLEANUP ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const lottieOptions = { animationData: lottieData || {} };
  const lottieObj = useLottie({ ...lottieOptions, style: { width: "100%", height: "auto" } });
  const LottieScroll = useLottieInteractivity({
    lottieObj,
    mode: "scroll",
    actions: [
      {
        visibility: [0, 1],
        type: "seek",
        frames: [0, 276],
      },
    ],
  });

  return (
    <>
      <div className={`main relative`}>
        {/* === BACKGROUND CONTENT (Layer 1) === */}
        <div>
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

            <div className="absolute top-0 left-0 h-full min-h-screen flex flex-col justify-center" style={{ paddingLeft: '15%' }}>
              
              <h2 data-mask-size="1200" className="text-[#b7ab98] text-2xl text-center tracking-[0.3em]">HUSNAIN KHURSHID</h2>
              <h1 data-mask-size="1200" className="text-[#b7ab98] text-[190px] font-extrabold leading-none">
                MAKING<br/>
                GOOD<br/>
                <span className="text-[#EB5939]">SHIT SINCE</span><br/>
                2019
              </h1>
            </div>
          </div>
          
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9]"> 
                <div className="relative w-screen h-[100px] flex items-center"> {/* or any height */}
                    <span data-mask-size="1200"className="absolute left-1/8 text-2xl text-[#383838] font-semibold tracking-[0.3em]">ABOUT ME</span>
                </div>
                <h2 data-mask-size="1200" ref={textRef} className="text-8xl font-bold text-gray-800 max-w-[90%] text-center">
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold">I’m a visual designer who brings ideas to life through </p>
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold">motion, design and storytelling.From bold </p>
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold">animations to intuitive interfaces,I help brands express </p>
                <p className="reveal-text mb-[-16] leading-tight text-[80px] font-bold"> who they are — and why they matter.</p>
                </h2>
          </div>
          

          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9]">
            <div className="bg-[#D9D9D9]">
                <div className="relative w-screen h-[100px] flex items-center"> {/* or any height */}
                    <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">WHAT I DO</span>
                </div>
                
                <div className="w-full flex justify-center">
                  <div className="w-[100%]"> 
                    <div  className="border-t-1 border-gray-500">
                      <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]"> 
                        <span data-mask-size="0"> VISUAL</span>
                      </p>
                    </div>
                    <div className="border-t-1 border-gray-500">
                      <p  className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                        <span data-mask-size="0"> MOTION</span>
                      </p>
                    </div>
                    <div className="border-t-1 border-gray-500">
                      <p  className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
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

                <div className="relative w-screen h-[100px] flex items-center"> {/* or any height */}
                    <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">WHAT I DO</span>
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
                      <p  className="text-[120px] font-bold text-gray-800 ml-[15%]">
                        <span data-mask-size="0"> MOTION</span>
                      </p>
                    </div>
                    <div 
                      ref={productMaskRef}
                      className="border-t-1 border-gray-500 bg-[#EB5939] mask-reveal"
                    >
                      <p  className="text-[120px] font-bold text-gray-800 ml-[15%]">
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

            <div className="w-full min-h-[400vh] bg-white relative">
              <div className="sticky top-0 h-screen flex items-center justify-center">
                <div ref={lottieRef} className="w-full max-w-full">
                  {lottieData && LottieScroll}
                </div>
              </div>
            </div>
          </div>


        {/* === REVEAL OVERLAY (Layer 2) === */}
        <div
          ref={revealRef}
          className="reveal absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{
            opacity: 0, // Start fully transparent
            maskImage: 'url("/test-mask.svg")',
            maskRepeat: 'no-repeat',
            maskSize: 'calc(var(--mask-scale, 0) * 50px)',
            maskPosition: 'calc(var(--cursor-x, -100) * 1px - var(--mask-scale, 0) * 25px) calc(var(--cursor-y, -100) * 1px - var(--mask-scale, 0) * 25px)',
            WebkitMaskImage: 'url("/test-mask.svg")',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'calc(var(--mask-scale, 0) * 50px)',
            WebkitMaskPosition: 'calc(var(--cursor-x, -100) * 1px - var(--mask-scale, 0) * 25px) calc(var(--cursor-y, -100) * 1px - var(--mask-scale, 0) * 25px)',
          }}
        >
          {/* REVEALED SECTION 1 */}
          <div className="w-full min-h-screen m-0 p-0 relative overflow-hidden bg-[#EB5939]">
            <div className="absolute top-0 left-0 h-full min-h-screen flex flex-col justify-center" style={{ paddingLeft: '15%' }}>
              <h2 className="text-[#000000] text-2xl text-center tracking-[0.3em]">HUSNAIN KHURSHID</h2>
              <h1 className="text-[#000000] text-[190px] font-extrabold leading-none">
                HIDING<br />
                BAD <br />
                SHIT SINCE<br />
                2019
              </h1>
            </div>
          </div>
          {/* REVEALED SECTION 2 */}
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#EB5939]">
            <div className="relative w-screen h-[100px] flex items-center"> {/* or any height */}
                <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">ABOUT ME</span>
            </div>
            <h2 className="text-8xl font-bold text-black max-w-[90%] text-center">
                <p className="mb-[-16] leading-tight text-[80px] font-bold">I’m a visual designer who brings ideas to life through </p>
                <p className="mb-[-16] leading-tight text-[80px] font-bold">motion, design and storytelling.From bold </p>
                <p className="mb-[-16] leading-tight text-[80px] font-bold">animations to intuitive interfaces,I help brands express </p>
                <p className="mb-[-16] leading-tight text-[80px] font-bold"> who they are — and why they matter.</p>
            </h2>
          </div>


          {/* REVEALED SECTION 3 */}
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#EB5939]"> 
            <div className="relative w-screen h-[100px] flex items-center"> {/* or any height */}
                <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">WHAT I DO</span>
            </div>
            
            <div className="w-full flex justify-center">
              <div className="w-[100%]"> 
                <div  className="border-t-1 border-gray-500">
                  <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">VISUAL</p>
                </div>
                <div  className="border-t-1 border-gray-500">
                  <p  className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">MOTION</p>
                </div>
                <div className="border-t-1 border-gray-500">
                  <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">PRODUCT</p>
                </div>
                <div className="border-t-1 border-gray-500 border-b-1">
                  <p  className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">PROMO</p>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
}