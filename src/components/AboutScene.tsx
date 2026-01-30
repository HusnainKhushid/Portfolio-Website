"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import ModelView from './ModelView';

const AboutScene: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <Canvas className="w-full h-full" camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={2} />
                <Suspense fallback={null}>
                    {/* Mouse on the Left */}
                    <ModelView
                        path="/3d/mouse.min.gltf"
                        scale={0.03}
                        position={[-3, 0, 0]}
                        rotation={[0.3, 0.5, 0]}
                        floatIntensity={1}
                        scrollY={scrollY}
                        rotationSpeed={0.1}
                    />

                    {/* Coffee on the Right */}
                    <ModelView
                        path="/3d/coffee.min.gltf"
                        scale={0.03}
                        position={[3, 0, 0]}
                        rotation={[0.3, -0.5, 0]}
                        floatIntensity={1}
                        scrollY={scrollY}
                        rotationSpeed={0.1}
                    />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default AboutScene;
