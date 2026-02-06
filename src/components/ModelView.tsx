"use client";

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface ModelViewProps {
    path: string;
    scale?: number | [number, number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
    floatIntensity?: number;
    rotationSpeed?: number;
    scrollY?: number;
}

const ModelView: React.FC<ModelViewProps> = ({
    path,
    scale = 1,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    rotationSpeed = 0.1,
    scrollY = 0
}) => {
    const { scene } = useGLTF(path);
    const groupRef = useRef<Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            // Scroll-based rotation
            groupRef.current.rotation.y = rotation[1] + (scrollY * rotationSpeed * 0.01);

        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
            <primitive object={scene} />
        </group>
    );
};

export default ModelView;

