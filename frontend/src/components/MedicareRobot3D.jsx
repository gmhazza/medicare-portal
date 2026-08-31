import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Sub-component for rendering the 3D Robot Model inside R3F Canvas
function RobotModel({ isHovered, isReplying, onClick, globalMouseRef }) {
  const { scene } = useGLTF('/imgvid/medicarebot.glb');
  const groupRef = useRef();
  
  // Clone scene cleanly preserving original high-quality 3D geometry
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    
    // Medical Teal colors
    const themeTeal = new THREE.Color('#0d9488'); // Medical Teal base
    const brightTeal = new THREE.Color('#14b8a6'); // Emissive Teal

    cloned.traverse((child) => {
      if (child.isMesh) {
        // Clone material cleanly
        const mat = child.material.clone();
        
        // Highlight middle neck/chest layer mesh with Theme Teal
        if (child.name === 'Object_5' || child.name === 'Object_1' || child.name.includes('5')) {
          mat.color = themeTeal;
          mat.emissive = brightTeal;
          mat.emissiveIntensity = 0.5;
          mat.roughness = 0.2;
          mat.metalness = 0.8;
        } else {
          // Keep metallic polish with subtle teal reflection
          mat.roughness = 0.28;
          mat.metalness = 0.85;
        }

        child.material = mat;
      }
    });

    return cloned;
  }, [scene]);

  // Dynamic eye & mouth lights reference
  const eyeLightLeftRef = useRef();
  const eyeLightRightRef = useRef();
  const mouthLightRef = useRef();

  // Animation wave timer (seconds)
  const waveTimerRef = useRef(0);
  const isWavingRef = useRef(false);

  // Initial greeting wave on website enter (lasts ~1.8 seconds)
  useEffect(() => {
    waveTimerRef.current = 1.8;
    isWavingRef.current = true;
  }, []);

  // Trigger one-time wave on mouse hover
  useEffect(() => {
    if (isHovered) {
      waveTimerRef.current = 1.4;
      isWavingRef.current = true;
    }
  }, [isHovered]);

  // Frame Loop for Floating, Global Cursor Tracking, Wave Gesture, and Eyes Shrink Expression
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const group = groupRef.current;
    if (!group) return;

    // 1. Gentle Formal Organic Floating (Up-down Y motion + subtle z-tilt)
    const floatY = Math.sin(t * 2.0) * 0.05;
    const floatTiltZ = Math.sin(t * 1.4) * 0.02;
    const floatTiltX = Math.cos(t * 1.6) * 0.02;

    // 2. Global Cursor Tracking (Follows mouse ANYWHERE across the entire website!)
    const mouseX = globalMouseRef.current ? globalMouseRef.current.x : 0;
    const mouseY = globalMouseRef.current ? globalMouseRef.current.y : 0;

    // Target rotations towards mouse position on screen
    const targetRotY = mouseX * 0.55; // Turn head left/right
    const targetRotX = -mouseY * 0.35; // Turn head up/down

    // Smooth lerp interpolation for head/body cursor tracking
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.08);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX + floatTiltX, 0.08);

    // 3. Waving Motion (Wave tilt on enter / hover, then settles straight)
    let waveZ = 0;
    let waveX = 0;
    let eyesShrink = false;

    if (waveTimerRef.current > 0) {
      waveTimerRef.current -= delta;
      // Waving oscillation
      waveZ = Math.sin(t * 12) * 0.16;
      waveX = Math.cos(t * 8) * 0.05;
      eyesShrink = true; // Eyes shrink happily during wave!
    } else {
      isWavingRef.current = false;
    }

    // Centered base position so FULL robot is visible without clipping!
    group.position.y = -0.15 + floatY;
    
    // When waving finishes, body settles straight and normal!
    const targetZ = floatTiltZ + (isWavingRef.current ? waveZ : 0);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetZ, 0.1);
    group.position.x = THREE.MathUtils.lerp(group.position.x, isWavingRef.current ? waveX : 0, 0.1);

    // 4. Smile & Eyes Shrink Animation
    // Target eye color: Teal (#14b8a6) normally, energetic Cyan (#00e5ff) when replying
    const eyeColorNormal = new THREE.Color('#14b8a6');
    const eyeColorReplying = new THREE.Color('#00e5ff');
    const targetEyeColor = isReplying ? eyeColorReplying : eyeColorNormal;

    // Eyes shrink intensity (focused bright smile glow when eyes shrink on enter/hover)
    const isShrinkActive = eyesShrink || isHovered;
    const baseGlow = isShrinkActive ? 2.5 : 1.1;
    const pulseGlow = isReplying ? Math.sin(t * 10) * 0.7 + 1.8 : Math.sin(t * 2.5) * 0.15 + baseGlow;

    if (eyeLightLeftRef.current) {
      eyeLightLeftRef.current.color.lerp(targetEyeColor, 0.1);
      eyeLightLeftRef.current.distance = isShrinkActive ? 0.4 : 0.6;
      eyeLightLeftRef.current.intensity = pulseGlow * 1.5;
    }
    if (eyeLightRightRef.current) {
      eyeLightRightRef.current.color.lerp(targetEyeColor, 0.1);
      eyeLightRightRef.current.distance = isShrinkActive ? 0.4 : 0.6;
      eyeLightRightRef.current.intensity = pulseGlow * 1.5;
    }
    if (mouthLightRef.current) {
      mouthLightRef.current.color.lerp(targetEyeColor, 0.1);
      mouthLightRef.current.intensity = isShrinkActive ? pulseGlow * 2.2 : pulseGlow * 0.7;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, -0.15, 0]} 
      scale={isHovered ? 1.4 : 1.3} 
      onClick={onClick}
      cursor="pointer"
    >
      {/* GLB Model Scene */}
      <primitive object={clonedScene} />

      {/* 3D Glowing Eyes (Teal / Cyan Emissive Lights with Shrink Smile Effect) */}
      <pointLight
        ref={eyeLightLeftRef}
        position={[-0.18, 0.65, 0.45]}
        distance={0.6}
        decay={2}
        color="#14b8a6"
        intensity={1.4}
      />
      <pointLight
        ref={eyeLightRightRef}
        position={[0.18, 0.65, 0.45]}
        distance={0.6}
        decay={2}
        color="#14b8a6"
        intensity={1.4}
      />

      {/* Smile / Mouth Light Glow */}
      <pointLight
        ref={mouthLightRef}
        position={[0, 0.48, 0.46]}
        distance={0.5}
        decay={2}
        color="#0d9488"
        intensity={0.9}
      />

      {/* Center Chest Layer Emissive Accent Light */}
      <pointLight
        position={[0, 0.15, 0.4]}
        distance={0.8}
        color="#0d9488"
        intensity={1.6}
      />
    </group>
  );
}

