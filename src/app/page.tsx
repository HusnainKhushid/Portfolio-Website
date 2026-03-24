"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// Components
import Navigation from "../components/ui/Navigation";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import WhatIDo from "../components/sections/WhatIDo";
import Showreel from "../components/sections/Showreel";
import Motto from "../components/sections/Motto";
import Experience from "../components/sections/Experience";

import GlobeScene from "../components/3d/GlobeScene";
import Contact from "../components/sections/Contact";
import SplashScreen from "../components/ui/SplashScreen";

export default function HomePage() {
  const revealRef = useRef<HTMLDivElement>(null);
  const [splashDone, setSplashDone] = useState(false);

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

    const checkMaskHover = () => {
      // Don't check if the pointer hasn't even entered the screen yet
      if (!hasPointerMoved) return;

      // Because the topmost reveal/globe layers have pointer-events-none, 
      // this correctly returns the interactive layer 1 element below the cursor.
      const el = document.elementFromPoint(pointerClientX, pointerClientY);
      if (!el) return;

      const hoverElement = el.closest("[data-mask-size]");
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
    };

    const syncCursorPosition = () => {
      cursorXTo(pointerClientX + window.scrollX);
      cursorYTo(pointerClientY + window.scrollY);
      checkMaskHover(); // Re-evaluate hover element as the page scrolls beneath the cursor
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;

      if (!hasPointerMoved) {
        hasPointerMoved = true;
        // Snap the mask to initial position immediately
        gsap.set(reveal, {
          "--cursor-x": pointerClientX + window.scrollX,
          "--cursor-y": pointerClientY + window.scrollY,
        });
        gsap.to(reveal, { opacity: 1, duration: 0.3 });
        maskScaleTo(1);
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
        <SplashScreen onBegin={() => setSplashDone(true)} onComplete={() => { }} />
        <Navigation />

        {/* ================================================================================================= */}
        {/* === BACKGROUND CONTENT (Layer 1 - Default) === */}
        {/* ================================================================================================= */}
        <div>
          <Hero variant="default" splashDone={splashDone} />
          <About variant="default" />
          <WhatIDo variant="default" />
          <Showreel variant="default" />
          <Experience variant="default" />
          <Motto variant="default" />

          <Contact variant="default" />
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
          <Experience variant="reveal" />
          <Motto variant="reveal" />
          <Contact variant="reveal" />
        </div>

        {/* ======================================================= */}
        {/* === LAYER 3 — Globe (above reveal, scrolls with page) = */}
        {/* ======================================================= */}
        {/* Uses the same section heights so the globe sits exactly */}
        {/* over the Experience section in the stacking order.      */}
        <div
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{ zIndex: 50 }}
          aria-hidden="true"
        >
          {/* 
                We have 4 sections before Experience: Hero, About, WhatIDo, Showreel
                Hero: 100vh
                About: min-h-[60vh] md:min-h-screen
                WhatIDo: min-h-[60vh] md:min-h-screen
                Showreel: min-h-[60vh] md:min-h-screen
                They don't perfectly equal 400vh on mobile anymore.
                But for testing "on top", we just put it inside a static place.
                For now we just reuse the spacer layout:
             */}
          <div className="flex flex-col w-full opacity-0">
            <div className="w-full h-screen" />
            <div className="w-full min-h-[60vh] md:min-h-screen" />
            <div className="w-full min-h-[60vh] md:min-h-screen" />
            <div className="w-full min-h-[60vh] md:min-h-screen" />
          </div>

          {/* Globe canvas — same height as Experience section */}
          <div className="w-full min-h-[60vh] md:min-h-screen absolute top-0 mt-[100vh]" style={{ transform: "translateY(calc(max(60vh, 100vh) * 3))" }}>
            <GlobeScene />
          </div>
        </div>
      </div>
    </>
  );
}