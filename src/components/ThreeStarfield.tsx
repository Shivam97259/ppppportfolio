import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PageView } from '../types';

interface ThreeStarfieldProps {
  currentPage: PageView;
  performanceMode: 'high' | 'eco';
}

export const ThreeStarfield: React.FC<ThreeStarfieldProps> = ({ currentPage, performanceMode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const warpFactorRef = useRef<number>(1);
  const targetWarpRef = useRef<number>(1);

  // Trigger brief camera warp acceleration on page change
  useEffect(() => {
    targetWarpRef.current = 4.5;
    const timer = setTimeout(() => {
      targetWarpRef.current = 1.0;
    }, 600);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x121212, 0.0015);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 400;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: performanceMode === 'high',
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceMode === 'high' ? 2 : 1));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x121212, 1);
    container.appendChild(renderer.domElement);

    // 4. Starfield Particles Geometry & Material
    const starCount = performanceMode === 'high' ? 3000 : 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color('#0EA5E9'), // Executive Accent Blue
      new THREE.Color('#38bdf8'), // Sky Blue
      new THREE.Color('#64748b'), // Cool Gray
      new THREE.Color('#ffffff'), // Pure White
      new THREE.Color('#94a3b8'), // Slate
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 200 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;

      starSizes[i] = Math.random() * 2.5 + 0.8;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Custom Canvas Texture for Glowing Circular Stars
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.8)');
      gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const starTexture = new THREE.CanvasTexture(canvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. 3D Cosmic Constellation Core Node
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Core Wireframe Icosahedron (Tech Core)
    const icoGeometry = new THREE.IcosahedronGeometry(60, 2);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    coreGroup.add(icoMesh);

    // Outer Orbital Ring 1
    const ring1Geometry = new THREE.TorusGeometry(100, 0.6, 16, 100);
    const ring1Material = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.3
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Outer Orbital Ring 2
    const ring2Geometry = new THREE.TorusGeometry(140, 0.8, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.25
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // Inner Glowing Core Sphere
    const innerCoreGeo = new THREE.SphereGeometry(25, 32, 32);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.15
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCore);

    // Position core group based on current viewport
    coreGroup.position.set(220, -50, -100);

    // 6. Interactive Parallax Mouse Controller
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX - window.innerWidth / 2) * 0.08;
      targetMouseY = (event.clientY - window.innerHeight / 2) * 0.08;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Adjust 3D Core position for mobile
      if (window.innerWidth < 768) {
        coreGroup.position.set(0, -120, -150);
        coreGroup.scale.set(0.6, 0.6, 0.6);
      } else {
        coreGroup.position.set(240, -40, -100);
        coreGroup.scale.set(1, 1, 1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Smooth warp acceleration transition
      warpFactorRef.current += (targetWarpRef.current - warpFactorRef.current) * 0.1;

      // Rotate Starfield
      starField.rotation.y = elapsedTime * 0.02 * warpFactorRef.current;
      starField.rotation.x = elapsedTime * 0.008;

      // Rotate 3D Core Structure
      coreGroup.rotation.y = elapsedTime * 0.15;
      coreGroup.rotation.x = elapsedTime * 0.08;
      ring1.rotation.z = elapsedTime * 0.25;
      ring2.rotation.z = -elapsedTime * 0.18;

      // Camera motion & mouse parallax
      camera.position.x = mouseX;
      camera.position.y = -mouseY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose Three.js objects
      starGeometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      ring1Geometry.dispose();
      ring1Material.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();

      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [performanceMode]);

  return (
    <div
      ref={mountRef}
      id="three-canvas-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1F1F1F 0%, #121212 100%)' }}
    />
  );
};
