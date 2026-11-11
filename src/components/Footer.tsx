import { useStore } from '../context/StoreContext';
import { KubreeBazzarLogo } from './KubreeBazzarLogo';

export function Footer() {
  const { navigate, settings } = useStore();

  const link = (label: string, path: string) => (
    <a
      href={path}
      onClick={(e) => {
        e.preventDefault();
        navigate(path);
      }}
      className="text-sm text-[#475569] hover:text-[#0B3B78] transition-colors"
    >
      {label}
    </a>
  );

  return (
    <footer className="border-t border-[#DCE6F2] bg-[#F0F6FF] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <KubreeBazzarLogo size="lg" onClick={() => navigate('/')} />
          <p className="text-xs font-bold text-[#0B3B78] mt-3">
            Your Friendly Online Shopping Bazzar!
          </p>
          <p className="text-xs text-[#475569] mt-2 leading-relaxed max-w-xs">
            Quality Rice, Everyday Grocery, Pure Honey, and Stylish Watches —
            delivered with care and a smile at KubreeBazzar.
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs font-semibold text-[#FF6B1A]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Facebook
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              YouTube
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider mb-3.5">
            Shop Categories
          </h3>
          <div className="flex flex-col gap-2.5">
            {link('Rice', '/rice')}
            {link('Grocery', '/grocery')}
            {link('Honey', '/honey')}
            {link('Watches', '/watches')}
            {link('All Products', '/shop')}
            {link('Special Offers', '/offers')}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider mb-3.5">
            Customer Care
          </h3>
          <div className="flex flex-col gap-2.5">
            {link('About Us', '/about')}
            {link('Contact Us', '/contact')}
            {link('Order Tracking', '/orders')}
            {link('FAQ', '/faq')}
            {link('Help Center', '/help')}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#0B3B78] uppercase tracking-wider mb-3.5">
            Policies &amp; Account
          </h3>
          <div className="flex flex-col gap-2.5">
            {link('My Account', '/profile')}
            {link('Wishlist', '/wishlist')}
            {link('Privacy Policy', '/privacy-policy')}
            {link('Terms & Conditions', '/terms')}
            {link('Shipping Policy', '/shipping-policy')}
            {link('Admin Dashboard', '/admin')}
          </div>
        </div>
      </div>

      <div className="border-t border-[#DCE6F2] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <span>
            © 2026 KubreeBazzar. All rights reserved.
          </span>
          <span>
            {settings?.contactEmail || 'care@kubreebazzar.in'} ·{' '}
            {settings?.contactPhone || '+91 44 2815 4400'}
          </span>
        </div>
      </div>
    </footer>
  );
}
