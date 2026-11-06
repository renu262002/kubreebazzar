import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type {
  Product,
  CategoryInfo,
  User,
  CartItem,
  Coupon,
  PromoBanner,
  ProductReview,
  SiteSettings,
} from '../types';

interface StoreContextValue {
  route: string;
  navigate: (path: string) => void;
  products: Product[];
  categories: CategoryInfo[];
  coupons: Coupon[];
  banners: PromoBanner[];
  reviews: ProductReview[];
  settings: SiteSettings | null;
  loadingProducts: boolean;
  refreshCatalog: () => Promise<void>;
  user: User | null;
  token: string | null;
  setSession: (token: string | null, user: User | null) => void;
  logout: () => void;
  cart: CartItem[];
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  updateCartQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  recentlyViewed: string[];
  recordRecentlyViewed: (productId: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function getEffectivePrice(product: Product, variantId?: string): number {
  const variant =
    product.variants.find((v) => v.id === variantId) || product.variants[0];
  const base = product.price + (variant ? variant.priceDelta : 0);
  const discounted = base * (1 - (product.discountPercent || 0) / 100);
  return Number(discounted.toFixed(2));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('aetheria_token')
  );
  const [user, setUser] = useState<User | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('aetheria_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const [guestWishlist, setGuestWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('aetheria_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('aetheria_recent');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const navigate = useCallback((path: string) => {
    const current = window.location.pathname + window.location.search;
    if (current !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const refreshCatalog = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const [prodRes, catRes, offRes, revRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/offers'),
        fetch('/api/reviews'),
        fetch('/api/settings'),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (offRes.ok) {
        const off = await offRes.json();
        setCoupons(off.coupons || []);
        setBanners(off.banners || []);
      }
      if (revRes.ok) setReviews(await revRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('aetheria_token');
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const setSession = useCallback(
    (newToken: string | null, newUser: User | null) => {
      if (newToken) {
        localStorage.setItem('aetheria_token', newToken);
      } else {
        localStorage.removeItem('aetheria_token');
      }
      setToken(newToken);
      setUser(newUser);
    },
    []
  );

  const logout = useCallback(() => {
    setSession(null, null);
    showToast('Signed out of Aetheria');
    navigate('/');
  }, [setSession, showToast, navigate]);

  useEffect(() => {
    localStorage.setItem('aetheria_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, variantId?: string, quantity = 1) => {
      const chosenVariant = variantId || product.variants[0]?.id || 'default';
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === product.id && i.variantId === chosenVariant
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + quantity,
          };
          return next;
        }
        return [
          ...prev,
          { productId: product.id, variantId: chosenVariant, quantity },
        ];
      });
      setCartDrawerOpen(true);
      showToast(`Added ${product.name} to bag`);
    },
    [showToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) =>
          prev.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          )
        );
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i
        )
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, variantId: string) => {
      setCart((prev) =>
        prev.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const enrichedCart = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = enrichedCart.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + getEffectivePrice(item.product, item.variantId) * item.quantity;
  }, 0);

  const wishlist = user ? user.wishlist : guestWishlist;

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (user && token) {
        const res = await fetch('/api/users/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          const data = await res.json();
          setUser((u) => (u ? { ...u, wishlist: data.wishlist } : u));
          showToast(
            data.wishlist.includes(productId)
              ? 'Saved to wishlist'
              : 'Removed from wishlist'
          );
        }
      } else {
        setGuestWishlist((prev) => {
          const exists = prev.includes(productId);
          const next = exists
            ? prev.filter((id) => id !== productId)
            : [...prev, productId];
          localStorage.setItem('aetheria_wishlist', JSON.stringify(next));
          showToast(exists ? 'Removed from wishlist' : 'Saved to wishlist');
          return next;
        });
      }
    },
    [user, token, showToast]
  );

  const recordRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(
        0,
        8
      );
      localStorage.setItem('aetheria_recent', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        route,
        navigate,
        products,
        categories,
        coupons,
        banners,
        reviews,
        settings,
        loadingProducts,
        refreshCatalog,
        user,
        token,
        setSession,
        logout,
        cart: enrichedCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal: Number(cartSubtotal.toFixed(2)),
        wishlist,
        toggleWishlist,
        recentlyViewed,
        recordRecentlyViewed,
        quickViewProduct,
        setQuickViewProduct,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
