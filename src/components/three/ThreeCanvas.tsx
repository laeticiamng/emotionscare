
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/components/theme/ThemeProvider';

const ThreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    // Choose colors based on theme
    const getColorScheme = () => {
      switch(theme) {
        case 'dark':
          return {
            particles: 0x4268ff,
            background: 0x0f172a
          };
        case 'pastel':
          return {
            particles: 0x6495ed,
            background: 0xe6f0ff
          };
        case 'light':
        default:
          return {
            particles: 0x3651ff,
            background: 0xf0f9ff
          };
      }
    };
    
    const colors = getColorScheme();
    scene.background = new THREE.Color(colors.background);
    scene.background.setAlpha(0.5); // Semi-transparent background
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 50;     // x
      posArray[i + 1] = (Math.random() - 0.5) * 50; // y
      posArray[i + 2] = (Math.random() - 0.5) * 50; // z
      
      // Scale (size variation)
      scaleArray[i / 3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Shader material for particles
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: new THREE.Color(colors.particles),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Central blob
    const blobGeometry = new THREE.SphereGeometry(2, 32, 32);
    const blobMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(colors.particles),
      transparent: true,
      opacity: 0.5,
      flatShading: false,
    });
    const blob = new THREE.Mesh(blobGeometry, blobMaterial);
    scene.add(blob);

    // Mouse interaction
    const mouse = {
      x: 0,
      y: 0
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame += 0.01;
      
      // Rotate particles system
      particleSystem.rotation.x = frame * 0.1;
      particleSystem.rotation.y = frame * 0.05;
      
      // Deform the blob
      blob.rotation.y += 0.005;
      blob.rotation.z += 0.002;
      
      // Add subtle waves to blob shape
      const blobVertices = (blobGeometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
      const initialPositions = Array.from({ length: blobVertices.count * 3 }, (_, i) => {
        if (i % 3 === 0) return 2 * Math.sin(i / 3 * Math.PI / 16);
        if (i % 3 === 1) return 2 * Math.cos(i / 3 * Math.PI / 16);
        return 2 * Math.sin(i / 3 * Math.PI / 16);
      });
      
      for (let i = 0; i < blobVertices.count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;
        
        // Apply subtle wave effect
        blobVertices.array[ix] = initialPositions[ix] + Math.sin(frame + i * 0.1) * 0.1;
        blobVertices.array[iy] = initialPositions[iy] + Math.sin(frame + i * 0.1) * 0.1;
        blobVertices.array[iz] = initialPositions[iz] + Math.cos(frame + i * 0.1) * 0.1;
      }
      
      blobVertices.needsUpdate = true;
      
      // Add interactivity with mouse
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      scene.clear();
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, [theme]);

  return <div ref={canvasRef} className="w-full h-full absolute inset-0 z-0" />;
};

export default ThreeCanvas;
