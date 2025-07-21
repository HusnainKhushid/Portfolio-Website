"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Player from "lottie-react";
import { useLottie, useLottieInteractivity } from "lottie-react";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const [lottieData, setLottieData] = useState<any>(null);

  useEffect(() => {
    import("../../public/data.json").then((mod) => setLottieData(mod.default || mod));
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. SETUP ---
    const video = videoRef.current;
    const reveal = revealRef.current;
    const text = textRef.current;
    if (!reveal || !text) return;

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
    const letters = text.querySelectorAll('.letter');
    gsap.fromTo(letters, {
      opacity: 0.5
    }, {
      opacity: 1,
      ease: 'power2.out',
      stagger: {
        each: 0.02,
        from: 'start'
      },
      scrollTrigger: {
        trigger: text,
        start: 'top bottom',
        end: 'bottom 50%',
        scrub: 1.5,
      }
    });

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

  const aboutText = "I’m a visual designer who brings ideas to life through motion, design and storytelling. From bold animations to intuitive interfaces,I help brands express who they are — and why they matter.";
  const aboutTextReveal = "I’m a visual designer who brings ideas to life through motion, design and storytelling. From bold animations to intuitive interfaces,I help brands express who they are — and why they matter.";

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
          <div className="w-full min-h-screen flex items-center justify-center bg-[#D9D9D9]">
            <h2 data-mask-size="1200" ref={textRef} className="text-8xl font-bold text-gray-800 max-w-[80%] text-center">
              {aboutText.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-3">
                  {word.split('').map((char, j) => (
                    <span key={j} className="letter inline-block">{char}</span>
                  ))}
                </span>
              ))}
            </h2>
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
          <div className="w-full min-h-screen flex items-center justify-center bg-[#EB5939]">
            <h2 className="text-8xl font-bold text-[#000000] max-w-[80%] text-center">
            {aboutTextReveal.split(' ').map((word, i) => (
              <span key={i} className="inline-block mr-3">
                {word.split('').map((char, j) => (
                  <span key={j} className="letter inline-block">{char}</span>
                ))}
              </span>
            ))}
            </h2>
          </div>

          <div className="w-full min-h-screen flex items-center justify-center bg-black">
           

          </div>


        </div>


      </div>
    </>
  );
}