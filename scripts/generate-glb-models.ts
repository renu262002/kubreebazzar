import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill FileReader in Node so GLTFExporter can export binary GLB buffers cleanly
if (typeof globalThis.FileReader === 'undefined') {
  class NodeFileReader {
    result: ArrayBuffer | string | null = null;
    onloadend: (() => void) | null = null;
    onload: (() => void) | null = null;
    onerror: ((err: unknown) => void) | null = null;

    readAsArrayBuffer(blob: Blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          this.result = buf;
          if (this.onloadend) this.onloadend();
          if (this.onload) this.onload();
        })
        .catch((err) => {
          if (this.onerror) this.onerror(err);
        });
    }

    readAsDataURL(blob: Blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          const b64 = Buffer.from(buf).toString('base64');
          const mime = blob.type || 'application/octet-stream';
          this.result = `data:${mime};base64,${b64}`;
          if (this.onloadend) this.onloadend();
          if (this.onload) this.onload();
        })
        .catch((err) => {
          if (this.onerror) this.onerror(err);
        });
    }
  }
  (globalThis as unknown as { FileReader: typeof NodeFileReader }).FileReader = NodeFileReader;
}

const outDir = path.resolve(process.cwd(), 'public/models');
fs.mkdirSync(outDir, { recursive: true });

function mat(
  name: string,
  color: number,
  roughness: number,
  metalness: number,
  extra: Partial<THREE.MeshStandardMaterialParameters> = {}
) {
  return new THREE.MeshStandardMaterial({
    name,
    color,
    roughness,
    metalness,
    ...extra,
  });
}

// 1. RICE BAG (.glb) — Sculpted jute harvest bag, stitched collar, brand label, brass scoop
function buildRiceBag(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'RiceBag';

  const jute = mat('JuteSack', 0xdcc7a1, 0.88, 0.02);
  const deepBlue = mat('KubreeDeepBlue', 0x0b3b78, 0.42, 0.15);
  const orange = mat('KubreeOrange', 0xff6b1a, 0.38, 0.12);
  const wood = mat('ScoopWood', 0x8b5a2b, 0.65, 0.05);
  const riceWhite = mat('BasmatiGrain', 0xfaf6ec, 0.32, 0.04);

  // Bulged burlap body via Lathe
  const pts = [
    new THREE.Vector2(0.0, -0.68),
    new THREE.Vector2(0.46, -0.66),
    new THREE.Vector2(0.58, -0.35),
    new THREE.Vector2(0.55, 0.15),
    new THREE.Vector2(0.42, 0.46),
    new THREE.Vector2(0.32, 0.56),
    new THREE.Vector2(0.42, 0.68),
    new THREE.Vector2(0.0, 0.62),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), jute);
  body.scale.set(1.08, 1, 0.72);
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);

  // Brand ribbon band
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.59, 0.42, 28, 1, true),
    deepBlue
  );
  band.scale.set(1.09, 1, 0.74);
  band.position.y = -0.14;
  g.add(band);

  // Front orange crest emblem
  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24), orange);
  badge.rotation.x = Math.PI / 2;
  badge.position.set(0, -0.1, 0.43);
  g.add(badge);

  // Braided rope tie collar
  const tie = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.042, 12, 28), orange);
  tie.rotation.x = Math.PI / 2;
  tie.scale.set(1.06, 0.72, 1);
  tie.position.y = 0.52;
  g.add(tie);

  // Wooden scoop tucked by side
  const scoopBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.28, 16, 1, false), wood);
  scoopBowl.rotation.z = -Math.PI / 4;
  scoopBowl.position.set(0.54, -0.45, 0.18);
  g.add(scoopBowl);

  const scoopHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.028, 0.34, 12), wood);
  scoopHandle.rotation.z = -Math.PI / 4;
  scoopHandle.position.set(0.71, -0.28, 0.18);
  g.add(scoopHandle);

  // Top rice mound visible inside open pouch lip
  const mound = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), riceWhite);
  mound.scale.set(1.05, 0.55, 0.72);
  mound.position.y = 0.45;
  g.add(mound);

  return g;
}

