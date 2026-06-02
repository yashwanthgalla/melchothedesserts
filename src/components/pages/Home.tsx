import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Star, ChevronRight, Phone } from 'lucide-react';
import { MENU_ITEMS } from '../../data/menuData';
import { ThreeDCard } from '../ui/ThreeDCard';
import { ThreeDScrollShowcase } from '../ui/ThreeDScrollShowcase';
import { useCart } from '../../context/CartContext';
import { DeliverySection } from '../sections/DeliverySection';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface HomeProps {
  setActiveTab: (tab: string) => void;
  setMenuInitialCategory?: (category: string | undefined) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, setMenuInitialCategory }) => {
  const { addToCart } = useCart();
  
  // Shuffle featured items on reload
  const [bestSellers, setBestSellers] = useState<typeof MENU_ITEMS>([]);
  const [localFavorites, setLocalFavorites] = useState<typeof MENU_ITEMS>([]);

  useEffect(() => {
    const shuffleArray = (array: typeof MENU_ITEMS) => [...array].sort(() => Math.random() - 0.5);
    
    const sellers = MENU_ITEMS.filter((item) => item.isBestSeller);
    const favorites = MENU_ITEMS.filter((item) => item.tag === 'Trending' || item.tag === 'Popular');
    
    setBestSellers(shuffleArray(sellers).slice(0, 3));
    setLocalFavorites(shuffleArray(favorites).slice(0, 4));
  }, []);

  // Stagger animation configuration

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 md:px-12 pt-16">
        {/* Luxury Background Image with Dark Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 brightness-[0.25]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Soft Gold overlay tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/60 to-transparent -z-10" />

        <div className="text-center max-w-4xl mx-auto z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="text-accent-gold tracking-[0.3em] uppercase text-xs md:text-sm font-semibold border-b border-accent-gold/30 pb-2">
              VIJAYAWADA'S LUXURY DESSERT BOUTIQUE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif text-luxury-cream tracking-tight leading-none mb-6 gold-glow"
          >
            Melcho <br className="md:hidden" />
            <span className="text-accent-gold">The Desserts</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl font-medium text-luxury-cream/80 max-w-2xl mx-auto mb-8 font-serif italic tracking-wide"
          >
            Croissants &bull; Waffles &bull; Brownies &bull; Mini Pancakes &bull; Hot Chocolate
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md"
          >
            <button
              onClick={() => setActiveTab('menu')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(229,192,123,0.3)] cursor-pointer"
            >
              Explore Menu <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-accent-gold/40 hover:border-accent-gold text-luxury-cream hover:bg-accent-gold/10 font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              Visit Us <MapPin className="w-4 h-4 text-accent-gold" />
            </button>
          </motion.div>
          
          {/* Working hours notice */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex items-center gap-2 text-xs md:text-sm text-muted-gold bg-primary-brown/40 border border-accent-gold/10 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <Clock className="w-4 h-4 text-accent-gold animate-pulse" />
            <span>Handcrafted fresh daily from <strong>5:30 PM &ndash; 12:00 AM</strong></span>
          </motion.div>
        </div>
      </section>

      {/* 2. Most Loved / Best Sellers Section */}
      <section className="py-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Premium Selection</span>
          <h2 className="text-3xl md:text-5xl font-serif text-luxury-cream mt-2">Most Loved Desserts</h2>
          <div className="w-24 h-0.5 bg-accent-gold mx-auto mt-4" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {bestSellers.map((item) => (
            <ThreeDCard key={item.id} className="glass-effect rounded-2xl overflow-hidden border border-accent-gold/10 flex flex-col h-full">
              <div className="relative overflow-hidden h-64 group">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-accent-gold text-primary-dark text-xs font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                  Best Seller
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                    ))}
                    <span className="text-xs text-muted-gold ml-1">({item.rating})</span>
                  </div>
                  <h3 className="text-xl font-serif text-luxury-cream mb-2 font-bold">{item.name}</h3>
                  <p className="text-luxury-cream/70 text-sm mb-4 leading-relaxed line-clamp-3">{item.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent-gold/10">
                  <span className="text-xl font-serif text-accent-gold font-bold">₹{item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark rounded-full text-xs font-bold transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,192,123,0.4)] cursor-pointer"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </ThreeDCard>
          ))}
        </motion.div>
      </section>

      {/* 3. Signature 3D Interactive Showcase */}
      <ThreeDScrollShowcase setActiveTab={setActiveTab} setMenuInitialCategory={setMenuInitialCategory} />

      {/* 4. What Vijayawada Loves Section */}
      <section className="py-24 px-4 md:px-12 bg-primary-brown/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Local Favorites</span>
              <h2 className="text-3xl md:text-5xl font-serif text-luxury-cream mt-2">What Vijayawada Loves</h2>
            </div>
            <button
              onClick={() => setActiveTab('menu')}
              className="mt-4 md:mt-0 flex items-center gap-1 text-accent-gold hover:text-accent-gold/80 transition-colors text-sm font-semibold cursor-pointer"
            >
              View Full Menu <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {localFavorites.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-xl overflow-hidden group hover:border-accent-gold/30 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-xs text-luxury-cream/90">{item.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-3 h-3 border border-green-600 flex items-center justify-center bg-white/5 rounded-[1px] shrink-0" title="100% Vegetarian">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    </div>
                    <h3 className="text-sm font-bold text-luxury-cream group-hover:text-accent-gold transition-colors truncate">{item.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-accent-gold font-serif font-bold">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1.5 bg-primary-brown/60 hover:bg-accent-gold hover:text-primary-dark text-accent-gold border border-accent-gold/20 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5. Premium Door Delivery / Order Online Section */}
      <DeliverySection setActiveTab={setActiveTab} />

      {/* 5. Google Review Rating Stats & Customer Reviews */}
      <section className="py-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div>
            <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Social Verification</span>
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-cream mt-2 mb-6">Loved by Hundreds on Google Reviews</h2>
            <p className="text-luxury-cream/70 text-sm leading-relaxed mb-6">
              Don't just take our word for it. Our patrons rank us as one of the premier dessert lounges in Moghalrajpuram. Drop in to experience the gold standard of sweet tooth indulgence.
            </p>
            <div className="glass-effect p-6 rounded-2xl border border-accent-gold/20 flex items-center gap-4">
              <div className="bg-accent-gold/10 p-4 rounded-xl flex items-center justify-center">
                <Star className="w-10 h-10 text-accent-gold fill-accent-gold" />
              </div>
              <div>
                <div className="text-3xl font-serif text-accent-gold font-bold">4.9 / 5.0</div>
                <div className="text-xs text-muted-gold mt-1">Based on 350+ Google reviews</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Review 1 */}
            <div className="glass-effect p-6 rounded-2xl border border-accent-gold/10 flex flex-col justify-between">
              <p className="text-sm text-luxury-cream/80 italic leading-relaxed">
                "Melcho is hands down the best dessert spot in Vijayawada! The Signature Melted Hot Chocolate is thick, rich, and absolutely delicious. The ambient dark theme feels very aesthetic, and it's a great hangout place."
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-luxury-cream">Sai Kumar</h4>
                  <p className="text-[10px] text-muted-gold">Google Local Guide</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
                  ))}
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-effect p-6 rounded-2xl border border-accent-gold/10 flex flex-col justify-between">
              <p className="text-sm text-luxury-cream/80 italic leading-relaxed">
                "The Biscoff Lotus Cheesecake was a total dream. Extremely creamy and perfect texture. I love that they serve till midnight. Vijayawada definitely needed a late-night luxury dessert parlor like Melcho."
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-luxury-cream">Priyanka R.</h4>
                  <p className="text-[10px] text-muted-gold">Food Enthusiast</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Instagram Gallery Feed Preview */}
      <section className="py-16 px-4 md:px-12 bg-primary-brown/10 border-t border-b border-accent-gold/10">
        <div className="max-w-7xl mx-auto text-center">
          <InstagramIcon className="w-8 h-8 text-accent-gold mx-auto mb-4 animate-bounce" />
          <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Share Your Melcho Moments</span>
          <h2 className="text-3xl md:text-5xl font-serif text-luxury-cream mt-2">Tag Us @melcho.thedesserts</h2>
          <p className="text-sm text-luxury-cream/70 mt-4 max-w-xl mx-auto">
            Take a snap of your delicious dessert, tag us on Instagram, and stand a chance to get featured on our wall or win a free hot chocolate cup!
          </p>
          <div className="mt-8">
            <a 
              href="https://www.instagram.com/melcho.thedesserts/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_4px_20px_rgba(229,192,123,0.3)] cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" /> Follow @melcho.thedesserts
            </a>
          </div>
        </div>
      </section>

      {/* 6.5. Behind The Scenes / Brand Video Section */}
      <section className="py-20 px-6 md:px-12 bg-primary-dark border-t border-b border-accent-gold/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Behind The Scenes</span>
            <h2 className="text-3xl md:text-5xl font-serif text-luxury-cream mt-2 font-bold gold-glow">Crafting Cravings</h2>
            <p className="mt-4 text-luxury-cream/70 leading-relaxed text-sm md:text-base font-light max-w-lg">
              Take a look inside the kitchen of Vijayawada's premium dessert boutique. Witness how we craft signature waffles, dense brownies, and hot chocolates fresh daily.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="glass-effect px-4 py-2 rounded-full border border-accent-gold/15 text-xs text-accent-gold font-semibold">🧇 Fresh Waffles</div>
              <div className="glass-effect px-4 py-2 rounded-full border border-accent-gold/15 text-xs text-accent-gold font-semibold">🍫 Rich Brownies</div>
              <div className="glass-effect px-4 py-2 rounded-full border border-accent-gold/15 text-xs text-accent-gold font-semibold">☕ Hot Chocolate</div>
              <div className="glass-effect px-4 py-2 rounded-full border border-accent-gold/15 text-xs text-accent-gold font-semibold">🥐 Croissants</div>
            </div>
          </div>

          {/* Right: Video Player */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-72 md:w-80 overflow-hidden rounded-xl">
              <video
                src="/Herovideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
                style={{ transform: 'rotate(-90deg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Location & Timing Section */}
      <section className="py-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Location & Timings</span>
            <h2 className="text-3xl md:text-5xl font-serif text-luxury-cream mt-2 mb-8">Plan Your Visit</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-accent-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-luxury-cream">Address</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed">
                    Ground Floor, Rams VSR Apartments,<br />
                    Opposite VPS Siddhartha Public School,<br />
                    Moghalrajpuram, Vijayawada, Andhra Pradesh
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-accent-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-luxury-cream">Timings</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed">
                    Open Every Day: <strong>5:30 PM &ndash; 12:00 AM</strong> (Midnight)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-accent-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-luxury-cream">Phone</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed">
                    +91 98765 43210 (Placeholder)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <a 
                href="https://www.google.com/maps/place/Melcho+the+desserts/@16.505496,80.6454481,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35fb0065e1cd0f:0x4bd48dd449c20192!8m2!3d16.505496!4d80.6454481!16s%2Fg%2F11zhx2ymql?entry=ttu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-accent-gold text-primary-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-accent-gold/90 transition-all duration-300 cursor-pointer"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-96 rounded-2xl overflow-hidden border border-accent-gold/20 shadow-2xl relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.267980313887!2d80.6428732!3d16.505496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fb0065e1cd0f%3A0x4bd48dd449c20192!2sMelcho%20the%20desserts!5e0!3m2!1sen!2sin!4v1717325000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              allowFullScreen={true}
              loading="lazy"
              title="Melcho The Desserts Location Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
