import type {
  ElectronicsCollection,
  ElectronicsGroupCategory,
  Product,
} from '../types';

export interface ElectronicsParentGroup {
  name: ElectronicsGroupCategory;
  slug: string;
  folder: string;
  description: string;
}

export const ELECTRONICS_PARENT_GROUPS: ElectronicsParentGroup[] = [
  {
    name: 'Smartphones & Tablets',
    slug: 'smartphones-tablets',
    folder: 'smartphones-tablets',
    description:
      'Modern edge-display smartphones, contemporary Android handsets, keypad feature phones, touchscreen tablets, and keyboard covers & styluses.',
  },
  {
    name: 'Audio Devices',
    slug: 'audio-devices',
    folder: 'audio-devices',
    description:
      'True wireless earbuds, wired in-ear earphones, wireless over-ear Bluetooth headphones, gaming headsets, portable speakers, and TV soundbars.',
  },
  {
    name: 'Smartwatches & Wearables',
    slug: 'wearables',
    folder: 'wearables',
    description:
      'Touchscreen smartwatches, slim daily fitness tracking bands, and child-friendly smartwatches.',
  },
  {
    name: 'Charging & Power',
    slug: 'charging-power',
    folder: 'charging-power',
    description:
      'Portable power banks, USB-C fast charging adapters, wireless charging pads, braided charging cables, and compact car chargers.',
  },
  {
    name: 'Computer Accessories',
    slug: 'computer-accessories',
    folder: 'computer-accessories',
    description:
      'Desktop keyboards, wireless optical mice, ergonomic gaming mice, webcams, multi-port USB hubs, and adjustable laptop stands.',
  },
  {
    name: 'Storage Devices',
    slug: 'storage-devices',
    folder: 'storage-devices',
    description:
      'Portable USB flash drives, external hard disk drives, compact external solid-state drives, and SD / microSD memory cards.',
  },
  {
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',
    folder: 'mobile-accessories',
    description:
      'Protective smartphone cases, tempered glass screen protectors, adjustable phone holders, telescopic selfie sticks, and mobile tripods.',
  },
  {
    name: 'Gaming Accessories',
    slug: 'gaming-accessories',
    folder: 'gaming-accessories',
    description:
      'Wireless game controllers, mechanical gaming keyboards, extended desk mouse pads, shared gaming headsets, and controller accessories.',
  },
  {
    name: 'Cameras & Accessories',
    slug: 'cameras-accessories',
    folder: 'cameras-accessories',
    description:
      'Compact digital cameras, mountable action cameras, indoor security cameras, and full-height adjustable camera tripods.',
  },
  {
    name: 'Home Electronics',
    slug: 'home-electronics',
    folder: 'home-electronics',
    description:
      'Smart LED bulbs, LED light strips and fixtures, multi-socket extension boards, smart electrical plugs, and wireless internet routers.',
  },
];

interface SeedInput {
  name: string;
  slug: string;
  parentGroup: ElectronicsGroupCategory;
  parentSlug: string;
  additionalGroups?: ElectronicsGroupCategory[];
  expectedFilename: string;
  image?: string;
  description: string;
  keywords: string[];
}

