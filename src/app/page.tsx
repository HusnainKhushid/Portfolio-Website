"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

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

    // --- 5. CLEANUP ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const aboutText = "I’m a visual designer who brings ideas to life through motion, design, and storytelling.From bold animations to intuitive interfaces, I help brands stand out and connect.";
  const aboutTextReveal = "I’m a visual designer who COPIES ideas to life through motion, design, and storytelling.From bold animations to intuitive interfaces, I help brands stand out and connect.";

  return (
    <>
      <div className="main relative">
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
            <div className="absolute top-0 left-0 w-full h-full min-h-screen flex flex-col items-center justify-center z-20">
              <h1 data-mask-size="700" className="text-white text-5xl font-extrabold text-center leading-tight drop-shadow-lg">
                Making good<br />
                shit since<br />
                2019
              </h1>
            </div>
          </div>
          <div className="w-full min-h-screen flex items-center justify-center bg-white">
            <h2 data-mask-size="700" ref={textRef} className="text-6xl font-bold font-poppins text-gray-800 max-w-[80%] text-center">
              {aboutText.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-3">
                  {word.split('').map((char, j) => (
                    <span key={j} className="letter inline-block">{char}</span>
                  ))}
                </span>
              ))}
            </h2>
          </div>

          <div className="w-full min-h-screen flex items-center justify-center bg-white">
           
           
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
          <div className="w-full min-h-screen m-0 p-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full min-h-screen flex flex-col items-center justify-center bg-amber-800">
              <h1 className="text-white text-5xl font-extrabold text-center leading-tight drop-shadow-lg">
                Making bad<br />
                shit since<br />
                2015
              </h1>
            </div>
          </div>
          {/* REVEALED SECTION 2 */}
          <div className="w-full min-h-screen flex items-center justify-center bg-black">
            <h2 className="text-6xl font-bold font-poppins text-white max-w-[80%] text-center">
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