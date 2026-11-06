import * as THREE from 'three';
import type { ModelPreset } from '../types';

export type FinishPreset = 'maroon' | 'gold' | 'ivory' | 'obsidian';

function tagExplode(
  obj: THREE.Object3D,
  ox: number,
  oy: number,
  oz: number
) {
  obj.userData.basePos = obj.position.clone();
  obj.userData.explodeOffset = new THREE.Vector3(ox, oy, oz);
}

function getPalette(finish: FinishPreset, isSoftwareGl: boolean) {
  const primaryColors: Record<FinishPreset, number> = {
    maroon: 0x6b1d2f,
    gold: 0xb88628,
    ivory: 0xf3eadc,
    obsidian: 0x261e1c,
  };
  const accentColors: Record<FinishPreset, number> = {
    maroon: 0xd4af37,
    gold: 0x6b1d2f,
    ivory: 0x8b263e,
    obsidian: 0xd4af37,
  };

  const primary = new THREE.MeshStandardMaterial({
    color: primaryColors[finish],
    roughness: finish === 'gold' ? 0.25 : 0.42,
    metalness: finish === 'gold' ? 0.85 : 0.25,
  });

  const accent = new THREE.MeshStandardMaterial({
    color: accentColors[finish],
    roughness: 0.24,
    metalness: 0.82,
  });

  const gold = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.9,
  });

  const burlap = new THREE.MeshStandardMaterial({
    color: 0xe6d7be,
    roughness: 0.78,
    metalness: 0.05,
  });

  const honeyAmber = new THREE.MeshPhysicalMaterial({
    color: 0xd98218,
    emissive: 0x5c2d00,
    emissiveIntensity: 0.25,
    roughness: 0.12,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.45,
    transparent: true,
    opacity: 0.92,
  });

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xfffdf9,
    roughness: 0.08,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.75,
    transparent: true,
    opacity: isSoftwareGl ? 0.35 : 0.9,
  });

  const leather = new THREE.MeshStandardMaterial({
    color: 0x4a2518,
    roughness: 0.55,
    metalness: 0.1,
  });

  const riceGrain = new THREE.MeshStandardMaterial({
    color: 0xfbf8f1,
    roughness: 0.35,
    metalness: 0.05,
  });

  return { primary, accent, gold, burlap, honeyAmber, glass, leather, riceGrain };
}

