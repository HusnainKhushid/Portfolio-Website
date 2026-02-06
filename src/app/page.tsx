"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// Components
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import WhatIDo from "../components/WhatIDo";
import Showreel from "../components/Showreel";
import Motto from "../components/Motto";
import LottieScroll from "../components/LottieScroll";

export default function HomePage() {
  const revealRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reveal = revealRef.current;
    if (!reveal) return;

    // --- 1. SMOOTH SCROLL ---
    const lenis = new Lenis();
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    lenis.on("scroll", ScrollTrigger.update);

    // --- 2. GLOBAL MOUSE TRACKING & REVEAL EFFECT ---
    // These GSAP quickTo setters manage the performant updates of CSS variables
    // on the reveal container to creating the flashlight effect.

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

    let pointerClientX = 0;
    let pointerClientY = 0;
    let hasPointerMoved = false;
    let currentHoverTarget: Element | null = null;

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
        maskScaleTo(1);
      }

      // Check if we are hovering over an element that should expand the mask
      // The Components should put `data-mask-size` on their interactive elements.
      const hoverElement = target.closest("[data-mask-size]");
      if (hoverElement !== currentHoverTarget) {
        currentHoverTarget = hoverElement;
        if (hoverElement) {
          const newSize = parseFloat(
            hoverElement.getAttribute("data-mask-size") || "100"
          );
          maskScaleTo(newSize / 100);
        } else {
          maskScaleTo(1);
        }
      }

      syncCursorPosition();
    };

    window.addEventListener("mousemove", handleMouseMove);
    lenis.on("scroll", syncCursorPosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className={`main relative`}>
        <Navigation />

        {/* ================================================================================================= */}
        {/* === BACKGROUND CONTENT (Layer 1 - Default) === */}
        {/* ================================================================================================= */}
        <div>
          <Hero variant="default" />
          <About variant="default" />
          <WhatIDo variant="default" />
          <Showreel variant="default" />
          <Motto variant="default" />

          {/* LottieScroll is structurally outside the reveal logic in original design */}
          <LottieScroll />
        </div>

        {/* ================================================================================================= */}
        {/* === REVEAL OVERLAY (Layer 2 - Reveal) === */}
        {/* ================================================================================================= */}
        <div
          ref={revealRef}
          className="reveal absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            opacity: 0, // Start transparent until mouse move
            zIndex: 15,
            // Original mask setup
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
          <Hero variant="reveal" />
          <About variant="reveal" />
          <WhatIDo variant="reveal" />
          <Showreel variant="reveal" />
          <Motto variant="reveal" />
          {/* LottieScroll is NOT in reveal layer */}
        </div>
      </div>
    </>
  );
}