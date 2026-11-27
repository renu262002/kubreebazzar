import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  MensFashionCollection,
  WomensFashionCollection,
  ElectronicsCollection,
  DriedFruitCollection,
  NutCollection,
  SkinCareCollection,
  HairCareCollection,
  FurnitureCollection,
  DriedPeasCollection,
  PranksNoveltiesCollection,
  FitnessGymCollection,
  AccessoriesCollection,
  SportsCollection,
  FootwearCollection,
  TeenagersCollection,
  KidsCollection,
} from '../types';
import {
  INITIAL_CATEGORIES,
  generate48Products,
} from '../data/catalogSeed';
import {
  INITIAL_MENS_FASHION_COLLECTIONS,
  mergeMensFashionCollections,
} from '../data/mensFashionCollections';
import {
  INITIAL_WOMENS_FASHION_COLLECTIONS,
  mergeWomensFashionCollections,
} from '../data/womensFashionCollections';
import {
  INITIAL_ELECTRONICS_COLLECTIONS,
  mergeElectronicsCollections,
} from '../data/electronicsCollections';
import {
  INITIAL_DRIED_FRUITS_COLLECTIONS,
  mergeDriedFruitsCollections,
} from '../data/driedFruitsCollections';
import {
  INITIAL_NUTS_COLLECTIONS,
  mergeNutsCollections,
} from '../data/nutsCollections';
import {
  INITIAL_SKIN_CARE_COLLECTIONS,
  mergeSkinCareCollections,
} from '../data/skinCareCollections';
import {
  INITIAL_HAIR_CARE_COLLECTIONS,
  mergeHairCareCollections,
} from '../data/hairCareCollections';
import {
  INITIAL_FURNITURE_COLLECTIONS,
  mergeFurnitureCollections,
} from '../data/furnitureCollections';
import {
  INITIAL_DRIED_PEAS_COLLECTIONS,
  mergeDriedPeasCollections,
} from '../data/driedPeasCollections';
import {
  INITIAL_PRANKS_NOVELTIES_COLLECTIONS,
  mergePranksNoveltiesCollections,
} from '../data/pranksNoveltiesCollections';
import {
  INITIAL_FITNESS_GYM_COLLECTIONS,
  mergeFitnessGymCollections,
} from '../data/fitnessGymCollections';
import {
  INITIAL_ACCESSORIES_COLLECTIONS,
  mergeAccessoriesCollections,
} from '../data/accessoriesCollections';
import {
  INITIAL_SPORTS_COLLECTIONS,
  mergeSportsCollections,
} from '../data/sportsCollections';
import {
  INITIAL_FOOTWEAR_COLLECTIONS,
  mergeFootwearCollections,
} from '../data/footwearCollections';
import {
  INITIAL_TEENAGERS_COLLECTIONS,
  mergeTeenagersCollections,
} from '../data/teenagersCollections';
import {
  INITIAL_KIDS_COLLECTIONS,
  mergeKidsCollections,
} from '../data/kidsCollections';
import { apiFetch, buildApiHeaders } from '../utils/apiClient';

export type AuthModalTab = 'login' | 'signup' | 'forgot' | 'reset';

export type PendingAuthAction =
  | {
      type: 'addToCart';
      productId: string;
      variantId?: string;
      quantity: number;
      redirectTo?: string;
    }
  | {
      type: 'toggleWishlist';
      productId: string;
      redirectTo?: string;
    }
  | {
      type: 'navigate';
      path: string;
    };

export interface AuthResult {
  ok: boolean;
  error?: string;
  message?: string;
  verificationRequired?: boolean;
  devResetToken?: string;
  user?: User;
}

interface AddToCartOptions {
  redirectTo?: string;
}

