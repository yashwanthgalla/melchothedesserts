import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, ArrowRight, ShoppingBag, Clock, ShieldCheck, Flame, Compass } from 'lucide-react';
import { MENU_ITEMS, type MenuItem } from '../../data/menuData';
import { useCart } from '../../context/CartContext';

interface DeliverySectionProps {
  setActiveTab?: (tab: string) => void;
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({ setActiveTab }) => {
  const { addToCart } = useCart();
  const [deliveryItems, setDeliveryItems] = useState<MenuItem[]>([]);

  // Sync delivery items from menu database
  useEffect(() => {
    const targets = [
      'Bubble Waffle With Fruit',
      'Magnum Cake',
      'Biscoff Cheesecake',
      'Oreo Bubble Waffle',
      'Hot Chocolate',
      'Tres Leches'
    ];
    // Find matching items from MENU_ITEMS
    const filtered = MENU_ITEMS.filter((item) => targets.includes(item.name));
    setDeliveryItems(filtered);
  }, []);

  const handleWhatsAppOrder = (itemName?: string) => {
    const message = itemName
      ? `Hi Melcho, I'd like to order "${itemName}" for door delivery!`
      : `Hi Melcho, I'd like to place an order for door delivery!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/918919196565?text=${encoded}`, '_blank');
  };

  return (
    <section className="relative py-24 px-6 md:px-12 w-full bg-primary-dark overflow-hidden border-t border-accent-gold/15">
      {/* Cinematic Night Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(229,192,123,0.06)_0px,transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Decorative neon linear lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* LEFT COLUMN: HERO CONTENT */}
        <div className="lg:col-span-6 space-y-8 relative z-10">
          
          {/* Rapido Delivery Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/35 px-4 py-1.5 rounded-full backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
            <span className="text-[10px] md:text-xs font-bold text-[#F59E0B] tracking-wider uppercase font-mono">
              Fast Delivery Across Vijayawada via Rapido
            </span>
          </motion.div>

          {/* Headlines */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif text-luxury-cream leading-tight font-bold">
              Now At Your <br />
              <span className="text-accent-gold">Doorstep</span>
            </h2>
            <p className="text-lg md:text-xl font-medium text-accent-gold/90 font-serif italic">
              Fresh desserts delivered hot & fast through Rapido Parcel
            </p>
            <p className="text-sm md:text-base text-luxury-cream/70 leading-relaxed font-light max-w-xl">
              Order your favorite waffles, brownies, cheesecakes, croissants & more without leaving home. Packed in premium insulated boxes so they arrive tasting exactly as chef intended.
            </p>
          </div>

          {/* Late Night Banner Alert */}
          <div className="relative overflow-hidden glass-effect p-4 rounded-xl border border-red-500/20 bg-red-950/10 max-w-md">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-500/5 rounded-full blur-xl" />
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">Late Night Dessert Cravings?</h4>
                <p className="text-[11px] text-luxury-cream/80 mt-0.5">We deliver daily from <strong>5:30 PM &ndash; Midnight</strong>.</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md pt-2">
            <button
              onClick={() => handleWhatsAppOrder()}
              className="px-6 py-4 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.03] shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" /> Order on WhatsApp
            </button>
            
            <a
              href="tel:+918919196565"
              className="px-6 py-4 rounded-full border border-accent-gold/40 hover:border-accent-gold text-luxury-cream hover:bg-accent-gold/10 font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-accent-gold" /> Call: +91 8919196565
            </a>
            
            {setActiveTab && (
              <button
                onClick={() => setActiveTab('menu')}
                className="text-xs text-accent-gold/80 hover:text-accent-gold font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-center sm:ml-2 py-2"
              >
                Explore Menu <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: POPULAR DELIVERY ITEMS GRID */}
        <div className="lg:col-span-6 space-y-6 relative z-10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] font-mono flex items-center gap-1.5 border-b border-accent-gold/10 pb-2">
            <Compass className="w-4 h-4 animate-spin-slow" /> Popularly Ordered At Home
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            {deliveryItems.map((item) => (
              <div
                key={item.id}
                className="bg-primary-brown/30 border border-accent-gold/10 hover:border-accent-gold/30 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="h-28 sm:h-32 overflow-hidden relative shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 right-2 bg-accent-gold/90 text-primary-dark text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                    ₹{item.price}
                  </div>
                </div>
                
                <div className="p-3.5 flex-grow flex flex-col justify-between">
                  <h5 className="text-xs font-serif font-bold text-luxury-cream group-hover:text-accent-gold transition-colors truncate">
                    {item.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-grow py-1.5 bg-primary-brown/80 hover:bg-accent-gold hover:text-primary-dark border border-accent-gold/20 hover:border-accent-gold text-[10px] font-bold rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" /> Add +
                    </button>
                    <button
                      onClick={() => handleWhatsAppOrder(item.name)}
                      className="p-1.5 bg-green-950/30 hover:bg-green-600 border border-green-800/40 hover:border-green-600 text-green-400 hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0"
                      title="Order Now via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-accent-gold/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs text-luxury-cream/80 relative z-10">
        <div className="flex flex-col items-center gap-2">
          <Clock className="w-5 h-5 text-accent-gold animate-pulse" />
          <span><strong>Fast Delivery</strong><br /><span className="text-[10px] text-luxury-cream/50">In 30–45 mins</span></span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent-gold" />
          <span><strong>Secure Packaging</strong><br /><span className="text-[10px] text-luxury-cream/50">Tamper-proof seals</span></span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Flame className="w-5 h-5 text-accent-gold" />
          <span><strong>Freshly Prepared</strong><br /><span className="text-[10px] text-luxury-cream/50">Made post order</span></span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Compass className="w-5 h-5 text-accent-gold animate-spin-slow" />
          <span><strong>Late Night Delivery</strong><br /><span className="text-[10px] text-luxury-cream/50">Till 12:00 AM Midnight</span></span>
        </div>
      </div>

    </section>
  );
};
