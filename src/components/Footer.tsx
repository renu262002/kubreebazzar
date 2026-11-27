import { useMemo, useState } from 'react';
import { ChevronDown, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  GOOGLE_MAPS_DIRECTIONS_URL,
  OFFICIAL_ADDRESS_LINES,
  OFFICIAL_BUSINESS_NAME,
  OFFICIAL_PHONE_NUMBERS,
} from '../data/businessContact';
import {
  buildCategoryTree,
  getCategoryDisplayName,
} from '../data/categoryHierarchy';
import { KubreeBazzarLogo } from './KubreeBazzarLogo';

interface FooterLinkItem {
  label: string;
  path: string;
}

interface CoreCategorySpec {
  id: string;
  fallbackLabel: string;
  fallbackPath: string;
}

const SHOPPING_CATEGORY_SPECS: CoreCategorySpec[] = [
  { id: 'Groceries', fallbackLabel: 'Groceries', fallbackPath: '/groceries' },
  { id: 'Fashion', fallbackLabel: 'Fashion', fallbackPath: '/fashion' },
  {
    id: 'Electronics',
    fallbackLabel: 'Electronics',
    fallbackPath: '/electronics',
  },
  { id: 'Kids', fallbackLabel: 'Kids', fallbackPath: '/kids' },
  { id: 'Teenager', fallbackLabel: 'Teenagers', fallbackPath: '/teenagers' },
  { id: 'Baby Kit', fallbackLabel: 'Baby Kit', fallbackPath: '/baby-kit' },
  {
    id: 'School Kit',
    fallbackLabel: 'School Kit',
    fallbackPath: '/school-kit',
  },
  {
    id: 'Temple',
    fallbackLabel: 'Temple & Pooja Essentials',
    fallbackPath: '/temple-pooja-essentials',
  },
  {
    id: 'Used Bikes and Cars',
    fallbackLabel: 'Used Bikes & Cars',
    fallbackPath: '/used-bikes-and-cars',
  },
];

const MORE_CATEGORY_SPECS: CoreCategorySpec[] = [
  { id: 'Dry Nuts', fallbackLabel: 'Nuts', fallbackPath: '/nuts' },
  {
    id: 'Dry Fruits',
    fallbackLabel: 'Dried Fruits',
    fallbackPath: '/dried-fruits',
  },
  {
    id: 'Dry Peas',
    fallbackLabel: 'Dried Peas',
    fallbackPath: '/dried-peas',
  },
  { id: 'Hair Care', fallbackLabel: 'Hair Care', fallbackPath: '/hair-care' },
  { id: 'Skin Care', fallbackLabel: 'Skin Care', fallbackPath: '/skin-care' },
  { id: 'Furniture', fallbackLabel: 'Furniture', fallbackPath: '/furniture' },
  {
    id: 'Prank Items',
    fallbackLabel: 'Pranks & Novelties',
    fallbackPath: '/pranks-novelties',
  },
  { id: 'Gym', fallbackLabel: 'Fitness & Gym', fallbackPath: '/fitness-gym' },
  { id: 'Sports', fallbackLabel: 'Sports', fallbackPath: '/sports' },
  {
    id: 'Accessories',
    fallbackLabel: 'Accessories',
    fallbackPath: '/accessories',
  },
  { id: 'Footwear', fallbackLabel: 'Footwear', fallbackPath: '/footwear' },
];

type AccordionKey = 'shopping' | 'more' | 'quick' | 'support';

