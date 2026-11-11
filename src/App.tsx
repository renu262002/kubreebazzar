import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { HomePage } from './pages/HomePage';
import { CategoryLandingPage } from './pages/CategoryLandingPage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { AboutPage } from './pages/AboutPage';
import { ShowroomPage } from './pages/ShowroomPage';
import {
  ShopTheLookPage,
  ComparePage,
  RewardsPage,
  BlogPage,
  BrandsPage,
} from './pages/ExperiencePages';
import {
  SearchPage,
  OffersPage,
  ContactPage,
  NewArrivalsPage,
  BestSellersPage,
  WishlistPage,
  FaqPage,
  HelpCenterPage,
  PolicyPage,
} from './pages/SecondaryPages';
import { AdminDashboard } from './pages/AdminDashboard';

function AppRouter() {
  const { route, toast } = useStore();
  const cleanPath = route.split('?')[0] || '/';

  const renderPage = () => {
    if (cleanPath === '/') return <HomePage />;
    if (cleanPath === '/rice') return <CategoryLandingPage category="Rice" />;
    if (cleanPath === '/grocery')
      return <CategoryLandingPage category="Grocery" />;
    if (cleanPath === '/honey') return <CategoryLandingPage category="Honey" />;
    if (cleanPath === '/watches')
      return <CategoryLandingPage category="Watches" />;
    if (cleanPath === '/shop' || cleanPath.startsWith('/category/'))
      return <ShopPage />;
    if (cleanPath === '/collections' || cleanPath === '/categories')
      return <CollectionsPage />;
    if (cleanPath === '/showroom') return <ShowroomPage />;
    if (cleanPath === '/shop-the-look') return <ShopTheLookPage />;
    if (cleanPath === '/compare') return <ComparePage />;
    if (cleanPath === '/rewards') return <RewardsPage />;
    if (cleanPath === '/blog') return <BlogPage />;
    if (cleanPath.startsWith('/blog/')) {
      return <BlogPage slug={cleanPath.replace('/blog/', '')} />;
    }
    if (cleanPath === '/brands') return <BrandsPage />;
    if (cleanPath.startsWith('/brands/')) {
      return <BrandsPage brandName={cleanPath.replace('/brands/', '')} />;
    }
    if (cleanPath === '/about') return <AboutPage />;
    if (cleanPath === '/new-arrivals') return <NewArrivalsPage />;
    if (cleanPath === '/best-sellers') return <BestSellersPage />;
    if (cleanPath === '/wishlist') return <WishlistPage />;
    if (cleanPath.startsWith('/product/')) {
      const slugOrId = cleanPath.replace('/product/', '');
      return <ProductDetailPage slugOrId={slugOrId} />;
    }
    if (cleanPath === '/cart') return <CartPage />;
    if (cleanPath === '/checkout') return <CheckoutPage />;
    if (cleanPath === '/auth') return <AuthPage />;
    if (cleanPath === '/profile' || cleanPath === '/account')
      return <ProfilePage />;
    if (cleanPath === '/orders') return <OrdersPage />;
    if (cleanPath === '/search') return <SearchPage />;
    if (cleanPath === '/offers') return <OffersPage />;
    if (cleanPath === '/contact') return <ContactPage />;
    if (cleanPath === '/faq') return <FaqPage />;
    if (cleanPath === '/help') return <HelpCenterPage />;
    if (cleanPath === '/privacy-policy') return <PolicyPage type="privacy" />;
    if (cleanPath === '/terms') return <PolicyPage type="terms" />;
    if (cleanPath === '/shipping-policy')
      return <PolicyPage type="shipping" />;
    if (cleanPath === '/return-policy') return <PolicyPage type="return" />;
    if (cleanPath === '/admin') return <AdminDashboard />;
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#132238]">
      <Header />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#0B3B78] border border-[#FF6B1A]/60 text-xs font-semibold text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  );
}
