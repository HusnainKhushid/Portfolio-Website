"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Auto-fit font size hook.
 *
 * Measures the widest nowrap child (<p> or <h1>) inside the container
 * and scales the container's font-size so nothing overflows.
 *
 * Accounts for container padding so the text fits within the
 * actual content area, not the full clientWidth.
 */
export function useAutoFitFont(
    containerRef: React.RefObject<HTMLElement | null>,
    { maxFont = 80, minFont = 12, selector = "p" } = {}
) {
    const [fontSize, setFontSize] = useState(maxFont);

    const recalc = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        // Subtract padding to get the real content area
        const style = window.getComputedStyle(el);
        const paddingL = parseFloat(style.paddingLeft) || 0;
        const paddingR = parseFloat(style.paddingRight) || 0;
        const availableWidth = el.clientWidth - paddingL - paddingR;
        if (availableWidth <= 0) return;

        // Measure at max font to get natural widths
        el.style.fontSize = `${maxFont}px`;

        const targets = el.querySelectorAll<HTMLElement>(selector);
        let widest = 0;
        targets.forEach((t) => {
            if (t.scrollWidth > widest) widest = t.scrollWidth;
        });

        if (widest === 0) return;

        // Scale proportionally
        const ideal = Math.floor((availableWidth / widest) * maxFont);
        const clamped = Math.max(minFont, Math.min(maxFont, ideal));

        el.style.fontSize = `${clamped}px`;
        setFontSize(clamped);
    }, [containerRef, maxFont, minFont, selector]);

    useEffect(() => {
        recalc();

        const el = containerRef.current;
        if (!el) return;

        const ro = new ResizeObserver(() => recalc());
        ro.observe(el);
        return () => ro.disconnect();
    }, [recalc, containerRef]);

    return fontSize;
}
