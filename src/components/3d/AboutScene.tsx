"use client";

import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import ModelView from './ModelView';

const SceneContent: React.FC<{ scrollYRef: React.RefObject<number> }> = ({ scrollYRef }) => {
    const { viewport, invalidate } = useThree();

    const isMobile = viewport.width < 5;
    const scale = isMobile ? 0.02 : 0.03;
    const xPos = (viewport.width / 2);

    // Drive rotation from ref (no re-renders) and request a new frame
    useFrame(() => {
        invalidate(); // request render only when called
    });

    return (
        <>
            <ModelView
                path="/3d/mouse.min.gltf"
                scale={scale}
                position={[-xPos - .1, 1.0, 0]}
                rotation={[0.3, -1, 0]}
                scrollYRef={scrollYRef}
                rotationSpeed={0.1}
            />
            <ModelView
                path="/3d/coffee.min.gltf"
                scale={scale}
                position={[xPos, -1.5, 0]}
                rotation={[0.3, -0.5, 0]}
                scrollYRef={scrollYRef}
                rotationSpeed={0.1}
            />
        </>
    );
};

const AboutScene: React.FC = () => {
    const scrollYRef = useRef(0);
    const isVisibleRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => { scrollYRef.current = window.scrollY; };
        window.addEventListener('scroll', handleScroll, { passive: true });
        scrollYRef.current = window.scrollY;

        // Only render when the About section is in the viewport
        const observer = new IntersectionObserver(
            ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
            { rootMargin: '200px' }  // start rendering slightly before visible
        );
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <Canvas
                className="w-full h-full"
                camera={{ position: [0, 0, 5], fov: 45 }}
                frameloop="demand"
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={2} />
                <Suspense fallback={null}>
                    <SceneContent scrollYRef={scrollYRef} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default AboutScene;
