import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Layers, Eye, EyeOff } from 'lucide-react';
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
  applyExplodedFactor,
  disposeObject3D,
  type FinishPreset,
} from '../three/productModels';

interface Product3DViewerProps {
  preset: ModelPreset;
  glbUrl?: string;
  productName: string;
}

const CAMERA_PRESETS: Record<
  'front' | 'side' | 'top' | 'detail',
  [number, number, number]
> = {
  front: [0, 0.25, 3.8],
  side: [3.6, 0.35, 0.6],
  top: [0, 3.7, 0.8],
  detail: [1.5, 0.55, 2.2],
};

export function Product3DViewer({
  preset,
  glbUrl,
  productName,
}: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [explode, setExplode] = useState(0);
  const [finish, setFinish] = useState<FinishPreset>('maroon');
  const [autoRotate, setAutoRotate] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  const explodeRef = useRef(0);
  const finishRef = useRef<FinishPreset>('maroon');
  const autoRotateRef = useRef(true);
  const targetCamRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    explodeRef.current = explode;
  }, [explode]);

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      50
    );
    camera.position.set(...CAMERA_PRESETS.front);

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
    const shadowPlane = createContactShadowPlane(2.0);
    scene.add(shadowPlane);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 1.8;
    controls.maxDistance = 7.0;
    controls.target.set(0, -0.05, 0);

    const onControlStart = () => {
      targetCamRef.current = null;
    };
    controls.addEventListener('start', onControlStart);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    let activeFinish: FinishPreset = finishRef.current;
    let currentExplode = 0;
    let modelGroup = buildProceduralProduct(preset, activeFinish, isSoftwareGl);
    modelGroup.scale.setScalar(1.15);
    rootGroup.add(modelGroup);

    let isCustomGlb = false;

    if (glbUrl) {
      const loader = new GLTFLoader();
      loader.load(
        glbUrl,
        (gltf) => {
          if (disposed) return;
          rootGroup.remove(modelGroup);
          disposeObject3D(modelGroup);
          isCustomGlb = true;
          const loaded = gltf.scene;
          const box = new THREE.Box3().setFromObject(loaded);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z, 0.001);
          const scale = 2.0 / maxDim;
          loaded.scale.setScalar(scale);
          const center = box.getCenter(new THREE.Vector3());
          loaded.position.sub(center.multiplyScalar(scale));
          modelGroup = loaded;
          rootGroup.add(modelGroup);
        },
        undefined,
        () => {}
      );
    }

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!isCustomGlb && finishRef.current !== activeFinish) {
        activeFinish = finishRef.current;
        rootGroup.remove(modelGroup);
        disposeObject3D(modelGroup);
        modelGroup = buildProceduralProduct(preset, activeFinish, isSoftwareGl);
        modelGroup.scale.setScalar(1.15);
        rootGroup.add(modelGroup);
      }

      if (!isCustomGlb) {
        currentExplode = THREE.MathUtils.damp(
          currentExplode,
          explodeRef.current,
          8,
          dt
        );
        applyExplodedFactor(modelGroup, currentExplode);
        animateProceduralProduct(modelGroup, elapsed);
      }

      if (targetCamRef.current) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          targetCamRef.current.x,
          6,
          dt
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          targetCamRef.current.y,
          6,
          dt
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          targetCamRef.current.z,
          6,
          dt
        );
        if (camera.position.distanceTo(targetCamRef.current) < 0.03) {
          targetCamRef.current = null;
        }
      }

      controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
      controls.autoRotateSpeed = 1.6;
      controls.update();

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
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      disposeObject3D(modelGroup);
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.Material).dispose();
      disposeEnv();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [preset, glbUrl]);

  const setCameraView = (view: keyof typeof CAMERA_PRESETS) => {
    targetCamRef.current = new THREE.Vector3(...CAMERA_PRESETS[view]);
  };

  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const HOTSPOTS_BY_PRESET: Record<
    ModelPreset,
    {
      label: string;
      detail: string;
      x: string;
      y: string;
      cam: keyof typeof CAMERA_PRESETS;
    }[]
  > = {
    rice: [
      {
        label: 'Woven Heritage Sack',
        detail: 'Breathable natural weave with gold-trimmed collar',
        x: '42%',
        y: '52%',
        cam: 'front',
      },
      {
        label: 'Aged Long Grains',
        detail: 'Slender aromatic grains with brass measure scoop',
        x: '60%',
        y: '34%',
        cam: 'detail',
      },
    ],
    grocery: [
      {
        label: 'Cold-Pressed Vessel',
        detail: 'Amber UV-protective glass for kitchen oils',
        x: '38%',
        y: '46%',
        cam: 'side',
      },
      {
        label: 'Brass Spice Tin',
        detail: 'Airtight canister for whole spices & dals',
        x: '58%',
        y: '54%',
        cam: 'detail',
      },
    ],
    honey: [
      {
        label: 'Faceted Glass Jar',
        detail: 'Heavyweight clear glass with golden honey swirl',
        x: '46%',
        y: '54%',
        cam: 'front',
      },
      {
        label: 'Golden Pour Stream',
        detail: 'Rich amber viscosity & airtight maroon lid',
        x: '56%',
        y: '30%',
        cam: 'detail',
      },
    ],
    watch: [
      {
        label: 'Maroon Sunburst Dial',
        detail: 'Applied gold indices under sapphire crystal',
        x: '48%',
        y: '46%',
        cam: 'front',
      },
      {
        label: 'Brushed Gold Bezel',
        detail: 'Fluted crown & stitched leather strap',
        x: '62%',
        y: '54%',
        cam: 'detail',
      },
    ],
  };

  const hotspots = !glbUrl ? HOTSPOTS_BY_PRESET[preset] || [] : [];

  if (contextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE1] text-[#786B65] text-sm rounded-xl border border-[#E6DDD0]">
        3D Viewport unavailable on this device
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden bg-gradient-to-b from-[#FAF6F0] to-[#EFE6D8] border border-[#E6DDD0]">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label={`360 degree 3D viewer for ${productName}`}
      />

      {/* Interactive Feature Hotspots */}
      {showHotspots &&
        hotspots.map((hs, idx) => {
          const isOpen = activeHotspot === idx;
          return (
            <div
              key={hs.label}
              style={{ left: hs.x, top: hs.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveHotspot(isOpen ? null : idx);
                  setCameraView(hs.cam);
                }}
                aria-label={`Inspect ${hs.label}`}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all whitespace-nowrap shadow-sm ${
                  isOpen
                    ? 'bg-[#6B1D2F] border-[#6B1D2F] text-white'
                    : 'bg-white/95 border-[#D8CBB8] text-[#1E1614] hover:border-[#6B1D2F]'
                }`}
              >
                + {hs.label}
              </button>
              {isOpen && (
                <div className="mt-1.5 w-48 rounded-lg bg-white/95 border border-[#6B1D2F]/30 p-2.5 text-[11px] text-[#4A3F3B] shadow-lg">
                  <p className="font-semibold text-[#1E1614]">{hs.label}</p>
                  <p className="text-[#786B65] mt-0.5">{hs.detail}</p>
                </div>
              )}
            </div>
          );
        })}

      {/* Top-left subtle interaction hint & hotspot toggle */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <span className="text-xs text-[#786B65] font-medium">
          Drag to orbit · Scroll to zoom
        </span>
        {hotspots.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHotspots((v) => !v)}
            className="pointer-events-auto px-2.5 py-1 rounded-md bg-white/90 border border-[#E6DDD0] text-[11px] font-medium text-[#4A3F3B] hover:text-[#1E1614]"
          >
            {showHotspots ? 'Hide Hotspots' : 'Show Hotspots'}
          </button>
        )}
      </div>

      {/* Collapsible Bottom Control Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-[680px] z-10 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setControlsOpen((v) => !v)}
          className="mb-1.5 px-3 py-1 rounded-md bg-white/95 border border-[#E6DDD0] text-xs font-medium text-[#4A3F3B] hover:text-[#1E1614] flex items-center gap-1.5 transition-colors shadow-sm"
        >
          {controlsOpen ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          <span>{controlsOpen ? 'Hide Controls' : 'Show Controls'}</span>
        </button>

        {controlsOpen && (
          <div className="w-full rounded-xl bg-white/95 border border-[#E6DDD0] px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-md">
            {!glbUrl && (
              <div className="flex items-center gap-2.5 min-w-[165px]">
                <Layers className="w-4 h-4 text-[#6B1D2F] shrink-0" />
                <label
                  htmlFor="explode-slider"
                  className="text-xs font-medium text-[#4A3F3B] whitespace-nowrap"
                >
                  Explode
                </label>
                <input
                  id="explode-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={explode}
                  onChange={(e) => setExplode(Number(e.target.value))}
                  className="w-24 accent-[#6B1D2F] cursor-pointer"
                />
              </div>
            )}

            {!glbUrl && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#786B65]">Finish</span>
                {(
                  [
                    { id: 'maroon', color: '#6B1D2F', label: 'Royal Maroon' },
                    { id: 'gold', color: '#B88628', label: 'Heritage Gold' },
                    { id: 'ivory', color: '#E6D7BE', label: 'Warm Ivory' },
                    { id: 'obsidian', color: '#261E1C', label: 'Espresso' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    title={f.label}
                    aria-label={`Select ${f.label} finish`}
                    onClick={() => setFinish(f.id)}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      finish === f.id
                        ? 'border-[#1E1614] scale-110 ring-2 ring-[#B88628]/40'
                        : 'border-[#D8CBB8] hover:scale-105'
                    }`}
                    style={{ backgroundColor: f.color }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5">
              {(['front', 'side', 'top', 'detail'] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setCameraView(view)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-[#4A3F3B] hover:text-[#6B1D2F] hover:bg-[#FAF6F0] capitalize transition-colors"
                >
                  {view}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAutoRotate((r) => !r)}
                aria-label="Toggle auto rotate"
                className={`p-1.5 rounded-md border transition-colors ${
                  autoRotate
                    ? 'border-[#6B1D2F]/40 bg-[#FDF4F6] text-[#6B1D2F]'
                    : 'border-[#E6DDD0] text-[#786B65] hover:text-[#1E1614]'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