const RAW_ELECTRONICS_COLLECTIONS: SeedInput[] = [
  // GROUP 1 — SMARTPHONES & TABLETS (5)
  {
    name: 'Smartphones',
    slug: 'smartphones',
    parentGroup: 'Smartphones & Tablets',
    parentSlug: 'smartphones-tablets',
    expectedFilename: 'smartphones-tablets/smartphones.jpg',
    image: '/images/electronics/smartphones-tablets/smartphones.jpg',
    description:
      'Modern edge-to-edge touchscreen smartphones engineered for crisp daily communication, photography, and smooth app performance.',
    keywords: ['smartphone', 'mobile phone', 'touchscreen phone', '5g phone'],
  },
  {
    name: 'Android Phones',
    slug: 'android-phones',
    parentGroup: 'Smartphones & Tablets',
    parentSlug: 'smartphones-tablets',
    expectedFilename: 'smartphones-tablets/android-phones.jpg',
    image: '/images/electronics/smartphones-tablets/android-phones.jpg',
    description:
      'Contemporary Android-style smartphones featuring versatile multi-lens cameras, vibrant displays, and expandable utility.',
    keywords: ['android phone', 'android smartphone', 'dual sim phone'],
  },
  {
    name: 'Feature Phones',
    slug: 'feature-phones',
    parentGroup: 'Smartphones & Tablets',
    parentSlug: 'smartphones-tablets',
    expectedFilename: 'smartphones-tablets/feature-phones.jpg',
    description:
      'Compact traditional keypad mobile phones built for long standby battery life and clear tactile dialing.',
    keywords: ['feature phone', 'keypad phone', 'button phone', 'basic mobile'],
  },
  {
    name: 'Tablets',
    slug: 'tablets',
    parentGroup: 'Smartphones & Tablets',
    parentSlug: 'smartphones-tablets',
    expectedFilename: 'smartphones-tablets/tablets.jpg',
    image: '/images/electronics/smartphones-tablets/tablets.jpg',
    description:
      'Lightweight wide-screen touchscreen tablets suited for reading, digital study, video calls, and creative sketching.',
    keywords: ['tablet', 'touchscreen tablet', 'slate tablet', 'reading tablet'],
  },
  {
    name: 'Tablet Accessories',
    slug: 'tablet-accessories',
    parentGroup: 'Smartphones & Tablets',
    parentSlug: 'smartphones-tablets',
    expectedFilename: 'smartphones-tablets/tablet-accessories.jpg',
    image: '/images/electronics/smartphones-tablets/tablet-accessories.jpg',
    description:
      'Foldable magnetic tablet keyboard covers, protective folios, and precision stylus pens for portable productivity.',
    keywords: ['tablet accessories', 'tablet keyboard', 'stylus pen', 'tablet cover'],
  },

  // GROUP 2 — AUDIO DEVICES (6)
  {
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    parentGroup: 'Audio Devices',
    parentSlug: 'audio-devices',
    expectedFilename: 'audio-devices/wireless-earbuds.jpg',
    image: '/images/electronics/audio-devices/wireless-earbuds.jpg',
    description:
      'Compact true wireless earbuds with pocket-sized charging cases for cable-free calls, commuting, and music.',
    keywords: ['wireless earbuds', 'tws earbuds', 'earbuds', 'bluetooth earbuds', 'anc earbuds'],
  },
  {
    name: 'Wired Earphones',
    slug: 'wired-earphones',
    parentGroup: 'Audio Devices',
    parentSlug: 'audio-devices',
    expectedFilename: 'audio-devices/wired-earphones.jpg',
    image: '/images/electronics/audio-devices/wired-earphones.jpg',
    description:
      'Tangle-resistant wired in-ear earphones offering zero-latency plug-and-play stereo sound for calls and audio.',
    keywords: ['wired earphones', 'in-ear earphones', '3.5mm earphones'],
  },
  {
    name: 'Bluetooth Headphones',
    slug: 'bluetooth-headphones',
    parentGroup: 'Audio Devices',
    parentSlug: 'audio-devices',
    expectedFilename: 'audio-devices/bluetooth-headphones.jpg',
    image: '/images/electronics/audio-devices/bluetooth-headphones.jpg',
    description:
      'Cushioned over-ear wireless Bluetooth headphones built for immersive listening and comfortable all-day wear.',
    keywords: ['bluetooth headphones', 'wireless headphones', 'over-ear headphones'],
  },
  {
    // Canonical Gaming Headsets collection referenced from both Audio Devices & Gaming Accessories
    name: 'Gaming Headsets',
    slug: 'gaming-headsets',
    parentGroup: 'Audio Devices',
    parentSlug: 'audio-devices',
    additionalGroups: ['Gaming Accessories'],
    expectedFilename: 'audio-devices/gaming-headsets.jpg',
    description:
      'Over-ear gaming headsets equipped with cushioned ear cups and boom microphones for clear team communication and positional audio.',
    keywords: ['gaming headset', 'gaming headphones', 'boom mic headset'],
  },
  {
    name: 'Bluetooth Speakers',
    slug: 'bluetooth-speakers',
    parentGroup: 'Audio Devices',
    parentSlug: 'audio-devices',
    expectedFilename: 'audio-devices/bluetooth-speakers.jpg',
    image: '/images/electronics/audio-devices/bluetooth-speakers.jpg',
    description:
      'Portable rechargeable wireless Bluetooth speakers designed for room-filling music at home or outdoors.',
    keywords: ['bluetooth speaker', 'portable speaker', 'wireless speaker'],
  },
  {
    name: 'Soundbars',
    slug: 'soundbars',
    parentGroup: 'Audio Devices',
    parentSlug: 'audio-devices',
    expectedFilename: 'audio-devices/soundbars.jpg',
    description:
      'Low-profile modern TV soundbars engineered to upgrade home television dialogue clarity and cinema acoustics.',
    keywords: ['soundbar', 'tv speaker', 'home theater bar'],
  },

  // GROUP 3 — SMARTWATCHES & WEARABLES (3)
  {
    name: 'Smartwatches',
    slug: 'smartwatches',
    parentGroup: 'Smartwatches & Wearables',
    parentSlug: 'wearables',
    expectedFilename: 'wearables/smartwatches.jpg',
    image: '/images/electronics/wearables/smartwatches.jpg',
    description:
      'Touchscreen smartwatches combining daily activity tracking, wrist alerts, and interchangeable straps.',
    keywords: ['smartwatch', 'smart watch', 'touchscreen watch', 'amoled watch'],
  },
  {
    name: 'Fitness Bands',
    slug: 'fitness-bands',
    parentGroup: 'Smartwatches & Wearables',
    parentSlug: 'wearables',
    expectedFilename: 'wearables/fitness-bands.jpg',
    description:
      'Lightweight slim fitness tracking bands built to monitor steps, workouts, and everyday movement without bulk.',
    keywords: ['fitness band', 'fitness tracker', 'activity band', 'smart band'],
  },
  {
    name: "Kids' Smartwatches",
    slug: 'kids-smartwatches',
    parentGroup: 'Smartwatches & Wearables',
    parentSlug: 'wearables',
    expectedFilename: 'wearables/kids-smartwatches.jpg',
    description:
      'Durable colourful child-friendly smartwatches featuring soft silicone bands and playful easy-read dials.',
    keywords: ['kids smartwatch', 'child watch', 'children smartwatch'],
  },

  // GROUP 4 — CHARGING & POWER (5)
  {
    name: 'Power Banks',
    slug: 'power-banks',
    parentGroup: 'Charging & Power',
    parentSlug: 'charging-power',
    expectedFilename: 'charging-power/power-banks.jpg',
    image: '/images/electronics/charging-power/power-banks.jpg',
    description:
      'Pocketable rechargeable power banks providing dependable backup battery power on commutes and trips.',
    keywords: ['power bank', 'portable charger', 'battery pack'],
  },
  {
    name: 'Fast Chargers',
    slug: 'fast-chargers',
    parentGroup: 'Charging & Power',
    parentSlug: 'charging-power',
    expectedFilename: 'charging-power/fast-chargers.jpg',
    image: '/images/electronics/charging-power/fast-chargers.jpg',
    description:
      'Compact USB-C and multi-port fast charging wall adapters built for safe high-efficiency power delivery.',
    keywords: ['fast charger', 'wall adapter', 'usb-c charger', 'gan charger'],
  },
  {
    name: 'Wireless Chargers',
    slug: 'wireless-chargers',
    parentGroup: 'Charging & Power',
    parentSlug: 'charging-power',
    expectedFilename: 'charging-power/wireless-chargers.jpg',
    description:
      'Slim wireless charging pads and bedside docks for cable-free drop-and-charge device convenience.',
    keywords: ['wireless charger', 'charging pad', 'inductive charger', 'charging dock'],
  },
  {
    name: 'Charging Cables',
    slug: 'charging-cables',
    parentGroup: 'Charging & Power',
    parentSlug: 'charging-power',
    expectedFilename: 'charging-power/charging-cables.jpg',
    description:
      'Durable braided USB-C and multi-connector charging and data sync cables reinforced at stress points.',
    keywords: ['charging cable', 'usb-c cable', 'data cable', 'fast charge cable'],
  },
  {
    name: 'Car Chargers',
    slug: 'car-chargers',
    parentGroup: 'Charging & Power',
    parentSlug: 'charging-power',
    expectedFilename: 'charging-power/car-chargers.jpg',
    description:
      'Low-profile dual-port vehicle socket charging adapters keeping phones and dash accessories topped up on the road.',
    keywords: ['car charger', 'vehicle adapter', 'auto usb charger'],
  },

  // GROUP 5 — COMPUTER ACCESSORIES (6)
  {
    name: 'Keyboards',
    slug: 'keyboards',
    parentGroup: 'Computer Accessories',
    parentSlug: 'computer-accessories',
    expectedFilename: 'computer-accessories/keyboards.jpg',
    image: '/images/electronics/computer-accessories/keyboards.jpg',
    description:
      'Full-size and compact desktop computer keyboards designed for comfortable everyday typing and desk organization.',
    keywords: ['keyboard', 'computer keyboard', 'wireless keyboard', 'office keyboard'],
  },
  {
    name: 'Wireless Mice',
    slug: 'wireless-mice',
    parentGroup: 'Computer Accessories',
    parentSlug: 'computer-accessories',
    expectedFilename: 'computer-accessories/wireless-mice.jpg',
    description:
      'Ergonomic wireless optical computer mice offering clutter-free tracking for laptops and home offices.',
    keywords: ['wireless mouse', 'computer mouse', 'bluetooth mouse', 'optical mouse'],
  },
  {
    name: 'Gaming Mice',
    slug: 'gaming-mice',
    parentGroup: 'Computer Accessories',
    parentSlug: 'computer-accessories',
    expectedFilename: 'computer-accessories/gaming-mice.jpg',
    description:
      'Sculpted high-precision ergonomic gaming mice built with responsive side switches and balanced glide.',
    keywords: ['gaming mouse', 'gaming mice', 'ergonomic mouse'],
  },
  {
    name: 'Webcams',
    slug: 'webcams',
    parentGroup: 'Computer Accessories',
    parentSlug: 'computer-accessories',
    expectedFilename: 'computer-accessories/webcams.jpg',
    description:
      'Clip-on desktop webcams with integrated microphones for sharp online classes, meetings, and streaming.',
    keywords: ['webcam', 'desktop camera', 'video call camera'],
  },
  {
    name: 'USB Hubs',
    slug: 'usb-hubs',
    parentGroup: 'Computer Accessories',
    parentSlug: 'computer-accessories',
    expectedFilename: 'computer-accessories/usb-hubs.jpg',
    image: '/images/electronics/computer-accessories/usb-hubs.jpg',
    description:
      'Sleek aluminum multi-port USB hubs expanding laptop connectivity for peripherals, displays, and memory cards.',
    keywords: ['usb hub', 'usb-c hub', 'multiport adapter', 'docking hub'],
  },
  {
    name: 'Laptop Stands',
    slug: 'laptop-stands',
    parentGroup: 'Computer Accessories',
    parentSlug: 'computer-accessories',
    expectedFilename: 'computer-accessories/laptop-stands.jpg',
    description:
      'Foldable ventilated aluminum laptop risers engineered for improved desk posture and passive notebook cooling.',
    keywords: ['laptop stand', 'notebook riser', 'desk stand'],
  },

  // GROUP 6 — STORAGE DEVICES (4)
  {
    name: 'USB Flash Drives',
    slug: 'usb-flash-drives',
    parentGroup: 'Storage Devices',
    parentSlug: 'storage-devices',
    expectedFilename: 'storage-devices/usb-flash-drives.jpg',
    description:
      'Compact pocket USB flash drives for quick file transfers, classroom documents, and everyday backups.',
    keywords: ['usb flash drive', 'pen drive', 'thumb drive', 'usb stick'],
  },
  {
    name: 'External Hard Drives',
    slug: 'external-hard-drives',
    parentGroup: 'Storage Devices',
    parentSlug: 'storage-devices',
    expectedFilename: 'storage-devices/external-hard-drives.jpg',
    description:
      'Slim portable external hard drives offering spacious plug-and-play archive capacity for photos and backups.',
    keywords: ['external hard drive', 'portable hdd', 'hard disk'],
  },
  {
    name: 'External SSDs',
    slug: 'external-ssds',
    parentGroup: 'Storage Devices',
    parentSlug: 'storage-devices',
    expectedFilename: 'storage-devices/external-ssds.jpg',
    description:
      'Pocket-sized shock-resistant external solid-state drives built for fast media editing and portable transfers.',
    keywords: ['external ssd', 'portable ssd', 'solid state drive'],
  },
  {
    name: 'Memory Cards',
    slug: 'memory-cards',
    parentGroup: 'Storage Devices',
    parentSlug: 'storage-devices',
    expectedFilename: 'storage-devices/memory-cards.jpg',
    description:
      'Reliable SD and microSD flash memory cards paired with full-size adapters for cameras, tablets, and action gear.',
    keywords: ['memory card', 'sd card', 'microsd card', 'flash card'],
  },

  // GROUP 7 — MOBILE ACCESSORIES (5)
  {
    name: 'Phone Cases',
    slug: 'phone-cases',
    parentGroup: 'Mobile Accessories',
    parentSlug: 'mobile-accessories',
    expectedFilename: 'mobile-accessories/phone-cases.jpg',
    description:
      'Shock-absorbing matte silicone and hard-shell protective smartphone cases shaped for everyday drop defense.',
    keywords: ['phone case', 'mobile cover', 'back cover', 'protective case'],
  },
  {
    name: 'Screen Protectors',
    slug: 'screen-protectors',
    parentGroup: 'Mobile Accessories',
    parentSlug: 'mobile-accessories',
    expectedFilename: 'mobile-accessories/screen-protectors.jpg',
    description:
      'Ultra-clear edge-fit tempered glass screen guards engineered to shield smartphone displays from scratches.',
    keywords: ['screen protector', 'tempered glass', 'screen guard'],
  },
  {
    name: 'Phone Holders',
    slug: 'phone-holders',
    parentGroup: 'Mobile Accessories',
    parentSlug: 'mobile-accessories',
    expectedFilename: 'mobile-accessories/phone-holders.jpg',
    description:
      'Adjustable articulated desk and dashboard phone stands keeping displays comfortably angled hands-free.',
    keywords: ['phone holder', 'mobile stand', 'desk phone mount'],
  },
  {
    name: 'Selfie Sticks',
    slug: 'selfie-sticks',
    parentGroup: 'Mobile Accessories',
    parentSlug: 'mobile-accessories',
    expectedFilename: 'mobile-accessories/selfie-sticks.jpg',
    description:
      'Foldable telescopic aluminum selfie sticks with secure phone clamps for travel group shots and vlogging.',
    keywords: ['selfie stick', 'extendable stick', 'phone selfie pole'],
  },
  {
    name: 'Mobile Tripods',
    slug: 'mobile-tripods',
    parentGroup: 'Mobile Accessories',
    parentSlug: 'mobile-accessories',
    expectedFilename: 'mobile-accessories/mobile-tripods.jpg',
    description:
      'Compact tabletop and flexible-leg mobile tripods with rotating phone mounts for steady reels and calls.',
    keywords: ['mobile tripod', 'phone tripod', 'smartphone stand tripod'],
  },

  // GROUP 8 — GAMING ACCESSORIES (4 primary + shared Gaming Headsets canonical link = 5 placements)
  {
    name: 'Gaming Controllers',
    slug: 'gaming-controllers',
    parentGroup: 'Gaming Accessories',
    parentSlug: 'gaming-accessories',
    expectedFilename: 'gaming-accessories/gaming-controllers.jpg',
    description:
      'Ergonomic wireless gamepads featuring dual analog thumbsticks, responsive triggers, and textured grips.',
    keywords: ['gaming controller', 'gamepad', 'wireless controller', 'joystick'],
  },
  {
    name: 'Gaming Keyboards',
    slug: 'gaming-keyboards',
    parentGroup: 'Gaming Accessories',
    parentSlug: 'gaming-accessories',
    expectedFilename: 'gaming-accessories/gaming-keyboards.jpg',
    description:
      'Tactile backlit mechanical gaming keyboards engineered for responsive keystrokes and durable desktop play.',
    keywords: ['gaming keyboard', 'mechanical keyboard', 'backlit keyboard'],
  },
  {
    name: 'Gaming Mouse Pads',
    slug: 'gaming-mouse-pads',
    parentGroup: 'Gaming Accessories',
    parentSlug: 'gaming-accessories',
    expectedFilename: 'gaming-accessories/gaming-mouse-pads.jpg',
    description:
      'Extended stitched-edge micro-weave desk mats providing smooth low-friction mouse control.',
    keywords: ['gaming mouse pad', 'desk mat', 'extended mousepad'],
  },
  {
    name: 'Gaming Accessories',
    slug: 'gaming-accessories',
    parentGroup: 'Gaming Accessories',
    parentSlug: 'gaming-accessories',
    expectedFilename: 'gaming-accessories/gaming-accessories.jpg',
    description:
      'Representative console and PC gaming companion gear including thumb grips, controller charging docks, and cable bundlers.',
    keywords: ['gaming accessories', 'controller dock', 'gaming gear'],
  },

  // GROUP 9 — CAMERAS & ACCESSORIES (4)
  {
    name: 'Digital Cameras',
    slug: 'digital-cameras',
    parentGroup: 'Cameras & Accessories',
    parentSlug: 'cameras-accessories',
    expectedFilename: 'cameras-accessories/digital-cameras.jpg',
    description:
      'Compact digital cameras with retractable zoom lenses designed for crisp travel, family, and everyday photography.',
    keywords: ['digital camera', 'compact camera', 'point and shoot camera'],
  },
  {
    name: 'Action Cameras',
    slug: 'action-cameras',
    parentGroup: 'Cameras & Accessories',
    parentSlug: 'cameras-accessories',
    expectedFilename: 'cameras-accessories/action-cameras.jpg',
    description:
      'Pocket-sized rugged action cameras built for helmet mounts, cycling trails, and outdoor adventure capture.',
    keywords: ['action camera', 'sports camera', 'adventure cam'],
  },
  {
    name: 'Security Cameras',
    slug: 'security-cameras',
    parentGroup: 'Cameras & Accessories',
    parentSlug: 'cameras-accessories',
    expectedFilename: 'cameras-accessories/security-cameras.jpg',
    description:
      'Smart indoor and entryway security cameras crafted for dependable home monitoring and peace of mind.',
    keywords: ['security camera', 'cctv camera', 'indoor camera', 'wifi camera'],
  },
  {
    name: 'Camera Tripods',
    slug: 'camera-tripods',
    parentGroup: 'Cameras & Accessories',
    parentSlug: 'cameras-accessories',
    expectedFilename: 'cameras-accessories/camera-tripods.jpg',
    description:
      'Adjustable telescopic aluminum camera tripods with three-way pan heads and quick-release mounting plates.',
    keywords: ['camera tripod', 'dslr tripod', 'photography stand'],
  },

  // GROUP 10 — HOME ELECTRONICS (5)
  {
    name: 'Smart Bulbs',
    slug: 'smart-bulbs',
    parentGroup: 'Home Electronics',
    parentSlug: 'home-electronics',
    expectedFilename: 'home-electronics/smart-bulbs.jpg',
    description:
      'App-controllable Wi-Fi smart LED bulbs offering tunable warm-to-cool ambient home illumination.',
    keywords: ['smart bulb', 'smart led bulb', 'wifi light bulb'],
  },
  {
    name: 'LED Lights',
    slug: 'led-lights',
    parentGroup: 'Home Electronics',
    parentSlug: 'home-electronics',
    expectedFilename: 'home-electronics/led-lights.jpg',
    description:
      'Flexible LED ambient strip lights and sleek indoor fixtures for modern workspace and room lighting.',
    keywords: ['led lights', 'led strip light', 'home lighting'],
  },
  {
    name: 'Extension Boards',
    slug: 'extension-boards',
    parentGroup: 'Home Electronics',
    parentSlug: 'home-electronics',
    expectedFilename: 'home-electronics/extension-boards.jpg',
    description:
      'Multi-socket surge-protected power extension strips with individual master switches for tidy workstation wiring.',
    keywords: ['extension board', 'power strip', 'spike buster', 'surge protector'],
  },
  {
    name: 'Smart Plugs',
    slug: 'smart-plugs',
    parentGroup: 'Home Electronics',
    parentSlug: 'home-electronics',
    expectedFilename: 'home-electronics/smart-plugs.jpg',
    description:
      'Compact Wi-Fi smart electrical socket plugs enabling scheduled appliance control from your phone.',
    keywords: ['smart plug', 'wifi socket', 'smart outlet'],
  },
  {
    name: 'Wi-Fi Routers',
    slug: 'wifi-routers',
    parentGroup: 'Home Electronics',
    parentSlug: 'home-electronics',
    expectedFilename: 'home-electronics/wifi-routers.jpg',
    description:
      'Multi-antenna dual-band wireless internet routers built for steady home and small-office Wi-Fi coverage.',
    keywords: ['wifi router', 'wi-fi router', 'wireless router', 'internet router'],
  },
];

