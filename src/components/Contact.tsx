"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface ContactProps {
    variant?: "default" | "reveal";
}

const leftSocials = ["Dribbble", "Youtube", "Linkedin"];
const rightSocials = ["Instagram", "Facebook", "Behance"];

function ArrowIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

export default function Contact({ variant = "default" }: ContactProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (variant !== "default" || !containerRef.current) return;

        const grayItems = containerRef.current.querySelectorAll<HTMLElement>(".contact-gray-item");
        const orangeItems = containerRef.current.querySelectorAll<HTMLElement>(".contact-mask-reveal");

        orangeItems.forEach((el) => {
            gsap.set(el, { maskSize: "100% 0%", WebkitMaskSize: "100% 0%" });
        });

        grayItems.forEach((grayEl, index) => {
            const orangeEl = orangeItems[index];
            if (!orangeEl) return;

            const animateTo = (h: string) =>
                gsap.to(orangeEl, {
                    maskSize: `100% ${h}`,
                    WebkitMaskSize: `100% ${h}`,
                    duration: 0.6,
                    ease: "power1.out",
                });

            grayEl.addEventListener("mouseenter", () => animateTo("100%"));
            grayEl.addEventListener("mouseleave", () => animateTo("0%"));
            orangeEl.addEventListener("mouseenter", () => animateTo("100%"));
            orangeEl.addEventListener("mouseleave", () => animateTo("0%"));
        });
    }, [variant]);

    const textSize = "text-[clamp(1.75rem,4.5vw,60px)]";

    /* ── REVEAL VARIANT ── */
    if (variant === "reveal") {
        return (
            <section className="w-full bg-[#EB5939] py-16 md:py-24">
                <div className="relative w-full h-[60px] sm:h-[70px] flex items-center">
                    <span className="absolute left-[12.5%] text-xs sm:text-sm md:text-base text-black font-semibold tracking-[0.5em] uppercase">
                        Connect
                    </span>
                </div>

                <div className="w-full px-[12.5%] flex flex-col md:flex-row gap-12 md:gap-0">
                    {/* Left */}
                    <div className="flex-1 flex flex-col">
                        {leftSocials.map((name) => (
                            <div key={name} className="flex items-center gap-3 py-1">
                                <ArrowIcon className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0" />
                                <span className={`${textSize} font-bold text-black`}>
                                    <span data-mask-size="0">{name}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Right */}
                    <div className="flex-1 flex flex-col">
                        {rightSocials.map((name) => (
                            <div key={name} className="flex items-center gap-3 py-1">
                                <ArrowIcon className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0" />
                                <span className={`${textSize} font-bold text-black`}>
                                    <span data-mask-size="0">{name}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Contact info */}
                    <div className="flex-none w-full md:w-[200px] flex flex-col justify-center gap-6 pl-0 md:pl-10">
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase mb-1">Email</p>
                            <span className="text-[clamp(0.9rem,2vw,18px)] text-black">hello@husnain.dev</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase mb-1">Phone</p>
                            <span className="text-[clamp(0.9rem,2vw,18px)] text-black">+92 300 123 4567</span>
                        </div>
                    </div>
                </div>

                <div className="mt-16 mx-[12.5%] pt-5 flex flex-col sm:flex-row justify-between gap-3">
                    <span className="text-[10px] text-black/40 tracking-widest uppercase">
                        © {new Date().getFullYear()} Husnain Khushid — All rights reserved
                    </span>
                    <span className="text-[10px] text-black/40 tracking-widest uppercase">
                        Designed &amp; Built by Husnain
                    </span>
                </div>
            </section>
        );
    }

    /* ── DEFAULT VARIANT ── */
    return (
        <section className="w-full bg-[#0d0d0d] py-16 md:py-24" ref={containerRef}>
            {/* Label */}
            <div className="relative w-full h-[60px] sm:h-[70px] flex items-center">
                <span className="absolute left-[12.5%] text-xs sm:text-sm md:text-base text-[#b7ab98] font-semibold tracking-[0.5em] uppercase">
                    Connect
                </span>
            </div>

            {/* Main layout */}
            <div className="w-full px-[12.5%] flex flex-col md:flex-row gap-12 md:gap-0">

                {/* ── SOCIALS AREA (relative container for overlay) ── */}
                <div className="flex-1 flex flex-col md:flex-row relative">

                    {/* ── BASE: dark rows (left) ── */}
                    <div className="flex-1 flex flex-col">
                        {leftSocials.map((name) => (
                            <a
                                key={name}
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-gray-item flex items-center gap-3 py-1 cursor-pointer group"
                            >
                                <ArrowIcon className="w-5 h-5 md:w-6 md:h-6 text-[#EB5939] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                                <span className={`reveal-text-light ${textSize} font-bold`}>
                                    <span data-mask-size="0">{name}</span>
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* ── BASE: dark rows (right) ── */}
                    <div className="flex-1 flex flex-col">
                        {rightSocials.map((name) => (
                            <a
                                key={name}
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-gray-item flex items-center gap-3 py-1 cursor-pointer group"
                            >
                                <ArrowIcon className="w-5 h-5 md:w-6 md:h-6 text-[#EB5939] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                                <span className={`reveal-text-light ${textSize} font-bold`}>
                                    <span data-mask-size="0">{name}</span>
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* ── OVERLAY: orange mask-reveal (both columns) ── */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col md:flex-row">

                        {/* Left overlay */}
                        <div className="flex-1 flex flex-col">
                            {leftSocials.map((name) => (
                                <div
                                    key={name}
                                    className="contact-mask-reveal bg-[#EB5939] flex items-center gap-3 py-1 pointer-events-auto flex-1"
                                    style={{
                                        maskImage: "linear-gradient(black,black)",
                                        WebkitMaskImage: "linear-gradient(black,black)",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskPosition: "center",
                                    }}
                                >
                                    <ArrowIcon className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0" />
                                    <span className={`${textSize} font-bold text-black`}>
                                        <span data-mask-size="0">{name}</span>
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Right overlay */}
                        <div className="flex-1 flex flex-col">
                            {rightSocials.map((name) => (
                                <div
                                    key={name}
                                    className="contact-mask-reveal bg-[#EB5939] flex items-center gap-3 py-1 pointer-events-auto flex-1"
                                    style={{
                                        maskImage: "linear-gradient(black,black)",
                                        WebkitMaskImage: "linear-gradient(black,black)",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskPosition: "center",
                                    }}
                                >
                                    <ArrowIcon className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0" />
                                    <span className={`${textSize} font-bold text-black`}>
                                        <span data-mask-size="0">{name}</span>
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* ── CONTACT INFO ── */}
                <div className="flex-none w-full md:w-[200px] flex flex-col justify-center gap-6 pl-0 md:pl-10">
                    <div>
                        <p className="text-[30px] font-semibold tracking-[0.2em] text-[#5a5245] uppercase mb-1">Email</p>
                        <a href="mailto:hello@husnain.dev" className="text-[clamp(0.9rem,2vw,18px)] text-[#b7ab98] hover:text-[#EB5939] transition-colors duration-300">
                            hello@husnain.dev
                        </a>
                    </div>
                    <div>
                        <p className="text-[30px] font-semibold tracking-[0.2em] text-[#5a5245] uppercase mb-1">Phone</p>
                        <a href="tel:+923001234567" className="text-[clamp(0.9rem,2vw,18px)] text-[#b7ab98] hover:text-[#EB5939] transition-colors duration-300">
                            +92 308 80028
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 mx-[12.5%] pt-5 flex flex-col sm:flex-row justify-between gap-3">
                <span className="text-[10px] text-[#2e2e2e] tracking-widest uppercase">
                    © {new Date().getFullYear()} Husnain Khushid — All rights reserved
                </span>
                <span className="text-[10px] text-[#2e2e2e] tracking-widest uppercase">
                    Designed &amp; Built by Husnain
                </span>
            </div>
        </section>
    );
}