// 2. HONEY JAR (.glb) — Ribbed faceted glass jar, golden amber core, dipper stick, gold metallic lid
function buildHoneyJar(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'HoneyJar';

  const glassMat = mat('JarGlass', 0xffffff, 0.08, 0.12, {
    transparent: true,
    opacity: 0.42,
  });
  const honeyCore = mat('GoldenHoney', 0xe58e0b, 0.14, 0.06, {
    emissive: 0x6e3200,
    emissiveIntensity: 0.25,
  });
  const goldLid = mat('GoldLid', 0xd4a024, 0.22, 0.88);
  const woodDipper = mat('HoneyDipperWood', 0xb67a3e, 0.58, 0.04);
  const labelBlue = mat('HoneyLabel', 0x0b3b78, 0.45, 0.15);

  // Inner golden honey liquid
  const honey = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.47, 0.88, 10), honeyCore);
  honey.position.y = -0.14;
  g.add(honey);

  // Faceted ribbed outer glass jar + rings
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.51, 0.53, 0.98, 10), glassMat);
  jar.position.y = -0.12;
  g.add(jar);

  for (let i = 0; i < 4; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.02, 10, 24), glassMat);
    rib.rotation.x = Math.PI / 2;
    rib.position.y = -0.45 + i * 0.22;
    g.add(rib);
  }

  // Front label band
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.525, 0.525, 0.34, 24, 1, true, -0.75, 1.5),
    labelBlue
  );
  label.position.y = -0.14;
  g.add(label);

  // Metallic gold neck & screw cap
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.44, 0.14, 24), glassMat);
  neck.position.y = 0.41;
  g.add(neck);

  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.17, 28), goldLid);
  lid.position.y = 0.52;
  g.add(lid);

  // Wooden honey dipper resting at an angle
  const dipperStick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 12), woodDipper);
  dipperStick.rotation.z = -0.52;
  dipperStick.position.set(0.42, 0.36, 0.15);
  g.add(dipperStick);

  const dipperHead = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 14), woodDipper);
  dipperHead.scale.set(1, 1.25, 1);
  dipperHead.position.set(0.18, -0.04, 0.15);
  g.add(dipperHead);

  return g;
}

// 3. SPICE CONTAINERS (.glb) — Trio of glass & brass spice canisters (Cardamom, Cloves, Cinnamon/Cumin)
function buildSpiceContainers(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'SpiceContainers';

  const brass = mat('BrushedBrass', 0xd99b26, 0.24, 0.88);
  const glass = mat('SpiceGlass', 0xf6fbff, 0.1, 0.1, { transparent: true, opacity: 0.4 });
  const greenSpice = mat('CardamomGreen', 0x4caf50, 0.72, 0.02);
  const cloveBrown = mat('CloveBrown', 0x5c3317, 0.78, 0.03);
  const cinnamonRust = mat('CinnamonAmber', 0xb44c1e, 0.7, 0.04);
  const trayMat = mat('TrayDeepBlue', 0x0b3b78, 0.35, 0.45);

  // Base tray
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.78, 0.08, 32), trayMat);
  tray.position.y = -0.55;
  g.add(tray);

  const configs = [
    { x: -0.34, z: 0.14, h: 0.72, fill: greenSpice, lidColor: brass },
    { x: 0.34, z: 0.14, h: 0.62, fill: cloveBrown, lidColor: brass },
    { x: 0.0, z: -0.32, h: 0.84, fill: cinnamonRust, lidColor: brass },
  ];

  configs.forEach((c) => {
    const sub = new THREE.Group();
    sub.position.set(c.x, -0.51, c.z);

    const spiceCore = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, c.h * 0.78, 20), c.fill);
    spiceCore.position.y = c.h * 0.42;
    sub.add(spiceCore);

    const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, c.h, 20), glass);
    jar.position.y = c.h * 0.5;
    sub.add(jar);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.07, 20), brass);
    collar.position.y = c.h * 0.16;
    sub.add(collar);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 20), c.lidColor);
    cap.position.y = c.h + 0.05;
    sub.add(cap);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), brass);
    knob.position.y = c.h + 0.14;
    sub.add(knob);

    g.add(sub);
  });

  return g;
}

