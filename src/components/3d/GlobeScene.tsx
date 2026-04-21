"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float, Preload, Stage } from "@react-three/drei";
import { Group } from "three";

/* ── Globe mesh ────────────────────────────────────────────── */
const GlobeMesh: React.FC<{ scrollYRef: React.RefObject<number> }> = ({ scrollYRef }) => {
    const { scene } = useGLTF("/3d/globe.min.gltf");
    const groupRef = useRef<Group>(null);
    const { invalidate } = useThree();

    useFrame(() => {
        if (!groupRef.current) return;
        const sy = scrollYRef.current;
        // Direct link to scroll: mapping scroll pixels to rotation + 180 deg offset
        groupRef.current.rotation.y = (sy * 0.001) + Math.PI;
        invalidate();
    });

    return (
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
            <group ref={groupRef} dispose={null} scale={3.4}>
                <primitive object={scene} />
            </group>
        </Float>
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
            camera={{ position: [0, 0, 6], fov: 30 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
        >
            <Suspense fallback={null}>
                {/* Harsh, dramatic front light */}
                <spotLight position={[0, 50, 20]} intensity={2.5} angle={0.15} penumbra={1} />
                <pointLight position={[5, 10, 5]} intensity={1} />
                <ambientLight intensity={1} />

                <Environment preset="night" />
                <GlobeMesh scrollYRef={scrollYRef} />
            </Suspense>
            <Preload all />
        </Canvas>
    );
};

export default GlobeScene;
