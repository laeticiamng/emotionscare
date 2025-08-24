
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/components/theme-provider';

interface ParticlesBackgroundProps {
  count?: number;
  size?: number;
  speed?: number;
  className?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ 
  count = 1500,
  size = 0.02,
  speed = 0.0003,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, reduceMotion } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Skip rendering for users with reduce motion enabled
    if (reduceMotion) return;
    
    // Initialisation de Three.js
    const scene = new THREE.Scene();
    
    // Caméra avec un champ de vision large pour effet immersif
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    
    // Renderer avec transparence et antialiasing
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Couleurs adaptées au thème
    let particleColor;
    switch (theme) {
      case 'dark':
        particleColor = new THREE.Color(0x3b82f6); // Bleu vif sur fond sombre
        break;
      case 'pastel':
        particleColor = new THREE.Color(0x60a5fa); // Bleu pastel
        break;
      default:
        particleColor = new THREE.Color(0x2563eb); // Bleu standard
    }
    
    // Création des particules
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Matériau des particules avec transparence et flou
    const particlesMaterial = new THREE.PointsMaterial({
      size: size,
      color: particleColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Création du mesh de particules
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Animation
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += speed;
      particlesMesh.rotation.y += speed * 0.8;
      
      // Effet d'ondulation subtile
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.0001;
      
      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;
        
        // Onde sinusoïdale très subtile
        positions[iy] += Math.sin(time + positions[ix] * 0.1) * 0.0005;
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
      
      return () => {
        cancelAnimationFrame(animationId);
      };
    };
    
    animate();
    
    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouvements de la souris
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      particlesMesh.rotation.y += mouseX * 0.0003;
      particlesMesh.rotation.x += mouseY * 0.0003;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Nettoyage
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Libération de la mémoire
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [count, size, speed, theme, reduceMotion]);
  
  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 -z-10 ${className} ${reduceMotion ? 'hidden' : ''}`}
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;