// 4. FASHION SNEAKER (.glb) — Sculpted athletic footwear silhouette with midsole, upper, tongue, laces, collar
function buildFashionShoe(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'FashionSneaker';

  const whiteRubber = mat('MidsoleWhite', 0xf8fafc, 0.42, 0.05);
  const cobaltUpper = mat('KnitBlue', 0x1d6fd8, 0.65, 0.08);
  const deepBlueTrim = mat('HeelDeepBlue', 0x0b3b78, 0.35, 0.22);
  const orangeAccent = mat('AccentOrange', 0xff6b1a, 0.36, 0.15);

  // Sole profile extruded cleanly
  const soleShape = new THREE.Shape();
  soleShape.moveTo(-0.78, -0.18);
  soleShape.quadraticCurveTo(0.0, -0.22, 0.84, -0.14);
  soleShape.quadraticCurveTo(0.92, -0.04, 0.82, 0.02);
  soleShape.quadraticCurveTo(0.0, 0.0, -0.76, 0.06);
  soleShape.quadraticCurveTo(-0.85, -0.06, -0.78, -0.18);

  const sole = new THREE.Mesh(
    new THREE.ExtrudeGeometry(soleShape, {
      depth: 0.56,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.04,
      bevelSegments: 4,
    }),
    whiteRubber
  );
  sole.position.set(0, -0.22, -0.28);
  g.add(sole);

  // Sculpted Upper Body
  const upperShape = new THREE.Shape();
  upperShape.moveTo(-0.74, -0.12);
  upperShape.lineTo(0.76, -0.12);
  upperShape.quadraticCurveTo(0.84, 0.04, 0.64, 0.12);
  upperShape.quadraticCurveTo(0.24, 0.22, 0.04, 0.42);
  upperShape.lineTo(-0.42, 0.46);
  upperShape.quadraticCurveTo(-0.68, 0.42, -0.74, -0.12);

  const upper = new THREE.Mesh(
    new THREE.ExtrudeGeometry(upperShape, {
      depth: 0.46,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.045,
      bevelSegments: 5,
    }),
    cobaltUpper
  );
  upper.position.set(0, -0.1, -0.23);
  g.add(upper);

  // Heel Stabilizer Wrap
  const heelClip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.3, 0.32, 20, 1, false, Math.PI * 0.55, Math.PI * 0.9),
    deepBlueTrim
  );
  heelClip.rotation.y = -Math.PI / 2;
  heelClip.position.set(-0.56, -0.04, 0);
  g.add(heelClip);

  // Signature Side Swoosh / Kinetic Stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.075, 0.58), orangeAccent);
  stripe.rotation.z = 0.22;
  stripe.position.set(0.06, 0.04, 0);
  g.add(stripe);

  // Tongue + Collar Pad
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.3, 0.36), deepBlueTrim);
  tongue.rotation.z = -0.45;
  tongue.position.set(-0.08, 0.34, 0);
  g.add(tongue);

  // Crisp Lace Bars
  for (let i = 0; i < 4; i++) {
    const lace = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.38, 8), whiteRubber);
    lace.rotation.x = Math.PI / 2;
    lace.position.set(0.08 + i * 0.11, 0.28 - i * 0.055, 0);
    g.add(lace);
  }

  // Slight dynamic display pitch
  g.rotation.y = -0.35;
  g.rotation.z = 0.1;
  return g;
}

