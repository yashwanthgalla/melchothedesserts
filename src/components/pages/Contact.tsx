import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'Catering', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: 'Catering', message: '' });
    }, 800);
  };

  return (
    <div className="w-full min-h-screen py-24 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-accent-gold tracking-widest text-xs uppercase font-semibold">Get In Touch</span>
        <h1 className="text-4xl md:text-6xl font-serif text-luxury-cream mt-2 mb-4">Connect With Melcho</h1>
        <div className="w-24 h-0.5 bg-accent-gold mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Contact info + Map */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif text-luxury-cream mb-6">Store Details</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-accent-gold/10 p-3 rounded-xl border border-accent-gold/25 h-12 w-12 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-luxury-cream uppercase tracking-wider">Address</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed">
                    Ground Floor, Rams VSR Apartments,<br />
                    Opposite VPS Siddhartha Public School,<br />
                    Moghalrajpuram, Vijayawada, Andhra Pradesh - 520010
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-accent-gold/10 p-3 rounded-xl border border-accent-gold/25 h-12 w-12 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-luxury-cream uppercase tracking-wider">Business Hours</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed">
                    Open Every Day: <strong>5:30 PM &ndash; 12:00 AM</strong> (Midnight)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-accent-gold/10 p-3 rounded-xl border border-accent-gold/25 h-12 w-12 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-luxury-cream uppercase tracking-wider">Catering & Inquiry</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed">
                    Phone: <span className="hover:text-accent-gold transition-colors">+91 98765 43210</span><br />
                    WhatsApp: <span className="hover:text-accent-gold transition-colors">+91 98765 43211</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-accent-gold/10 p-3 rounded-xl border border-accent-gold/25 h-12 w-12 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-luxury-cream uppercase tracking-wider">Email Correspondence</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed hover:text-accent-gold transition-colors">
                    hello@melchodesserts.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-accent-gold/10 p-3 rounded-xl border border-accent-gold/25 h-12 w-12 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-accent-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-luxury-cream uppercase tracking-wider">Instagram Feed</h4>
                  <p className="text-luxury-cream/70 text-sm mt-1 leading-relaxed">
                    Follow us: <a href="https://www.instagram.com/melcho.thedesserts/" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:underline font-bold">@melcho.thedesserts</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-accent-gold/20 shadow-xl relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.267980313887!2d80.6428732!3d16.505496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fb0065e1cd0f%3A0x4bd48dd449c20192!2sMelcho%20the%20desserts!5e0!3m2!1sen!2sin!4v1717325000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              allowFullScreen={true}
              loading="lazy"
              title="Melcho Google Location Map"
            />
          </div>
        </div>

        {/* Dynamic Form */}
        <div className="glass-effect p-8 rounded-2xl border border-accent-gold/15 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-serif text-luxury-cream mb-2">Write To Us</h2>
            <p className="text-xs text-luxury-cream/60 mb-6 font-light">
              Planning a party or corporate catering in Vijayawada? Want a custom-baked celebration cake? Send us a message and our chefs will get in touch.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-accent-gold mb-4" />
                  <h3 className="text-xl font-serif text-luxury-cream font-bold">Message Received</h3>
                  <p className="text-xs text-luxury-cream/70 mt-2 max-w-xs">
                    Thank you for writing. Our dessert specialists will contact you shortly!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs text-accent-gold underline hover:text-accent-gold/80 cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-gold tracking-wider block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-primary-brown/30 border border-accent-gold/15 focus:border-accent-gold rounded-xl px-4 py-3 text-sm text-luxury-cream outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-gold tracking-wider block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-primary-brown/30 border border-accent-gold/15 focus:border-accent-gold rounded-xl px-4 py-3 text-sm text-luxury-cream outline-none transition-colors"
                        placeholder="+91 99999 88888"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-gold tracking-wider block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-primary-brown/30 border border-accent-gold/15 focus:border-accent-gold rounded-xl px-4 py-3 text-sm text-luxury-cream outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-gold tracking-wider block mb-1">Inquiry Type</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-primary-brown/30 border border-accent-gold/15 focus:border-accent-gold rounded-xl px-4 py-3 text-sm text-luxury-cream outline-none transition-colors"
                    >
                      <option value="Catering" className="bg-primary-brown text-luxury-cream">Catering Services</option>
                      <option value="Celebration Cake" className="bg-primary-brown text-luxury-cream">Celebration Cake Order</option>
                      <option value="Table Booking" className="bg-primary-brown text-luxury-cream">Table / VIP Space Booking</option>
                      <option value="General Feedback" className="bg-primary-brown text-luxury-cream">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-gold tracking-wider block mb-1">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-primary-brown/30 border border-accent-gold/15 focus:border-accent-gold rounded-xl px-4 py-3 text-sm text-luxury-cream outline-none transition-colors resize-none"
                      placeholder="Share details about your gathering date, guest count, or sweet requests..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(229,192,123,0.2)] cursor-pointer"
                  >
                    Send Message <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 pt-6 border-t border-accent-gold/10 flex items-center justify-between text-xs text-muted-gold">
            <span>Or chat via WhatsApp</span>
            <a 
              href="https://wa.me/919876543211" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-accent-gold font-bold hover:underline"
            >
              Start Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
