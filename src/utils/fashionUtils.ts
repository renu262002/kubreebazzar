import type { Product, ProductReview, ProductVariant } from '../types';
import { getEffectivePrice } from '../context/StoreContext';

const CLOTHING_SUBCATEGORY_KEYWORDS = [
  "men's fashion",
  "women's fashion",
  'shirts',
  't-shirts',
  'tshirts',
  'pants',
  'trousers',
  'sarees',
  'churidar',
  'lehengas',
  'tops',
  'skirts',
  'nightwear',
  'korean fashion',
  'traditional wear',
  'bottom wear',
  'shawls & stoles',
  'long coats',
  'track pants',
  'clothing',
  'apparel',
  'dresses',
  'kids wear',
  'teen wear',
  "boys' clothing",
  "girls' clothing",
  'boys clothing',
  'girls clothing',
  "boys' fashion",
  "girls' fashion",
  'boys fashion',
  'girls fashion',
  'boys wear',
  'girls wear',
];

const CLOTHING_NAME_PATTERN =
  /\b(shirt|t-shirt|tee|pant|pants|trouser|trousers|chino|chinos|jean|jeans|saree|churidar|chudithar|anarkali|kurti|kurta|lehenga|skirt|nightwear|pajama|cardigan|hoodie|frock|dress|gown|coat|blazer|shawl|stole|half-saree|ethnic wear|apparel|clothing)\b/i;

/**
 * Returns true ONLY for Fashion & Apparel / Clothing items (Men's, Women's, Kids' Clothing, Teenagers' Clothing).
 * Explicitly excludes Toys, Electronics, Groceries, Kits, Footwear, Accessories, Furniture, etc.
 */
export function isFashionClothingProduct(
  product: Pick<
    Product,
    'category' | 'subcategory' | 'subSubcategory' | 'name' | 'tags'
  >
): boolean {
  const cat = (product.category || '').trim().toLowerCase();
  if (cat === 'fashion') return true;

  if (cat === 'kids' || cat === 'teenager' || cat === 'teenagers') {
    const subHay = [
      product.subcategory || '',
      product.subSubcategory || '',
      ...(product.tags || []),
    ]
      .join(' ')
      .toLowerCase();
    if (CLOTHING_SUBCATEGORY_KEYWORDS.some((kw) => subHay.includes(kw))) {
      return true;
    }
    if (CLOTHING_NAME_PATTERN.test(product.name || '')) {
      return true;
    }
  }

  return false;
}

export function extractFashionFabric(product: Product): string | null {
  if (!Array.isArray(product.specs)) return null;
  const fabricSpec = product.specs.find((s) => {
    const label = (s.label || '').toLowerCase();
    const val = (s.value || '').toLowerCase();
    if (val.includes('kubreebazzar inspected')) return false;
    return (
      label.includes('fabric') ||
      label.includes('material') ||
      label.includes('silk') ||
      label.includes('textile')
    );
  });
  return fabricSpec?.value?.trim() || null;
}

export function extractFashionFit(product: Product): string | null {
  if (!Array.isArray(product.specs)) return null;
  const fitSpec = product.specs.find((s) =>
    /^(fit|style|cut|weave)$/i.test((s.label || '').trim())
  );
  return fitSpec?.value?.trim() || null;
}

const KNOWN_SIZE_REGEX = /^(XS|S|M|L|XL|XXL|2XL|3XL|Free Size|\d{2})$/i;

export function getVariantSize(variant: ProductVariant): string | null {
  if (variant.size && variant.size.trim()) {
    return variant.size.trim();
  }
  const text = `${variant.label || ''} ${variant.name || ''}`.trim();
  if (!text || /standard edition/i.test(text)) return null;
  if (KNOWN_SIZE_REGEX.test(text)) return text;
  const tokenMatch = text.match(
    /\b(XS|XXL|2XL|3XL|XL|S|M|L|Free Size)\b/i
  );
  return tokenMatch ? tokenMatch[1] : null;
}

export function extractFashionSizes(variants: ProductVariant[]): string[] {
  const seen = new Map<string, string>();
  for (const v of variants) {
    const size = getVariantSize(v);
    if (size) {
      const key = size.toUpperCase();
      if (!seen.has(key)) seen.set(key, size);
    }
  }
  return Array.from(seen.values());
}