// 5. SHOPPING BAG (.glb) — Signature KubreeBazzar tote bag with folded cuff & arched handles
function buildShoppingBag(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'ShoppingBag';

  const orangeBag = mat('BagOrange', 0xff6b1a, 0.45, 0.06);
  const deepBlueCuff = mat('CuffBlue', 0x0b3b78, 0.38, 0.18);
  const goldCord = mat('HandleGold', 0xf8fafc, 0.3, 0.25);
  const emblem = mat('BagEmblem', 0x1d6fd8, 0.22, 0.72);

  // Tapered shopping bag body
  const bagShape = new THREE.Shape();
  bagShape.moveTo(-0.52, -0.58);
  bagShape.lineTo(0.52, -0.58);
  bagShape.lineTo(0.46, 0.46);
  bagShape.lineTo(-0.46, 0.46);
  bagShape.closePath();

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(bagShape, {
      depth: 0.44,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    }),
    orangeBag
  );
  body.position.set(0, 0, -0.22);
  g.add(body);

  // Top contrast cuff collar
  const cuff = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.16, 0.52), deepBlueCuff);
  cuff.position.y = 0.42;
  g.add(cuff);

  // Center medallion plaque
  const plaque = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 24), emblem);
  plaque.rotation.x = Math.PI / 2;
  plaque.position.set(0, -0.04, 0.25);
  g.add(plaque);

  // Front & back curved tube handles
  [-0.14, 0.14].forEach((zPos) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.22, 0.46, zPos),
      new THREE.Vector3(-0.18, 0.82, zPos),
      new THREE.Vector3(0.0, 0.88, zPos),
      new THREE.Vector3(0.18, 0.82, zPos),
      new THREE.Vector3(0.22, 0.46, zPos),
    ]);
    const handle = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.026, 10, false), goldCord);
    g.add(handle);
  });

  return g;
}

// 6. HEADPHONES (.glb) — Studio over-ear ANC wireless headphones with metallic yokes & plush earpads
function buildHeadphones(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'Headphones';

  const matteBlue = mat('HeadphoneMatteBlue', 0x0b3b78, 0.4, 0.25);
  const brushedSteel = mat('HeadphoneSteel', 0xd8e2ef, 0.2, 0.9);
  const cushionLeather = mat('HeadphoneLeather', 0x1e293b, 0.58, 0.08);
  const orangeRing = mat('AcousticAccent', 0xff6b1a, 0.25, 0.65);

  // Curved Spring Headband Arch
  const headband = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.065, 16, 40, Math.PI * 1.08),
    matteBlue
  );
  headband.rotation.z = -0.12;
  headband.position.y = 0.14;
  g.add(headband);

  // Inner Headband Cushion
  const topPad = new THREE.Mesh(
    new THREE.TorusGeometry(0.505, 0.045, 12, 28, Math.PI * 0.6),
    cushionLeather
  );
  topPad.rotation.z = Math.PI * 0.2;
  topPad.position.y = 0.14;
  g.add(topPad);

  // Left & Right Swivel Yokes + Earcups + Cushions + Orange Metallic Rings
  [-1, 1].forEach((side) => {
    const cupGroup = new THREE.Group();
    cupGroup.position.set(side * 0.56, -0.18, 0);
    cupGroup.rotation.z = side * 0.12;

    const slider = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.34, 12), brushedSteel);
    slider.position.set(0, 0.24, 0);
    cupGroup.add(slider);

    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.14, 28), matteBlue);
    shell.rotation.z = Math.PI / 2;
    shell.position.set(side * 0.04, 0, 0);
    cupGroup.add(shell);

    const accentRing = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.018, 12, 28), orangeRing);
    accentRing.rotation.y = Math.PI / 2;
    accentRing.position.set(side * 0.115, 0, 0);
    cupGroup.add(accentRing);

    const earPad = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.072, 16, 28), cushionLeather);
    earPad.rotation.y = Math.PI / 2;
    earPad.position.set(-side * 0.045, 0, 0);
    cupGroup.add(earPad);

    g.add(cupGroup);
  });

  return g;
}

