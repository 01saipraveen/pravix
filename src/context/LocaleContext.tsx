import React, { createContext, useContext, useState } from 'react';

export type Language = 'EN' | 'DE' | 'ES' | 'FR';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

interface LocaleContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (cur: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Exchange rates from base USD
const currencyRates: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

// Dictionary of translations
const translations: Record<Language, Record<string, string>> = {
  EN: {
    'nav.searchPlaceholder': 'Search premium tech products...',
    'nav.categories': 'Categories',
    'nav.wishlist': 'Wishlist',
    'nav.cart': 'Cart',
    'nav.login': 'Log In',
    'nav.register': 'Register',
    'nav.logout': 'Log Out',
    'home.heroTitle': 'The Future of Neural Tech is Here',
    'home.heroSubtitle': 'Explore elite laptops, high-fidelity audio, and next-gen smart devices.',
    'home.cta': 'Shop Nexus Series',
    'home.featured': 'Featured Masterpieces',
    'home.bestSellers': 'Best Sellers',
    'home.newArrivals': 'New Arrivals',
    'home.reviewsTitle': 'What Technologists Say',
    'home.subscribe': 'Subscribe to Pravix',
    'home.subscribeDesc': 'Get intelligence reports on flash sales, new firmware, and exclusive discounts.',
    'cart.title': 'Your Intelligence Terminal (Cart)',
    'cart.empty': 'Your cart is currently empty.',
    'cart.saveLater': 'Saved for Later',
    'cart.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.coupon': 'Apply Coupon',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.specs': 'Specifications',
    'product.reviews': 'Reviews',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'checkout.title': 'Secure Gateway Checkout',
    'checkout.shipping': 'Shipping Address',
    'checkout.billing': 'Billing Address',
    'checkout.payment': 'Payment Method',
    'checkout.placeOrder': 'Authorize Payment & Order',
  },
  DE: {
    'nav.searchPlaceholder': 'Premium-Tech-Produkte suchen...',
    'nav.categories': 'Kategorien',
    'nav.wishlist': 'Wunschliste',
    'nav.cart': 'Warenkorb',
    'nav.login': 'Einloggen',
    'nav.register': 'Registrieren',
    'nav.logout': 'Abmelden',
    'home.heroTitle': 'Die Zukunft der Neural-Tech ist da',
    'home.heroSubtitle': 'Entdecken Sie Elite-Laptops, Hi-Fi-Audio und Smart-Geräte der nächsten Generation.',
    'home.cta': 'Nexus-Serie shoppen',
    'home.featured': 'Ausgewählte Meisterwerke',
    'home.bestSellers': 'Bestseller',
    'home.newArrivals': 'Neuerscheinungen',
    'home.reviewsTitle': 'Was Technologen sagen',
    'home.subscribe': 'Pravix abonnieren',
    'home.subscribeDesc': 'Erhalten Sie Berichte über Flash-Sales, neue Firmware und exklusive Rabatte.',
    'cart.title': 'Ihr Terminal (Warenkorb)',
    'cart.empty': 'Ihr Warenkorb ist derzeit leer.',
    'cart.saveLater': 'Für später gespeichert',
    'cart.summary': 'Bestellübersicht',
    'cart.subtotal': 'Zwischensumme',
    'cart.shipping': 'Versand',
    'cart.tax': 'Steuer',
    'cart.total': 'Gesamtsumme',
    'cart.checkout': 'Zur Kasse gehen',
    'cart.coupon': 'Gutschein anwenden',
    'product.addToCart': 'In den Warenkorb',
    'product.buyNow': 'Jetzt kaufen',
    'product.specs': 'Spezifikationen',
    'product.reviews': 'Bewertungen',
    'product.inStock': 'Auf Lager',
    'product.outOfStock': 'Ausverkauft',
    'checkout.title': 'Sicheres Kassen-Gateway',
    'checkout.shipping': 'Lieferadresse',
    'checkout.billing': 'Rechnungsadresse',
    'checkout.payment': 'Zahlungsmethode',
    'checkout.placeOrder': 'Zahlung autorisieren & bestellen',
  },
  ES: {
    'nav.searchPlaceholder': 'Buscar tecnología premium...',
    'nav.categories': 'Categorías',
    'nav.wishlist': 'Lista',
    'nav.cart': 'Carrito',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    'home.heroTitle': 'El futuro de la tecnología neural ya está aquí',
    'home.heroSubtitle': 'Explora portátiles de élite, audio de alta fidelidad y dispositivos inteligentes.',
    'home.cta': 'Comprar Serie Nexus',
    'home.featured': 'Obras Maestras Destacadas',
    'home.bestSellers': 'Más Vendidos',
    'home.newArrivals': 'Novedades',
    'home.reviewsTitle': 'Lo que dicen los tecnólogos',
    'home.subscribe': 'Suscribirse a Pravix',
    'home.subscribeDesc': 'Reciba informes sobre ventas flash, nuevo firmware y descuentos exclusivos.',
    'cart.title': 'Su Terminal de Compra (Carrito)',
    'cart.empty': 'Su carrito está actualmente vacío.',
    'cart.saveLater': 'Guardado para más tarde',
    'cart.summary': 'Resumen del Pedido',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Envío',
    'cart.tax': 'Impuesto',
    'cart.total': 'Total',
    'cart.checkout': 'Proceder al Pago',
    'cart.coupon': 'Aplicar Cupón',
    'product.addToCart': 'Añadir al Carrito',
    'product.buyNow': 'Comprar Ahora',
    'product.specs': 'Especificaciones',
    'product.reviews': 'Reseñas',
    'product.inStock': 'En Stock',
    'product.outOfStock': 'Sin Stock',
    'checkout.title': 'Pasarela de Pago Segura',
    'checkout.shipping': 'Dirección de Envío',
    'checkout.billing': 'Dirección de Facturación',
    'checkout.payment': 'Método de Pago',
    'checkout.placeOrder': 'Autorizar Pago y Pedido',
  },
  FR: {
    'nav.searchPlaceholder': 'Rechercher des produits tech...',
    'nav.categories': 'Catégories',
    'nav.wishlist': 'Favoris',
    'nav.cart': 'Panier',
    'nav.login': 'Connexion',
    'nav.register': 'S\'inscrire',
    'nav.logout': 'Déconnexion',
    'home.heroTitle': 'L\'avenir de la technologie neural est ici',
    'home.heroSubtitle': 'Découvrez des ordinateurs portables d\'élite, de l\'audio haute fidélité et des objets connectés.',
    'home.cta': 'Acheter la Série Nexus',
    'home.featured': 'Chefs-d\'œuvre Vedettes',
    'home.bestSellers': 'Meilleures Ventes',
    'home.newArrivals': 'Nouveautés',
    'home.reviewsTitle': 'Ce que disent les technologues',
    'home.subscribe': 'S\'abonner à Pravix',
    'home.subscribeDesc': 'Recevez des rapports sur les ventes flash, les nouveaux firmwares et les remises exclusives.',
    'cart.title': 'Votre Terminal d\'Achat (Panier)',
    'cart.empty': 'Votre panier est actuellement vide.',
    'cart.saveLater': 'Enregistré pour plus tard',
    'cart.summary': 'Résumé de la commande',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.tax': 'Taxe',
    'cart.total': 'Total',
    'cart.checkout': 'Passer à la caisse',
    'cart.coupon': 'Appliquer le coupon',
    'product.addToCart': 'Ajouter au Panier',
    'product.buyNow': 'Acheter Immédiatement',
    'product.specs': 'Spécifications',
    'product.reviews': 'Avis',
    'product.inStock': 'En Stock',
    'product.outOfStock': 'En Rupture',
    'checkout.title': 'Passerelle de Paiement Sécurisée',
    'checkout.shipping': 'Adresse de Livraison',
    'checkout.billing': 'Adresse de Facturation',
    'checkout.payment': 'Mode de Paiement',
    'checkout.placeOrder': 'Autoriser le Paiement',
  },
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'EN';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'USD';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    localStorage.setItem('currency', cur);
  };

  const formatPrice = (priceInUSD: number): string => {
    const rate = currencyRates[currency];
    const converted = priceInUSD * rate;
    const symbol = currencySymbols[currency];
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const t = (key: string): string => {
    const dictionary = translations[language];
    return dictionary[key] || translations['EN'][key] || key;
  };

  return (
    <LocaleContext.Provider value={{ language, currency, setLanguage, setCurrency, formatPrice, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within a LocaleProvider');
  return context;
};
