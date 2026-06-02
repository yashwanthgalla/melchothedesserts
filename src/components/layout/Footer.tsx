import React from 'react';
import { MapPin, Clock, Heart } from 'lucide-react';

const InstagramIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);



interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full bg-primary-dark border-t border-accent-gold/20 pt-16 pb-8 px-6 md:px-12 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Segment */}
        <div className="md:col-span-2 space-y-4">
          <button 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 focus:outline-none cursor-pointer text-left"
          >
            <img 
              src="/logo.svg" 
              alt="Melcho Logo" 
              className="h-12 w-12 object-contain rounded-full border border-accent-gold/25 shadow-md" 
            />
            <div className="flex flex-col items-start leading-none">
              <span className="text-2xl font-serif text-luxury-cream tracking-wider font-bold">
                Melcho
              </span>
              <span className="text-[9px] text-accent-gold tracking-[0.2em] font-mono mt-0.5 uppercase font-bold">
                The Desserts
              </span>
            </div>
          </button>
          <p className="text-sm text-luxury-cream/70 leading-relaxed font-light max-w-sm">
            Vijayawada's premium luxury dessert destination. Indulge in artisanal waffles, dense fudge brownies, velvety cheesecakes, and gourmet melted hot chocolates handcrafted fresh daily.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a 
              href="https://www.instagram.com/melcho.thedesserts/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-primary-brown/50 border border-accent-gold/20 text-accent-gold hover:bg-accent-gold hover:text-primary-dark transition-all"
              title="Follow us on Instagram"
            >
              <InstagramIcon />
            </a>

            <a 
              href="https://www.google.com/maps/place/Melcho+the+desserts/@16.505496,80.6454481,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35fb0065e1cd0f:0x4bd48dd449c20192!8m2!3d16.505496!4d80.6454481!16s%2Fg%2F11zhx2ymql?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-primary-brown/50 border border-accent-gold/20 text-accent-gold hover:bg-accent-gold hover:text-primary-dark transition-all"
              title="Locate us on Google Maps"
            >
              <MapPin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-accent-gold font-bold text-xs uppercase tracking-widest mb-6">Quick Navigation</h3>
          <ul className="space-y-3">
            {['Home', 'Menu', 'About', 'Gallery', 'Contact'].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => {
                    setActiveTab(tab.toLowerCase());
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-luxury-cream/80 hover:text-accent-gold transition-colors font-medium cursor-pointer"
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cafe Information */}
        <div>
          <h3 className="text-accent-gold font-bold text-xs uppercase tracking-widest mb-6">Store Details</h3>
          <ul className="space-y-4">
            <li className="flex gap-2 text-sm text-luxury-cream/80 leading-relaxed font-light">
              <MapPin className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <span>
                Rams VSR Apartments, Moghalrajpuram, Vijayawada
              </span>
            </li>
            <li className="flex gap-2 text-sm text-luxury-cream/80 leading-relaxed font-light">
              <Clock className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <span>
                Daily: 5:30 PM &ndash; 12:00 AM
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright row */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-accent-gold/10 flex flex-col md:flex-row items-center justify-between text-xs text-muted-gold font-light gap-4">
        <span>&copy; {new Date().getFullYear()} Melcho The Desserts. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Vijayawada, India
        </span>
      </div>
    </footer>
  );
};
export default Footer;