// 7. WRISTWATCH (.glb) — Luxury skeleton chronograph case, bezel, crown, indices, sapphire & strap
function buildWristwatch(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'Wristwatch';

  const goldCase = mat('WatchGoldCase', 0xd4a438, 0.18, 0.92);
  const blueDial = mat('WatchDeepDial', 0x0b3b78, 0.28, 0.55);
  const sapphire = mat('SapphireCrystal', 0xeef8ff, 0.05, 0.1, {
    transparent: true,
    opacity: 0.34,
  });
  const strapLeather = mat('WatchLeatherStrap', 0x4b2618, 0.56, 0.08);
  const orangeHand = mat('SecondHandOrange', 0xff6b1a, 0.2, 0.8);

  const dialAssembly = new THREE.Group();
  dialAssembly.rotation.x = 0.22;

  // Main Watch Case Cylinder
  const caseBody = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.44, 0.16, 36), goldCase);
  caseBody.rotation.x = Math.PI / 2;
  dialAssembly.add(caseBody);

  // Stepped Bezel Torus
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 16, 36), goldCase);
  bezel.position.z = 0.07;
  dialAssembly.add(bezel);

  // Recessed Skeleton Dial Plate
  const dialPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.04, 32), blueDial);
  dialPlate.rotation.x = Math.PI / 2;
  dialPlate.position.z = 0.055;
  dialAssembly.add(dialPlate);

  // Skeleton Gear Accent Ring Inside Dial
  const gearRing = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 12, 24), goldCase);
  gearRing.position.z = 0.08;
  dialAssembly.add(gearRing);

  // Hour Indices
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.065, 0.02), goldCase);
    marker.position.set(Math.sin(angle) * 0.32, Math.cos(angle) * 0.32, 0.085);
    marker.rotation.z = -angle;
    dialAssembly.add(marker);
  }

  // Hour, Minute & Orange Sweeping Second Hands
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.2, 0.015), goldCase);
  hourHand.position.set(0.05, 0.06, 0.1);
  hourHand.rotation.z = -0.8;
  dialAssembly.add(hourHand);

  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.28, 0.015), orangeHand);
  minHand.position.set(-0.08, 0.08, 0.11);
  minHand.rotation.z = 0.7;
  dialAssembly.add(minHand);

  // Sapphire Dome Lens
  const crystal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.025, 32), sapphire);
  crystal.rotation.x = Math.PI / 2;
  crystal.position.z = 0.125;
  dialAssembly.add(crystal);

  // Winding Crown & Pushers
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.09, 16), goldCase);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(0.49, 0, 0);
  dialAssembly.add(crown);

  // Curved Leather Strap Loop (Top & Bottom Lugs + Band)
  [-1, 1].forEach((dir) => {
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, dir * 0.43, 0.01),
      new THREE.Vector3(0, dir * 0.68, -0.09),
      new THREE.Vector3(0, dir * 0.72, -0.34),
      new THREE.Vector3(0, dir * 0.46, -0.55),
    ]);
    const strap = new THREE.Mesh(new THREE.TubeGeometry(strapCurve, 18, 0.16, 8, false), strapLeather);
    strap.scale.set(1.25, 1, 0.28);
    dialAssembly.add(strap);
  });

  g.add(dialAssembly);
  return g;
}