interface StoreContextValue {
  route: string;
  navigate: (path: string) => void;
  products: Product[];
  categories: CategoryInfo[];
  mensFashionCollections: MensFashionCollection[];
  womensFashionCollections: WomensFashionCollection[];
  electronicsCollections: ElectronicsCollection[];
  driedFruitsCollections: DriedFruitCollection[];
  nutsCollections: NutCollection[];
  skinCareCollections: SkinCareCollection[];
  hairCareCollections: HairCareCollection[];
  furnitureCollections: FurnitureCollection[];
  driedPeasCollections: DriedPeasCollection[];
  pranksNoveltiesCollections: PranksNoveltiesCollection[];
  fitnessGymCollections: FitnessGymCollection[];
  accessoriesCollections: AccessoriesCollection[];
  sportsCollections: SportsCollection[];
  footwearCollections: FootwearCollection[];
  teenagersCollections: TeenagersCollection[];
  kidsCollections: KidsCollection[];
  coupons: Coupon[];
  banners: PromoBanner[];
  reviews: ProductReview[];
  settings: SiteSettings | null;
  loadingProducts: boolean;
  loadingCategories: boolean;
  categoriesError: string | null;
  retryCategories: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
  user: User | null;
  token: string | null;
  authLoading: boolean;
  authMode: 'server';
  isGoogleSignInEnabled: boolean;
  authModalOpen: boolean;
  authModalTab: AuthModalTab;
  authModalMessage: string | null;
  setAuthModalTab: (tab: AuthModalTab) => void;
  openAuthModal: (options?: {
    tab?: AuthModalTab;
    message?: string | null;
    pendingAction?: PendingAuthAction | null;
  }) => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  registerWithEmail: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  confirmPasswordReset: (payload: {
    token?: string;
    newPassword: string;
  }) => Promise<AuthResult>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<AuthResult>;
  verifyEmail: (verificationToken: string) => Promise<AuthResult>;
  setSession: (token: string | null, user: User | null) => void;
  logout: () => Promise<void>;
  cart: CartItem[];
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    variantId?: string,
    quantity?: number,
    options?: AddToCartOptions
  ) => boolean;
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
  toggleWishlist: (productId: string) => Promise<boolean>;
  recentlyViewed: string[];
  recordRecentlyViewed: (productId: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const PENDING_ACTION_KEY = 'kb_pending_action';

const StoreContext = createContext<StoreContextValue | null>(null);

export function getEffectivePrice(product: Product, variantId?: string): number {
  const variant =
    product.variants.find((v) => v.id === variantId) || product.variants[0];
  const base = product.price + (variant ? variant.priceDelta : 0);
  const discounted = base * (1 - (product.discountPercent || 0) / 100);
  return Number(discounted.toFixed(2));
}

function readStoredPendingAction(): PendingAuthAction | null {
  try {
    const raw = sessionStorage.getItem(PENDING_ACTION_KEY);
    return raw ? (JSON.parse(raw) as PendingAuthAction) : null;
  } catch {
    return null;
  }
}

function writeStoredPendingAction(action: PendingAuthAction | null) {
  try {
    if (action) {
      sessionStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
    } else {
      sessionStorage.removeItem(PENDING_ACTION_KEY);
    }
  } catch {
    // Ignore storage restriction
  }
}

// Cleanup any legacy auth token keys from localStorage on load
function clearLegacyLocalStorageAuthTokens() {
  try {
    localStorage.removeItem('kb_auth_token');
    localStorage.removeItem('aetheria_token');
  } catch {
    // Ignore storage restriction
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      return generate48Products();
    } catch {
      return [];
    }
  });
  const [categories, setCategories] = useState<CategoryInfo[]>(
    () => INITIAL_CATEGORIES
  );
  const [mensFashionCollections, setMensFashionCollections] = useState<
    MensFashionCollection[]
  >(() => INITIAL_MENS_FASHION_COLLECTIONS);
  const [womensFashionCollections, setWomensFashionCollections] = useState<
    WomensFashionCollection[]
  >(() => INITIAL_WOMENS_FASHION_COLLECTIONS);
  const [electronicsCollections, setElectronicsCollections] = useState<
    ElectronicsCollection[]
  >(() => INITIAL_ELECTRONICS_COLLECTIONS);
  const [driedFruitsCollections, setDriedFruitsCollections] = useState<
    DriedFruitCollection[]
  >(() => INITIAL_DRIED_FRUITS_COLLECTIONS);
  const [nutsCollections, setNutsCollections] = useState<NutCollection[]>(
    () => INITIAL_NUTS_COLLECTIONS
  );
  const [skinCareCollections, setSkinCareCollections] = useState<
    SkinCareCollection[]
  >(() => INITIAL_SKIN_CARE_COLLECTIONS);
  const [hairCareCollections, setHairCareCollections] = useState<
    HairCareCollection[]
  >(() => INITIAL_HAIR_CARE_COLLECTIONS);
  const [furnitureCollections, setFurnitureCollections] = useState<
    FurnitureCollection[]
  >(() => INITIAL_FURNITURE_COLLECTIONS);
  const [driedPeasCollections, setDriedPeasCollections] = useState<
    DriedPeasCollection[]
  >(() => INITIAL_DRIED_PEAS_COLLECTIONS);
  const [pranksNoveltiesCollections, setPranksNoveltiesCollections] = useState<
    PranksNoveltiesCollection[]
  >(() => INITIAL_PRANKS_NOVELTIES_COLLECTIONS);
  const [fitnessGymCollections, setFitnessGymCollections] = useState<
    FitnessGymCollection[]
  >(() => INITIAL_FITNESS_GYM_COLLECTIONS);
  const [accessoriesCollections, setAccessoriesCollections] = useState<
    AccessoriesCollection[]
  >(() => INITIAL_ACCESSORIES_COLLECTIONS);
  const [sportsCollections, setSportsCollections] = useState<
    SportsCollection[]
  >(() => INITIAL_SPORTS_COLLECTIONS);
  const [footwearCollections, setFootwearCollections] = useState<
    FootwearCollection[]
  >(() => INITIAL_FOOTWEAR_COLLECTIONS);
  const [teenagersCollections, setTeenagersCollections] = useState<
    TeenagersCollection[]
  >(() => INITIAL_TEENAGERS_COLLECTIONS);
  const [kidsCollections, setKidsCollections] = useState<
    KidsCollection[]
  >(() => INITIAL_KIDS_COLLECTIONS);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('login');
  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAuthAction | null>(
    () => readStoredPendingAction()
  );

  const processingPendingRef = useRef(false);

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

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
    const t = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const navigate = useCallback((path: string) => {
    const current = window.location.pathname + window.location.search;
    if (current !== path) {
      window.history.pushState({}, '', path);
    }
    setMobileMenuOpen(false);
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

  const hydrateSessionFromServer = useCallback(
    async (bearerToken?: string): Promise<User | null> => {
      const res = await apiFetch('/api/auth/me', {
        headers: buildApiHeaders(bearerToken),
      });
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      const loadedUser: User = data.user;
      const loadedCart: CartItem[] = Array.isArray(data.cart)
        ? data.cart
        : Array.isArray(loadedUser.cart)
          ? loadedUser.cart
          : [];
      setToken((prev) => bearerToken || prev || 'cookie-session');
      setUser(loadedUser);
      setCart(loadedCart);
      return loadedUser;
    },
    []
  );

  // Restore session strictly via HttpOnly cookie on mount (never from localStorage)
  useEffect(() => {
    let active = true;
    clearLegacyLocalStorageAuthTokens();

    async function bootstrapAuth() {
      try {
        const hydrated = await hydrateSessionFromServer();
        if (!hydrated && active) {
          setToken(null);
          setUser(null);
          setCart([]);
        }
      } catch {
        if (active) {
          setToken(null);
          setUser(null);
          setCart([]);
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    void bootstrapAuth();
    return () => {
      active = false;
    };
  }, [hydrateSessionFromServer]);

  const retryCategories = useCallback(async () => {
    setLoadingCategories(true);
    setCategoriesError(null);
    try {
      const res = await apiFetch('/api/categories');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`Failed to fetch categories (${res.status})`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid categories response');
      }
      setCategories(data.length > 0 ? data : INITIAL_CATEGORIES);
      setCategoriesError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to refresh categories';
      setCategoriesError(message);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const refreshCatalog = useCallback(async () => {
    setLoadingProducts(true);
    setLoadingCategories(true);
    setCategoriesError(null);
    try {
      const isJson = (res: Response) =>
        res.ok &&
        (res.headers.get('content-type') || '').includes('application/json');

      const productHeaders = buildApiHeaders(token);

      const [prodRes, catRes, offRes, revRes, setRes, mfRes, wfRes, elRes, dfRes, nutRes, scRes, hcRes, furnRes, dpRes, pnRes, fgRes, accRes, spRes, fwRes, teenRes, kidsRes] = await Promise.all([
        apiFetch('/api/products', { headers: productHeaders }).catch(() => null),
        fetch('/api/categories').catch(() => null),
        fetch('/api/offers').catch(() => null),
        fetch('/api/reviews').catch(() => null),
        fetch('/api/settings').catch(() => null),
        fetch('/api/mens-fashion/collections').catch(() => null),
        fetch('/api/womens-fashion/collections').catch(() => null),
        fetch('/api/electronics/collections').catch(() => null),
        fetch('/api/dried-fruits/collections').catch(() => null),
        fetch('/api/nuts/collections').catch(() => null),
        fetch('/api/skin-care/collections').catch(() => null),
        fetch('/api/hair-care/collections').catch(() => null),
        fetch('/api/furniture/collections').catch(() => null),
        fetch('/api/dried-peas/collections').catch(() => null),
        fetch('/api/pranks-novelties/collections').catch(() => null),
        fetch('/api/fitness-gym/collections').catch(() => null),
        fetch('/api/accessories/collections').catch(() => null),
        fetch('/api/sports/collections').catch(() => null),
        fetch('/api/footwear/collections').catch(() => null),
        fetch('/api/teenagers/collections').catch(() => null),
        fetch('/api/kids/collections').catch(() => null),
      ]);

      if (prodRes && isJson(prodRes)) {
        const data = await prodRes.json();
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      }

      if (mfRes && isJson(mfRes)) {
        const data = await mfRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setMensFashionCollections(mergeMensFashionCollections(data));
        }
      }

      if (wfRes && isJson(wfRes)) {
        const data = await wfRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setWomensFashionCollections(mergeWomensFashionCollections(data));
        }
      }

      if (elRes && isJson(elRes)) {
        const data = await elRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setElectronicsCollections(mergeElectronicsCollections(data));
        }
      }

      if (dfRes && isJson(dfRes)) {
        const data = await dfRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setDriedFruitsCollections(mergeDriedFruitsCollections(data));
        }
      }

      if (nutRes && isJson(nutRes)) {
        const data = await nutRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setNutsCollections(mergeNutsCollections(data));
        }
      }

      if (scRes && isJson(scRes)) {
        const data = await scRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setSkinCareCollections(mergeSkinCareCollections(data));
        }
      }

      if (hcRes && isJson(hcRes)) {
        const data = await hcRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setHairCareCollections(mergeHairCareCollections(data));
        }
      }

      if (furnRes && isJson(furnRes)) {
        const data = await furnRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setFurnitureCollections(mergeFurnitureCollections(data));
        }
      }

      if (dpRes && isJson(dpRes)) {
        const data = await dpRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setDriedPeasCollections(mergeDriedPeasCollections(data));
        }
      }

      if (pnRes && isJson(pnRes)) {
        const data = await pnRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setPranksNoveltiesCollections(mergePranksNoveltiesCollections(data));
        }
      }

      if (fgRes && isJson(fgRes)) {
        const data = await fgRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setFitnessGymCollections(mergeFitnessGymCollections(data));
        }
      }

      if (accRes && isJson(accRes)) {
        const data = await accRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setAccessoriesCollections(mergeAccessoriesCollections(data));
        }
      }

      if (spRes && isJson(spRes)) {
        const data = await spRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setSportsCollections(mergeSportsCollections(data));
        }
      }

      if (fwRes && isJson(fwRes)) {
        const data = await fwRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setFootwearCollections(mergeFootwearCollections(data));
        }
      }

      if (teenRes && isJson(teenRes)) {
        const data = await teenRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setTeenagersCollections(mergeTeenagersCollections(data));
        }
      }

      if (kidsRes && isJson(kidsRes)) {
        const data = await kidsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setKidsCollections(mergeKidsCollections(data));
        }
      }

      if (catRes && isJson(catRes)) {
        const data = await catRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setCategoriesError(null);
        } else {
          setCategoriesError('Category list is currently empty');
        }
      } else if (catRes && catRes.status >= 500) {
        setCategoriesError(`Category service returned status ${catRes.status}`);
      } else if (!catRes) {
        setCategoriesError(
          'Unable to reach category service. Showing saved departments.'
        );
      }

      if (offRes && isJson(offRes)) {
        const off = await offRes.json();
        if (off) {
          setCoupons(off.coupons || []);
          setBanners(off.banners || []);
        }
      }
      if (revRes && isJson(revRes)) {
        const data = await revRes.json();
        if (Array.isArray(data)) setReviews(data);
      }
      if (setRes && isJson(setRes)) {
        const data = await setRes.json();
        if (data) setSettings(data);
      }
    } catch (err) {
      console.warn('API sync warning (using catalog cache):', err);
      setCategoriesError(
        'Unable to sync latest categories. Showing cached catalog.'
      );
    } finally {
      setLoadingProducts(false);
      setLoadingCategories(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const setSession = useCallback(
    (newToken: string | null, newUser: User | null) => {
      clearLegacyLocalStorageAuthTokens();
      setToken(newToken || (newUser ? 'cookie-session' : null));
      setUser(newUser);
      if (!newUser) {
        setCart([]);
      } else if (Array.isArray(newUser.cart)) {
        setCart(newUser.cart);
      }
    },
    []
  );

  const openAuthModal = useCallback(
    (options?: {
      tab?: AuthModalTab;
      message?: string | null;
      pendingAction?: PendingAuthAction | null;
    }) => {
      setQuickViewProduct(null);
      setMobileMenuOpen(false);
      setAuthModalTab(options?.tab || 'login');
      setAuthModalMessage(options?.message ?? null);
      if (options?.pendingAction !== undefined) {
        setPendingAction(options.pendingAction);
        writeStoredPendingAction(options.pendingAction);
      }
      setAuthModalOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalMessage(null);
    setPendingAction(null);
    writeStoredPendingAction(null);
  }, []);

  const loginWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await apiFetch('/api/auth/login', {
          method: 'POST',
          headers: buildApiHeaders(null, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data.error || 'Invalid email or password' };
        }
        setToken(data.token || 'cookie-session');
        setUser(data.user);
        setCart(Array.isArray(data.user?.cart) ? data.user.cart : []);
        setAuthModalOpen(false);
        setAuthModalMessage(null);
        showToast(`Welcome back, ${data.user.name}`);
        return { ok: true, user: data.user };
      } catch {
        return { ok: false, error: 'Network error while signing in' };
      }
    },
    [showToast]
  );

  const registerWithEmail = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }): Promise<AuthResult> => {
      try {
        const res = await apiFetch('/api/auth/signup', {
          method: 'POST',
          headers: buildApiHeaders(null, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            name: payload.name.trim(),
            email: payload.email.trim(),
            password: payload.password,
            phone: payload.phone?.trim() || '',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return {
            ok: false,
            error: data.error || 'Could not create account',
          };
        }
        setToken(data.token || 'cookie-session');
        setUser(data.user);
        setCart(Array.isArray(data.user?.cart) ? data.user.cart : []);
        setAuthModalOpen(false);
        setAuthModalMessage(null);
        showToast(`Welcome to KubreeBazzar, ${data.user.name}`);
        return { ok: true, user: data.user };
      } catch {
        return { ok: false, error: 'Network error while creating account' };
      }
    },
    [showToast]
  );

  const loginWithGoogle = useCallback(async (): Promise<AuthResult> => {
    return {
      ok: false,
      error: 'Use email and password to sign in to your KubreeBazzar account.',
    };
  }, []);

  const requestPasswordReset = useCallback(
    async (email: string): Promise<AuthResult> => {
      try {
        const res = await apiFetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: buildApiHeaders(null, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data.error || 'Reset request failed' };
        }
        return {
          ok: true,
          message:
            data.message ||
            'Password reset instructions have been processed for your email.',
        };
      } catch {
        return {
          ok: false,
          error: 'Network error while requesting password reset',
        };
      }
    },
    []
  );

  const confirmPasswordReset = useCallback(
    async (payload: {
      token?: string;
      newPassword: string;
    }): Promise<AuthResult> => {
      try {
        const res = await apiFetch('/api/auth/reset-password', {
          method: 'POST',
          headers: buildApiHeaders(null, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            token: payload.token,
            password: payload.newPassword,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data.error || 'Could not reset password' };
        }
        return {
          ok: true,
          message:
            data.message || 'Password updated! Please sign in with your new password.',
        };
      } catch {
        return {
          ok: false,
          error: 'Network error while updating password',
        };
      }
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
      try {
        const res = await apiFetch('/api/auth/change-password', {
          method: 'POST',
          headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data.error || 'Could not change password' };
        }
        if (data.token) {
          setToken(data.token);
        }
        return {
          ok: true,
          message: data.message || 'Password updated successfully.',
        };
      } catch {
        return { ok: false, error: 'Network error while updating password' };
      }
    },
    [token]
  );

  const verifyEmail = useCallback(
    async (verificationToken: string): Promise<AuthResult> => {
      try {
        const res = await apiFetch('/api/auth/verify-email', {
          method: 'POST',
          headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({ token: verificationToken }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data.error || 'Could not verify email' };
        }
        if (data.user) setUser(data.user);
        return {
          ok: true,
          message: 'Your email address has been verified.',
          user: data.user,
        };
      } catch {
        return { ok: false, error: 'Network error while verifying email' };
      }
    },
    [token]
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        headers: buildApiHeaders(token),
      }).catch(() => null);
    } finally {
      clearLegacyLocalStorageAuthTokens();
      localStorage.removeItem('aetheria_cart');
      localStorage.removeItem('aetheria_wishlist');
      writeStoredPendingAction(null);
      setPendingAction(null);
      setToken(null);
      setUser(null);
      setCart([]);
      setCartDrawerOpen(false);
      showToast('Signed out of KubreeBazzar');
      navigate('/');
    }
  }, [token, showToast, navigate]);

  const executeServerAddToCart = useCallback(
    async (
      product: Product,
      variantId: string | undefined,
      quantity: number,
      authToken: string,
      redirectTo?: string
    ) => {
      const chosenVariant = variantId || product.variants[0]?.id || 'default';
      // Optimistic immediate cart update
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

      if (redirectTo) {
        navigate(redirectTo);
      } else {
        setCartDrawerOpen(true);
      }
      showToast(`Added ${product.name} to cart`);

      try {
        const res = await apiFetch('/api/cart/items', {
          method: 'POST',
          headers: buildApiHeaders(authToken, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            productId: product.id,
            variantId: chosenVariant,
            quantity,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.items)) {
            setCart(data.items);
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          if (errData.error) showToast(errData.error);
          // Re-sync authoritative cart from server
          const syncRes = await apiFetch('/api/cart', {
            headers: buildApiHeaders(authToken),
          });
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (Array.isArray(syncData.items)) setCart(syncData.items);
          }
        }
      } catch {
        // Keep optimistic state temporarily; next refresh syncs from server
      }
    },
    [navigate, showToast]
  );

  // Resume pending action strictly ONCE after successful login / signup
  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !pendingAction ||
      processingPendingRef.current
    ) {
      return;
    }

    const actionToRun = pendingAction;
    processingPendingRef.current = true;
    setPendingAction(null);
    writeStoredPendingAction(null);

    const runPending = async () => {
      try {
        if (actionToRun.type === 'addToCart') {
          const targetProduct = products.find(
            (p) => p.id === actionToRun.productId
          );
          if (targetProduct) {
            await executeServerAddToCart(
              targetProduct,
              actionToRun.variantId,
              actionToRun.quantity,
              token || '',
              actionToRun.redirectTo
            );
          }
        } else if (actionToRun.type === 'toggleWishlist') {
          if (user.wishlist.includes(actionToRun.productId)) {
            showToast('Item is already saved in your wishlist');
          } else {
            const res = await apiFetch('/api/users/wishlist', {
              method: 'POST',
              headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
              body: JSON.stringify({ productId: actionToRun.productId }),
            });
            if (res.ok) {
              const data = await res.json();
              setUser((u) => (u ? { ...u, wishlist: data.wishlist } : u));
              showToast('Saved to wishlist');
            }
          }
        } else if (actionToRun.type === 'navigate') {
          navigate(actionToRun.path);
        }
      } finally {
        processingPendingRef.current = false;
      }
    };

    void runPending();
  }, [
    authLoading,
    user,
    token,
    pendingAction,
    products,
    executeServerAddToCart,
    navigate,
    showToast,
  ]);

  const addToCart = useCallback(
    (
      product: Product,
      variantId?: string,
      quantity = 1,
      options?: AddToCartOptions
    ): boolean => {
      if (!user) {
        openAuthModal({
          tab: 'login',
          message: 'Please log in to add items to your cart.',
          pendingAction: {
            type: 'addToCart',
            productId: product.id,
            variantId: variantId || product.variants[0]?.id,
            quantity,
            redirectTo: options?.redirectTo,
          },
        });
        return false;
      }

      void executeServerAddToCart(
        product,
        variantId,
        quantity,
        token || '',
        options?.redirectTo
      );
      return true;
    },
    [user, token, openAuthModal, executeServerAddToCart]
  );

  const updateCartQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (!user) {
        openAuthModal({
          tab: 'login',
          message: 'Please log in to manage your shopping cart.',
        });
        return;
      }

      if (quantity <= 0) {
        setCart((prev) =>
          prev.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          )
        );
      } else {
        setCart((prev) =>
          prev.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity }
              : i
          )
        );
      }

      void apiFetch('/api/cart/items', {
        method: 'PUT',
        headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({ productId, variantId, quantity }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.items)) {
            setCart(data.items);
          }
        })
        .catch(() => null);
    },
    [user, token, openAuthModal]
  );

  const removeFromCart = useCallback(
    (productId: string, variantId: string) => {
      if (!user) return;
      setCart((prev) =>
        prev.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
      );
      void apiFetch(
        `/api/cart/items/${encodeURIComponent(productId)}/${encodeURIComponent(
          variantId
        )}`,
        {
          method: 'DELETE',
          headers: buildApiHeaders(token),
        }
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.items)) {
            setCart(data.items);
          }
        })
        .catch(() => null);
    },
    [user, token]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    if (user || token) {
      void apiFetch('/api/cart', {
        method: 'DELETE',
        headers: buildApiHeaders(token),
      }).catch(() => null);
    }
  }, [user, token]);

  const enrichedCart = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = enrichedCart.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + getEffectivePrice(item.product, item.variantId) * item.quantity;
  }, 0);

  const wishlist = user ? user.wishlist : [];

  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!user) {
        openAuthModal({
          tab: 'login',
          message: 'Please log in to save items to your wishlist.',
          pendingAction: {
            type: 'toggleWishlist',
            productId,
          },
        });
        return false;
      }

      const res = await apiFetch('/api/users/wishlist', {
        method: 'POST',
        headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
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
        return true;
      }
      return false;
    },
    [user, token, openAuthModal, showToast]
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
        mensFashionCollections,
        womensFashionCollections,
        electronicsCollections,
        driedFruitsCollections,
        nutsCollections,
        skinCareCollections,
        hairCareCollections,
        furnitureCollections,
        driedPeasCollections,
        pranksNoveltiesCollections,
        fitnessGymCollections,
        accessoriesCollections,
        sportsCollections,
        footwearCollections,
        teenagersCollections,
        kidsCollections,
        coupons,
        banners,
        reviews,
        settings,
        loadingProducts,
        loadingCategories,
        categoriesError,
        retryCategories,
        refreshCatalog,
        user,
        token,
        authLoading,
        authMode: 'server',
        isGoogleSignInEnabled: false,
        authModalOpen,
        authModalTab,
        authModalMessage,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        requestPasswordReset,
        confirmPasswordReset,
        changePassword,
        verifyEmail,
        setSession,
        logout,
        cart: enrichedCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
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

export function useAuth() {
  const {
    user,
    token,
    authLoading,
    authMode,
    isGoogleSignInEnabled,
    authModalOpen,
    authModalTab,
    authModalMessage,
    setAuthModalTab,
    openAuthModal,
    closeAuthModal,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    requestPasswordReset,
    confirmPasswordReset,
    changePassword,
    verifyEmail,
    logout,
  } = useStore();
  return {
    user,
    token,
    authLoading,
    authMode,
    isGoogleSignInEnabled,
    authModalOpen,
    authModalTab,
    authModalMessage,
    setAuthModalTab,
    openAuthModal,
    closeAuthModal,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    requestPasswordReset,
    confirmPasswordReset,
    changePassword,
    verifyEmail,
    logout,
  };
}
