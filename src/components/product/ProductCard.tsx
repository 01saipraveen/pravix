import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../data/database';
import { useLocale } from '../../context/LocaleContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useLocale();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { showToast } = useToast();

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const discountedPrice = product.flashSaleDiscount
    ? product.price * (1 - product.flashSaleDiscount / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isWishlisted ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist!`,
      isWishlisted ? 'info' : 'success'
    );
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-950/20 transition-all group flex flex-col h-full"
    >
      
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="bg-indigo-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
            Best Seller
          </span>
        )}
        {product.flashSaleDiscount && (
          <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
            -{product.flashSaleDiscount}%
          </span>
        )}
      </div>

      {/* Wishlist Heart Icon */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/30 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 shadow-md transition-colors cursor-pointer"
      >
        <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image Gallery Wrapper */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] bg-slate-50 dark:bg-slate-950/40 overflow-hidden shrink-0 zoom-container">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover zoom-image"
          loading="lazy"
        />
        {/* Hover overlay icons */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <span className="p-3 rounded-2xl bg-white/90 text-slate-900 shadow-xl hover:scale-105 transition-transform">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </Link>

      {/* Product Details info */}
      <div className="p-5 flex flex-col flex-1 gap-2.5 justify-between">
        
        <div className="flex flex-col gap-1.5">
          {/* Category */}
          <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-extrabold uppercase tracking-widest">
            {product.category}
          </span>
          {/* Name */}
          <Link to={`/product/${product.id}`} className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors text-lg line-clamp-1">
            {product.name}
          </Link>
          {/* Tagline */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2rem]">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">{product.rating}</span>
          </div>
          <span className="text-slate-400 font-medium">({product.reviewsCount} reviews)</span>
        </div>

        {/* Price & Add to Cart Action Row */}
        <div className="flex items-center justify-between gap-4 mt-2">
          {/* Price */}
          <div className="flex flex-col">
            {product.flashSaleDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
            )}
            <span className={`text-[10px] font-bold uppercase ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-3 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:cursor-not-allowed shadow transition-colors cursor-pointer flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </motion.div>
  );
};
