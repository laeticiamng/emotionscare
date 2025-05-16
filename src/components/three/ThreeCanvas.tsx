
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/components/theme/ThemeProvider';

interface ThreeCanvasProps {
  className?: string;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particle material
    const getColorBasedOnTheme = () => {
      if (theme === 'dark') return 0x3b82f6; // blue for dark mode
      if (theme === 'pastel') return 0x93c5fd; // light blue for pastel mode
      return 0x60a5fa; // default blue
    };
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color = new THREE.Color(getColorBasedOnTheme());
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;
      
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create texture loader
    const textureLoader = new THREE.TextureLoader();
    let particleTexture;
    
    try {
      particleTexture = textureLoader.load('/assets/textures/particle.png');
    } catch (e) {
      console.error('Failed to load particle texture, using default');
      // Create a default particle texture
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(16, 16, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      particleTexture = new THREE.CanvasTexture(canvas);
    }
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      alphaMap: particleTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.6,
      vertexColors: true
    });
    
    // Create particles mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(getColorBasedOnTheme(), 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a wave effect
    const waveGeometry = new THREE.PlaneGeometry(60, 60, 32, 32);
    const waveMaterial = new THREE.MeshPhongMaterial({
      color: getColorBasedOnTheme(),
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      wireframe: true
    });
    
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.rotation.x = -Math.PI / 2;
    wave.position.y = -10;
    scene.add(wave);
    
    // Handle mouse movement
    const mouse = {
      x: 0,
      y: 0
    };
    
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate particles
      particles.rotation.y = elapsedTime * 0.05;
      
      // Move particles based on mouse position
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.5;
      particles.rotation.x += (targetY - particles.rotation.x) * 0.02;
      particles.rotation.y += (targetX - particles.rotation.y) * 0.02;
      
      // Animate wave
      const positions = waveGeometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(elapsedTime + x * 0.5) * 0.5;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      
      // Render
      renderer.render(scene, camera);
      
      // Call animate recursively
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      
      // Dispose resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      waveGeometry.dispose();
      waveMaterial.dispose();
    };
  }, [isDarkMode, theme]);
  
  return <div ref={containerRef} className={`absolute inset-0 -z-10 ${className}`} />;
};

export default ThreeCanvas;
