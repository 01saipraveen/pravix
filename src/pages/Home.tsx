import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Hero } from '../components/homepage/Hero';
import { FlashSaleCountdown } from '../components/homepage/FlashSaleCountdown';
import { ProductCard } from '../components/product/ProductCard';
import { products, categories, faqs } from '../data/database';
import { useLocale } from '../context/LocaleContext';
import { 
  Laptop, Smartphone, Headphones, Home as HomeIcon, 
  Sparkles, ChevronDown, HelpCircle, 
  RefreshCw, SlidersHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeProps {
  searchQuery: string;
}

export const Home: React.FC<HomeProps> = ({ searchQuery }) => {
  const { t, formatPrice } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Category & Filters
  const activeCategory = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Scroll to products on CTA click
  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Set selected category
  const setCategory = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const discountedPrice = product.flashSaleDiscount
          ? product.price * (1 - product.flashSaleDiscount / 100)
          : product.price;
        const matchesPrice = discountedPrice <= priceRange;

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        const getPrice = (p: typeof a) => p.flashSaleDiscount ? p.price * (1 - p.flashSaleDiscount / 100) : p.price;
        
        switch (sortBy) {
          case 'price-low':
            return getPrice(a) - getPrice(b);
          case 'price-high':
            return getPrice(b) - getPrice(a);
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          default:
            return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0); // Featured / Best Seller
        }
      });
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  // AI Product Recommendations (simulated)
  const aiRecommendations = useMemo(() => {
    // Return products that match the current category or are bestsellers
    return products
      .filter((p) => p.category !== activeCategory && p.isBestSeller)
      .slice(0, 3);
  }, [activeCategory]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      default: return <HomeIcon className="w-5 h-5" />;
    }
  };

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pb-16">
      
      {/* Hero Header */}
      <Hero onExploreClick={scrollToProducts} />

      {/* Countdown Sale Widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <FlashSaleCountdown />
      </div>

      {/* Categories Horizontal Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center flex flex-col gap-2 mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Core Architectures</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">Select a technological subsystem to filter available hardware components.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* All category card */}
          <button
            onClick={() => setCategory('all')}
            className={`p-6 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xl'
                : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeCategory === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">All Gear</span>
          </button>

          {/* Individual Category cards */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 cursor-pointer h-full ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xl'
                    : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-500'}`}>
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h4 className="font-bold text-sm truncate">{cat.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        
        {/* Header and Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 dark:border-slate-800/80 pb-6 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {activeCategory === 'all' 
                ? t('home.featured') 
                : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} premium models
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer ${
                showFilters 
                  ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' 
                  : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 hover:border-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 px-4 py-2 pr-10 rounded-xl text-sm font-semibold outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Drawer panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6 mb-8 shadow-sm flex flex-col gap-4"
            >
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Refine Hardware Subsystem</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                {/* Price Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-500">Max Unit Budget:</span>
                    <span className="font-extrabold text-indigo-500">{formatPrice(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>{formatPrice(100)}</span>
                    <span>{formatPrice(3000)}</span>
                  </div>
                </div>

                {/* Reset button */}
                <div className="flex items-end justify-end">
                  <button
                    onClick={() => { setPriceRange(3000); setSortBy('featured'); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Calibration</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/40 dark:border-slate-800/40">
            <SlidersHorizontal className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-1">No Hardware Matches</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">Try calibrating your budget slider or searching with less specific keywords.</p>
          </div>
        )}

      </section>

      {/* AI Smart Recommendation Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                <span>AI Recommended Upgrades</span>
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mt-1 max-w-md">
                Based on your current workspace configuration, our model suggests adding these high-efficiency components.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto shrink-0">
            {aiRecommendations.map((rec) => (
              <Link 
                to={`/product/${rec.id}`}
                key={rec.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3 hover:border-indigo-500 transition-colors shadow-sm"
              >
                <img src={rec.images[0]} alt={rec.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                <div className="truncate w-36">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{rec.name}</h4>
                  <span className="text-xs text-indigo-500 font-extrabold">{formatPrice(rec.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Reviews Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center flex flex-col gap-2 mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">{t('home.reviewsTitle')}</h2>
          <p className="text-sm text-slate-500">Real feedback logged from hardware engineers and development teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between gap-6">
            <p className="text-sm leading-relaxed italic text-slate-600 dark:text-slate-400">
              "The compile speeds on the NexusBook Pro are incredible. I compile Rust monorepos all day, and the thermal profile stays cool and quiet. Absolutely phenomenal engineering."
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                JD
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">Jeff Devlin</h5>
                <p className="text-[10px] text-slate-400 font-medium">Principal Engineer at CloudScale</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between gap-6">
            <p className="text-sm leading-relaxed italic text-slate-600 dark:text-slate-400">
              "AeroBuds ANC is outstanding. In a loud server room with fans screaming, I can activate active isolation and focus entirely. Audio quality is precise and crystal clear."
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white text-xs">
                SM
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">Sarah Miller</h5>
                <p className="text-[10px] text-slate-400 font-medium">System Architect at NetCore</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between gap-6">
            <p className="text-sm leading-relaxed italic text-slate-600 dark:text-slate-400">
              "Order fulfillment was extremely fast. International customs fees and shipping were calculated exactly at checkout, no surprise fees. Highly satisfied with their support."
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-bold text-white text-xs">
                TL
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">Tanaka Lin</h5>
                <p className="text-[10px] text-slate-400 font-medium">Hardware Lead at TechTokyo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center flex flex-col gap-2 mb-10">
          <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto" />
          <h2 className="text-3xl font-extrabold tracking-tight">System FAQ</h2>
          <p className="text-sm text-slate-500">Quick answers regarding shipping, warranties, and student discounts.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
