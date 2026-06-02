import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Clock, Award } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { icon: <Sparkles className="w-6 h-6 text-accent-gold" />, title: '100% Handcrafted', desc: 'Every single sauce, syrup, waffle base, and brownie is prepared fresh daily.' },
    { icon: <Clock className="w-6 h-6 text-accent-gold" />, title: 'Midnight Cravings', desc: 'Serving happiness from 5:30 PM until 12:00 AM midnight, every day.' },
    { icon: <Heart className="w-6 h-6 text-accent-gold" />, title: 'Imported Cocoa', desc: 'We only cook with authentic, top-grade imported Belgian chocolates.' },
    { icon: <Award className="w-6 h-6 text-accent-gold" />, title: 'Premium Lounge', desc: 'Cozy, modern, dark elegant seating designed for visual and culinary excellence.' },
  ];

  return (
    <div className="w-full min-h-screen py-24 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Our Journey</span>
        <h1 className="text-4xl md:text-6xl font-serif text-luxury-cream mt-2 mb-4">The Melcho Story</h1>
        <div className="w-24 h-0.5 bg-accent-gold mx-auto mt-4" />
      </div>

      {/* Intro Block: Image Left, Text Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-accent-gold/20"
        >
          <img
            src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
            alt="Melcho Cafe Atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent flex items-end p-6">
            <div>
              <p className="text-accent-gold text-xs uppercase tracking-widest font-semibold">ESTD. 2026</p>
              <h3 className="text-xl font-serif text-luxury-cream mt-1 font-bold">Moghalrajpuram Lounge</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-serif text-luxury-cream italic">
            &ldquo;A cozy premium dessert destination in Vijayawada serving handcrafted desserts daily from 5:30 PM.&rdquo;
          </h2>
          <p className="text-luxury-cream/80 text-sm leading-relaxed font-light">
            Melcho was born from a singular passion: to elevate Vijayawada's dessert culture to international standards. Located in the heart of Moghalrajpuram, we combine rich, dark modern interiors with sweet, sensory masterpieces. 
          </p>
          <p className="text-luxury-cream/80 text-sm leading-relaxed font-light">
            We believe that a dessert shouldn't just taste spectacular; it should look like art and feel like a celebration. That's why we import the finest cocoa solids, melt chocolate fresh for every order, and serve everything in a stunning lounge space that's custom-built for Instagram and memory-making.
          </p>
          <div className="pt-4 border-t border-accent-gold/15 flex items-center gap-6">
            <div>
              <div className="text-2xl font-serif font-bold text-accent-gold">5:30 PM</div>
              <div className="text-[10px] text-muted-gold uppercase tracking-wider mt-1">Doors Open</div>
            </div>
            <div className="w-px h-10 bg-accent-gold/20" />
            <div>
              <div className="text-2xl font-serif font-bold text-accent-gold">12:00 AM</div>
              <div className="text-[10px] text-muted-gold uppercase tracking-wider mt-1">Midnight Close</div>
            </div>
            <div className="w-px h-10 bg-accent-gold/20" />
            <div>
              <div className="text-2xl font-serif font-bold text-accent-gold">Vijayawada</div>
              <div className="text-[10px] text-muted-gold uppercase tracking-wider mt-1">Home Brand</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid of Perks / Stats */}
      <div className="py-16 border-t border-b border-accent-gold/15 mb-24">
        <div className="text-center mb-12">
          <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Core Values</span>
          <h2 className="text-2xl md:text-3xl font-serif text-luxury-cream mt-1">Why Patrons Love Melcho</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-effect p-6 rounded-2xl border border-accent-gold/10 text-center flex flex-col items-center"
            >
              <div className="mb-4 bg-accent-gold/10 p-3 rounded-xl border border-accent-gold/25">
                {stat.icon}
              </div>
              <h3 className="text-base font-bold text-luxury-cream mb-2">{stat.title}</h3>
              <p className="text-xs text-luxury-cream/70 leading-relaxed font-light">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ambience segment with 3 photo rows */}
      <div>
        <div className="text-center mb-12">
          <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Atmosphere</span>
          <h2 className="text-2xl md:text-3xl font-serif text-luxury-cream mt-1">Our Cozy Ambience</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl overflow-hidden border border-accent-gold/10 relative group">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
              alt="Cozy interior seating"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-luxury-cream border border-luxury-cream px-4 py-2 rounded-full backdrop-blur-sm">
                Comfort Seating
              </span>
            </div>
          </div>

          <div className="h-64 rounded-2xl overflow-hidden border border-accent-gold/10 relative group">
            <img
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80"
              alt="Espresso bar and dessert counter"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-luxury-cream border border-luxury-cream px-4 py-2 rounded-full backdrop-blur-sm">
                Luxury Counter
              </span>
            </div>
          </div>

          <div className="h-64 rounded-2xl overflow-hidden border border-accent-gold/10 relative group">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
              alt="Night lighting atmosphere"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-luxury-cream border border-luxury-cream px-4 py-2 rounded-full backdrop-blur-sm">
                Aesthetic Lighting
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
