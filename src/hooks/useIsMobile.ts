"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` when the viewport is considered "mobile"
 * (width < 768 px, i.e. smaller than Tailwind's `md` breakpoint).
 * SSR-safe: returns `false` until the first client-side render.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        setIsMobile(mq.matches);

        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
