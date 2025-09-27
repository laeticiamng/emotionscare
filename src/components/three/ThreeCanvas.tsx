
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Création de la scène
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);

    // Ajout de lumières
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Création des particules pour l'arrière-plan
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Matériel pour les particules
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x3651ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    // Création du système de particules
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Position de la caméra
    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotation lente des particules
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 -z-10" />;
};

export default ThreeCanvas;