export const INITIAL_ELECTRONICS_COLLECTIONS: ElectronicsCollection[] =
  RAW_ELECTRONICS_COLLECTIONS.map((item, idx) => ({
    id: `el-${item.slug}`,
    name: item.name,
    slug: item.slug,
    parentGroup: item.parentGroup,
    parentSlug: item.parentSlug,
    ...(item.additionalGroups ? { additionalGroups: item.additionalGroups } : {}),
    image: item.image || '',
    expectedFilename: item.expectedFilename,
    imageStatus: item.image ? 'generated' : 'quota_pending',
    description: item.description,
    keywords: item.keywords,
    status: 'approved',
    approved: true,
    displayOrder: idx + 1,
  }));

export function mergeElectronicsCollections(
  persisted: Partial<ElectronicsCollection>[] = []
): ElectronicsCollection[] {
  const persistedById = new Map<string, Partial<ElectronicsCollection>>();
  for (const item of Array.isArray(persisted) ? persisted : []) {
    if (item && item.id) {
      persistedById.set(item.id.toLowerCase(), item);
    }
  }

  return INITIAL_ELECTRONICS_COLLECTIONS.map((seed) => {
    const existing = persistedById.get(seed.id.toLowerCase());
    if (!existing) return seed;

    const status =
      existing.status === 'pending_approval' || existing.approved === false
        ? 'pending_approval'
        : 'approved';
    const rawExistingImage =
      typeof existing.image === 'string' && existing.image.trim()
        ? existing.image.trim()
        : '';
    const normalizedExistingImage = rawExistingImage.startsWith('/images/electronics/')
      ? rawExistingImage.replace(/\.webp$/i, '.jpg')
      : rawExistingImage;
    const nextImage = normalizedExistingImage || seed.image;
    const nextImageStatus = !nextImage
      ? 'quota_pending'
      : nextImage.startsWith('/uploads/')
        ? 'uploaded'
        : 'generated';

    return {
      ...seed,
      ...existing,
      id: seed.id,
      slug: seed.slug,
      parentGroup: seed.parentGroup,
      parentSlug: seed.parentSlug,
      ...(seed.additionalGroups ? { additionalGroups: seed.additionalGroups } : {}),
      expectedFilename: seed.expectedFilename,
      name:
        typeof existing.name === 'string' && existing.name.trim()
          ? existing.name.trim()
          : seed.name,
      description:
        typeof existing.description === 'string' && existing.description.trim()
          ? existing.description.trim()
          : seed.description,
      image: nextImage,
      imageStatus: nextImageStatus,
      keywords:
        Array.isArray(existing.keywords) && existing.keywords.length > 0
          ? existing.keywords
          : seed.keywords,
      status,
      approved: status === 'approved',
      displayOrder: seed.displayOrder,
    };
  });
}