export function Footer() {
  const { navigate, categories, settings } = useStore();
  const [openSection, setOpenSection] = useState<AccordionKey | null>(
    'shopping'
  );

  const currentYear = new Date().getFullYear();

  const { shoppingCategoryLinks, moreCategoryLinks } = useMemo(() => {
    const activeTree = buildCategoryTree(categories);

    const resolveSpec = (spec: CoreCategorySpec): FooterLinkItem | null => {
      const matchedNode = activeTree.find(
        (node) =>
          node.id.toLowerCase() === spec.id.toLowerCase() ||
          `/${node.slug.toLowerCase()}` === spec.fallbackPath.toLowerCase()
      );

      // Respect inactive status if runtime categories have explicitly deactivated this category
      if (!matchedNode && categories.length > 0) {
        const deactivated = categories.find(
          (cat) =>
            cat.id.toLowerCase() === spec.id.toLowerCase() &&
            cat.status === 'inactive'
        );
        if (deactivated) return null;
      }

      const displayLabel = matchedNode
        ? getCategoryDisplayName(matchedNode.id, categories) ||
          matchedNode.name ||
          spec.fallbackLabel
        : spec.fallbackLabel;

      return {
        label: displayLabel,
        path: matchedNode?.path || spec.fallbackPath,
      };
    };

    const shopping = SHOPPING_CATEGORY_SPECS.map(resolveSpec).filter(
      (item): item is FooterLinkItem => item !== null
    );
    shopping.push({ label: 'View All Categories', path: '/collections' });

    const more = MORE_CATEGORY_SPECS.map(resolveSpec).filter(
      (item): item is FooterLinkItem => item !== null
    );

    // Append any extra active top-level categories created in Admin without duplication
    const coreIdsLower = new Set(
      [...SHOPPING_CATEGORY_SPECS, ...MORE_CATEGORY_SPECS].map((s) =>
        s.id.toLowerCase()
      )
    );
    const corePathsLower = new Set(
      [...SHOPPING_CATEGORY_SPECS, ...MORE_CATEGORY_SPECS].map((s) =>
        s.fallbackPath.toLowerCase()
      )
    );

    activeTree.forEach((node) => {
      if (
        !coreIdsLower.has(node.id.toLowerCase()) &&
        !corePathsLower.has(node.path.toLowerCase())
      ) {
        more.push({
          label:
            getCategoryDisplayName(node.id, categories) || node.name || node.id,
          path: node.path,
        });
      }
    });

    return {
      shoppingCategoryLinks: shopping,
      moreCategoryLinks: more,
    };
  }, [categories]);

  const quickLinks: FooterLinkItem[] = useMemo(
    () => [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Full Catalog', path: '/shop' },
      { label: 'Wishlist', path: '/wishlist' },
      { label: 'My Account', path: '/profile' },
      { label: 'Cart', path: '/cart' },
      { label: 'Track Order', path: '/orders' },
      { label: 'Offers', path: '/offers' },
    ],
    []
  );

  const supportLinks: FooterLinkItem[] = useMemo(
    () => [
      { label: 'Help / Support', path: '/help' },
      { label: 'Shipping & Delivery', path: '/shipping-policy' },
      { label: 'Return & Refund Policy', path: '/return-policy' },
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'FAQ', path: '/faq' },
    ],
    []
  );

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    navigate(path);
  };

  const renderDesktopLink = (item: FooterLinkItem, isHighlight = false) => (
    <li key={`${item.label}-${item.path}`}>
      <a
        href={item.path}
        onClick={(e) => handleNavigate(e, item.path)}
        className={`inline-block text-sm leading-snug transition-colors duration-150 focus-visible:outline-none focus-visible:underline ${
          isHighlight
            ? 'font-semibold text-[#1D6FD8] hover:text-[#FF6B1A]'
            : 'text-[#334155] hover:text-[#1D6FD8]'
        }`}
      >
        {item.label}
      </a>
    </li>
  );

  const renderMobileAccordion = (
    key: AccordionKey,
    title: string,
    items: FooterLinkItem[],
    highlightLast = false
  ) => {
    const isOpen = openSection === key;
    return (
      <div className="border-b border-[#DCE6F2]">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setOpenSection(isOpen ? null : key)}
          className="w-full min-h-[48px] py-3.5 flex items-center justify-between text-left gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D6FD8]/40 rounded"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B3B78]">
            {title}
          </span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 text-[#1D6FD8] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <ul className="pb-4 pt-0.5 grid grid-cols-1 gap-1.5">
            {items.map((item, idx) => {
              const isHighlight = highlightLast && idx === items.length - 1;
              return (
                <li key={`${item.label}-${item.path}`}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNavigate(e, item.path)}
                    className={`flex items-center min-h-[36px] py-1 text-sm transition-colors ${
                      isHighlight
                        ? 'font-semibold text-[#1D6FD8] hover:text-[#FF6B1A]'
                        : 'text-[#334155] hover:text-[#1D6FD8]'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  const contactEmail = settings?.contactEmail?.trim() || 'care@kubreebazzar.in';

  return (
    <footer className="border-t border-[#DCE6F2] bg-[#F0F6FF] mt-12 sm:mt-20 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10">
        {/* Mobile Layout: Single column + Expandable Accordions */}
        <div className="md:hidden">
          <div className="pb-6 border-b border-[#DCE6F2]">
            <KubreeBazzarLogo size="lg" onClick={() => navigate('/')} />
            <p className="text-sm font-semibold text-[#0B3B78] mt-3">
              Everything You Need, All in One Place.
            </p>
            <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
              Groceries, Fashion, Electronics, Kids &amp; Family Essentials, and
              Used Bikes &amp; Cars across all 20 collections.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#FF6B1A]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B3B78] transition-colors"
              >
                Instagram
              </a>
              <span aria-hidden="true" className="text-[#94A3B8]">
                ·
              </span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B3B78] transition-colors"
              >
                Facebook
              </a>
              <span aria-hidden="true" className="text-[#94A3B8]">
                ·
              </span>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B3B78] transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          <div className="mt-1">
            {renderMobileAccordion(
              'shopping',
              'Shopping Categories',
              shoppingCategoryLinks,
              true
            )}
            {renderMobileAccordion(
              'more',
              'More Categories',
              moreCategoryLinks
            )}
            {renderMobileAccordion('quick', 'Quick Links', quickLinks)}
            {renderMobileAccordion('support', 'Customer Support', supportLinks)}
          </div>
        </div>

        {/* Tablet & Desktop 5-Column Layout */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(0,0.85fr)_minmax(0,1.05fr)] gap-8 xl:gap-10">
          {/* Column 1: KUBREEBAZZAR */}
          <div className="md:col-span-3 lg:col-span-1">
            <KubreeBazzarLogo size="lg" onClick={() => navigate('/')} />
            <p className="text-sm font-bold text-[#0B3B78] mt-3.5">
              Everything You Need, All in One Place.
            </p>
            <p className="text-xs text-[#475569] mt-2 leading-relaxed max-w-xs">
              Explore 20 curated collections from daily groceries, fashion, and
              electronics to baby kits, school kits, and verified used vehicles.
            </p>

            <div className="mt-5 flex items-center gap-3.5 text-xs font-semibold text-[#FF6B1A]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B3B78] transition-colors"
              >
                Instagram
              </a>
              <span aria-hidden="true" className="text-[#94A3B8]">
                ·
              </span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B3B78] transition-colors"
              >
                Facebook
              </a>
              <span aria-hidden="true" className="text-[#94A3B8]">
                ·
              </span>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B3B78] transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Column 2: SHOPPING CATEGORIES */}
          <nav aria-label="Shopping Categories">
            <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider pb-2 mb-3.5 border-b border-[#DCE6F2]">
              Shopping Categories
            </h3>
            <ul className="flex flex-col gap-2.5">
              {shoppingCategoryLinks.map((item, idx) =>
                renderDesktopLink(
                  item,
                  idx === shoppingCategoryLinks.length - 1
                )
              )}
            </ul>
          </nav>

          {/* Column 3: MORE CATEGORIES */}
          <nav aria-label="More Categories">
            <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider pb-2 mb-3.5 border-b border-[#DCE6F2]">
              More Categories
            </h3>
            <ul className="flex flex-col gap-2.5">
              {moreCategoryLinks.map((item) => renderDesktopLink(item))}
            </ul>
          </nav>

          {/* Column 4: QUICK LINKS */}
          <nav aria-label="Quick Links">
            <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider pb-2 mb-3.5 border-b border-[#DCE6F2]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((item) => renderDesktopLink(item))}
            </ul>
          </nav>

          {/* Column 5: CUSTOMER SUPPORT */}
          <nav aria-label="Customer Support">
            <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider pb-2 mb-3.5 border-b border-[#DCE6F2]">
              Customer Support
            </h3>
            <ul className="flex flex-col gap-2.5">
              {supportLinks.map((item) => renderDesktopLink(item))}
            </ul>
          </nav>
        </div>
        {/* Official Contact Information Section (Single Responsive Instance) */}
        <section
          aria-label="Contact Information"
          className="mt-8 sm:mt-10 pt-7 border-t border-[#DCE6F2]"
        >
          <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[#EEF4FB]">
              <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider">
                Contact Information
              </h3>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D6FD8] hover:text-[#0B3B78] transition-colors break-all"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{contactEmail}</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Official Business Address & Get Directions */}
              <div className="lg:col-span-6 flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-[#1D6FD8] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </span>
                <div className="min-w-0 space-y-2.5">
                  <div>
                    <p className="text-sm font-bold text-[#0B3B78]">
                      {OFFICIAL_BUSINESS_NAME}
                    </p>
                    <address className="not-italic text-xs sm:text-sm text-[#475569] leading-relaxed mt-1 break-words">
                      {OFFICIAL_ADDRESS_LINES.map((line, index) => (
                        <span key={line} className="block sm:inline">
                          {line}
                          {index < OFFICIAL_ADDRESS_LINES.length - 1 ? ' ' : ''}
                        </span>
                      ))}
                    </address>
                  </div>

                  <div>
                    <a
                      href={GOOGLE_MAPS_DIRECTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-[#F0F6FF] hover:bg-[#1D6FD8] text-xs font-bold text-[#0B3B78] hover:text-white border border-[#DCE6F2] hover:border-[#1D6FD8] transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Official Mobile Numbers & Call Now Links */}
              <div className="lg:col-span-6 flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#FFF4EC] border border-[#FF6B1A]/20 text-[#FF6B1A] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-2.5">
                  <p className="text-sm font-bold text-[#0B3B78]">
                    Phone Support
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {OFFICIAL_PHONE_NUMBERS.map((phoneItem) => (
                      <div
                        key={phoneItem.telHref}
                        className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[#64748B]">
                            {phoneItem.label}
                          </p>
                          <a
                            href={phoneItem.telHref}
                            className="text-sm font-bold text-[#0B3B78] hover:text-[#1D6FD8] tabular-nums whitespace-nowrap transition-colors"
                          >
                            {phoneItem.display}
                          </a>
                        </div>
                        <a
                          href={phoneItem.telHref}
                          className="inline-flex items-center justify-center min-h-[38px] px-3 py-1.5 rounded-lg bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white whitespace-nowrap shrink-0 transition-colors"
                        >
                          Call Now
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Legal & Payment Strip */}
      <div className="border-t border-[#DCE6F2] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col lg:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5">
            <span className="font-medium text-[#0B3B78]">
              © {currentYear} KubreeBazzar. All rights reserved.
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-[#CBD5E1]">
              |
            </span>
            <a
              href="/privacy-policy"
              onClick={(e) => handleNavigate(e, '/privacy-policy')}
              className="hover:text-[#1D6FD8] transition-colors"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true" className="text-[#CBD5E1]">
              ·
            </span>
            <a
              href="/terms"
              onClick={(e) => handleNavigate(e, '/terms')}
              className="hover:text-[#1D6FD8] transition-colors"
            >
              Terms &amp; Conditions
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-3 gap-y-1.5 text-center">
            <span className="text-[#64748B]">
              Payments: Razorpay (UPI, Cards, Netbanking) · Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