export interface FashionColourOption {
  key: string;
  name: string;
  colorHex: string;
  image?: string;
}

export function extractFashionColours(
  variants: ProductVariant[]
): FashionColourOption[] {
  const map = new Map<string, FashionColourOption>();
  for (const v of variants) {
    if (!v.colorHex) continue;
    const key = v.colorHex.trim().toLowerCase();
    if (!map.has(key)) {
      const derivedName =
        v.colorName?.trim() ||
        v.name
          .replace(/\b(XS|XXL|2XL|3XL|XL|S|M|L|Free Size)\b/gi, '')
          .replace(/[-/|]+/g, ' ')
          .trim() ||
        v.colorHex;
      map.set(key, {
        key,
        name: derivedName,
        colorHex: v.colorHex,
        image: v.image,
      });
    } else if (v.image && !map.get(key)?.image) {
      const prev = map.get(key)!;
      map.set(key, { ...prev, image: v.image });
    }
  }
  return Array.from(map.values());
}

export function resolveFashionVariant(
  variants: ProductVariant[],
  selectedSize: string | null,
  selectedColourKey: string | null
): ProductVariant | undefined {
  if (!variants.length) return undefined;

  const matchesSize = (v: ProductVariant) => {
    if (!selectedSize) return true;
    const vs = getVariantSize(v);
    return vs ? vs.toLowerCase() === selectedSize.toLowerCase() : false;
  };
  const matchesColour = (v: ProductVariant) => {
    if (!selectedColourKey) return true;
    return (v.colorHex || '').trim().toLowerCase() === selectedColourKey;
  };

  return (
    variants.find(
      (v) => matchesSize(v) && matchesColour(v) && Number(v.stock || 0) > 0
    ) ||
    variants.find((v) => matchesSize(v) && matchesColour(v)) ||
    variants.find((v) => matchesColour(v) && Number(v.stock || 0) > 0) ||
    variants.find((v) => matchesSize(v) && Number(v.stock || 0) > 0) ||
    variants.find((v) => matchesColour(v)) ||
    variants.find((v) => matchesSize(v)) ||
    variants[0]
  );
}

export function getFashionPricing(
  product: Product,
  variant?: ProductVariant
): {
  sellingPrice: number;
  mrp: number;
  discountPercent: number;
  hasPrice: boolean;
  hasDiscount: boolean;
} {
  const sellingPrice = getEffectivePrice(product, variant?.id);
  const hasPrice = sellingPrice > 0;
  const baseWithDelta = Math.max(
    0,
    Number(product.price || 0) + Number(variant?.priceDelta || 0)
  );

  const mrp =
    product.originalPrice && product.originalPrice > sellingPrice
      ? Math.round(product.originalPrice)
      : hasPrice &&
          Number(product.discountPercent || 0) > 0 &&
          baseWithDelta > sellingPrice
        ? Math.round(baseWithDelta)
        : 0;

  const discountPercent =
    hasPrice && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  return {
    sellingPrice,
    mrp,
    discountPercent,
    hasPrice,
    hasDiscount: hasPrice && discountPercent > 0 && mrp > sellingPrice,
  };
}

export function getRealProductRating(
  product: Product,
  reviews: ProductReview[]
): {
  rating: number;
  reviewCount: number;
  hasRating: boolean;
} {
  const approvedReviews = reviews.filter(
    (r) => r.productId === product.id && r.approved !== false
  );
  if (approvedReviews.length > 0) {
    const avg =
      approvedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
      approvedReviews.length;
    return {
      rating: Number(avg.toFixed(1)),
      reviewCount: approvedReviews.length,
      hasRating: avg > 0,
    };
  }
  if (
    !product.isDemoRating &&
    Number(product.reviewCount || 0) > 0 &&
    Number(product.rating || 0) > 0
  ) {
    return {
      rating: Number(Number(product.rating).toFixed(1)),
      reviewCount: Number(product.reviewCount),
      hasRating: true,
    };
  }
  return { rating: 0, reviewCount: 0, hasRating: false };
}