export function buildProceduralProduct(
  preset: ModelPreset,
  finish: FinishPreset = 'maroon',
  isSoftwareGl = false
): THREE.Group {
  const group = new THREE.Group();
  const pal = getPalette(finish, isSoftwareGl);

  if (preset === 'rice') {
    // 1. Woven Heritage Rice Sack Body
    const sack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.66, 1.25, 32),
      pal.burlap
    );
    sack.scale.set(1.05, 1, 0.72);
    sack.position.y = -0.22;
    tagExplode(sack, 0, -0.1, 0);
    group.add(sack);

    // 2. Maroon & Gold Heritage Sash Band
    const sash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.63, 0.42, 32),
      pal.primary
    );
    sash.scale.set(1.06, 1, 0.73);
    sash.position.y = -0.18;
    tagExplode(sash, 0, 0, 0.35);
    group.add(sash);

    // 3. Gold Top Collar Trim
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.045, 16, 36),
      pal.gold
    );
    collar.rotation.x = Math.PI / 2;
    collar.scale.set(1.05, 0.72, 1);
    collar.position.y = 0.42;
    tagExplode(collar, 0, 0.35, 0);
    group.add(collar);

    // 4. Brass Grain Scoop
    const scoop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.42, 20, 1, true, 0, Math.PI),
      pal.gold
    );
    scoop.rotation.z = Math.PI / 3;
    scoop.position.set(0.68, -0.55, 0.25);
    tagExplode(scoop, 0.45, -0.15, 0.25);
    group.add(scoop);

    // 5. Animated Falling Rice Grains
    const grains: THREE.Mesh[] = [];
    const grainGeo = new THREE.CapsuleGeometry(0.022, 0.065, 6, 10);
    for (let i = 0; i < 18; i++) {
      const g = new THREE.Mesh(grainGeo, pal.riceGrain);
      const angle = (i / 18) * Math.PI * 2;
      const radius = 0.08 + (i % 4) * 0.07;
      g.position.set(
        Math.cos(angle) * radius,
        0.45 + (i % 6) * 0.16,
        Math.sin(angle) * radius * 0.7
      );
      g.rotation.set(i * 0.5, i * 0.8, i * 0.3);
      g.userData.seed = i * 0.47;
      g.userData.baseX = g.position.x;
      g.userData.baseZ = g.position.z;
      grains.push(g);
      group.add(g);
    }
    group.userData.animatedGrains = grains;
  } else if (preset === 'grocery') {
    // 1. 3D Woven/Gold Shopping Basket Base & Rim
    const basketBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.76, 0.62, 0.58, 32, 1, true),
      pal.gold
    );
    basketBase.scale.set(1.15, 1, 0.82);
    basketBase.position.y = -0.45;
    tagExplode(basketBase, 0, -0.3, 0);
    group.add(basketBase);

    const basketBottom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 0.05, 32),
      pal.primary
    );
    basketBottom.scale.set(1.15, 1, 0.82);
    basketBottom.position.y = -0.73;
    tagExplode(basketBottom, 0, -0.45, 0);
    group.add(basketBottom);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.76, 0.04, 16, 40),
      pal.primary
    );
    rim.rotation.x = Math.PI / 2;
    rim.scale.set(1.15, 0.82, 1);
    rim.position.y = -0.16;
    tagExplode(rim, 0, -0.1, 0);
    group.add(rim);

    // 2. Floating Grocery Essentials Arranging into Basket
    const floatingItems: THREE.Object3D[] = [];

    // Cold-Pressed Oil Bottle
    const oilBottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.78, 24),
      pal.honeyAmber
    );
    oilBottle.position.set(-0.32, 0.12, 0.05);
    oilBottle.userData.baseY = 0.12;
    oilBottle.userData.phase = 0;
    tagExplode(oilBottle, -0.4, 0.35, 0);
    group.add(oilBottle);
    floatingItems.push(oilBottle);

    // Dal Glass Canister
    const dalJar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.62, 24),
      pal.glass
    );
    dalJar.position.set(0.24, 0.05, -0.05);
    dalJar.userData.baseY = 0.05;
    dalJar.userData.phase = 1.6;
    tagExplode(dalJar, 0.35, 0.3, 0);
    group.add(dalJar);
    floatingItems.push(dalJar);

    // Brass Masala Tin
    const spiceTin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.36, 24),
      pal.gold
    );
    spiceTin.position.set(0.02, 0.22, 0.24);
    spiceTin.userData.baseY = 0.22;
    spiceTin.userData.phase = 3.1;
    tagExplode(spiceTin, 0, 0.45, 0.35);
    group.add(spiceTin);
    floatingItems.push(spiceTin);

    group.userData.floatingItems = floatingItems;
  } else if (preset === 'honey') {
    // 1. Inner Golden Honey Core
    const honeyCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.5, 0.96, 8),
      pal.honeyAmber
    );
    honeyCore.position.y = -0.15;
    tagExplode(honeyCore, 0, 0, 0);
    group.add(honeyCore);

    // 2. Faceted Clear Glass Jar
    const glassJar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.56, 1.06, 8),
      pal.glass
    );
    glassJar.position.y = -0.15;
    tagExplode(glassJar, 0, 0, 0.4);
    group.add(glassJar);

    // 3. Maroon & Gold Lid
    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.18, 32),
      pal.primary
    );
    lid.position.y = 0.48;
    tagExplode(lid, 0, 0.5, 0);
    group.add(lid);

    // 4. Golden Honey Swirl & Liquid Pour Stream
    const swirlGroup = new THREE.Group();
    const swirl = new THREE.Mesh(
      new THREE.TorusGeometry(0.66, 0.045, 16, 48, Math.PI * 1.45),
      pal.honeyAmber
    );
    swirl.rotation.x = Math.PI * 0.42;
    swirl.position.y = 0.05;
    swirlGroup.add(swirl);

    const pourStream = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.055, 0.72, 16),
      pal.honeyAmber
    );
    pourStream.position.set(0.42, 0.55, 0.15);
    pourStream.rotation.z = 0.18;
    swirlGroup.add(pourStream);

    tagExplode(swirlGroup, 0.35, 0.25, 0);
    group.add(swirlGroup);
    group.userData.honeySwirl = swirlGroup;
  } else {
    // 'watch' — Luxury Heritage Wristwatch
    // 1. Brushed Gold Case & Bezel
    const watchCase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.68, 0.18, 48),
      pal.gold
    );
    watchCase.rotation.x = Math.PI / 2;
    tagExplode(watchCase, 0, 0, 0);
    group.add(watchCase);

    // 2. Deep Maroon Sunburst Dial
    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.58, 0.04, 48),
      pal.primary
    );
    dial.rotation.x = Math.PI / 2;
    dial.position.z = 0.08;
    tagExplode(dial, 0, 0, 0.28);
    group.add(dial);

    // 3. Sapphire Crystal
    const crystal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.59, 0.59, 0.03, 48),
      pal.glass
    );
    crystal.rotation.x = Math.PI / 2;
    crystal.position.z = 0.12;
    tagExplode(crystal, 0, 0, 0.55);
    group.add(crystal);

    // 4. Gold Hands
    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.32, 0.02),
      pal.gold
    );
    hourHand.position.set(0.06, 0.08, 0.11);
    hourHand.rotation.z = -0.5;
    group.add(hourHand);

    const minHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, 0.44, 0.02),
      pal.gold
    );
    minHand.position.set(-0.08, 0.12, 0.115);
    minHand.rotation.z = 0.65;
    group.add(minHand);
    group.userData.watchMinHand = minHand;

    // 5. Fluted Crown
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.14, 20),
      pal.gold
    );
    crown.rotation.z = Math.PI / 2;
    crown.position.set(0.73, 0, 0);
    tagExplode(crown, 0.35, 0, 0);
    group.add(crown);

    // 6. Leather Strap Top & Bottom
    const strapTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.72, 0.08),
      pal.leather
    );
    strapTop.position.set(0, 0.92, -0.04);
    strapTop.rotation.x = 0.14;
    tagExplode(strapTop, 0, 0.4, 0);
    group.add(strapTop);

    const strapBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.72, 0.08),
      pal.leather
    );
    strapBottom.position.set(0, -0.92, -0.04);
    strapBottom.rotation.x = -0.14;
    tagExplode(strapBottom, 0, -0.4, 0);
    group.add(strapBottom);
  }

  return group;
}

