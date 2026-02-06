"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface WhatIDoProps {
    variant?: "default" | "reveal";
}

export default function WhatIDo({ variant = "default" }: WhatIDoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // In 'default' mode, we have the interactive orange bars overlaying the gray text.
        // We attach the hover listeners to the interactive elements.

        if (variant === "default" && containerRef.current) {
            const items = containerRef.current.querySelectorAll(".mask-reveal");
            items.forEach((maskElement: Element) => {
                const el = maskElement as HTMLElement;
                // The structure is: <div class="mask-reveal"> <p> ... </p> </div>
                // The original code attached listener to 'span' inside. 
                // We need to ensure pointer events can reach it.
                // But wait, initially the maskSize is "100% 0%".
                // If mask hides the element, mouse events might not fire on it depending on browser.
                // However, in the original code, the Gray text was UNDERNEATH.
                // And this Orange Bar was on top.
                // If the Orange Bar is masked away, we are hovering the Gray Text?
                // But the listener was attached to the span inside the Orange Bar.
                // This suggests the span might be visible or there's a trick.
                // OR, maybe I should attach the listener to the WRAPPER causing the effect?

                // Actually, simplest replication of original behavior:
                // Original: span inside maskElement.
                // Let's attach to the maskElement itself or the container for stability, 
                // but strictly following original logic:

                const spanTag = el.querySelector("span") as HTMLElement;

                if (spanTag) {
                    // The trigger must be the parent/wrapper because if the element is masked (height 0), 
                    // you can't hover it to start the animation!
                    // In the original code, the "What I Do" section had a relative wrapper.
                    // The Orange Bar was absolute.
                    // So the mouseenter probably needs to happen on the area occupied by the item.
                    // Let's modify the structure slightly to wrap both Gray and Orange in a relative container
                    // and listen on THAT container.

                    // However, I want to minimize structural changes if possible.
                    // Looking at original page.tsx lines 638+, the absolute div was covering the same area?
                    // No, it was just "absolute". 

                    // New Strategy: Attach event listener to the Gray text (which is always visible),
                    // and have it trigger the Orange text animation.

                    // But we need to link them.
                    // Index based matching?

                }
            });

            // BETTER APPROACH:
            // Render the items pairwise in a simplified structure.
            // <ItemWrapper> -> <GrayText /> <OrangeOverlay /> </ItemWrapper>
            // MouseEnter ItemWrapper -> Reveal OrangeOverlay.

            // Let's do this manual query selection since I kept the structure similar to original.
            // But I need to allow "hover" trigger.
            // I will attach the listeners to the `mask-reveal` element, but I will make sure it has a "hit target" 
            // or I will attach to the sibling text.
        }
    }, [variant]);

    // Helper for safe event attaching
    useLayoutEffect(() => {
        if (variant === "default" && containerRef.current) {
            // Select all Item Wrappers (I'll add a wrapper class or just assume parallel structure)
            // Since I can't easily change the DOM without a larger refactor, let's use the fact that
            // I'm going to render the Orange Bars ON TOP of the Gray ones in the same component.

            const grayItems = containerRef.current.querySelectorAll('.gray-item');
            const orangeItems = containerRef.current.querySelectorAll('.mask-reveal');

            grayItems.forEach((grayEl, index) => {
                const orangeEl = orangeItems[index] as HTMLElement;
                if (!orangeEl) return;

                // Set initial state
                gsap.set(orangeEl, {
                    maskSize: "100% 0%",
                    WebkitMaskSize: "100% 0%",
                });

                const animateTo = (height: string) => {
                    gsap.to(orangeEl, {
                        maskSize: `100% ${height}`,
                        WebkitMaskSize: `100% ${height}`,
                        duration: 0.6,
                        ease: "power1.out",
                    });
                }

                grayEl.addEventListener('mouseenter', () => animateTo("100%"));
                grayEl.addEventListener('mouseleave', () => animateTo("0%"));

                // Also listen on the orange element in case the mouse moves "fast" into it 
                // and it covers the gray one (z-index wise)
                orangeEl.addEventListener('mouseenter', () => animateTo("100%"));
                orangeEl.addEventListener('mouseleave', () => animateTo("0%"));
            });
        }
    }, [variant]);


    if (variant === "reveal") {
        // Layer 2: Black Text on Orange BG (The Flashlight Effect Content)
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#EB5939]">
                <div className="relative w-screen h-[100px] flex items-center">
                    <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                        WHAT I DO
                    </span>
                </div>

                <div className="w-full flex justify-center">
                    <div className="w-[100%]">
                        {/* Just the text content for the flashlight to reveal */}
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
        );
    }

    // DEFAULT VARIANT
    // Contains both the Base Gray layer AND the Interactive Orange Overlay layer
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] relative" ref={containerRef}>
            <div className="bg-[#D9D9D9] w-full">
                <div className="relative w-screen h-[100px] flex items-center">
                    <span className="absolute left-1/8 text-2xl text-black font-semibold tracking-[0.3em]">
                        WHAT I DO
                    </span>
                </div>

                <div className="w-full flex justify-center relative">

                    {/* BASE: Gray Text */}
                    <div className="w-[100%]">
                        <div className="border-t-1 border-gray-500 gray-item cursor-pointer">
                            <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                                <span data-mask-size="0"> VISUAL</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500 gray-item cursor-pointer">
                            <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                                <span data-mask-size="0"> MOTION</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500 gray-item cursor-pointer">
                            <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                                <span data-mask-size="0">PRODUCT</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-gray-500 border-b-1 gray-item cursor-pointer">
                            <p className="reveal-text text-[120px] font-bold text-gray-800 ml-[15%]">
                                <span data-mask-size="0">PROMO</span>
                            </p>
                        </div>
                    </div>

                    {/* OVERLAY: Orange Bars (Absolutely positioned on top) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="w-[100%] h-full flex flex-col">
                            <div className="border-t border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className="text-[120px] font-bold text-black">
                                    <span data-mask-size="0">VISUAL</span>
                                </p>
                                <p className="text-[30px] font-medium text-black/90 ml-auto mr-[15%]">
                                    <span data-mask-size="0">DESIGN</span>
                                </p>
                            </div>

                            <div className="border-t border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className="text-[120px] font-bold text-black">
                                    <span data-mask-size="0"> MOTION</span>
                                </p>
                                <p className="text-[30px] font-medium text-black/90 ml-auto mr-[15%]">
                                    <span data-mask-size="0">GRAPHICS</span>
                                </p>
                            </div>

                            <div className="border-t border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className="text-[120px] font-bold text-black">
                                    <span data-mask-size="0">PRODUCT</span>
                                </p>
                                <p className="text-[30px] font-medium text-black/90 ml-auto mr-[15%]">
                                    <span data-mask-size="0">INTERFACES</span>
                                </p>
                            </div>

                            <div className="border-t border-gray-500 border-b border-gray-500 bg-[#EB5939] mask-reveal flex items-center px-[15%] pointer-events-auto flex-1">
                                <p className="text-[120px] font-bold text-black">
                                    <span data-mask-size="0">PROMO</span>
                                </p>
                                <p className="text-[30px] font-medium text-black/90 ml-auto mr-[15%]">
                                    <span data-mask-size="0">VIDEOS</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
