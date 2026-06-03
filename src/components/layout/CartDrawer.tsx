import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const { isAuthenticated, setActiveTab } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [diningMode, setDiningMode] = useState<'takeaway' | 'dinein'>('takeaway');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!isAuthenticated) {
      setIsCartOpen(false);
      setActiveTab('auth');
      alert('Please log in or register to complete your order.');
      return;
    }

    // Construct formatted text message for WhatsApp API
    const businessNumber = '919876543211'; // Café WhatsApp number
    let message = `*MELCHO THE DESSERTS - NEW ORDER*\n`;
    message += `===============================\n`;
    message += `*Customer:* ${customerName}\n`;
    message += `*Phone:* ${customerPhone}\n`;
    message += `*Mode:* ${diningMode === 'dinein' ? '🍽️ Dine-In' : '🥡 Takeaway'}\n`;
    message += `===============================\n\n`;
    message += `*Items ordered:*\n`;

    cartItems.forEach((ci) => {
      message += `- ${ci.quantity}x _${ci.item.name}_ (₹${ci.item.price * ci.quantity})\n`;
    });

    message += `\n*Grand Total:* ₹${cartTotal}\n`;
    message += `===============================\n`;
    message += `_Sent from Melcho Online Lounge_`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodedText}`;

    // Open WhatsApp link in a new window
    window.open(whatsappUrl, '_blank');
    
    // Reset inputs & close cart
    setCustomerName('');
    setCustomerPhone('');
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-primary-dark z-50 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-primary-dark/95 border-l border-accent-gold/20 shadow-2xl z-50 flex flex-col glass-effect"
          >
            {/* Header */}
            <div className="p-6 border-b border-accent-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent-gold" />
                <h2 className="text-xl font-serif text-luxury-cream font-bold">Your Cravings</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full border border-accent-gold/10 hover:border-accent-gold/30 hover:bg-primary-brown/40 text-accent-gold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((ci) => (
                  <div
                    key={ci.item.id}
                    className="flex gap-4 p-3 rounded-xl bg-primary-brown/20 border border-accent-gold/5 items-center justify-between"
                  >
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-accent-gold/15"
                    />
                    
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold text-luxury-cream truncate">{ci.item.name}</h4>
                      <p className="text-xs text-accent-gold font-serif mt-1">₹{ci.item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                          className="p-1 rounded bg-primary-brown/60 text-luxury-cream border border-accent-gold/10 hover:border-accent-gold/35"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-luxury-cream px-1">{ci.quantity}</span>
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                          className="p-1 rounded bg-primary-brown/60 text-luxury-cream border border-accent-gold/10 hover:border-accent-gold/35"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(ci.item.id)}
                      className="p-2 text-luxury-cream/50 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-luxury-cream/50 space-y-2 py-12">
                  <ShoppingBag className="w-12 h-12 text-accent-gold/30" />
                  <p className="font-light text-sm">Your dessert bag is empty.</p>
                  <p className="text-xs text-luxury-cream/35">Explore our menu and add your favorite chocolate delights!</p>
                </div>
              )}
            </div>

            {/* Checkout Form & Pricing */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-accent-gold/15 bg-primary-brown/10 space-y-4">
                {/* Cost summary */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-gold">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-gold">
                    <span>CGST + SGST (5%)</span>
                    <span>₹{Math.round(cartTotal * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-luxury-cream pt-2 border-t border-accent-gold/10">
                    <span>Grand Total</span>
                    <span className="text-accent-gold font-serif">₹{cartTotal + Math.round(cartTotal * 0.05)}</span>
                  </div>
                </div>

                {/* Simulated Checkout Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-primary-dark/80 border border-accent-gold/15 focus:border-accent-gold text-xs rounded-lg px-3 py-2 text-luxury-cream outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp No"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-primary-dark/80 border border-accent-gold/15 focus:border-accent-gold text-xs rounded-lg px-3 py-2 text-luxury-cream outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDiningMode('takeaway')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                        diningMode === 'takeaway'
                          ? 'bg-accent-gold/20 text-accent-gold border-accent-gold'
                          : 'border-accent-gold/10 text-luxury-cream/70 hover:border-accent-gold/20'
                      }`}
                    >
                      Takeaway
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiningMode('dinein')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                        diningMode === 'dinein'
                          ? 'bg-accent-gold/20 text-accent-gold border-accent-gold'
                          : 'border-accent-gold/10 text-luxury-cream/70 hover:border-accent-gold/20'
                      }`}
                    >
                      Dine-In
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(229,192,123,0.3)] transition-all cursor-pointer"
                  >
                    Place Order via WhatsApp <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