// 8. GROCERY BASKET (.glb) — Retail wire/molded shopping basket holding oil bottle, spice jar & fruit
function buildGroceryBasket(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'GroceryBasket';

  const blueBody = mat('BasketBlue', 0x1d6fd8, 0.42, 0.18);
  const deepRim = mat('BasketRim', 0x0b3b78, 0.3, 0.35);
  const orangeHandle = mat('BasketOrangeHandle', 0xff6b1a, 0.35, 0.12);
  const honeyAmber = mat('OilBottleAmber', 0xe59412, 0.18, 0.06);
  const greenFresh = mat('FreshGreen', 0x4caf50, 0.55, 0.04);
  const creamPack = mat('GrainPack', 0xf6efe2, 0.68, 0.04);

  // Tapered Basket Shell & Bottom
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.5, 0.48, 28, 1, true), blueBody);
  shell.scale.set(1.22, 1, 0.85);
  shell.position.y = -0.22;
  g.add(shell);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 28), deepRim);
  base.scale.set(1.22, 1, 0.85);
  base.position.y = -0.45;
  g.add(base);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.042, 14, 36), deepRim);
  rim.rotation.x = Math.PI / 2;
  rim.scale.set(1.22, 0.85, 1);
  rim.position.y = 0.02;
  g.add(rim);

  // Twin Folding Orange Carry Handles
  [-0.2, 0.2].forEach((zOffset) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.56, 0.04, zOffset),
      new THREE.Vector3(-0.42, 0.48, zOffset * 0.4),
      new THREE.Vector3(0.0, 0.54, zOffset * 0.25),
      new THREE.Vector3(0.42, 0.48, zOffset * 0.4),
      new THREE.Vector3(0.56, 0.04, zOffset),
    ]);
    const handle = new THREE.Mesh(new THREE.TubeGeometry(curve, 22, 0.032, 10, false), orangeHandle);
    g.add(handle);
  });

  // 3D Essentials Packed Inside Basket
  const oilBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.58, 18), honeyAmber);
  oilBottle.position.set(-0.28, 0.08, 0.08);
  g.add(oilBottle);

  const boxPack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.48, 0.22), creamPack);
  boxPack.rotation.y = 0.24;
  boxPack.position.set(0.24, 0.06, -0.06);
  g.add(boxPack);

  const freshOrb1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 14), greenFresh);
  freshOrb1.position.set(0.04, 0.08, 0.24);
  g.add(freshOrb1);

  const freshOrb2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 14), orangeHandle);
  freshOrb2.position.set(-0.08, 0.06, -0.2);
  g.add(freshOrb2);

  return g;
}

// 9. FASHION HANDBAG (.glb) — Structured designer leather tote with brass clasp, top flap & arched handle
function buildFashionHandbag(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'FashionHandbag';

  const leatherNavy = mat('BagNavyLeather', 0x102a54, 0.44, 0.12);
  const tanTrim = mat('BagTanTrim', 0xc97b3b, 0.48, 0.08);
  const brushedBrass = mat('BagBrassClasp', 0xd9a23b, 0.2, 0.9);

  // Sculpted trapezoidal leather body
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-0.56, -0.44);
  bodyShape.lineTo(0.56, -0.44);
  bodyShape.lineTo(0.46, 0.36);
  bodyShape.lineTo(-0.46, 0.36);
  bodyShape.closePath();

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(bodyShape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 4,
    }),
    leatherNavy
  );
  body.position.set(0, 0, -0.16);
  g.add(body);

  // Front envelope flap
  const flap = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.38, 0.05), tanTrim);
  flap.position.set(0, 0.16, 0.19);
  g.add(flap);

  // Brass turn-lock buckle
  const lockPlate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.05), brushedBrass);
  lockPlate.position.set(0, 0.04, 0.22);
  g.add(lockPlate);

  // Structured arched leather handle + brass D-rings
  [-0.28, 0.28].forEach((x) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 10, 20), brushedBrass);
    ring.position.set(x, 0.4, 0.02);
    g.add(ring);
  });

  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 0.41, 0.02),
    new THREE.Vector3(-0.22, 0.74, 0.02),
    new THREE.Vector3(0, 0.8, 0.02),
    new THREE.Vector3(0.22, 0.74, 0.02),
    new THREE.Vector3(0.28, 0.41, 0.02),
  ]);
  const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 24, 0.036, 12, false), tanTrim);
  g.add(handle);

  return g;
}

