"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function Navigation() {
    useLayoutEffect(() => {
        // --- NAVIGATION HOVER ANIMATION ---
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
    }, []);

    return (
        <nav className="fixed top-10 right-10 z-20">
            <ul data-mask-size="0" className="flex flex-col items-end space-y-2">
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
    );
}
