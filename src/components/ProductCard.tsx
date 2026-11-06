import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import type { Product } from '../types';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    navigate,
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
  } = useStore();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [addedPulse, setAddedPulse] = useState(false);

  const isSaved = wishlist.includes(product.id);
  const finalPrice = getEffectivePrice(product);
  const hasDiscount = product.discountPercent > 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 5, ry: x * 5 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, product.variants[0]?.id, 1);
    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 350);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="group cursor-pointer rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#1D6FD8] shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0F6FF]">
        <ResilientImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#FF6B1A] text-white text-[11px] font-bold shadow-xs">
            {product.discountPercent}% OFF
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center border bg-white/95 border-[#DCE6F2] text-[#0B3B78] hover:text-[#FF6B1A] shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
                : 'bg-white/95 border-[#DCE6F2] text-[#0B3B78] hover:text-[#FF6B1A]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#132238] bg-white/95 border border-[#DCE6F2] px-2.5 py-1 rounded-lg shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
          <span>{product.stock > 0 ? 'In Stock' : 'Sold Out'}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
            <span className="font-medium text-[#1D6FD8]">
              {product.category}
              {product.subcategory ? ` · ${product.subcategory}` : ''}
            </span>
            <span className="inline-flex items-center gap-1 text-[#132238] font-semibold">
              <Star className="w-3.5 h-3.5 text-[#FF6B1A] fill-current" />
              <span className="font-mono-tabular">{product.rating}</span>
            </span>
          </div>

          <h3 className="font-display text-lg font-bold text-[#0B3B78] group-hover:text-[#FF6B1A] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#475569] mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#EEF4FB]">
          <div className="flex items-baseline gap-2">
            <span className="font-mono-tabular text-base font-bold text-[#0B3B78]">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="font-mono-tabular text-xs text-[#94A3B8] line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={handleQuickAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              product.stock <= 0
                ? 'bg-[#E2E8F0] text-[#64748B] cursor-not-allowed'
                : addedPulse
                ? 'bg-[#4CAF50] text-white scale-95'
                : 'bg-[#FF6B1A] hover:bg-[#E5580D] text-white shadow-xs'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span>{product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
