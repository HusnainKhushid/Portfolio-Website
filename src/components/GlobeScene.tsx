"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Group } from "three";

/* ── Globe mesh ────────────────────────────────────────────── */
const GlobeMesh: React.FC<{ scrollY: number }> = ({ scrollY }) => {
    const { scene } = useGLTF("/3d/globe.min.gltf");
    const groupRef = useRef<Group>(null);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        // Slow auto-rotation + scroll-driven boost
        groupRef.current.rotation.y += delta * 0.15 + scrollY * 0.000005;
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={0.032} dispose={null}>
            <primitive object={scene} />
        </group>
    );
};

/* ── Scene ────────────────────────────────────────────────── */
const GlobeScene: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        setScrollY(window.scrollY);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <Canvas
            className="w-full h-full"
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
        >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={2.5} />
            <pointLight position={[-5, -5, 5]} intensity={1} />
            <Suspense fallback={null}>
                <GlobeMesh scrollY={scrollY} />
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    );
};

export default GlobeScene;
