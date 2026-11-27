import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface KubreeBazzarLogoProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function KubreeBazzarLogo({ onClick, size = 'md' }: KubreeBazzarLogoProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  const dim = size === 'sm' ? 26 : size === 'lg' ? 36 : 30;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      setFallback(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(dim, dim);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
    camera.position.set(0, 0.15, 3.2);

    const ambient = new THREE.AmbientLight(0xfff5e4, 1.3);
    const key = new THREE.DirectionalLight(0xffe0a3, 2.2);
    key.position.set(2.5, 3, 4);
    const rim = new THREE.DirectionalLight(0x741d35, 1.4);
    rim.position.set(-3, -2, -2);
    scene.add(ambient, key, rim);

    const group = new THREE.Group();
    scene.add(group);

    // Core 3D Sphere (Deep Maroon & Gold)
    const sphereGeo = new THREE.SphereGeometry(0.72, 24, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x741d35,
      metalness: 0.45,
      roughness: 0.25,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // Gold Equatorial & Meridian Rings
    const ringGeo = new THREE.TorusGeometry(0.92, 0.055, 12, 36);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4a64a,
      metalness: 0.85,
      roughness: 0.18,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI * 0.36;
    ring1.rotation.y = 0.25;

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI * 0.45;
    ring2.rotation.x = -0.3;

    group.add(ring1, ring2);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      if (disposed) return;
      const t = clock.getElapsedTime();
      if (!prefersReducedMotion) {
        group.rotation.y = t * 0.85;
        group.rotation.x = Math.sin(t * 0.6) * 0.18;
      }
      renderer.render(scene, camera);
      if (!prefersReducedMotion) {
        frameId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [dim]);

  const textClass =
    size === 'sm'
      ? 'text-lg sm:text-xl'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : 'text-xl sm:text-2xl';

  return (
    <a
      href="/"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus:outline-none"
      aria-label="KubreeBazzar Home"
    >
      {fallback ? (
        <span
          style={{ width: dim, height: dim }}
          className="rounded-full bg-gradient-to-br from-[#741D35] via-[#8E2442] to-[#D4A64A] border border-[#D4A64A] shrink-0"
          aria-hidden="true"
        />
      ) : (
        <div
          ref={mountRef}
          style={{ width: dim, height: dim }}
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      <span
        className={`font-display ${textClass} font-bold tracking-tight leading-none`}
      >
        <span className="text-[#741D35]">All</span>
        <span className="text-[#D4A64A]">Sphere</span>
      </span>
    </a>
  );
}
