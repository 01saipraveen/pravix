import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../../context/LocaleContext';
import { ArrowRight, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { t } = useLocale();

  return (
    <div className="relative overflow-hidden min-h-[85vh] flex items-center bg-slate-50 dark:bg-slate-950 pt-20 border-b border-slate-200/50 dark:border-slate-900/50">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Neural Core Technology</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white leading-[1.1] tracking-tight">
            {t('home.heroTitle')}{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Nexus Series
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
            {t('home.heroSubtitle')} Experience unparalleled precision, responsive tactile feedback, and high-fidelity smart living.
          </p>

          {/* Features Checklist */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI Product Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>2-Year Global Warranty</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>{t('home.cta')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-base transition-colors cursor-pointer"
            >
              Learn More
            </button>
          </div>

        </motion.div>

        {/* Right Content - Visual Feature */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-tr from-indigo-500/10 to-purple-500/15 p-4 flex items-center justify-center group">
            {/* Visual Glassmorphism Card */}
            <div className="absolute inset-0 bg-slate-950/5 dark:bg-white/5 backdrop-blur-[2px] rounded-3xl" />
            
            {/* Displaying a premium mockup product image */}
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" 
              alt="Nexus Gear Mockup" 
              className="w-4/5 h-4/5 object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform duration-700 relative z-10"
            />
            
            {/* Overlay interactive mini-badge */}
            <div className="absolute bottom-6 left-6 z-20 glass-panel-light dark:glass-panel-dark px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold">
                15%
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">AeroBuds Studio Max</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Flash Sale Active</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
