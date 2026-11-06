import { useState, useMemo } from 'react';
import {
  Search,
  Tag,
  Copy,
  Check,
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  HelpCircle,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export function SearchPage() {
  const { products } = useStore();
  const initialQ = (() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  })();
  const [query, setQuery] = useState(initialQ);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Instant Catalog Search
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614] mb-6">
          Search KubreeBazzar
        </h1>

        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-[#8C7E77] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Basmati rice, gingelly oil, forest honey, automatic watch..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[#D8CBB8] text-base text-[#1E1614] placeholder:text-[#8C7E77] focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>
      </div>

      <p className="font-mono text-xs text-[#6E6059]">
        {results.length} matching products
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export function NewArrivalsPage() {
  const { products } = useStore();
  const list = products.filter((p) => p.newArrival !== false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Latest Additions
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          New Arrivals
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export function BestSellersPage() {
  const { products } = useStore();
  const list = products.filter((p) => p.bestSeller !== false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Customer Favourites
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Best Sellers
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export function WishlistPage() {
  const { products, wishlist, navigate } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Saved Selection
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Your Wishlist ({saved.length})
        </h1>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-14 text-center">
          <Heart className="w-10 h-10 text-[#B88628] mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-[#1E1614]">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[#6E6059] mt-1">
            Save any product from the catalog to compare pack sizes and prices
            later.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-5 px-5 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white cursor-pointer"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OffersPage() {
  const { coupons, banners, products, showToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const discountedProducts = products.filter((p) => p.discountPercent > 0);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Copied code ${code}`);
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Seasonal Savings &amp; Coupons
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Active Offers &amp; Coupons
        </h1>
      </div>

      {banners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-gradient-to-br from-[#6B1D2F] to-[#4A121F] text-white p-6 space-y-2"
            >
              <p className="text-xs font-semibold text-[#E6C36A] uppercase">
                Featured Campaign
              </p>
              <h2 className="font-serif text-2xl font-bold">{b.title}</h2>
              <p className="text-sm text-white/85">{b.subtitle}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-white border border-[#E6DCD0] p-6 flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-[#B88628] font-semibold">
                <Tag className="w-3.5 h-3.5" />
                <span>
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </span>
              </div>
              <p className="font-mono text-xl font-bold text-[#1E1614] mt-1">
                {c.code}
              </p>
              <p className="text-xs text-[#6E6059] mt-1">{c.description}</p>
            </div>

            <button
              type="button"
              onClick={() => copyCode(c.code)}
              className="px-4 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedCode === c.code ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {discountedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1E1614]">
            Special Value Editions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {discountedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ContactPage() {
  const { settings, navigate, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (res.ok) {
      setSent(true);
      showToast('Inquiry received by KubreeBazzar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Customer Care &amp; Support
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Contact {settings?.brandName || 'KubreeBazzar'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Support Channels & FAQ Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1E1614]">
              Direct Support Channels
            </h2>
            <div className="space-y-3.5 text-xs text-[#5C4F49]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#6B1D2F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1E1614]">Email Support</p>
                  <p className="text-[#6E6059]">
                    {settings?.contactEmail || 'care@kaveriemporium.in'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#B88628] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1E1614]">Telephone</p>
                  <p className="font-mono text-[#6E6059]">
                    {settings?.contactPhone || '+91 44 2815 4400'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6B1D2F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1E1614]">Flagship Store</p>
                  <p className="text-[#6E6059]">
                    {settings?.contactAddress ||
                      '42 Cathedral Road, Gopalapuram, Chennai, Tamil Nadu 600086'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B88628] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1E1614]">Support Hours</p>
                  <p className="text-[#6E6059]">
                    {settings?.supportHours ||
                      'Monday – Saturday, 9:30 AM – 7:30 PM IST'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#1E1614]">
              Quick Help Shortcuts
            </h2>
            <div className="flex flex-col gap-2 text-xs">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="text-left text-[#6B1D2F] hover:text-[#521422] font-medium flex items-center justify-between py-1 cursor-pointer"
              >
                <span>Track an existing shipment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/faq')}
                className="text-left text-[#6B1D2F] hover:text-[#521422] font-medium flex items-center justify-between py-1 cursor-pointer"
              >
                <span>Browse Frequently Asked Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/return-policy')}
                className="text-left text-[#6B1D2F] hover:text-[#521422] font-medium flex items-center justify-between py-1 cursor-pointer"
              >
                <span>Read Return &amp; Refund Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Working Contact Form */}
        <div className="lg:col-span-7">
          {sent ? (
            <div className="rounded-2xl bg-white border border-[#E6DCD0] p-8 text-center space-y-3">
              <h2 className="font-serif text-2xl font-bold text-[#1E1614]">
                Message Received
              </h2>
              <p className="text-sm text-[#5C4F49]">
                Our customer care team will respond to {email} within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage('');
                }}
                className="px-4 py-2 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white border border-[#E6DCD0] p-6 sm:p-8 space-y-4"
            >
              <h2 className="font-serif text-xl font-bold text-[#1E1614]">
                Send a Direct Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#5C4F49] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#5C4F49] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order inquiry, bulk rice packs, or watch sizing"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-sm font-semibold text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function FaqPage() {
  const faqs = [
    {
      q: 'How does the 360° 3D Product Viewer work?',
      a: 'Every product page includes an interactive WebGL stage where you can drag to orbit 360°, zoom in on details, switch finishes, and use the Exploded View slider to inspect packaging and watch components.',
    },
    {
      q: 'Which payment methods are supported?',
      a: 'We support Razorpay online payments (UPI, Cards, NetBanking, Wallets with server-side HMAC-SHA256 signature verification) as well as Cash on Delivery (COD).',
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders of ₹1,500 or more qualify for complimentary delivery (2–4 business days). Standard delivery is ₹99.',
    },
    {
      q: 'Can I return or exchange an item?',
      a: 'Yes. Unopened pantry items and unworn watches may be returned or exchanged within 14 days of delivery in their original sealed packaging.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Knowledge Base
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-2"
          >
            <h2 className="font-serif text-lg font-bold text-[#1E1614] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#6B1D2F] shrink-0" />
              <span>{item.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4F49] leading-relaxed pl-6">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HelpCenterPage() {
  const { navigate } = useStore();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Customer Care
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Help Center
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Order & Shipment Tracking',
            desc: 'Check real-time 5-stage fulfillment milestones using your account or checkout email.',
            path: '/orders',
          },
          {
            title: 'Shipping & Delivery',
            desc: 'Learn about dispatch timelines, protective glass-jar packaging, and free delivery thresholds.',
            path: '/shipping-policy',
          },
          {
            title: 'Returns & Refunds',
            desc: 'Review our return window, inspection process, and refund timelines.',
            path: '/return-policy',
          },
        ].map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(card.path);
              }
            }}
            className="cursor-pointer rounded-2xl bg-white border border-[#E6DCD0] hover:border-[#6B1D2F] p-6 flex flex-col justify-between transition-colors"
          >
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1E1614]">
                {card.title}
              </h2>
              <p className="text-xs text-[#6E6059] mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <span className="mt-5 text-xs font-semibold text-[#6B1D2F] inline-flex items-center gap-1">
              <span>Open Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolicyPage({
  type,
}: {
  type: 'privacy' | 'terms' | 'shipping' | 'return';
}) {
  const { settings } = useStore();
  const brand = settings?.brandName || 'KubreeBazzar';

  const content = {
    privacy: {
      title: 'Privacy Policy',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Information We Collect',
          p: `${brand} collects only the account, shipping, and order details necessary to fulfill your purchases, maintain your saved wishlist, and provide shipment tracking.`,
        },
        {
          h: '2. Payment Security',
          p: 'Online payments are processed via Razorpay with server-side HMAC-SHA256 signature verification. We never store raw payment card numbers on our servers.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Storefront Usage',
          p: `By accessing ${brand}, you agree to provide accurate shipping and contact information when placing orders.`,
        },
        {
          h: '2. Pricing & Availability',
          p: 'All product prices in INR (₹), discounts, and variant inventory levels are loaded dynamically and confirmed at checkout.',
        },
      ],
    },
    shipping: {
      title: 'Shipping Policy',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Dispatch & Transit',
          p: 'Orders are inspected and packed within 24 hours. Delivery is complimentary on orders of ₹1,500 or more (₹99 flat rate otherwise).',
        },
        {
          h: '2. Milestone Tracking',
          p: 'Every order includes 5-stage tracking from Processing and Packed through Shipped, Out for Delivery, and Delivered.',
        },
      ],
    },
    return: {
      title: 'Return & Refund Policy',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Return Window',
          p: 'Unopened food/grocery packs and unworn watches may be returned within 14 days of delivery in their original, undamaged packaging.',
        },
        {
          h: '2. Refund Processing',
          p: 'Once inspected at our fulfillment hub, refunds are issued to your original payment method within 5–7 business days.',
        },
      ],
    },
  }[type];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          {content.updated}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          {content.title}
        </h1>
      </div>

      <div className="space-y-6">
        {content.sections.map((sec) => (
          <div
            key={sec.h}
            className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-2"
          >
            <h2 className="font-serif text-xl font-bold text-[#1E1614]">
              {sec.h}
            </h2>
            <p className="text-sm text-[#5C4F49] leading-relaxed">{sec.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
