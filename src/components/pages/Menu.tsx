import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../data/menuData';
import { ThreeDCard } from '../ui/ThreeDCard';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Search, Heart, Star } from 'lucide-react';

// Green vegetarian dot in a green square outline (standard in India)
const VegIcon: React.FC = () => (
  <div className="w-4 h-4 border border-green-600 flex items-center justify-center shrink-0 bg-white/5 rounded-[2px]" title="100% Vegetarian">
    <div className="w-2 h-2 rounded-full bg-green-600" />
  </div>
);

interface MenuProps {
  initialCategory?: string;
  setInitialCategory?: (category: string | undefined) => void;
}

export const Menu: React.FC<MenuProps> = ({ initialCategory, setInitialCategory }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('Bubble Waffle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      // Reset after consuming it
      if (setInitialCategory) {
        setInitialCategory(undefined);
      }
    }
  }, [initialCategory, setInitialCategory]);
  
  // Persisted wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('melcho_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('melcho_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (itemId: string) => {
    setWishlist((prev) => 
      prev.includes(itemId) 
        ? prev.filter((id) => id !== itemId) 
        : [...prev, itemId]
    );
  };

  // Filter items by category & search query
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTagStyles = (tag?: string) => {
    switch (tag) {
      case 'Must Try':
        return 'bg-accent-gold text-primary-dark border-primary-dark/20';
      case 'Trending':
        return 'bg-rose-950 text-rose-200 border-rose-800/40';
      case 'Popular':
        return 'bg-amber-950 text-amber-200 border-amber-800/40';
      default:
        return 'bg-primary-brown text-luxury-cream border-accent-gold/20';
    }
  };

  return (
    <div className="w-full min-h-screen py-24 px-4 md:px-12 max-w-7xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Artisanal Menu</span>
        <h1 className="text-4xl md:text-6xl font-serif text-luxury-cream mt-2 mb-4">Gourmet Creations</h1>
        <p className="text-sm md:text-base text-luxury-cream/70 max-w-xl mx-auto font-light">
          Choose from our fresh, premium desserts handcrafted daily. Indulge in warm bubble waffles, croissants, loaded buns, or custom toppings.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 relative">
        <input
          type="text"
          placeholder="Search dessert cravings (e.g., Oreo, Biscoff, Magnum)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-primary-brown/40 border border-accent-gold/20 focus:border-accent-gold text-luxury-cream rounded-full px-6 py-3 pl-12 outline-none text-sm transition-all backdrop-blur-md"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gold" />
      </div>

      {/* Category Horizontal Pill list */}
      <div className="flex overflow-x-auto pb-4 mb-12 scrollbar-none gap-3 justify-start md:justify-center -mx-4 px-4 sticky top-[72px] z-30 py-2 bg-primary-dark/80 backdrop-blur-sm border-b border-accent-gold/5">
        {MENU_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSearchQuery(''); // Reset search when switching categories
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-accent-gold text-primary-dark shadow-[0_4px_15px_rgba(229,192,123,0.3)] font-bold'
                  : 'bg-primary-brown/40 text-luxury-cream/80 border border-accent-gold/10 hover:border-accent-gold/30 hover:bg-primary-brown/60'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Grid of items */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isLiked = wishlist.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex"
                >
                  <ThreeDCard className="glass-effect rounded-2xl overflow-hidden border border-accent-gold/10 flex flex-col w-full">
                    {/* Image Area */}
                    <div className="relative h-56 overflow-hidden group shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Dark overlay fade on hover */}
                      <div className="absolute inset-0 bg-primary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Custom Tags/Ribbons */}
                      {item.tag && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border shadow-md tracking-wider ${getTagStyles(item.tag)}`}>
                            {item.tag}
                          </span>
                        </div>
                      )}

                      {/* Best Seller Ribbon */}
                      {item.isBestSeller && !item.tag && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-amber-600 text-luxury-cream border border-amber-500/30 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                            Best Seller
                          </span>
                        </div>
                      )}

                      {/* Top Right: Rating Indicator */}
                      <div className="absolute top-4 right-4 z-20 bg-primary-dark/80 backdrop-blur-sm border border-accent-gold/20 rounded-full py-1 px-2.5 flex items-center gap-1">
                        <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />
                        <span className="text-[10px] text-luxury-cream font-bold">{item.rating}</span>
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Title Row with Veg Icon */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <VegIcon />
                            <h3 className="text-lg font-serif font-bold text-luxury-cream group-hover:text-accent-gold transition-colors leading-snug">
                              {item.name}
                            </h3>
                          </div>
                          
                          {/* Heart wishlist button with bounce animation */}
                          <motion.button
                            onClick={() => toggleWishlist(item.id)}
                            whileTap={{ scale: 0.8 }}
                            className="p-1.5 rounded-full bg-primary-brown/40 border border-accent-gold/15 text-accent-gold hover:bg-accent-gold hover:text-primary-dark transition-all cursor-pointer shrink-0"
                            title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-accent-gold'}`} />
                          </motion.button>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-luxury-cream/70 leading-relaxed font-light mt-2 line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-accent-gold/10">
                        <span className="text-lg font-serif text-accent-gold font-bold">₹{item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-[0_2px_8px_rgba(229,192,123,0.15)] hover:shadow-[0_4px_15px_rgba(229,192,123,0.3)] cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add To Cart
                        </button>
                      </div>
                    </div>
                  </ThreeDCard>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center text-luxury-cream/50 font-light"
            >
              No desserts found matching "{searchQuery}" in this category.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
export default Menu;
