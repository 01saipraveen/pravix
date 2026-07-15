import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { brandLogos } from '../../data/database';
import { Mail, ArrowRight, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulating subscription
    showToast('Subscribed! Welcome to Pravix Intelligence Reports.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      
      {/* Brand Logos Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
          Supporting Global Architectures
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-300">
          {brandLogos.map((logo) => (
            <span key={logo} className="font-extrabold text-xl tracking-tight text-white select-none">
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* About column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">
              Pravix
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            High-performance hardware engineered for the next era of computing. Experience precision, velocity, and premium design.
          </p>
          <div className="flex items-center gap-3 mt-2 text-slate-500">
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        {/* Navigation column */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Shop Categories</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><Link to="/?category=smartphones" className="hover:text-white transition-colors">Smartphones & Wearables</Link></li>
            <li><Link to="/?category=laptops" className="hover:text-white transition-colors">Laptops & Keyboards</Link></li>
            <li><Link to="/?category=audio" className="hover:text-white transition-colors">Audio Studio Gear</Link></li>
            <li><Link to="/?category=smarthome" className="hover:text-white transition-colors">Smart Home Hubs</Link></li>
          </ul>
        </div>

        {/* Support & Policies column */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support & Policies</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/policies/refund" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter Subscription column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">{t('home.subscribe')}</h3>
          <p className="text-sm leading-relaxed">
            {t('home.subscribeDesc')}
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@domain.com"
              className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-700 text-sm"
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
            <button
              type="submit"
              className="absolute right-1.5 p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800 text-xs text-center flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
        <p>© {new Date().getFullYear()} Pravix Corporation. All hardware designs, neural cores, and assets are simulated properties.</p>
        <div className="flex gap-4">
          <Link to="/policies/privacy" className="hover:text-slate-400">Privacy</Link>
          <Link to="/policies/terms" className="hover:text-slate-400">Terms</Link>
          <Link to="/policies/refund" className="hover:text-slate-400">Returns</Link>
        </div>
      </div>

    </footer>
  );
};
