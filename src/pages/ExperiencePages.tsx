import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  Scale,
  Award,
  BookOpen,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from '../components/ResilientImage';
import { ProductCard } from '../components/ProductCard';

export function ShopTheLookPage() {
  const { products, addToCart, navigate } = useStore();
  const [selectedHotspotIdx, setSelectedHotspotIdx] = useState(0);

  const lookItems = [
    {
      title: 'Royal Aged Basmati Rice (5 kg)',
      slug: 'royal-aged-basmati-rice-5kg',
      x: '26%',
      y: '38%',
      note: '24-month aged long-grain harvest',
    },
    {
      title: 'Nilgiri Wild Forest Honey',
      slug: 'nilgiri-wild-forest-raw-honey',
      x: '54%',
      y: '52%',
      note: 'Amber glass jar with brass-toned lid',
    },
    {
      title: 'Kaveri Sovereign Maroon Automatic',
      slug: 'kaveri-sovereign-maroon-automatic',
      x: '76%',
      y: '42%',
      note: 'Sapphire crystal & exhibition caseback',
    },
  ];

  const activeSpot = lookItems[selectedHotspotIdx] || lookItems[0];
  const matchedProduct =
    products.find((p) => p.slug === activeSpot.slug) || products[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-[#E6DCD0] pb-6">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Curated Household Pairing
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Shop the Collection
        </h1>
        <p className="text-sm text-[#5C4F49] mt-2">
          Click any interactive pin to inspect featured staples and timepieces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-[#E6DCD0] aspect-[16/10] bg-[#F3ECE1]">
          <ResilientImage
            src="/src/assets/images/product_grocery_spices_1793935955305.jpg"
            alt="KubreeBazzar Curated Showcase"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            aria-hidden="true"
          />

          {lookItems.map((spot, idx) => {
            const active = idx === selectedHotspotIdx;
            return (
              <button
                key={spot.slug}
                type="button"
                onClick={() => setSelectedHotspotIdx(idx)}
                style={{ left: spot.x, top: spot.y }}
                aria-label={`Select ${spot.title}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#6B1D2F] border-white text-white scale-105'
                    : 'bg-white/95 border-[#D8CBB8] text-[#1E1614] hover:border-[#6B1D2F]'
                }`}
              >
                + {spot.title.split(' ').slice(0, 2).join(' ')}
              </button>
            );
          })}
        </div>

        {matchedProduct && (
          <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E6DCD0] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between text-xs text-[#B88628] font-semibold">
              <span>Selected Item</span>
              <span>{activeSpot.note}</span>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E6DCD0]">
              <ResilientImage
                src={matchedProduct.images[0]}
                alt={matchedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-[#6E6059]">
                {matchedProduct.category} · {matchedProduct.brand}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#1E1614] mt-1">
                {matchedProduct.name}
              </h2>
              <p className="font-mono text-lg font-bold text-[#6B1D2F] mt-2">
                ₹{getEffectivePrice(matchedProduct).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  addToCart(matchedProduct, matchedProduct.variants[0]?.id, 1)
                }
                className="flex-1 py-3 px-4 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`/product/${matchedProduct.slug}`)}
                className="py-3 px-4 rounded-lg border border-[#D8CBB8] text-xs font-semibold text-[#1E1614] hover:bg-[#FAF6F0] cursor-pointer"
              >
                Inspect 3D
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ComparePage() {
  const { products, navigate, addToCart } = useStore();
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    products.slice(0, 3).map((p) => p.id)
  );

  const items = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-[#E6DCD0] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1.5">
          <Scale className="w-4 h-4" />
          <span>Side-by-Side Specification Matrix</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Product Comparison
        </h1>
        <p className="text-sm text-[#5C4F49] mt-2">
          Select any three products from our catalog to compare pricing, 3D
          inspection availability, and specifications.
        </p>
      </div>

      {items.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl bg-white border border-[#E6DCD0]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6DCD0]">
                <th className="p-4 text-[#6E6059] font-medium w-44">Feature</th>
                {items.map((item, idx) => (
                  <th key={item.id} className="p-4 min-w-[220px]">
                    <select
                      aria-label={`Compare product ${idx + 1}`}
                      value={item.id}
                      onChange={(e) => {
                        const next = [...selectedIds];
                        next[idx] = e.target.value;
                        setSelectedIds(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-xs font-semibold text-[#1E1614]"
                    >
                      {products.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DCD0]">
              <tr>
                <td className="p-4 text-[#6E6059]">Preview</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4">
                    <div className="w-32 h-24 rounded-lg overflow-hidden bg-[#FAF6F0] border border-[#E6DCD0]">
                      <ResilientImage
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[#6E6059]">Category &amp; Brand</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-[#1E1614] font-medium">
                    {item.category} · {item.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[#6E6059]">Effective Price</td>
                {items.map((item) => (
                  <td
                    key={item.id}
                    className="p-4 font-mono text-[#6B1D2F] font-bold text-sm"
                  >
                    ₹{getEffectivePrice(item).toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[#6E6059]">3D Model</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-[#1E1614]">
                    {item.has3DModel !== false || Boolean(item.glbUrl)
                      ? 'Interactive 360° 3D + Hotspots'
                      : '2D Studio Gallery'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[#6E6059]">Demo Rating</td>
                {items.map((item) => (
                  <td
                    key={item.id}
                    className="p-4 font-mono text-[#B88628] font-semibold"
                  >
                    {item.rating} ★ ({item.reviewCount} demo reviews)
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[#6E6059]">Actions</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(item, item.variants[0]?.id, 1)
                        }
                        className="px-3 py-2 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white cursor-pointer"
                      >
                        Add to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${item.slug}`)}
                        className="px-3 py-2 rounded-lg border border-[#D8CBB8] text-xs text-[#1E1614] hover:bg-[#FAF6F0] cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function RewardsPage() {
  const { user, token, navigate } = useStore();
  const [orders, setOrders] = useState<
    { id: string; orderNumber: string; total: number; createdAt: string }[]
  >([]);

  useEffect(() => {
    if (!token) {
      setOrders([]);
      return;
    }
    fetch('/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {});
  }, [token]);

  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);
  const pointsBalance = Math.round(totalSpent);
  const tier =
    pointsBalance >= 25000
      ? 'Royal Patron'
      : pointsBalance >= 5000
      ? 'Heritage Member'
      : 'Welcome Member';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E6DCD0] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1.5">
            <Award className="w-4 h-4" />
            <span>Kaveri Privilege Club · Configurable Preview</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
            Shopping Rewards
          </h1>
        </div>
        <span className="text-xs text-[#6E6059]">
          Earning Rule: 1 pt per ₹1 spent · 10 pts = ₹1 credit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6">
          <p className="text-xs text-[#6E6059]">Available Points Balance</p>
          <p className="font-mono text-3xl font-bold text-[#6B1D2F] mt-2">
            {pointsBalance.toLocaleString('en-IN')} pts
          </p>
          <p className="text-xs text-[#B88628] mt-2 font-medium">
            Estimated Value: ₹{Math.round(pointsBalance / 10).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6">
          <p className="text-xs text-[#6E6059]">Current Tier</p>
          <p className="font-serif text-2xl font-bold text-[#1E1614] mt-2">
            {tier}
          </p>
          <p className="text-xs text-[#6E6059] mt-2">
            {user ? `Member: ${user.name}` : 'Sign in to sync account points'}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6">
          <p className="text-xs text-[#6E6059]">Expiration Policy</p>
          <p className="font-serif text-2xl font-bold text-[#1E1614] mt-2">
            12 Months Rolling
          </p>
          <p className="text-xs text-[#6E6059] mt-2">
            Points remain active with any qualifying order.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#1E1614]">
          Points Transaction History
        </h2>
        {orders.length === 0 ? (
          <div className="text-xs text-[#6E6059] space-y-3">
            <p>
              No points transactions yet. Place an order to earn 1 point per
              rupee spent.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-4 py-2 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white cursor-pointer"
            >
              Explore Catalog
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E6DCD0] text-xs">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#1E1614]">
                    Order {ord.orderNumber}
                  </p>
                  <p className="text-[#6E6059]">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className="font-mono text-emerald-700 font-semibold">
                  +{Math.round(ord.total).toLocaleString('en-IN')} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const BLOG_ARTICLES = [
  {
    slug: 'choosing-the-right-rice-for-biryani-and-daily-meals',
    title: 'Choosing the Right Rice for Biryani, Daily Meals & Idli Batter',
    category: 'Rice & Harvests',
    readTime: '4 min read',
    image: '/src/assets/images/product_rice_basmati_1793935955754.jpg',
    excerpt:
      'How grain aging, amylose texture, and parboiling shape aroma and fluffiness across Basmati, Sona Masoori, and Ponni.',
    body: 'Aging Basmati paddy for 18 to 24 months reduces moisture content and firms the starch structure so each grain elongates cleanly without clumping. For everyday South Indian meals, steamed Sona Masoori offers a light, fluffy texture, while parboiled Ponni and Idli rice deliver soft, resilient batters.',
  },
  {
    slug: 'single-origin-floral-honeys-of-southern-india',
    title: 'Single-Origin Floral Honeys: Forest, Blossom & Multiflora Notes',
    category: 'Honey Conservatory',
    readTime: '3 min read',
    image: '/src/assets/images/product_honey_forest_1793935955585.jpg',
    excerpt:
      'Understanding how regional blossoms shape colour, viscosity, and flavour profiles from the Nilgiris to Coorg.',
    body: 'Honey reflects the nectar sources of its surrounding flora. Dark amber forest honey from high-altitude woodlands carries deep, malty notes, whereas lighter Coorg coffee-blossom honey offers a delicate floral finish suited to morning tea and warm toast.',
  },
  {
    slug: 'automatic-chronograph-and-dress-watches-sizing-guide',
    title: 'Automatic, Chronograph & Dress Watches: A Collector’s Sizing Guide',
    category: 'Horology',
    readTime: '4 min read',
    image: '/src/assets/images/product_watch_chronograph_1793935956352.jpg',
    excerpt:
      'Matching case diameter, lug-to-lug proportions, and strap materials to formal occasions and everyday wear.',
    body: 'When selecting a wristwatch, lug-to-lug distance matters just as much as case diameter. A 38 mm to 40 mm dress case with a slim bezel sits effortlessly under a shirt cuff, while a 42 mm chronograph with a sapphire crystal and exhibition caseback makes a bold statement.',
  },
];

export function BlogPage({ slug }: { slug?: string }) {
  const { navigate } = useStore();

  if (slug) {
    const article =
      BLOG_ARTICLES.find((a) => a.slug === slug) || BLOG_ARTICLES[0];
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#6E6059] hover:text-[#1E1614] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </button>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-[#B88628] uppercase tracking-wider">
            {article.category} · {article.readTime}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
            {article.title}
          </h1>
        </div>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#E6DCD0] bg-[#F3ECE1]">
          <ResilientImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-sm text-[#3D332E] leading-relaxed">
          <p className="text-base text-[#1E1614] font-medium">
            {article.excerpt}
          </p>
          <p>{article.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-[#E6DCD0] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1.5">
          <BookOpen className="w-4 h-4" />
          <span>Editorial Guides</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Shopping Inspiration &amp; Buying Guides
        </h1>
        <p className="text-sm text-[#5C4F49] mt-2">
          Practical notes on rice varieties, kitchen staples, floral honey, and
          horology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_ARTICLES.map((art) => (
          <article
            key={art.slug}
            onClick={() => navigate(`/blog/${art.slug}`)}
            className="group cursor-pointer rounded-2xl bg-white border border-[#E6DCD0] hover:border-[#6B1D2F] overflow-hidden flex flex-col justify-between transition-colors"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[#F3ECE1]">
              <ResilientImage
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs text-[#B88628] font-medium">
                {art.category} · {art.readTime}
              </p>
              <h2 className="font-serif text-xl font-bold text-[#1E1614] group-hover:text-[#6B1D2F] transition-colors">
                {art.title}
              </h2>
              <p className="text-xs text-[#6E6059] leading-relaxed">
                {art.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B1D2F] pt-1">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BrandsPage({ brandName }: { brandName?: string }) {
  const { products, navigate } = useStore();
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter((b): b is string => Boolean(b)))
  );
  const activeBrand = brandName ? decodeURIComponent(brandName) : '';
  const brandProducts = activeBrand
    ? products.filter(
        (p) => p.brand?.toLowerCase() === activeBrand.toLowerCase()
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-[#E6DCD0] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>In-Store Houses</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          {activeBrand || 'Featured Brands'}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((b) => {
          const count = products.filter((p) => p.brand === b).length;
          const selected = b.toLowerCase() === activeBrand.toLowerCase();
          return (
            <button
              key={b}
              type="button"
              onClick={() => navigate(`/brands/${encodeURIComponent(b)}`)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                selected
                  ? 'bg-[#FAF6F0] border-[#6B1D2F] text-[#1E1614]'
                  : 'bg-white border-[#E6DCD0] text-[#5C4F49] hover:border-[#B88628]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-[#1E1614]">
                  {b}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#6B1D2F]" />
              </div>
              <p className="text-xs text-[#6E6059] mt-1">
                {count} catalog items
              </p>
            </button>
          );
        })}
      </div>

      {activeBrand && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1E1614]">
            Products by {activeBrand} ({brandProducts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {brandProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
