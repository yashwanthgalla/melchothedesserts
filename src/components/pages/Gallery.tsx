import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Heart } from 'lucide-react';

interface GalleryItem {
  id: number;
  url: string;
  category: 'waffles' | 'cheesecakes' | 'drinks' | 'vibes';
  title: string;
  likes: number;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
    category: 'waffles',
    title: 'Nutella Caramel Waffle Stack',
    likes: 142,
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    category: 'vibes',
    title: 'Warm Lounge Interiors',
    likes: 98,
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    category: 'cheesecakes',
    title: 'Biscoff Lotus Baked Cheesecake',
    likes: 215,
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    category: 'drinks',
    title: 'Signature Melted Cocoa',
    likes: 312,
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&w=800&q=80',
    category: 'waffles',
    title: 'Triple Cocoa Drizzle Waffle',
    likes: 189,
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    category: 'vibes',
    title: 'Gourmet Dessert Display',
    likes: 124,
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&w=800&q=80',
    category: 'cheesecakes',
    title: 'Chilled Blueberry Bliss',
    likes: 167,
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    category: 'drinks',
    title: 'Freakshake Double Fudge',
    likes: 245,
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    category: 'vibes',
    title: 'Midnight Cozy Glow',
    likes: 156,
  },
];

export const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<number[]>([]);

  const filteredItems = filter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === filter);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedPhotos.includes(id)) {
      setLikedPhotos(likedPhotos.filter(pId => pId !== id));
    } else {
      setLikedPhotos([...likedPhotos, id]);
    }
  };

  return (
    <div className="w-full min-h-screen py-24 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Visual Treats</span>
        <h1 className="text-4xl md:text-6xl font-serif text-luxury-cream mt-2 mb-4">Instagram Worthy</h1>
        <p className="text-sm md:text-base text-luxury-cream/70 max-w-xl mx-auto font-light">
          A glimpse into the luxurious aesthetic of Melcho. Discover plated masterpieces and late-night vibes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {['all', 'waffles', 'cheesecakes', 'drinks', 'vibes'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              filter === cat
                ? 'bg-accent-gold text-primary-dark font-bold'
                : 'bg-primary-brown/40 text-luxury-cream/80 border border-accent-gold/10 hover:border-accent-gold/30'
            }`}
          >
            {cat === 'drinks' ? 'Hot Chocolate & Drinks' : cat === 'vibes' ? 'Café Vibes' : cat}
          </button>
        ))}
      </div>

      {/* Pinterest Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const isLiked = likedPhotos.includes(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative break-inside-avoid rounded-2xl overflow-hidden border border-accent-gold/15 group shadow-md cursor-pointer"
                onClick={() => setActivePhoto(item)}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10" />

                {/* Hover Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20 pointer-events-none">
                  <div>
                    <span className="text-accent-gold text-[10px] uppercase font-bold tracking-widest font-mono">
                      {item.category === 'vibes' ? 'Ambience' : item.category}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-luxury-cream mt-0.5">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 pointer-events-auto">
                    <button 
                      onClick={(e) => toggleLike(item.id, e)}
                      className="p-2 rounded-full bg-primary-brown/80 border border-accent-gold/20 hover:bg-accent-gold hover:text-primary-dark text-luxury-cream transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-accent-gold'}`} />
                    </button>
                    <div className="p-2 rounded-full bg-primary-brown/80 border border-accent-gold/20 text-accent-gold">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary-dark/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-primary-brown/60 border border-accent-gold/20 text-luxury-cream hover:bg-accent-gold hover:text-primary-dark transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-accent-gold/30 glass-effect flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-2/3 h-full max-h-[50vh] md:max-h-[80vh] overflow-hidden">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-1/3 p-8 flex flex-col justify-between bg-primary-brown/10">
                <div>
                  <span className="text-accent-gold text-xs uppercase tracking-widest font-mono font-bold">
                    {activePhoto.category === 'vibes' ? 'Café Atmosphere' : activePhoto.category}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-luxury-cream mt-2 mb-4">{activePhoto.title}</h2>
                  
                  <p className="text-sm text-luxury-cream/70 leading-relaxed font-light">
                    Made fresh in our Vijayawada dessert lounge. Drop by between 5:30 PM &amp; 12:00 AM to indulge in these stunning plated items.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-accent-gold/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart 
                      className={`w-5 h-5 cursor-pointer ${
                        likedPhotos.includes(activePhoto.id) ? 'fill-red-500 text-red-500' : 'text-accent-gold'
                      }`}
                      onClick={(e) => toggleLike(activePhoto.id, e)}
                    />
                    <span className="text-xs font-mono text-muted-gold">
                      {activePhoto.likes + (likedPhotos.includes(activePhoto.id) ? 1 : 0)} Likes
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-muted-gold border border-accent-gold/20 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                    Melcho Exclusive
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Gallery;
