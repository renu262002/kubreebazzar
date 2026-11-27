import type { Product } from '../types';

export function resolveProductGlb(product: Product | null | undefined): string | null {
  if (!product) return null;
  if (product.glbUrl && product.glbUrl.trim().length > 0) {
    return product.glbUrl.trim();
  }

  const slug = (product.slug || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (slug.includes('rice') || sub.includes('rice') || name.includes('basmati') || name.includes('ponni')) {
    return '/models/rice-bag.glb';
  }
  if (slug.includes('honey') || name.includes('honey')) {
    return '/models/honey-jar.glb';
  }
  if (
    slug.includes('cardamom') ||
    slug.includes('cloves') ||
    slug.includes('cinnamon') ||
    slug.includes('cumin') ||
    name.includes('spice')
  ) {
    return '/models/spice-containers.glb';
  }
  if (cat.includes('watch') || name.includes('watch') || slug.includes('watch')) {
    return '/models/wristwatch.glb';
  }
  if (cat === 'footwear' || name.includes('shoe') || name.includes('sneaker')) {
    return '/models/fashion-shoe.glb';
  }
  if (name.includes('handbag') || name.includes('tote') || name.includes('purse')) {
    return '/models/fashion-handbag.glb';
  }
  if (cat === 'electronics' || name.includes('headphone') || name.includes('earbud') || name.includes('audio')) {
    return '/models/headphones.glb';
  }
  if (cat === 'baby kit' || cat === 'baby' || name.includes('bottle')) {
    return '/models/baby-essentials.glb';
  }
  if (cat === 'school kit' || cat === 'school' || name.includes('backpack') || name.includes('school bag')) {
    return '/models/school-backpack.glb';
  }
  if (cat === 'sports' || cat === 'gym' || name.includes('cricket') || name.includes('football')) {
    return '/models/sports-gear.glb';
  }
  if (cat === 'groceries' || cat === 'dry nuts' || cat === 'dry fruits' || cat === 'dry peas') {
    return '/models/grocery-basket.glb';
  }
  if (cat === 'fashion') {
    return '/models/shopping-bag.glb';
  }
  return null;
}

export function resolveCategoryFallbackImage(categoryId: string): string {
  const id = (categoryId || '').toLowerCase();
  if (id.includes('whole')) return '/images/categories/whole-spices.jpg';
  if (id.includes('masala')) return '/images/categories/masala-powders.jpg';
  if (id.includes('grocer')) return '/images/categories/groceries.jpg';
  if (id.includes('access')) return '/images/categories/accessories.jpg';
  if (id.includes('footwear')) return '/images/categories/footwear.jpg';
  if (id.includes('electron')) return '/images/categories/electronics.jpg';
  if (id.includes('furniture')) return '/images/categories/furniture.jpg';
  if (id.includes('skin')) return '/images/categories/skin-care.jpg';
  if (id.includes('hair')) return '/images/categories/hair-care.jpg';
  if (id.includes('gym') || id.includes('fitness')) return '/images/categories/fitness-gym.jpg';
  if (id.includes('sports')) return '/images/categories/sports.jpg';
  if (id.includes('fashion')) return '/images/categories/fashion.jpg';
  if (id.includes('prank')) return '/images/categories/pranks-novelties.jpg';
  if (id.includes('used')) return '/images/categories/used-bikes-cars.jpg';
  if (id.includes('nut')) return '/images/categories/nuts.jpg';
  if (id.includes('fruit')) return '/images/categories/dried-fruits.jpg';
  if (id.includes('pea')) return '/images/categories/dried-peas.jpg';
  if (id.includes('temple')) return '/images/temple-kit/basket.png';
  if (id.includes('baby kit') || id.includes('baby-kit')) {
    return '/images/baby-kit/baby powder.png';
  }
  if (id.includes('school')) return '/images/school-kit/school bag.png';
  if (id.includes('kid')) return '/images/categories/kids.jpg';
  if (id.includes('teen')) return '/images/categories/teenagers.jpg';
  return '/images/categories/groceries.jpg';
}
