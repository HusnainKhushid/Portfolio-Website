"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function Navigation() {
    useLayoutEffect(() => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item) => {
            const el = item as HTMLElement;

            if (!el.querySelector('.nav-underline')) {
                const underline = document.createElement('span');
                underline.className = 'nav-underline';
                el.appendChild(underline);

                gsap.set(underline, {
                    width: 0,
                    left: "50%",
                    bottom: "-3px",
                    position: "absolute",
                    height: "1px",
                    backgroundColor: "#EB5939",
                });
            }

            el.addEventListener('mouseenter', () => {
                gsap.to(el, { color: "#EB5939", duration: 0.3, ease: "power1.out" });
                gsap.to(el.querySelector('.nav-underline'), { width: "100%", left: "0", duration: 0.3, ease: "power1.out" });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, { color: "#b7ab98", duration: 0.3, ease: "power1.out" });
                gsap.to(el.querySelector('.nav-underline'), { width: 0, left: "50%", duration: 0.3, ease: "power1.out" });
            });
        });
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="fixed top-10 right-10 z-20">
            <ul data-mask-size="0" className="flex flex-col items-end space-y-1">
                {[
                    { label: "ABOUT", id: "about" },
                    { label: "WORK", id: "work" },
                    { label: "CONTACT", id: "contact" },
                ].map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className="text-[#b7ab98] hover:text-[#EB5939] text-xs tracking-[0.15em] font-normal relative nav-item"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
