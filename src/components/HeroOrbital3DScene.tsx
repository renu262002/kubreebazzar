import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import {
  Environment,
  Html,
  Lightformer,
  Line,
  Sparkles,
  useTexture,
} from '@react-three/drei';
import gsap from 'gsap';
import type { ProductCategory } from '../types';

export interface OrbitalProductItem {
  category: ProductCategory;
  title: string;
  subtitle: string;
  path: string;
  image: string;
}

export const ORBITAL_PRODUCTS: OrbitalProductItem[] = [
  {
    category: 'Rice',
    title: 'Premium Rice Bag',
    subtitle: 'Aged Basmati & Ponni',
    path: '/rice',
    image: '/images/hero_rice_bowl_bag_1793936931121.jpg',
  },
  {
    category: 'Grocery',
    title: 'Grocery Basket',
    subtitle: 'Cold-Pressed Oils & Spices',
    path: '/grocery',
    image: '/images/hero_grocery_basket_1793936930249.jpg',
  },
  {
    category: 'Honey',
    title: 'Natural Honey Jar',
    subtitle: 'Wild Forest Golden Honey',
    path: '/honey',
    image: '/images/hero_honey_drip_jar_1793936931141.jpg',
  },
  {
    category: 'Watches',
    title: 'Luxury Wristwatch',
    subtitle: 'Sovereign Automatic',
    path: '/watches',
    image: '/images/hero_luxury_watch_studio_1793936930915.jpg',
  },
];

interface HeroOrbital3DSceneProps {
  onNavigate: (path: string) => void;
  isMobile: boolean;
  reducedMotion: boolean;
}

function CentralKubreeBazzar({
  radius,
  reducedMotion,
}: {
  radius: number;
  reducedMotion: boolean;
}) {
  const sphereGroupRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!sphereGroupRef.current) return;

    if (!reducedMotion) {
      // Subtle floating movement
      sphereGroupRef.current.position.y = Math.sin(t * 1.15) * 0.08;
      // Smooth continuous rotation around its own axis
      if (outerGlassRef.current) {
        outerGlassRef.current.rotation.y = t * 0.28;
      }
      if (innerCoreRef.current) {
        innerCoreRef.current.rotation.y = -t * 0.42;
        innerCoreRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
      }
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z = t * 0.22;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.z = -t * 0.18;
      }
    }
  });

  return (
    <group ref={sphereGroupRef}>
      {/* Outer Glass-like Sphere with subtle gold & maroon reflections */}
      <mesh ref={outerGlassRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial
          color="#FFFDF8"
          transmission={0.82}
          opacity={1}
          transparent
          roughness={0.08}
          metalness={0.05}
          ior={1.48}
          thickness={1.4}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.06}
          attenuationColor="#741D35"
          attenuationDistance={1.9}
          envMapIntensity={1.65}
        />
      </mesh>

      {/* Inner Warm Maroon & Gold Core for rich depth */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[radius * 0.46, 3]} />
        <meshStandardMaterial
          color="#741D35"
          emissive="#4A1020"
          emissiveIntensity={0.45}
          metalness={0.65}
          roughness={0.22}
        />
      </mesh>

      {/* Subtle Soft Golden Inner Glow Shell */}
      <mesh>
        <sphereGeometry args={[radius * 0.68, 32, 32]} />
        <meshBasicMaterial
          color="#D4A64A"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Equatorial & Meridian Gold Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI * 0.38, 0.22, 0]}>
        <torusGeometry args={[radius * 1.14, 0.018, 16, 96]} />
        <meshStandardMaterial
          color="#D4A64A"
          emissive="#D4A64A"
          emissiveIntensity={0.28}
          metalness={0.88}
          roughness={0.18}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[-Math.PI * 0.32, -0.4, 0]}>
        <torusGeometry args={[radius * 1.22, 0.012, 16, 96]} />
        <meshStandardMaterial
          color="#741D35"
          emissive="#741D35"
          emissiveIntensity={0.2}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Elegant "KubreeBazzar" Brand Label anchored to the Central Sphere */}
      <Html
        position={[0, 0, radius * 1.02]}
        center
        distanceFactor={7}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div className="px-3.5 py-1 rounded-full bg-[#FFFDF8]/88 backdrop-blur-md border border-[#D4A64A]/80 shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#741D35]" />
          <span className="font-display text-sm sm:text-base font-bold tracking-tight">
            <span className="text-[#741D35]">All</span>
            <span className="text-[#D4A64A]">Sphere</span>
          </span>
        </div>
      </Html>
    </group>
  );
}