// 10. BABY ESSENTIALS (.glb) — Ergonomic feeding bottle + wooden pastel stacking rings toy
function buildBabyEssentials(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'BabyEssentials';

  const bottleGlass = mat('BabyBottleBody', 0xf3f9ff, 0.16, 0.06, {
    transparent: true,
    opacity: 0.78,
  });
  const milkCore = mat('MilkCore', 0xfffcf2, 0.35, 0.02);
  const softBlue = mat('BabySoftBlue', 0x4b93e8, 0.55, 0.06);
  const softOrange = mat('BabySoftOrange', 0xff8c42, 0.52, 0.06);
  const mintGreen = mat('BabyMintGreen', 0x5cc47b, 0.52, 0.06);
  const silicone = mat('SiliconeNipple', 0xfce7cf, 0.45, 0.02);
  const wood = mat('ToyWood', 0xd4a46a, 0.65, 0.02);

  // Feeding Bottle (Left)
  const bottleGroup = new THREE.Group();
  bottleGroup.position.set(-0.3, -0.05, 0.06);

  const milk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.62, 20), milkCore);
  milk.position.y = -0.08;
  bottleGroup.add(milk);

  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.24, 0.74, 24), bottleGlass);
  shell.position.y = -0.04;
  bottleGroup.add(shell);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.23, 0.14, 24), softBlue);
  collar.position.y = 0.38;
  bottleGroup.add(collar);

  const nipple = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.11, 0.18, 20), silicone);
  nipple.position.y = 0.53;
  bottleGroup.add(nipple);
  g.add(bottleGroup);

  // Stacking Rings Toy (Right)
  const toyGroup = new THREE.Group();
  toyGroup.position.set(0.32, -0.15, -0.06);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.1, 24), wood);
  base.position.y = -0.3;
  toyGroup.add(base);

  const dowel = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.68, 16), wood);
  dowel.position.y = 0.06;
  toyGroup.add(dowel);

  [
    { r: 0.27, y: -0.18, m: softBlue },
    { r: 0.22, y: -0.04, m: mintGreen },
    { r: 0.17, y: 0.1, m: softOrange },
  ].forEach((ring) => {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(ring.r, 0.065, 16, 28), ring.m);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = ring.y;
    toyGroup.add(torus);
  });

  const topper = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 16), softOrange);
  topper.position.y = 0.28;
  toyGroup.add(topper);

  g.add(toyGroup);
  return g;
}

// 11. SCHOOL BACKPACK (.glb) — Classic sculpted school bag with front pocket, zippers & twin straps
function buildSchoolBackpack(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'SchoolBackpack';

  const packBlue = mat('BackpackRoyalBlue', 0x1d6fd8, 0.68, 0.08);
  const darkNavy = mat('BackpackDeepNavy', 0x0b3b78, 0.58, 0.12);
  const accentOrange = mat('BackpackOrange', 0xff6b1a, 0.52, 0.1);
  const metalZip = mat('ZipMetal', 0xe2e8f0, 0.22, 0.88);

  // Rounded main pack shell
  const mainShape = new THREE.Shape();
  mainShape.moveTo(-0.46, -0.52);
  mainShape.lineTo(0.46, -0.52);
  mainShape.lineTo(0.42, 0.34);
  mainShape.quadraticCurveTo(0.36, 0.58, 0.0, 0.6);
  mainShape.quadraticCurveTo(-0.36, 0.58, -0.42, 0.34);
  mainShape.closePath();

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(mainShape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 5,
    }),
    packBlue
  );
  body.position.set(0, 0, -0.18);
  g.add(body);

  // Front organizer pouch
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.44, 0.18), darkNavy);
  pocket.position.set(0, -0.22, 0.26);
  g.add(pocket);

  // Orange zip trim band & metallic zipper pull
  const trim = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.19), accentOrange);
  trim.position.set(0, -0.02, 0.27);
  g.add(trim);

  const zipPull = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.04), metalZip);
  zipPull.position.set(0.14, -0.06, 0.37);
  g.add(zipPull);

  // Top carry loop handle
  const topHandle = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.028, 10, 22, Math.PI),
    accentOrange
  );
  topHandle.position.set(0, 0.61, 0);
  g.add(topHandle);

  // Pencil sticking neatly out of side mesh pocket
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.38, 16), metalZip);
  bottle.position.set(0.5, -0.22, 0.04);
  g.add(bottle);

  return g;
}

