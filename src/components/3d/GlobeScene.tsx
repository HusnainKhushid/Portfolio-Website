"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Group } from "three";

/* ── Globe mesh ────────────────────────────────────────────── */
const GlobeMesh: React.FC<{ scrollYRef: React.RefObject<number> }> = ({ scrollYRef }) => {
    const { scene } = useGLTF("/3d/globe.min.gltf");
    const groupRef = useRef<Group>(null);
    const { invalidate } = useThree();

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const sy = scrollYRef.current;
        groupRef.current.rotation.y += delta * 0.15 + sy * 0.000005;
        invalidate(); // request next frame (continuous rotation needs it)
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={0.032} dispose={null}>
            <primitive object={scene} />
        </group>
    );
};

/* ── Scene ────────────────────────────────────────────────── */
const GlobeScene: React.FC = () => {
    const scrollYRef = useRef(0);

    useEffect(() => {
        const onScroll = () => { scrollYRef.current = window.scrollY; };
        window.addEventListener("scroll", onScroll, { passive: true });
        scrollYRef.current = window.scrollY;
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <Canvas
            className="w-full h-full"
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
            frameloop="demand"
        >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={2.5} />
            <pointLight position={[-5, -5, 5]} intensity={1} />
            <Suspense fallback={null}>
                <GlobeMesh scrollYRef={scrollYRef} />
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    );
};

export default GlobeScene;
