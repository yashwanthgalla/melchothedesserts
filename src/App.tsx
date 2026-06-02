import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { Home } from './components/pages/Home';
import { Menu } from './components/pages/Menu';
import { About } from './components/pages/About';
import { Gallery } from './components/pages/Gallery';
import { Contact } from './components/pages/Contact';
import { FloatingParticles } from './components/ui/FloatingParticles';
import './App.css';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [menuInitialCategory, setMenuInitialCategory] = useState<string | undefined>(undefined);
  const { cartCount, setIsCartOpen } = useCart();

  // Page switching logic with transition configurations
  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} setMenuInitialCategory={setMenuInitialCategory} />;
      case 'menu':
        return <Menu initialCategory={menuInitialCategory} setInitialCategory={setMenuInitialCategory} />;
      case 'about':
        return <About />;
      case 'gallery':
        return <Gallery />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setActiveTab={setActiveTab} setMenuInitialCategory={setMenuInitialCategory} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Ambient background particles */}
      <FloatingParticles />
      {/* Sticky Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Pages content wrapper with transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Shopping Cart Slider Drawer */}
      <CartDrawer />

      {/* Floating Action Cart Button (Reveals itself when scroll down or has items) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark p-4 rounded-full shadow-[0_10px_25px_rgba(229,192,123,0.5)] border border-primary-dark cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-bold font-mono bg-primary-dark text-accent-gold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