// 12. SPORTS GEAR (.glb) — Paneled match ball + matte sports hydration bottle
function buildSportsGear(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'SportsGear';

  const ballLeather = mat('SportBallBase', 0xd9581a, 0.52, 0.06);
  const seamBlack = mat('SportSeam', 0x1e293b, 0.65, 0.08);
  const steelBottle = mat('SportFlask', 0x0b3b78, 0.28, 0.72);
  const capSteel = mat('SportCapSteel', 0xdbe5f2, 0.22, 0.88);
  const orangeGrip = mat('SportGrip', 0xff6b1a, 0.45, 0.1);

  // Sculpted match basketball with orthogonal seam rings
  const ballGroup = new THREE.Group();
  ballGroup.position.set(-0.22, -0.08, 0.08);

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 24), ballLeather);
  ballGroup.add(sphere);

  const seam1 = new THREE.Mesh(new THREE.TorusGeometry(0.422, 0.015, 8, 36), seamBlack);
  ballGroup.add(seam1);

  const seam2 = new THREE.Mesh(new THREE.TorusGeometry(0.422, 0.015, 8, 36), seamBlack);
  seam2.rotation.y = Math.PI / 2;
  ballGroup.add(seam2);
  g.add(ballGroup);

  // Insulated Sports Sipper Bottle (Right)
  const flaskGroup = new THREE.Group();
  flaskGroup.position.set(0.36, -0.02, -0.1);
  flaskGroup.rotation.z = -0.12;

  const flaskBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.74, 24), steelBottle);
  flaskGroup.add(flaskBody);

  const gripBand = new THREE.Mesh(new THREE.CylinderGeometry(0.166, 0.166, 0.16, 24), orangeGrip);
  gripBand.position.y = -0.08;
  flaskGroup.add(gripBand);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.14, 20), capSteel);
  cap.position.y = 0.44;
  flaskGroup.add(cap);

  g.add(flaskGroup);
  return g;
}

const MODELS: { filename: string; build: () => THREE.Group }[] = [
  { filename: 'rice-bag.glb', build: buildRiceBag },
  { filename: 'honey-jar.glb', build: buildHoneyJar },
  { filename: 'spice-containers.glb', build: buildSpiceContainers },
  { filename: 'fashion-shoe.glb', build: buildFashionShoe },
  { filename: 'fashion-handbag.glb', build: buildFashionHandbag },
  { filename: 'shopping-bag.glb', build: buildShoppingBag },
  { filename: 'headphones.glb', build: buildHeadphones },
  { filename: 'wristwatch.glb', build: buildWristwatch },
  { filename: 'baby-essentials.glb', build: buildBabyEssentials },
  { filename: 'school-backpack.glb', build: buildSchoolBackpack },
  { filename: 'sports-gear.glb', build: buildSportsGear },
  { filename: 'grocery-basket.glb', build: buildGroceryBasket },
];

async function exportAll() {
  const exporter = new GLTFExporter();
  for (const item of MODELS) {
    const group = item.build();
    const glbBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        group,
        (res) => {
          if (res instanceof ArrayBuffer) {
            resolve(res);
          } else {
            reject(new Error(`Expected ArrayBuffer for ${item.filename}`));
          }
        },
        (err) => reject(err),
        { binary: true, onlyVisible: true }
      );
    });
    const dest = path.join(outDir, item.filename);
    fs.writeFileSync(dest, Buffer.from(glbBuffer));
    console.log(`Generated ${item.filename} (${glbBuffer.byteLength} bytes)`);
  }
}

exportAll().catch((err) => {
  console.error('GLB generation failed:', err);
  process.exit(1);
});
