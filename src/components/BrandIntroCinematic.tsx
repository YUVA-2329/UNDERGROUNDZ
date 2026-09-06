/**
 * UNDERGROUNDZ — 5-SECOND ULTRA-SMOOTH MATTE BLACK INTRO
 * ZERO LAG • HARDWARE GPU ACCELERATED • 60FPS
 * 
 * Features:
 * - Pure Matte Black (#000000) Canvas
 * - Original /logo.png Title Revealed Left-to-Right by the Superbike
 * - High-Octane Superbike Sound Engine
 * - Zero React State Re-renders in Animation Loop (Direct Ref Updates)
 * - Zero Screen Clutter: No HUD, No Text, No Subtitles, No Progress Bar
 * - Seamless 5.0s Fade-Out Directly to Store
 */

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { X } from 'lucide-react';
import { CinematicAudioEngine } from '../lib/cinematicAudio';

interface BrandIntroCinematicProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

export const BrandIntroCinematic: React.FC<BrandIntroCinematicProps> = ({
  onComplete,
  autoPlay = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  const audioEngineRef = useRef<CinematicAudioEngine | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isCompletedRef = useRef<boolean>(false);

  // Audio start helper on gesture or autoplay
  const startAudioSafely = useCallback(() => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new CinematicAudioEngine();
    }
    audioEngineRef.current.init();
    audioEngineRef.current.setMuted(false);
    audioEngineRef.current.startAmbientAtmosphere();
  }, []);

  const handleSkip = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    if (audioEngineRef.current) {
      audioEngineRef.current.stopAll();
    }
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const logoWrapper = logoWrapperRef.current;
    const beam = beamRef.current;
    if (!container || !canvas) return;

    // Initialize Audio Engine
    const audioEngine = new CinematicAudioEngine();
    audioEngineRef.current = audioEngine;
    if (autoPlay) {
      audioEngine.init();
      audioEngine.startAmbientAtmosphere();
    }

    // Direct click anywhere on screen unlocks sound if browser blocked autoplay
    const handleUserGesture = () => {
      startAudioSafely();
    };
    window.addEventListener('pointerdown', handleUserGesture, { once: true });

    // 1. LIGHTWEIGHT HIGH-PERFORMANCE THREE.JS SETUP (ZERO LAG)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Clamp to 1.25x max to prevent 4K retina GPU throttling
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

    // 2. WET TARMAC ROAD PLANE (Pre-shaded, no expensive CPU texture generation)
    const roadGeo = new THREE.PlaneGeometry(36, 180);
    const roadMat = new THREE.MeshPhongMaterial({
      color: 0x050505,
      specular: 0x222222,
      shininess: 90,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -25);
    scene.add(road);

    // Subtle white center lane dashes
    const laneGroup = new THREE.Group();
    const laneGeo = new THREE.PlaneGeometry(0.18, 2.8);
    const laneMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    for (let i = 0; i < 18; i++) {
      const dash = new THREE.Mesh(laneGeo, laneMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.01, 15 - i * 8);
      laneGroup.add(dash);
    }
    scene.add(laneGroup);

    // 3. SLEEK MATTE BLACK SUPERBIKE
    const bikeGroup = new THREE.Group();

    const blackCarbonMat = new THREE.MeshPhongMaterial({
      color: 0x060608,
      specular: 0x333338,
      shininess: 40,
    });

    const titaniumMat = new THREE.MeshPhongMaterial({
      color: 0x18181c,
      specular: 0x666670,
      shininess: 100,
    });

    const rubberMat = new THREE.MeshPhongMaterial({
      color: 0x020202,
      specular: 0x111111,
      shininess: 10,
    });

    // Main Chassis Tank
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.44, 1.4, 12), blackCarbonMat);
    tank.rotation.x = Math.PI / 2;
    tank.position.set(0, 0.95, 0);
    bikeGroup.add(tank);

    // Engine Block
    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.8), blackCarbonMat);
    engine.position.set(0, 0.55, 0.1);
    bikeGroup.add(engine);

    // Exhaust Pipe
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.3, 10), titaniumMat);
    exhaust.rotation.x = Math.PI / 2.2;
    exhaust.position.set(0.24, 0.42, -0.6);
    bikeGroup.add(exhaust);

    // Wheels
    const createWheel = () => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 12, 24), rubberMat);
      g.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 12), titaniumMat);
      rim.rotation.x = Math.PI / 2;
      g.add(rim);
      return g;
    };

    const frontWheel = createWheel();
    frontWheel.position.set(0, 0.5, 1.35);
    bikeGroup.add(frontWheel);

    const rearWheel = createWheel();
    rearWheel.position.set(0, 0.5, -1.2);
    bikeGroup.add(rearWheel);

    // Front Fork
    const forkL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8), titaniumMat);
    forkL.position.set(-0.15, 0.82, 0.95);
    forkL.rotation.x = -Math.PI / 9;
    bikeGroup.add(forkL);

    const forkR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8), titaniumMat);
    forkR.position.set(0.15, 0.82, 0.95);
    forkR.rotation.x = -Math.PI / 9;
    bikeGroup.add(forkR);

    // Aerodynamic Cowl & Xenon Headlight
    const cowl = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.44, 10), blackCarbonMat);
    cowl.rotation.x = -Math.PI / 2;
    cowl.position.set(0, 1.1, 1.25);
    bikeGroup.add(cowl);

    const pureWhiteLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headlight = new THREE.Mesh(new THREE.CircleGeometry(0.11, 16), pureWhiteLightMat);
    headlight.position.set(0, 1.08, 1.48);
    bikeGroup.add(headlight);

    // Forward Piercing Spotlight Beam
    const bikeSpot = new THREE.SpotLight(0xffffff, 20, 75, Math.PI / 5, 0.5, 1.2);
    bikeSpot.position.set(0, 1.1, 1.5);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0.1, 30);
    bikeGroup.add(spotTarget);
    bikeSpot.target = spotTarget;
    bikeGroup.add(bikeSpot);

    // Stealth Crouching Rider
    const rider = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.75), rubberMat);
    rider.position.set(0, 1.35, -0.05);
    rider.rotation.x = Math.PI / 5;
    bikeGroup.add(rider);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), blackCarbonMat);
    helmet.scale.set(0.9, 1.0, 1.15);
    helmet.position.set(0, 1.6, 0.38);
    bikeGroup.add(helmet);

    // Initial position far to the left
    bikeGroup.position.set(-18, 0, 18);
    scene.add(bikeGroup);

    // Minimal Ambient Scene Light
    const ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(0, 10, 10);
    scene.add(dirLight);

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 4. ANIMATION TIMELINE: PRECISE 5.0 SECONDS (DIRECT REF UPDATES FOR 60FPS)
    const INTRO_DURATION = 5.0;
    let startTime: number | null = null;
    let bikeSoundFired = false;
    let impactSoundFired = false;
    let audioFadeFired = false;

    const animate = (timestamp: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const t = Math.min(elapsed, INTRO_DURATION);

      // --- 1. CAMERA CHOREOGRAPHY ---
      if (t < 0.6) {
        camera.position.set(0, 0.5, 13.0);
        camera.lookAt(new THREE.Vector3(0, 0.5, -20.0));
      } else if (t < 3.2) {
        const cp = (t - 0.6) / 2.6;
        camera.position.set(
          Math.sin(cp * Math.PI) * 0.8,
          0.6 + cp * 0.35,
          13.0 - cp * 3.5
        );
        camera.lookAt(new THREE.Vector3(0, 0.7, -18.0));
      } else {
        camera.position.set(0, 0.95, 9.5);
        camera.lookAt(new THREE.Vector3(0, 0.7, -18.0));
      }

      // --- 2. MOTORCYCLE SWEEP (LEFT TO RIGHT) ---
      if (t < 0.5) {
        bikeGroup.position.set(-18, 0, 20);
      } else if (t < 3.3) {
        const bp = (t - 0.5) / 2.8; // 0 to 1
        // Smooth cubic ease across
        const ease = Math.pow(bp, 1.25);
        const currentX = -16 + ease * 34; // -16 to +18 (left to right across frame)
        const currentZ = 20 - ease * 70;  // 20 to -50

        bikeGroup.position.set(currentX, Math.sin(t * 40) * 0.01, currentZ);
        bikeGroup.rotation.y = -0.35 + ease * 0.7;
        bikeGroup.rotation.z = Math.sin(bp * Math.PI) * -0.18;

        frontWheel.rotation.x -= 0.6;
        rearWheel.rotation.x -= 0.6;

        // Trigger Audio: Bike Pass
        if (!bikeSoundFired && t >= 0.55) {
          bikeSoundFired = true;
          if (audioEngineRef.current) {
            audioEngineRef.current.triggerBikePass();
          }
        }
      } else {
        bikeGroup.position.set(30, 0, -100);
      }

      // --- 3. LOGO REVEAL (LEFT TO RIGHT IN SYNC WITH BIKE) ---
      // Direct DOM update: ZERO React re-renders!
      if (logoWrapper && beam) {
        if (t < 0.65) {
          logoWrapper.style.clipPath = 'inset(0 100% 0 0)';
          beam.style.opacity = '0';
        } else if (t < 2.9) {
          const revP = (t - 0.65) / 2.25; // 0 to 1
          const easeRev = 1 - Math.pow(1 - revP, 2.2);
          const percent = Math.min(100, Math.max(0, easeRev * 100));

          logoWrapper.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
          beam.style.opacity = '1';
          beam.style.left = `${percent}%`;
        } else {
          logoWrapper.style.clipPath = 'inset(0 0% 0 0)';
          beam.style.opacity = '0';

          // Trigger Audio: Title Lock Impact
          if (!impactSoundFired) {
            impactSoundFired = true;
            if (audioEngineRef.current) {
              audioEngineRef.current.triggerTitleLockImpact();
            }
          }
        }
      }

      // --- 4. ULTRA SMOOTH FADE OUT TO BLACK (4.1s - 5.0s) ---
      if (container) {
        if (t >= 4.1) {
          const fadeProg = (t - 4.1) / 0.9; // 0 to 1
          const alpha = Math.max(0, 1 - fadeProg);
          container.style.opacity = `${alpha}`;

          if (!audioFadeFired) {
            audioFadeFired = true;
            if (audioEngineRef.current) {
              audioEngineRef.current.fadeOut(0.9);
            }
          }
        } else {
          container.style.opacity = '1';
        }
      }

      // --- 5. FINISHED AT 5.0 SECONDS ---
      if (t >= INTRO_DURATION && !isCompletedRef.current) {
        isCompletedRef.current = true;
        if (onComplete) {
          onComplete();
        }
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      audioEngine.stopAll();
      renderer.dispose();
      scene.clear();
    };
  }, [autoPlay, onComplete, startAudioSafely]);

  return (
    <div
      ref={containerRef}
      id="brand-intro-screen"
      className="fixed inset-0 z-[100] bg-black overflow-hidden select-none cursor-default"
      style={{
        backgroundColor: '#000000',
        willChange: 'opacity',
      }}
    >
      {/* 3D WebGL Canvas — Smooth 60FPS Matte Black Road & Superbike */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{
          backgroundColor: '#000000',
        }}
      />

      {/* ONLY THE ORIGINAL UNDERGROUNDZ TITLE REVEALED FROM LEFT TO RIGHT */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center px-6">
        <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl flex items-center justify-center">
          
          {/* Logo Container with Left-to-Right Reveal Mask */}
          <div
            ref={logoWrapperRef}
            className="relative w-full flex flex-col items-center justify-center"
            style={{
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path',
            }}
          >
            {/* The Official UNDERGROUNDZ Logo from Homepage */}
            <img
              src="/logo.png"
              alt="UNDERGROUNDZ"
              className="w-full max-h-[160px] md:max-h-[220px] object-contain brightness-125 contrast-125"
              style={{
                willChange: 'transform',
              }}
            />
            <div className="mt-4 font-body text-[#8e8e98] text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.5em] font-bold uppercase text-center">
              WHEN ENGINE SPEAKS
            </div>
          </div>

          {/* Slicing Vertical White Light Beam at the Reveal Leading Edge */}
          <div
            ref={beamRef}
            className="absolute top-0 bottom-0 pointer-events-none z-40 flex items-center justify-center opacity-0"
            style={{
              left: '0%',
              transform: 'translateX(-50%)',
              width: '4px',
              willChange: 'left, opacity',
            }}
          >
            <div className="w-[2px] h-full bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff]" />
            <div className="absolute w-6 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Discreet Minimalist Skip Button in Top Right */}
      {onComplete && (
        <button
          id="btn-intro-skip-minimal"
          onClick={handleSkip}
          className="absolute top-6 right-6 z-50 p-2 text-white/30 hover:text-white transition-colors cursor-pointer rounded-none"
          title="Skip"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
