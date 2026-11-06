import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  detectSoftwareWebGL,
  createStudioRenderer,
  setupStudioEnvironmentAndLights,
  scheduleAfterDraw,
} from '../three/studioSetup';
import {
  buildProceduralProduct,
  animateProceduralProduct,
  disposeObject3D,
} from '../three/productModels';

interface Hero3DCanvasProps {
  onSelectPreset?: (slug: string) => void;
}

export function Hero3DCanvas({ onSelectPreset }: Hero3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      50
    );
    camera.position.set(0, 0.25, isMobile ? 7.4 : 6.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createStudioRenderer(container, isSoftwareGl);
      if (isMobile && !isSoftwareGl) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.shadowMap.enabled = false;
      }
    } catch {
      setContextLost(true);
      return;
    }

    const disposeEnv = setupStudioEnvironmentAndLights(
      scene,
      renderer,
      isSoftwareGl
    );

    const universeCenter = new THREE.Vector3(isMobile ? 0 : 0.85, 0, 0);
    const heroGroup = new THREE.Group();
    heroGroup.position.copy(universeCenter);
    scene.add(heroGroup);

    // Central Glowing KubreeBazzar Brand Core
    const sphereGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(0.68, isMobile ? 24 : 36, isMobile ? 24 : 36);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x741d35,
      emissive: 0xd4a64a,
      emissiveIntensity: 0.32,
      metalness: 0.55,
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sphereGroup.add(coreMesh);

    const haloGeo = new THREE.SphereGeometry(0.84, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd4a64a,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    sphereGroup.add(haloMesh);

    const eqRingGeo = new THREE.TorusGeometry(1.05, 0.024, 12, 64);
    const eqRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4a64a,
      metalness: 0.88,
      roughness: 0.16,
    });
    const eqRing1 = new THREE.Mesh(eqRingGeo, eqRingMat);
    eqRing1.rotation.x = Math.PI * 0.38;
    const eqRing2 = new THREE.Mesh(eqRingGeo, eqRingMat);
    eqRing2.rotation.y = Math.PI * 0.42;
    sphereGroup.add(eqRing1, eqRing2);

    heroGroup.add(sphereGroup);

    // 4 Orbiting Product Categories Around the Central KubreeBazzar
    const rice = buildProceduralProduct('rice', 'maroon', isSoftwareGl);
    rice.scale.setScalar(0.78);
    rice.userData.slug = 'royal-aged-basmati-rice-5kg';

    const honey = buildProceduralProduct('honey', 'gold', isSoftwareGl);
    honey.scale.setScalar(0.76);
    honey.userData.slug = 'nilgiri-wild-forest-raw-honey';

    const watch = buildProceduralProduct('watch', 'maroon', isSoftwareGl);
    watch.scale.setScalar(0.76);
    watch.userData.slug = 'kaveri-sovereign-maroon-automatic';

    const grocery = buildProceduralProduct('grocery', 'gold', isSoftwareGl);
    grocery.scale.setScalar(0.74);
    grocery.userData.slug = 'cold-pressed-gingelly-sesame-oil';

    heroGroup.add(rice, honey, watch, grocery);

    // Outer Orbital Track Ring
    const orbitGeo = new THREE.TorusGeometry(2.15, 0.012, 12, 96);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xd4a64a,
      transparent: true,
      opacity: 0.35,
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI * 0.42;
    orbitRing.rotation.y = -0.15;
    heroGroup.add(orbitRing);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollFactor = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (isMobile) return;
      const rect = container.getBoundingClientRect();
      pointer.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleScroll = () => {
      scrollFactor = Math.min(window.scrollY / 600, 1);
    };

    const raycaster = new THREE.Raycaster();
    const clickVec = new THREE.Vector2();
    const handleClick = (e: MouseEvent) => {
      if (!onSelectPreset) return;
      const rect = container.getBoundingClientRect();
      clickVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      clickVec.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(clickVec, camera);
      const hits = raycaster.intersectObjects(heroGroup.children, true);
      if (hits.length > 0) {
        let curr: THREE.Object3D | null = hits[0].object;
        while (curr && !curr.userData.slug) {
          curr = curr.parent;
        }
        if (curr?.userData.slug) {
          onSelectPreset(curr.userData.slug);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const orbitRadiusX = isMobile ? 1.75 : 2.15;
    const orbitRadiusZ = isMobile ? 1.15 : 1.45;
    const orbitSpeed = isMobile ? 0.22 : 0.34;

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 5, dt);
      pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 5, dt);

      const angleOffset = prefersReducedMotion ? 0 : elapsed * orbitSpeed;

      // Position the 4 categories smoothly around the central KubreeBazzar
      const items = [
        { obj: rice, baseAngle: 0 },
        { obj: honey, baseAngle: Math.PI * 0.5 },
        { obj: watch, baseAngle: Math.PI },
        { obj: grocery, baseAngle: Math.PI * 1.5 },
      ];

      items.forEach(({ obj, baseAngle }, idx) => {
        const a = baseAngle + angleOffset;
        obj.position.x = Math.cos(a) * orbitRadiusX;
        obj.position.z = Math.sin(a) * orbitRadiusZ;
        obj.position.y = prefersReducedMotion
          ? (idx % 2 === 0 ? 0.35 : -0.35)
          : Math.sin(elapsed * 1.1 + idx * 1.4) * 0.38;

        if (!prefersReducedMotion) {
          obj.rotation.y = elapsed * 0.45 + pointer.x * 0.35;
          if (!isMobile) {
            animateProceduralProduct(obj, elapsed);
          }
        }
      });

      if (!prefersReducedMotion) {
        sphereGroup.rotation.y = elapsed * 0.4 + pointer.x * 0.3;
        sphereGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.12 + pointer.y * 0.2;
        coreMat.emissiveIntensity = 0.28 + Math.sin(elapsed * 1.8) * 0.08;
        orbitRing.rotation.z = elapsed * 0.08;
      }

      const targetCamX = pointer.x * 0.38;
      const targetCamY = 0.25 + pointer.y * 0.22 - scrollFactor * 0.45;
      const targetCamZ = (isMobile ? 7.4 : 6.5) + scrollFactor * 1.2;

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        targetCamX,
        4,
        dt
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        targetCamY,
        4,
        dt
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetCamZ,
        4,
        dt
      );
      camera.lookAt(universeCenter.x * 0.55, 0, 0);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        scheduleAfterDraw(renderer, tick, (id) => {
          frameId = id;
        });
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      disposeObject3D(heroGroup);
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      eqRingGeo.dispose();
      eqRingMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      disposeEnv();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectPreset]);

  if (contextLost) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#FFFDF8] via-[#F7F0E5] to-[#EADBC6]" />
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-pointer"
      aria-label="Interactive 3D KubreeBazzar shopping universe with Rice, Honey, Watches, and Grocery"
    />
  );
}