// Fallback loader
function LoaderFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-teal-900/10 rounded-full animate-pulse">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Main Exported Component
export default function MedicareRobot3D({ onClick, isReplying = false, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Track mouse coordinates across the WHOLE website
  const globalMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize x from -1 (left edge) to +1 (right edge)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      // Normalize y from -1 (bottom edge) to +1 (top edge)
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      globalMouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (hasError) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center bg-teal-800 text-white rounded-full p-3 shadow-md hover:scale-105 transition-transform ${className}`}
      >
        <img src="/imgvid/medicarechatbot.png" alt="Robot" className="w-10 h-10 object-contain" />
      </button>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative cursor-pointer overflow-visible transition-all duration-300 ${
        isHovered ? 'scale-105' : 'scale-100'
      } ${className}`}
      style={{ width: '120px', height: '120px' }}
      title="Click to talk to MediCare AI Assistant"
    >
      <React.Suspense fallback={<LoaderFallback />}>
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 38 }}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto', overflow: 'visible' }}
          gl={{ antialias: true, alpha: true }}
          onError={() => setHasError(true)}
        >
          {/* Lighting */}
          <ambientLight intensity={1.3} />
          <directionalLight position={[3, 5, 4]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#0d9488" />
          <spotLight position={[0, 4, 3]} intensity={2.0} angle={0.6} penumbra={1} color="#14b8a6" />

          {/* 3D Robot */}
          <RobotModel 
            isHovered={isHovered} 
            isReplying={isReplying} 
            onClick={onClick}
            globalMouseRef={globalMouseRef}
          />
        </Canvas>
      </React.Suspense>
    </div>
  );
}

// Preload GLB model
useGLTF.preload('/imgvid/medicarebot.glb');
