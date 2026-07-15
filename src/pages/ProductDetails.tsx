import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/database';
import type { Review } from '../data/database';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/product/ProductCard';
import { 
  Star, Heart, ShoppingCart, Share2, Shield, Truck, 
  RotateCcw, Send, Plus, Minus, ArrowLeft 
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useLocale();
  const { addToCart, wishlist, toggleWishlist, addToRecentlyViewed } = useCart();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Hardware Component Not Found</h2>
        <Link to="/" className="px-6 py-2 bg-indigo-500 text-white rounded-xl">Back to Core Terminal</Link>
      </div>
    );
  }

  // Add to recently viewed on load
  useEffect(() => {
    addToRecentlyViewed(product.id);
  }, [product.id]);

  // Gallery state
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);
  useEffect(() => {
    setActiveImage(product.images[0]);
  }, [product]);

  // Zoom state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Quantity selector state
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, content: '' });

  // Update reviews if product changes
  useEffect(() => {
    setReviewsList(product.reviews);
  }, [product]);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const discountedPrice = product.flashSaleDiscount
    ? product.price * (1 - product.flashSaleDiscount / 100)
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${quantity}x ${product.name} added to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product URL copied to clipboard!', 'success');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      isWishlisted ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist!`,
      isWishlisted ? 'info' : 'success'
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.content) {
      showToast('Please fill out all review fields.', 'warning');
      return;
    }

    const reviewItem: Review = {
      id: Math.random().toString(36).substring(7),
      author: newReview.author,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      content: newReview.content,
    };

    setReviewsList((prev) => [reviewItem, ...prev]);
    setNewReview({ author: '', rating: 5, content: '' });
    showToast('Review submitted for model analysis!', 'success');
  };

  // Find related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-indigo-500 transition-colors mb-8 text-slate-500">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Terminal</span>
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-6 md:p-8 shadow-sm">
          
          {/* Left Column: Image Gallery & Zoom */}
          <div className="flex flex-col gap-4">
            
            {/* Main Interactive Zoom Image */}
            <div 
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 cursor-zoom-in"
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
                style={{
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
              />

              {/* Tag Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.flashSaleDiscount && (
                  <span className="bg-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded-lg">
                    -{product.flashSaleDiscount}% Off
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-50 dark:bg-slate-950/40 transition-all cursor-pointer ${
                    activeImage === img ? 'border-indigo-500 scale-95 shadow-md' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Pricing & Options */}
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
              <span className="text-xs text-indigo-500 font-extrabold uppercase tracking-widest">{product.category}</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">{product.name}</h1>
              <p className="text-sm text-indigo-500 dark:text-indigo-400 font-bold">{product.tagline}</p>
              
              {/* Stars & Reviews summary */}
              <div className="flex items-center gap-2 text-sm mt-1">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="font-bold ml-1">{product.rating}</span>
                </div>
                <span className="text-slate-400">|</span>
                <span className="text-slate-400 font-semibold">{reviewsList.length} Customer Reviews</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Price & Stock info */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Calibrated Unit Cost</p>
                {product.flashSaleDiscount ? (
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-950 dark:text-white">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1 block">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  product.stock > 0 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>{product.stock > 0 ? `${product.stock} Units Available` : 'Out of stock'}</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Ships in 24 Hours</p>
              </div>
            </div>

            {/* Quantity Selector & Add Actions */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shrink-0">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-800 dark:text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* Extra utility row */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleWishlist}
                  className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Save for Later'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Component</span>
                </button>
              </div>
            </div>

            {/* Quick Guarantees panel */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-5 text-center text-xs">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Global Shipping</span>
                <span className="text-[10px] text-slate-400">Fast delivery worldwide</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Secured Payments</span>
                <span className="text-[10px] text-slate-400">256-bit encryption</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Hassle Returns</span>
                <span className="text-[10px] text-slate-400">30-day money back</span>
              </div>
            </div>

          </div>

        </div>

        {/* Specifications Tab & Reviews Tab */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 items-start">
          
          {/* Specifications List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <h3 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <span>Technical Calibration</span>
            </h3>
            
            <div className="flex flex-col border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden">
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div 
                  key={key} 
                  className={`grid grid-cols-3 p-4 text-sm leading-relaxed ${
                    idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-950/20' : 'bg-transparent'
                  } border-b border-slate-100 dark:border-slate-850/60 last:border-b-0`}
                >
                  <span className="font-bold text-slate-500 dark:text-slate-400 col-span-1">{key}</span>
                  <span className="text-slate-800 dark:text-slate-100 font-semibold col-span-2">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews & Add Review Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <h3 className="text-2xl font-extrabold tracking-tight">Telemetry (Reviews)</h3>
            
            {/* Reviews display */}
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto no-scrollbar">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">{rev.author}</h5>
                      <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500' : 'text-slate-200 dark:text-slate-800'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {rev.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">No telemetry reports recorded for this unit.</p>
              )}
            </div>

            {/* Write a review form */}
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-850 pt-5">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Log New Report</h4>
              
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Technologist name"
                  value={newReview.author}
                  onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs focus:outline-none border border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Rating select */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Calibration Metric (Rating):</span>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-bold outline-none"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <textarea
                  required
                  rows={3}
                  placeholder="Review contents..."
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs focus:outline-none border border-slate-200 dark:border-slate-800 resize-none"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Analysis</span>
              </button>
            </form>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-slate-200/60 dark:border-slate-800/80 pt-16">
            <h3 className="text-3xl font-extrabold tracking-tight mb-8">Related Modules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
