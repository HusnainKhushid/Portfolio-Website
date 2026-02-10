"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import ModelView from './ModelView';

const SceneContent: React.FC<{ scrollY: number }> = ({ scrollY }) => {
    const { viewport } = useThree();

    // Responsive scale logic
    // On small screens (mobile), viewport.width is small.
    // We adjust scale to ensure it doesn't look too massive or tiny, 
    // though the main request is positioning.
    const isMobile = viewport.width < 5;
    const scale = isMobile ? 0.02 : 0.03;

    // Position: half outside means centered on the edge.
    // viewport.width is the total width. Edge is width / 2.
    // Left edge: -width / 2
    // Right edge: width / 2
    const xPos = (viewport.width / 2);

    return (
        <>
            {/* Mouse on the Left */}
            <ModelView
                path="/3d/mouse.min.gltf"
                scale={scale}
                position={[-xPos - .1, 1.0, 0]}
                rotation={[0.3, -1, 0]}
                scrollY={scrollY}
                rotationSpeed={0.1}
            />

            {/* Coffee on the Right */}
            <ModelView
                path="/3d/coffee.min.gltf"
                scale={scale}
                position={[xPos, -1.5, 0]}
                rotation={[0.3, -0.5, 0]}
                scrollY={scrollY}
                rotationSpeed={0.1}
            />
        </>
    );
};

const AboutScene: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial set
        setScrollY(window.scrollY);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <Canvas className="w-full h-full" camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={2} />
                <Suspense fallback={null}>
                    <SceneContent scrollY={scrollY} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default AboutScene;