interface OrbitingProductNodeProps {
  item: OrbitalProductItem;
  index: number;
  total: number;
  radiusX: number;
  radiusZ: number;
  orbitAngleRef: React.MutableRefObject<number>;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  onSelect: (path: string) => void;
  isMobile: boolean;
  wasDraggedRef: React.MutableRefObject<boolean>;
}

function OrbitingProductNode({
  item,
  index,
  total,
  radiusX,
  radiusZ,
  orbitAngleRef,
  hoveredIndex,
  setHoveredIndex,
  onSelect,
  isMobile,
  wasDraggedRef,
}: OrbitingProductNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardMeshRef = useRef<THREE.Group>(null);
  const texture = useTexture(item.image);
  const isHovered = hoveredIndex === index;

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  const cardWidth = isMobile ? 1.15 : 1.48;
  const cardHeight = cardWidth * 0.75; // 4:3 studio aspect ratio

  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    // Equal spacing around the elliptical orbital path
    const baseOffset = (index * Math.PI * 2) / total;
    const angle = orbitAngleRef.current + baseOffset;

    // Mathematical elliptical orbital positioning:
    // x = radiusX * cos(angle), z = radiusZ * sin(angle)
    const x = radiusX * Math.cos(angle);
    const z = radiusZ * Math.sin(angle);
    const y = Math.sin(angle * 2) * 0.08;

    groupRef.current.position.set(x, y, z);

    // Maintain upright orientation facing the camera while orbiting
    if (cardMeshRef.current) {
      cardMeshRef.current.quaternion.copy(camera.quaternion);

      // Subtle depth-based scale enhancement + hover highlight
      const depthNorm = THREE.MathUtils.clamp(
        (z + radiusZ) / (2 * radiusZ),
        0,
        1
      );
      const targetScale =
        (0.88 + depthNorm * 0.22) * (isHovered ? 1.12 : 1.0);
      cardMeshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.12
      );
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredIndex(index);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredIndex(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (wasDraggedRef.current) return;
    onSelect(item.path);
  };

  return (
    <group ref={groupRef}>
      <group
        ref={cardMeshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Gold & Maroon Studio Frame Backing */}
        <mesh position={[0, 0, -0.025]} castShadow receiveShadow>
          <boxGeometry args={[cardWidth + 0.09, cardHeight + 0.09, 0.035]} />
          <meshStandardMaterial
            color={isHovered ? '#D4A64A' : '#E6DDD0'}
            emissive={isHovered ? '#D4A64A' : '#000000'}
            emissiveIntensity={isHovered ? 0.35 : 0}
            metalness={0.65}
            roughness={0.25}
          />
        </mesh>

        {/* Photorealistic Product Image Plane with depth testing */}
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[cardWidth, cardHeight]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.32}
            metalness={0.05}
            depthTest
            depthWrite
          />
        </mesh>

        {/* Category Pill & Hover Highlight Label */}
        <Html
          position={[0, -cardHeight / 2 - 0.16, 0.04]}
          center
          distanceFactor={7.2}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`px-2.5 py-1 rounded-lg border text-center transition-all duration-200 whitespace-nowrap shadow-md ${
              isHovered
                ? 'bg-[#741D35] text-white border-[#D4A64A] scale-105'
                : 'bg-[#FFFDF8]/92 text-[#222222] border-[#E6DDD0]'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider leading-tight">
              {item.category}
            </div>
            {isHovered && (
              <div className="text-[10px] text-[#F7F0E5] font-medium mt-0.5">
                {item.title} · Explore →
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

function OrbitalPathRing({
  radiusX,
  radiusZ,
}: {
  radiusX: number;
  radiusZ: number;
}) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push([
        radiusX * Math.cos(theta),
        Math.sin(theta * 2) * 0.08,
        radiusZ * Math.sin(theta),
      ]);
    }
    return pts;
  }, [radiusX, radiusZ]);

  return (
    <Line
      points={points}
      color="#D4A64A"
      lineWidth={1.4}
      transparent
      opacity={0.48}
    />
  );
}

function OrbitalUniverse({
  onNavigate,
  isMobile,
  reducedMotion,
}: HeroOrbital3DSceneProps) {
  const universeRef = useRef<THREE.Group>(null);
  const orbitAngleRef = useRef<number>(0.4);
  const speedMultiplierRef = useRef<number>(1);
  const dragVelocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const wasDraggedRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const pointerDownXRef = useRef<number>(0);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { camera, pointer, gl } = useThree();

  const sphereRadius = isMobile ? 0.92 : 1.28;
  const radiusX = isMobile ? 1.85 : 2.72;
  const radiusZ = isMobile ? 1.15 : 1.62;

  // Smooth GSAP entrance animation when homepage loads
  useEffect(() => {
    if (!universeRef.current || reducedMotion) return;
    universeRef.current.scale.set(0.82, 0.82, 0.82);
    const tween = gsap.to(universeRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.05,
      ease: 'power3.out',
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  // Horizontal drag interaction on the canvas
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      wasDraggedRef.current = false;
      lastPointerXRef.current = e.clientX;
      pointerDownXRef.current = e.clientX;
      dragVelocityRef.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;
      if (Math.abs(e.clientX - pointerDownXRef.current) > 6) {
        wasDraggedRef.current = true;
      }
      const deltaAngle = dx * 0.0065;
      orbitAngleRef.current += deltaAngle;
      dragVelocityRef.current = deltaAngle;
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        wasDraggedRef.current = false;
      }, 60);
    };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.cursor = 'auto';
    };
  }, [gl.domElement]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    // Smoothly slow orbital speed when hovering over a product
    const targetSpeed = hoveredIndex !== null ? 0.14 : 1.0;
    speedMultiplierRef.current = THREE.MathUtils.lerp(
      speedMultiplierRef.current,
      targetSpeed,
      0.08
    );

    if (!isDraggingRef.current) {
      // Apply residual drag inertia, then resume automatic rotation
      if (Math.abs(dragVelocityRef.current) > 0.0001) {
        orbitAngleRef.current += dragVelocityRef.current;
        dragVelocityRef.current *= 0.92;
      } else if (!reducedMotion) {
        orbitAngleRef.current += clampedDelta * 0.36 * speedMultiplierRef.current;
      }
    }

    // Gently shift camera angle with mouse movement
    if (!isMobile && !reducedMotion) {
      const targetCamX = pointer.x * 0.55;
      const targetCamY = 0.65 + pointer.y * 0.35;
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        targetCamX,
        0.05
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        targetCamY,
        0.05
      );
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={universeRef}>
      {/* Slightly tilted elliptical orbital plane for realistic 3D depth */}
      <group rotation={[0.22, 0, -0.09]}>
        <CentralKubreeBazzar
          radius={sphereRadius}
          reducedMotion={reducedMotion}
        />

        <OrbitalPathRing radiusX={radiusX} radiusZ={radiusZ} />

        {ORBITAL_PRODUCTS.map((item, idx) => (
          <OrbitingProductNode
            key={item.category}
            item={item}
            index={idx}
            total={ORBITAL_PRODUCTS.length}
            radiusX={radiusX}
            radiusZ={radiusZ}
            orbitAngleRef={orbitAngleRef}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            onSelect={onNavigate}
            isMobile={isMobile}
            wasDraggedRef={wasDraggedRef}
          />
        ))}
      </group>

      {/* Soft Golden Light Particles */}
      {!reducedMotion && (
        <Sparkles
          count={isMobile ? 22 : 42}
          scale={[radiusX * 2.3, 3.2, radiusZ * 2.3]}
          size={isMobile ? 2.2 : 2.8}
          speed={0.35}
          opacity={0.55}
          color="#D4A64A"
        />
      )}
    </group>
  );
}

export function HeroOrbital3DScene({
  onNavigate,
  isMobile,
  reducedMotion,
}: HeroOrbital3DSceneProps) {
  return (
    <Canvas
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{
        position: [0, 0.65, isMobile ? 7.5 : 6.4],
        fov: 42,
        near: 0.1,
        far: 50,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      className="w-full h-full touch-pan-y"
    >
      {/* Realistic Studio Lighting */}
      <ambientLight intensity={0.85} color="#FFFDF8" />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.8}
        color="#FFF5E0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 2, 3]} intensity={1.2} color="#D4A64A" />
      <pointLight position={[3, -2, -3]} intensity={1.1} color="#741D35" />

      {/* Self-contained Studio Environment for realistic glass & metallic reflections */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#FFFDF8"
          position={[0, 5, 3]}
          scale={[8, 4, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={2.0}
          color="#D4A64A"
          position={[5, 2, 2]}
          scale={3}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={1.6}
          color="#741D35"
          position={[-5, -1, -2]}
          scale={3.5}
          target={[0, 0, 0]}
        />
      </Environment>

      <OrbitalUniverse
        onNavigate={onNavigate}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