export function getElectronicsGroupsForCollection(
  col: Pick<ElectronicsCollection, 'parentGroup' | 'additionalGroups'>
): ElectronicsGroupCategory[] {
  return [col.parentGroup, ...(col.additionalGroups || [])];
}

export function electronicsCollectionBelongsToGroup(
  col: Pick<ElectronicsCollection, 'parentGroup' | 'parentSlug' | 'additionalGroups'>,
  groupNameOrSlug: string
): boolean {
  const clean = (groupNameOrSlug || '').toLowerCase().trim();
  if (!clean || clean === 'all') return true;
  if (
    col.parentGroup.toLowerCase() === clean ||
    col.parentSlug.toLowerCase() === clean
  ) {
    return true;
  }
  return (col.additionalGroups || []).some((g) => {
    if (g.toLowerCase() === clean) return true;
    const matchedGroup = ELECTRONICS_PARENT_GROUPS.find(
      (pg) => pg.name.toLowerCase() === g.toLowerCase()
    );
    return (
      matchedGroup?.slug.toLowerCase() === clean ||
      matchedGroup?.folder.toLowerCase() === clean
    );
  });
}

export function getElectronicsCollectionPath(
  col: Pick<ElectronicsCollection, 'parentSlug' | 'slug'>,
  contextGroupSlug?: string
): string {
  const resolvedContext = contextGroupSlug
    ? findElectronicsGroupBySlug(contextGroupSlug)?.slug || contextGroupSlug
    : undefined;
  const groupSlug = resolvedContext || col.parentSlug;
  return `/electronics/${groupSlug}/${col.slug}`;
}

