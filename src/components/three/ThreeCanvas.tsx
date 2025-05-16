
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
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
      
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      alphaMap: new THREE.TextureLoader().load('/textures/particle.png'),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.6
    });
    
    // Create particles mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(getColorBasedOnTheme(), 0.5);
    scene.add(ambientLight);
    
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
    };
  }, [isDarkMode, theme]);
  
  return <div ref={containerRef} className={`absolute inset-0 -z-10 ${className}`} />;
};

export default ThreeCanvas;
