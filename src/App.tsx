import { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';
import {
  MobileBottomNav,
  shouldShowMobileBottomNav,
} from './components/MobileBottomNav';
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
import { UsedBikesAndCarsPage } from './pages/UsedBikesAndCarsPage';
import { BabyKitPage } from './pages/BabyKitPage';
import { TempleKitPage } from './pages/TempleKitPage';
import { SchoolKitPage } from './pages/SchoolKitPage';
import {
  buildCategoryTree,
  getCategoryBySlug,
  LEGACY_SLUG_REDIRECTS,
} from './data/categoryHierarchy';
import { findMensFashionParentBySlug } from './data/mensFashionCollections';
import {
  findWomensFashionCollection,
  findWomensFashionParentBySlug,
} from './data/womensFashionCollections';
import {
  findElectronicsCollection,
  findElectronicsGroupBySlug,
} from './data/electronicsCollections';
import { findDriedFruitCollection } from './data/driedFruitsCollections';
import { findNutCollection } from './data/nutsCollections';
import {
  findSkinCareCollection,
  findSkinCareGroupBySlug,
} from './data/skinCareCollections';
import {
  findHairCareCollection,
  findHairCareGroupBySlug,
} from './data/hairCareCollections';
import {
  findFurnitureCollection,
  findFurnitureGroupBySlug,
} from './data/furnitureCollections';
import {
  findDriedPeasCollection,
  findDriedPeasGroupBySlug,
} from './data/driedPeasCollections';
import {
  findPranksNoveltiesCollection,
  findPranksNoveltiesGroupBySlug,
} from './data/pranksNoveltiesCollections';
import {
  findFitnessGymCollection,
  findFitnessGymGroupBySlug,
} from './data/fitnessGymCollections';
import {
  findAccessoriesCollection,
  findAccessoriesGroupBySlug,
} from './data/accessoriesCollections';
import {
  findSportsCollection,
  findSportsGroupBySlug,
} from './data/sportsCollections';
import {
  findFootwearCollection,
  findFootwearGroupBySlug,
} from './data/footwearCollections';
import {
  findTeenagersCollection,
  findTeenagersGroupBySlug,
} from './data/teenagersCollections';
import {
  findKidsCollection,
  findKidsGroupBySlug,
} from './data/kidsCollections';
import {
  findRiceCollection,
  findRiceMealGroupBySlug,
} from './data/riceCollections';

function AppRouter() {
  const {
    route,
    toast,
    categories,
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
    mobileMenuOpen,
    cartDrawerOpen,
    quickViewProduct,
    authModalOpen,
  } = useStore();
  const cleanPath = route.split('?')[0] || '/';
  const isAdminRoute = cleanPath === '/admin' || cleanPath.startsWith('/admin/');
  const queryString = route.includes('?') ? `?${route.split('?')[1]}` : '';
  const bottomNavVisible =
    !isAdminRoute &&
    shouldShowMobileBottomNav(
      route,
      mobileMenuOpen || cartDrawerOpen || authModalOpen || Boolean(quickViewProduct)
    );

  // Safely canonicalize legacy indexed URLs (e.g. /temple -> /temple-pooja-essentials, /baby-care -> /baby-kit) without 404s
  useEffect(() => {
    const slugSegment = cleanPath.startsWith('/category/')
      ? cleanPath.replace('/category/', '').split('/')[0]
      : cleanPath.slice(1).split('/')[0];
    const redirectTarget =
      cleanPath === '/baby-care/baby-kit' || cleanPath === '/category/baby-kit'
        ? '/baby-kit'
        : cleanPath === '/temple/temple-kit' ||
            cleanPath === '/temple-pooja-essentials/temple-kit' ||
            cleanPath === '/temple-kit' ||
            cleanPath === '/category/temple-kit'
          ? '/temple-pooja-essentials'
          : cleanPath === '/school' ||
              cleanPath === '/school-supplies' ||
              cleanPath === '/school/school-kit' ||
              cleanPath === '/school-supplies/school-kit' ||
              cleanPath === '/category/school' ||
              cleanPath === '/category/school-supplies' ||
              cleanPath === '/category/school-kit'
            ? '/school-kit'
            : slugSegment
              ? LEGACY_SLUG_REDIRECTS[slugSegment.toLowerCase()]
              : undefined;
    if (redirectTarget && cleanPath !== redirectTarget) {
      window.history.replaceState({}, '', `${redirectTarget}${queryString}`);
    } else if (cleanPath === '/') {
      document.title = 'KubreeBazzar | Your Friendly Online Shopping Bazzar';
    }
  }, [cleanPath, queryString]);

  const renderPage = () => {
    if (cleanPath === '/') return <HomePage />;

    // 1. Dedicated Used Bikes & Cars (One Combined Category)
    if (
      cleanPath === '/used-bikes-and-cars' ||
      cleanPath === '/used-bikes' ||
      cleanPath === '/used-cars'
    ) {
      return <UsedBikesAndCarsPage />;
    }

    // 2. Core Independent Categories (Canonical & Legacy Aliases)
    if (cleanPath === '/kids') return <CategoryLandingPage category="Kids" />;
    if (cleanPath.startsWith('/kids/')) {
      const prefix = '/kids/';
      const segments = cleanPath
        .slice(prefix.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findKidsGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findKidsCollection(seg0, kidsCollections)
          : undefined;
      return (
        <CategoryLandingPage
          category="Kids"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/teenagers' || cleanPath === '/teenager')
      return <CategoryLandingPage category="Teenager" />;
    if (
      cleanPath.startsWith('/teenagers/') ||
      cleanPath.startsWith('/teenager/')
    ) {
      const prefix = cleanPath.startsWith('/teenagers/')
        ? '/teenagers/'
        : '/teenager/';
      const segments = cleanPath
        .slice(prefix.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findTeenagersGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findTeenagersCollection(seg0, teenagersCollections)
          : undefined;
      return (
        <CategoryLandingPage
          category="Teenager"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (
      cleanPath === '/baby-kit' ||
      cleanPath === '/baby-care/baby-kit' ||
      cleanPath === '/baby-care' ||
      cleanPath === '/baby'
    )
      return <BabyKitPage />;
    if (cleanPath === '/fashion')
      return <CategoryLandingPage category="Fashion" />;
    if (cleanPath.startsWith('/fashion/')) {
      const segments = cleanPath
        .slice('/fashion/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const seg2 = segments[2] || '';

      const subCategoryInit =
        seg0 === 'mens-fashion' || seg0 === 'men' || seg0 === "men's fashion"
          ? "Men's Fashion"
          : seg0 === 'womens-fashion' ||
              seg0 === 'women' ||
              seg0 === "women's fashion"
            ? "Women's Fashion"
            : segments[0] || 'All';

      const isWomenRoute = subCategoryInit === "Women's Fashion";
      const parentMatch = isWomenRoute
        ? undefined
        : findMensFashionParentBySlug(seg1);
      const womenParentMatch = isWomenRoute
        ? findWomensFashionParentBySlug(seg1)
        : undefined;
      const womenDirectCollection =
        isWomenRoute && !womenParentMatch && seg1 && !seg2
          ? findWomensFashionCollection(womensFashionCollections, seg1)
          : undefined;
      const tree = buildCategoryTree(categories);
      const fashionNode = tree.find(
        (n) => n.id.toLowerCase() === 'fashion' || n.slug === 'fashion'
      );
      const subNode = fashionNode?.subcategories.find(
        (s) =>
          s.name.toLowerCase() === subCategoryInit.toLowerCase() ||
          s.slug.toLowerCase() === seg0
      );
      const thirdNode =
        seg1 && subNode
          ? subNode.children.find(
              (c) =>
                c.slug.toLowerCase() === seg1 || c.name.toLowerCase() === seg1
            )
          : undefined;

      return (
        <CategoryLandingPage
          category="Fashion"
          subCategoryInit={subCategoryInit}
          thirdCategoryInit={
            womenParentMatch?.name ||
            womenDirectCollection?.parentCategory ||
            parentMatch?.name ||
            thirdNode?.name ||
            segments[1] ||
            'All'
          }
          collectionSlugInit={
            seg2 || womenDirectCollection?.slug || undefined
          }
        />
      );
    }
    if (cleanPath === '/groceries' || cleanPath === '/grocery')
      return <CategoryLandingPage category="Groceries" />;

    // Direct Groceries subcategory shortcuts & full nested /groceries/:sub/:third routes
    if (cleanPath === '/whole-spices')
      return (
        <CategoryLandingPage
          category="Groceries"
          subCategoryInit="Whole Spices"
        />
      );
    if (cleanPath === '/masala-powders')
      return (
        <CategoryLandingPage
          category="Groceries"
          subCategoryInit="Masala Powders"
        />
      );
    if (cleanPath.startsWith('/groceries/')) {
      const segments = cleanPath
        .slice('/groceries/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const tree = buildCategoryTree(categories);
      const groceriesNode = tree.find(
        (n) => n.id.toLowerCase() === 'groceries' || n.slug === 'groceries'
      );
      const subSlug = (segments[0] || '').toLowerCase();
      if (subSlug === 'rice') {
        const seg1 = (segments[1] || '').toLowerCase();
        const seg2 = (segments[2] || '').toLowerCase();
        const mealMatch = seg1 ? findRiceMealGroupBySlug(seg1) : undefined;
        const matchedRiceCollection =
          mealMatch && seg2
            ? findRiceCollection(seg2, mealMatch.name)
            : !mealMatch && seg1
              ? findRiceCollection(seg1)
              : undefined;
        return (
          <CategoryLandingPage
            category="Groceries"
            subCategoryInit="Rice"
            thirdCategoryInit={
              mealMatch?.name ||
              matchedRiceCollection?.parentGroup ||
              segments[1] ||
              'All'
            }
            collectionSlugInit={
              matchedRiceCollection?.slug || (mealMatch && seg2 ? seg2 : undefined)
            }
          />
        );
      }
      const subNode = groceriesNode?.subcategories.find(
        (s) =>
          s.slug.toLowerCase() === subSlug || s.name.toLowerCase() === subSlug
      );
      const thirdSlug = (segments[1] || '').toLowerCase();
      const thirdNode =
        thirdSlug && subNode
          ? subNode.children.find(
              (c) =>
                c.slug.toLowerCase() === thirdSlug ||
                c.name.toLowerCase() === thirdSlug
            )
          : undefined;
      const fourthSlug = (segments[2] || '').toLowerCase();
      const fourthNode =
        fourthSlug && thirdNode?.children
          ? thirdNode.children.find(
              (f) =>
                f.slug.toLowerCase() === fourthSlug ||
                f.name.toLowerCase() === fourthSlug
            )
          : undefined;
      return (
        <CategoryLandingPage
          category="Groceries"
          subCategoryInit={subNode?.name || segments[0] || 'All'}
          thirdCategoryInit={thirdNode?.name || segments[1] || 'All'}
          fourthCategoryInit={fourthNode?.name || segments[2] || 'All'}
        />
      );
    }

    // 3. Other Main Categories (Canonical & Legacy Aliases)
    if (
      cleanPath === '/temple-pooja-essentials' ||
      cleanPath === '/temple' ||
      cleanPath === '/temple/temple-kit' ||
      cleanPath === '/temple-pooja-essentials/temple-kit' ||
      cleanPath === '/temple-kit'
    )
      return <TempleKitPage />;
    if (
      cleanPath === '/school/school-kit' ||
      cleanPath === '/school-supplies' ||
      cleanPath === '/school' ||
      cleanPath === '/school-kit' ||
      cleanPath === '/school-supplies/school-kit'
    )
      return <SchoolKitPage />;
    if (cleanPath === '/nuts' || cleanPath === '/dry-nuts')
      return <CategoryLandingPage category="Dry Nuts" />;
    if (
      cleanPath.startsWith('/nuts/') ||
      cleanPath.startsWith('/dry-nuts/')
    ) {
      const prefix = cleanPath.startsWith('/nuts/')
        ? '/nuts/'
        : '/dry-nuts/';
      const slug = decodeURIComponent(cleanPath.slice(prefix.length))
        .split('/')[0]
        .trim();
      const matchedNut = slug
        ? findNutCollection(nutsCollections, slug)
        : undefined;
      return (
        <CategoryLandingPage
          category="Dry Nuts"
          collectionSlugInit={matchedNut?.slug || slug || undefined}
        />
      );
    }
    if (cleanPath === '/dried-fruits' || cleanPath === '/dry-fruits')
      return <CategoryLandingPage category="Dry Fruits" />;
    if (
      cleanPath.startsWith('/dried-fruits/') ||
      cleanPath.startsWith('/dry-fruits/')
    ) {
      const prefix = cleanPath.startsWith('/dried-fruits/')
        ? '/dried-fruits/'
        : '/dry-fruits/';
      const slug = decodeURIComponent(cleanPath.slice(prefix.length))
        .split('/')[0]
        .trim();
      const matchedFruit = slug
        ? findDriedFruitCollection(driedFruitsCollections, slug)
        : undefined;
      return (
        <CategoryLandingPage
          category="Dry Fruits"
          collectionSlugInit={matchedFruit?.slug || slug || undefined}
        />
      );
    }
    if (cleanPath === '/hair-care')
      return <CategoryLandingPage category="Hair Care" />;
    if (cleanPath.startsWith('/hair-care/')) {
      const segments = cleanPath
        .slice('/hair-care/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findHairCareGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findHairCareCollection(hairCareCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Hair Care"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/skin-care')
      return <CategoryLandingPage category="Skin Care" />;
    if (cleanPath.startsWith('/skin-care/')) {
      const segments = cleanPath
        .slice('/skin-care/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findSkinCareGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findSkinCareCollection(skinCareCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Skin Care"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/electronics')
      return <CategoryLandingPage category="Electronics" />;
    if (cleanPath.startsWith('/electronics/')) {
      const segments = cleanPath
        .slice('/electronics/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findElectronicsGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findElectronicsCollection(electronicsCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Electronics"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/furniture')
      return <CategoryLandingPage category="Furniture" />;
    if (cleanPath.startsWith('/furniture/')) {
      const segments = cleanPath
        .slice('/furniture/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findFurnitureGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findFurnitureCollection(furnitureCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Furniture"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/pranks-novelties' || cleanPath === '/prank-items')
      return <CategoryLandingPage category="Prank Items" />;
    if (
      cleanPath.startsWith('/pranks-novelties/') ||
      cleanPath.startsWith('/prank-items/')
    ) {
      const prefix = cleanPath.startsWith('/pranks-novelties/')
        ? '/pranks-novelties/'
        : '/prank-items/';
      const segments = cleanPath
        .slice(prefix.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findPranksNoveltiesGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findPranksNoveltiesCollection(pranksNoveltiesCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Prank Items"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/dried-peas' || cleanPath === '/dry-peas')
      return <CategoryLandingPage category="Dry Peas" />;
    if (
      cleanPath.startsWith('/dried-peas/') ||
      cleanPath.startsWith('/dry-peas/')
    ) {
      const prefix = cleanPath.startsWith('/dried-peas/')
        ? '/dried-peas/'
        : '/dry-peas/';
      const segments = cleanPath
        .slice(prefix.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findDriedPeasGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findDriedPeasCollection(driedPeasCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Dry Peas"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/fitness-gym' || cleanPath === '/gym')
      return <CategoryLandingPage category="Gym" />;
    if (
      cleanPath.startsWith('/fitness-gym/') ||
      cleanPath.startsWith('/gym/')
    ) {
      const prefix = cleanPath.startsWith('/fitness-gym/')
        ? '/fitness-gym/'
        : '/gym/';
      const segments = cleanPath
        .slice(prefix.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findFitnessGymGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findFitnessGymCollection(fitnessGymCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Gym"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/sports')
      return <CategoryLandingPage category="Sports" />;
    if (cleanPath.startsWith('/sports/')) {
      const segments = cleanPath
        .slice('/sports/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findSportsGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findSportsCollection(sportsCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Sports"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/accessories')
      return <CategoryLandingPage category="Accessories" />;
    if (cleanPath.startsWith('/accessories/')) {
      const segments = cleanPath
        .slice('/accessories/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findAccessoriesGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findAccessoriesCollection(accessoriesCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Accessories"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }
    if (cleanPath === '/footwear')
      return <CategoryLandingPage category="Footwear" />;
    if (cleanPath.startsWith('/footwear/')) {
      const segments = cleanPath
        .slice('/footwear/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const groupMatch = findFootwearGroupBySlug(seg0);
      const directCollection =
        !groupMatch && seg0 && !seg1
          ? findFootwearCollection(footwearCollections, seg0)
          : undefined;
      return (
        <CategoryLandingPage
          category="Footwear"
          subCategoryInit={
            groupMatch?.name ||
            directCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={seg1 || directCollection?.slug || undefined}
        />
      );
    }

    // Legacy Shortcut Aliases
    if (cleanPath === '/rice')
      return <CategoryLandingPage category="Groceries" subCategoryInit="Rice" />;
    if (cleanPath.startsWith('/rice/')) {
      const segments = cleanPath
        .slice('/rice/'.length)
        .split('/')
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean);
      const seg0 = (segments[0] || '').toLowerCase();
      const seg1 = (segments[1] || '').toLowerCase();
      const mealMatch = seg0 ? findRiceMealGroupBySlug(seg0) : undefined;
      const matchedRiceCollection =
        mealMatch && seg1
          ? findRiceCollection(seg1, mealMatch.name)
          : !mealMatch && seg0
            ? findRiceCollection(seg0)
            : undefined;
      return (
        <CategoryLandingPage
          category="Groceries"
          subCategoryInit="Rice"
          thirdCategoryInit={
            mealMatch?.name ||
            matchedRiceCollection?.parentGroup ||
            segments[0] ||
            'All'
          }
          collectionSlugInit={
            matchedRiceCollection?.slug || (mealMatch && seg1 ? seg1 : undefined)
          }
        />
      );
    }
    if (cleanPath === '/honey')
      return (
        <CategoryLandingPage
          category="Groceries"
          subCategoryInit="Health Foods"
          thirdCategoryInit="Healthy Sweets"
        />
      );
    if (cleanPath === '/watches')
      return <CategoryLandingPage category="Accessories" />;

    // Dynamic /category/:slug routes
    if (cleanPath.startsWith('/category/')) {
      const slug = cleanPath.replace('/category/', '').toLowerCase();
      if (slug === 'baby-kit' || slug === 'baby-care' || slug === 'baby') {
        return <BabyKitPage />;
      }
      if (
        slug === 'temple' ||
        slug === 'temple-pooja-essentials' ||
        slug === 'temple-kit'
      ) {
        return <TempleKitPage />;
      }
      if (
        slug === 'school' ||
        slug === 'school-supplies' ||
        slug === 'school-kit'
      ) {
        return <SchoolKitPage />;
      }
      const matched = getCategoryBySlug(slug, categories);
      if (matched) {
        if (matched.slug === 'used-bikes-and-cars') {
          return <UsedBikesAndCarsPage />;
        }
        if (matched.slug === 'baby-kit') {
          return <BabyKitPage />;
        }
        if (
          matched.slug === 'temple-pooja-essentials' ||
          matched.slug === 'temple-kit'
        ) {
          return <TempleKitPage />;
        }
        if (
          matched.slug === 'school-kit' ||
          matched.slug === 'school-supplies'
        ) {
          return <SchoolKitPage />;
        }
        const parentId = matched.parentCategoryId || matched.parentId;
        if (parentId) {
          return (
            <CategoryLandingPage
              category={parentId}
              subCategoryInit={matched.name || matched.id}
            />
          );
        }
        return <CategoryLandingPage category={matched.id} />;
      }
      return <ShopPage />;
    }

    if (cleanPath === '/shop') return <ShopPage />;
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
    if (cleanPath === '/auth' || cleanPath === '/login')
      return <AuthPage initialTab="login" />;
    if (cleanPath === '/signup') return <AuthPage initialTab="signup" />;
    if (cleanPath === '/reset-password') return <AuthPage initialTab="reset" />;
    if (cleanPath === '/profile' || cleanPath === '/account')
      return <ProfilePage />;
    if (cleanPath === '/orders' || cleanPath === '/account/orders')
      return <OrdersPage />;
    if (cleanPath.startsWith('/account/orders/')) {
      const orderIdParam = decodeURIComponent(
        cleanPath.slice('/account/orders/'.length).split('/')[0] || ''
      ).trim();
      return <OrdersPage orderIdParam={orderIdParam || undefined} />;
    }
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
    if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
      return <AdminDashboard />;
    }

    // Dynamic top-level category routes added at runtime (e.g. /organic-spices)
    if (cleanPath.length > 1) {
      const topSlug = cleanPath.slice(1).split('/')[0];
      const dynamicCat = getCategoryBySlug(topSlug, categories);
      if (dynamicCat && dynamicCat.status !== 'inactive') {
        const parentId = dynamicCat.parentCategoryId || dynamicCat.parentId;
        if (parentId) {
          return (
            <CategoryLandingPage
              category={parentId}
              subCategoryInit={dynamicCat.name || dynamicCat.id}
            />
          );
        }
        return <CategoryLandingPage category={dynamicCat.id} />;
      }
    }

    return <HomePage />;
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8FAFC] text-[#132238] ${
        bottomNavVisible ? 'pb-16 lg:pb-0' : ''
      }`}
    >
      {!isAdminRoute && <Header />}
      <main className="flex-1">{renderPage()}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileBottomNav />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <QuickViewModal />}
      {!isAdminRoute && <AuthModal />}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-5 lg:bottom-5 z-50 px-4 py-2.5 rounded-xl bg-[#0B3B78] border border-[#FF6B1A]/60 text-xs font-semibold text-white shadow-lg text-center sm:text-left"
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