export function findElectronicsGroupBySlug(
  slugOrName?: string
): ElectronicsParentGroup | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  return ELECTRONICS_PARENT_GROUPS.find(
    (g) =>
      g.slug === clean ||
      g.folder === clean ||
      g.name.toLowerCase() === clean
  );
}

export function findElectronicsCollection(
  collections: ElectronicsCollection[],
  slugOrName?: string,
  groupSlugOrName?: string
): ElectronicsCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;

  const groupClean = (groupSlugOrName || '').toLowerCase().trim();
  const groupPool = groupClean
    ? collections.filter((c) => electronicsCollectionBelongsToGroup(c, groupClean))
    : collections;
  const pool = groupPool.length > 0 ? groupPool : collections;

  return (
    pool.find(
      (c) =>
        c.slug.toLowerCase() === clean ||
        c.id.toLowerCase() === clean ||
        c.id.toLowerCase() === `el-${clean}` ||
        c.name.toLowerCase() === clean
    ) ||
    collections.find(
      (c) =>
        c.slug.toLowerCase() === clean ||
        c.id.toLowerCase() === clean ||
        c.id.toLowerCase() === `el-${clean}` ||
        c.name.toLowerCase() === clean
    )
  );
}

export function productMatchesElectronicsCollection(
  product: Product,
  collection: ElectronicsCollection
): boolean {
  if ((product.category || '').toLowerCase().trim() !== 'electronics') {
    return false;
  }

  const subLower = (product.subcategory || '').toLowerCase().trim();
  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
  const colNameLower = collection.name.toLowerCase();
  const colSlugLower = collection.slug.toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase().trim());

  // Direct subSubcategory / subcategory / tag match
  if (
    subSubLower === colNameLower ||
    subSubLower === colSlugLower ||
    subLower === colNameLower ||
    subLower === colSlugLower ||
    tags.includes(colNameLower) ||
    tags.includes(colSlugLower) ||
    tags.includes(collection.id.toLowerCase())
  ) {
    return true;
  }

  // If product explicitly specifies a different Electronics sub-type in subSubcategory, do not cross-match
  const allGroupsLower = getElectronicsGroupsForCollection(collection).map((g) =>
    g.toLowerCase()
  );
  if (subSubLower && !allGroupsLower.includes(subSubLower)) {
    return false;
  }

  const haystack = [
    product.name,
    product.shortDescription,
    product.description,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  return collection.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}