export function animateProceduralProduct(group: THREE.Group, elapsed: number) {
  const grains = group.userData.animatedGrains as THREE.Mesh[] | undefined;
  if (grains) {
    for (const g of grains) {
      const seed = (g.userData.seed as number) || 0;
      const cycle = (elapsed * 0.75 + seed) % 1;
      g.position.y = 1.15 - cycle * 0.85;
      g.position.x =
        (g.userData.baseX as number) + Math.sin(elapsed * 2 + seed) * 0.03;
      g.rotation.z = elapsed * 1.5 + seed;
    }
  }

  const floating = group.userData.floatingItems as THREE.Object3D[] | undefined;
  if (floating) {
    for (const item of floating) {
      const baseY = (item.userData.baseY as number) || 0;
      const phase = (item.userData.phase as number) || 0;
      item.position.y = baseY + Math.sin(elapsed * 1.8 + phase) * 0.08;
      item.rotation.y = elapsed * 0.4 + phase;
    }
  }

  const swirl = group.userData.honeySwirl as THREE.Object3D | undefined;
  if (swirl) {
    swirl.rotation.y = elapsed * 0.65;
  }

  const minHand = group.userData.watchMinHand as THREE.Object3D | undefined;
  if (minHand) {
    minHand.rotation.z = -elapsed * 0.35;
  }
}

export function applyExplodedFactor(group: THREE.Group, factor: number) {
  group.traverse((obj) => {
    if (obj.userData.basePos && obj.userData.explodeOffset) {
      const base = obj.userData.basePos as THREE.Vector3;
      const offset = obj.userData.explodeOffset as THREE.Vector3;
      obj.position.set(
        base.x + offset.x * factor,
        base.y + offset.y * factor,
        base.z + offset.z * factor
      );
    }
  });
}

export function disposeObject3D(root: THREE.Object3D) {
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material?.dispose();
      }
    }
  });
}
