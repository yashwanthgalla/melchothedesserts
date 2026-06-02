import React, { useEffect, useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { MENU_ITEMS, type MenuItem } from '../../data/menuData';

interface ThreeDScrollShowcaseProps {
  setActiveTab?: (tab: string) => void;
  setMenuInitialCategory?: (category: string | undefined) => void;
}

export const ThreeDScrollShowcase: React.FC<ThreeDScrollShowcaseProps> = ({ setActiveTab, setMenuInitialCategory }) => {
  const { addToCart } = useCart();
  const [shuffledItems, setShuffledItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Shuffle the menu items on load so the gallery feels fresh and dynamic on every visit
    const items = [...MENU_ITEMS].sort(() => Math.random() - 0.5);
    setShuffledItems(items);
  }, []);

  const handleViewInMenu = (category: string) => {
    if (setMenuInitialCategory) {
      setMenuInitialCategory(category);
    }
    if (setActiveTab) {
      setActiveTab('menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Duplicate the array of items to create a seamless, infinite marquee loop
  const marqueeItems = [...shuffledItems, ...shuffledItems];

  return (
    <section className="py-24 bg-primary-dark border-t border-b border-accent-gold/15 relative overflow-hidden">
      {/* Mesh grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(229,192,123,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(229,192,123,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Ambient background gold flares */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
        <span className="text-accent-gold uppercase tracking-[0.25em] text-[10px] md:text-xs font-bold font-mono">
          Our Dessert Gallery
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-luxury-cream mt-2 font-bold gold-glow">
          Conveyor of Cravings
        </h2>
        <p className="mt-4 text-luxury-cream/70 leading-relaxed text-xs md:text-sm font-light max-w-xl mx-auto">
          Hover over any floating dessert plate to view details, add it straight to your cart, or click to explore it inside our menu.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Container */}
      <div className="w-full overflow-hidden relative py-4 z-10">
        <div className="marquee-track">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[160px] h-[160px] md:w-[220px] md:h-[220px] rounded-full border border-luxury-cream/15 bg-primary-brown/50 backdrop-blur-xl flex items-center justify-center shadow-lg transition-all duration-500 circular-gallery-item shrink-0"
            >
              {/* Outer Glow effect on active hovered element */}
              <div className="absolute inset-0 rounded-full border border-accent-gold/0 hover:border-accent-gold shadow-[0_0_20px_rgba(229,192,123,0)] hover:shadow-[0_0_20px_rgba(229,192,123,0.25)] pointer-events-none transition-all duration-300" />
              
              <div className="w-[120px] h-[120px] md:w-[170px] md:h-[170px] rounded-full overflow-hidden border border-accent-gold/15 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/45 via-transparent to-transparent" />
              </div>

              {/* Circular Gallery Action Overlay */}
              <div 
                onClick={() => handleViewInMenu(item.category)}
                className="circular-gallery-overlay"
              >
                <h4 className="circular-gallery-title font-bold text-center w-full px-2 truncate">
                  {item.name}
                </h4>
                <p className="circular-gallery-price font-serif">
                  ₹{item.price}
                </p>
                <div className="circular-gallery-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="circular-gallery-btn"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInMenu(item.category);
                    }}
                    className="circular-gallery-btn"
                    title="View in Menu"
                  >
                    <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeDScrollShowcase;
