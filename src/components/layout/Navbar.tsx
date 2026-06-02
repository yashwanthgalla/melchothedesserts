import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sun, Moon, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for adding opaque shadows
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync light/dark mode class on body
  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    if (!isLightMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-primary-dark/25 py-3 backdrop-blur-[3px] shadow-[0_4px_30px_rgba(18,9,7,0.15)]' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 focus:outline-none cursor-pointer group"
          >
            <img 
              src="/logo.svg" 
              alt="Melcho Logo" 
              className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform duration-500 group-hover:rotate-12 rounded-full border border-accent-gold/25 shadow-md" 
            />
            <div className="flex flex-col items-start leading-none">
              <span className="text-xl md:text-2xl font-serif text-luxury-cream tracking-wider font-bold gold-glow">
                Melcho
              </span>
              <span className="text-[8px] md:text-[9px] text-accent-gold tracking-[0.2em] font-mono mt-0.5 uppercase font-bold">
                The Desserts
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Floating Pill Layout) */}
          <div className="hidden md:flex items-center gap-4 bg-glass-brown/50 border border-accent-gold/15 rounded-full py-2 px-5 backdrop-blur-md shadow-[0_8px_32px_rgba(18,9,7,0.25)]">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-xs uppercase tracking-wider relative px-3 py-1.5 cursor-pointer font-bold transition-colors duration-300 ${
                    isActive ? 'text-accent-gold' : 'text-luxury-cream/70 hover:text-accent-gold'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(229,192,123,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-accent-gold/10 hover:border-accent-gold/30 hover:bg-primary-brown/40 text-accent-gold transition-colors cursor-pointer"
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full border border-accent-gold/10 hover:border-accent-gold/30 hover:bg-primary-brown/40 text-accent-gold transition-all relative cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-accent-gold text-primary-dark font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-primary-dark"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-accent-gold/10 text-accent-gold cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] z-30 glass-effect border-b border-accent-gold/20 flex flex-col md:hidden py-6 px-8 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left text-sm font-semibold uppercase tracking-widest py-2 border-b border-accent-gold/5 cursor-pointer ${
                      isActive ? 'text-accent-gold font-bold' : 'text-luxury-cream'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
