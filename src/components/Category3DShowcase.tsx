import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ModelPreset } from '../types';
import {
  detectSoftwareWebGL,
  createStudioRenderer,
  setupStudioEnvironmentAndLights,
  createContactShadowPlane,
  scheduleAfterDraw,
} from '../three/studioSetup';
import {
  buildProceduralProduct,
  animateProceduralProduct,
  disposeObject3D,
} from '../three/productModels';

interface Category3DShowcaseProps {
  activePreset: ModelPreset;
}

export function Category3DShowcase({ activePreset }: Category3DShowcaseProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const presetRef = useRef<ModelPreset>(activePreset);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    presetRef.current = activePreset;
  }, [activePreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      40
    );
    camera.position.set(0, 0.35, 4.2);
    camera.lookAt(0, -0.1, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createStudioRenderer(container, isSoftwareGl);
    } catch {
      setContextLost(true);
      return;
    }

    const disposeEnv = setupStudioEnvironmentAndLights(
      scene,
      renderer,
      isSoftwareGl
    );
    const shadowPlane = createContactShadowPlane(1.8);
    scene.add(shadowPlane);

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    let currentPreset: ModelPreset = presetRef.current;
    let currentModel = buildProceduralProduct(
      currentPreset,
      'maroon',
      isSoftwareGl
    );
    stageGroup.add(currentModel);

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    container.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (presetRef.current !== currentPreset) {
        stageGroup.remove(currentModel);
        disposeObject3D(currentModel);
        currentPreset = presetRef.current;
        currentModel = buildProceduralProduct(
          currentPreset,
          'maroon',
          isSoftwareGl
        );
        currentModel.scale.setScalar(0.6);
        stageGroup.add(currentModel);
      }

      const nextScale = THREE.MathUtils.damp(
        currentModel.scale.x,
        1.1,
        7,
        dt
      );
      currentModel.scale.setScalar(nextScale);
      animateProceduralProduct(currentModel, elapsed);

      stageGroup.rotation.y = THREE.MathUtils.damp(
        stageGroup.rotation.y,
        elapsed * 0.55 + pointerX * 0.65,
        5,
        dt
      );
      stageGroup.rotation.x = THREE.MathUtils.damp(
        stageGroup.rotation.x,
        pointerY * 0.25,
        5,
        dt
      );

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
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      disposeObject3D(currentModel);
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.Material).dispose();
      disposeEnv();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (contextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE1] text-[#786B65] text-sm">
        3D Preview Unavailable
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-label="Interactive 3D category model"
    />
  );
}
