import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShoppingBag, MapPin, Gift, Settings, LogOut, Check,
  Camera, Plus, Trash2, Edit2, AlertTriangle, 
  Map, Compass, Phone, Download, FileText, ChevronRight, X, Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MENU_ITEMS, type MenuItem } from '../../data/menuData';
import { 
  collection, doc, setDoc, getDocs, deleteDoc, updateDoc, getDoc, query, where 
} from 'firebase/firestore';
import { db } from '../../firebase';

// Types for Dashboard structures
interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  rewardPoints: number;
  cashbackEarned: number;
  referralBonus: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  accountPrivacy: 'Public' | 'Private';
}

interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

interface OrderHistoryItem {
  id: string;
  items: { item: MenuItem; quantity: number }[];
  totalAmount: number;
  paymentMethod: string;
  status: 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  date: string;
  address: string;
  estimatedTime: string;
  deliveryCharge: number;
  gst: number;
  discount: number;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

// Available premium dessert-themed avatars for the gallery selection
const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=150&h=150&q=80',
];

interface ProfileDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ setActiveTab }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, addToCart } = useCart();
  const { isAuthenticated, user, logout, loading } = useAuth();

  // Redirect to login if session does not exist
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setActiveTab('auth');
    }
  }, [isAuthenticated, loading, setActiveTab]);

  if (loading) {
    return (
      <div className="w-full min-h-screen py-24 flex items-center justify-center bg-primary-dark">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-luxury-cream/60 uppercase tracking-widest font-mono">Authenticating Lounge Session...</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Persistent States initialization (localStorage)
  // ----------------------------------------------------
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('melcho_profile');
    if (saved) return JSON.parse(saved);
    return {
      fullName: 'Yashwanth Galla',
      email: 'yashwanth.galla@gmail.com',
      phone: '+91 89191 96565',
      avatar: AVATAR_OPTIONS[0],
      joinedDate: 'January 2026',
      rewardPoints: 1250,
      cashbackEarned: 320,
      referralBonus: 100,
      emailNotifications: true,
      smsNotifications: true,
      accountPrivacy: 'Public',
    };
  });

  // Sync profile details with authenticated user context
  useEffect(() => {
    if (user) {
      setProfileName(user.displayName);
      setProfileEmail(user.email);
      
      const saved = localStorage.getItem('melcho_profile');
      if (saved) {
        const savedProfile = JSON.parse(saved);
        setProfilePhone(savedProfile.phone || '');
        setProfile(savedProfile);
      } else {
        setProfile(prev => ({
          ...prev,
          fullName: user.displayName,
          email: user.email,
          rewardPoints: user.rewardPoints,
        }));
      }
    }
  }, [user]);

  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem('melcho_addresses');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'addr1',
        type: 'Home',
        street: 'Ground Floor, Rams VSR Apartments, Moghalrajpuram',
        city: 'Vijayawada, AP - 520010',
        phone: '+91 89191 96565',
        isDefault: true,
      },
      {
        id: 'addr2',
        type: 'Work',
        street: 'Siddhartha Academy Road, Moghalrajpuram',
        city: 'Vijayawada, AP - 520010',
        phone: '+91 98765 43210',
        isDefault: false,
      }
    ];
  });

  const [orders, setOrders] = useState<OrderHistoryItem[]>(() => {
    const saved = localStorage.getItem('melcho_orders');
    if (saved) return JSON.parse(saved);
    
    // Default initial mock orders history
    const bubbleWaffle = MENU_ITEMS.find(m => m.id === 'bw1') || MENU_ITEMS[0];
    const hotChoc = MENU_ITEMS.find(m => m.id === 'mm1') || MENU_ITEMS[4];
    const tresLeches = MENU_ITEMS.find(m => m.id === 'mm5') || MENU_ITEMS[8];

    return [
      {
        id: 'MLC-2098-G',
        items: [
          { item: bubbleWaffle, quantity: 1 },
          { item: hotChoc, quantity: 2 }
        ],
        totalAmount: 432, // (199*1 + 99*2) + GST + delivery - discount
        paymentMethod: 'UPI / GPay',
        status: 'Delivered',
        date: '2026-06-02 07:15 PM',
        address: 'Rams VSR Apartments, Moghalrajpuram, Vijayawada',
        estimatedTime: 'Delivered in 28 mins',
        deliveryCharge: 0, // waived for Gold
        gst: 35,
        discount: 0
      },
      {
        id: 'MLC-1054-C',
        items: [
          { item: tresLeches, quantity: 1 }
        ],
        totalAmount: 188,
        paymentMethod: 'Card Payment',
        status: 'Delivered',
        date: '2026-05-28 09:40 PM',
        address: 'Siddhartha Academy Road, Moghalrajpuram, Vijayawada',
        estimatedTime: 'Delivered in 35 mins',
        deliveryCharge: 0,
        gst: 29,
        discount: 0
      }
    ];
  });

  // Fetch user addresses and order records from Firestore on load
  useEffect(() => {
    if (user) {
      const fetchFirestoreUserData = async () => {
        try {
          // 1. Fetch addresses from subcollection
          const addrColRef = collection(db, 'users', user.uid, 'addresses');
          const addrSnap = await getDocs(addrColRef);
          const loadedAddrs = addrSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as SavedAddress));
          if (loadedAddrs.length > 0) {
            setAddresses(loadedAddrs);
            // Default selected address selector
            const defaultAddr = loadedAddrs.find(a => a.isDefault);
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);
            else setSelectedAddressId(loadedAddrs[0].id);
          }

          // 2. Fetch orders matching userId
          const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const ordersSnap = await getDocs(ordersQuery);
          const loadedOrders = ordersSnap.docs.map(doc => doc.data() as OrderHistoryItem);
          
          // Sort by date descending
          loadedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          if (loadedOrders.length > 0) {
            setOrders(loadedOrders);
          }
        } catch (err) {
          console.error('Error fetching user data from Firestore:', err);
        }
      };
      fetchFirestoreUserData();
    }
  }, [user]);

  // ----------------------------------------------------
  // Dashboard UI States
  // ----------------------------------------------------
  const [activeSection, setActiveSection] = useState<'profile' | 'orders' | 'cart' | 'addresses' | 'rewards' | 'settings'>('profile');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<SavedAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // Active Address selection for checkout
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find(a => a.isDefault)?.id || (addresses[0]?.id || '')
  );

  // Address form fields
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressPhone, setAddressPhone] = useState('');

  // Profile forms
  const [profileName, setProfileName] = useState(profile.fullName);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [profilePhone, setProfilePhone] = useState(profile.phone);
  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);

  // Active tracking order modal state
  const [trackingOrder, setTrackingOrder] = useState<OrderHistoryItem | null>(null);
  // Detailed invoice viewer state
  const [invoiceOrder, setInvoiceOrder] = useState<OrderHistoryItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Active order timeline animation helper
  const [trackingTimelineStep, setTrackingTimelineStep] = useState(1);

  // ----------------------------------------------------
  // Syncing to LocalStorage
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem('melcho_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('melcho_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('melcho_orders', JSON.stringify(orders));
  }, [orders]);

  // Simulating real-time order tracking progress changes
  useEffect(() => {
    if (trackingOrder) {
      setTrackingTimelineStep(1);
      const interval = setInterval(() => {
        setTrackingTimelineStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            return 4;
          }
          return prev + 1;
        });
      }, 5000); // Progresses step every 5 seconds for visual excitement
      return () => clearInterval(interval);
    }
  }, [trackingOrder]);

  // Toast triggers helper
  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // ----------------------------------------------------
  // Features Handlers
  // ----------------------------------------------------

  // 1. Profile update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('save_profile');
    try {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          fullName: profileName,
          email: profileEmail,
          phone: profilePhone
        });
      }
      setProfile(prev => ({
        ...prev,
        fullName: profileName,
        email: profileEmail,
        phone: profilePhone,
      }));
      triggerToast('Profile updated in cloud successfully!', 'success');
    } catch (err) {
      console.error('Error saving profile to Firestore:', err);
      triggerToast('Failed to update profile in database.', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordOld || !passwordNew) {
      triggerToast('Please fill out all password fields', 'error');
      return;
    }
    setLoadingAction('save_password');
    setTimeout(() => {
      setPasswordOld('');
      setPasswordNew('');
      setLoadingAction(null);
      triggerToast('Password changed securely!', 'success');
    }, 1200);
  };

  const handleSelectAvatar = (url: string) => {
    setProfile(prev => ({ ...prev, avatar: url }));
    setIsAvatarModalOpen(false);
    triggerToast('Profile picture updated!', 'success');
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile(prev => ({ ...prev, avatar: event.target!.result as string }));
          triggerToast('Uploaded profile picture!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Light / Dark mode sync
  const toggleThemeMode = () => {
    const isCurrentlyLight = document.body.classList.contains('light');
    if (isCurrentlyLight) {
      document.body.classList.remove('light');
      triggerToast('Enabled Dark Chocolate mode', 'info');
    } else {
      document.body.classList.add('light');
      triggerToast('Enabled Creamy Light mode', 'info');
    }
  };

  // 3. Address handlers
  const handleOpenAddressModal = (address?: SavedAddress) => {
    if (address) {
      setEditAddress(address);
      setAddressType(address.type);
      setAddressStreet(address.street);
      setAddressCity(address.city);
      setAddressPhone(address.phone);
    } else {
      setEditAddress(null);
      setAddressType('Home');
      setAddressStreet('');
      setAddressCity('');
      setAddressPhone(profile.phone);
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressStreet || !addressCity || !addressPhone) {
      triggerToast('Please fill in all address details', 'error');
      return;
    }

    try {
      if (editAddress) {
        // Edit in Firestore
        if (user) {
          const addrDocRef = doc(db, 'users', user.uid, 'addresses', editAddress.id);
          await setDoc(addrDocRef, {
            type: addressType,
            street: addressStreet,
            city: addressCity,
            phone: addressPhone,
            isDefault: editAddress.isDefault
          });
        }
        setAddresses(prev => prev.map(a => a.id === editAddress.id ? {
          ...a,
          type: addressType,
          street: addressStreet,
          city: addressCity,
          phone: addressPhone
        } : a));
        triggerToast('Address updated in cloud!', 'success');
      } else {
        // Create in Firestore
        const newAddrId = 'addr_' + Date.now();
        const newAddress: SavedAddress = {
          id: newAddrId,
          type: addressType,
          street: addressStreet,
          city: addressCity,
          phone: addressPhone,
          isDefault: addresses.length === 0, // default if first
        };
        if (user) {
          const addrDocRef = doc(db, 'users', user.uid, 'addresses', newAddrId);
          await setDoc(addrDocRef, {
            type: addressType,
            street: addressStreet,
            city: addressCity,
            phone: addressPhone,
            isDefault: newAddress.isDefault
          });
        }
        setAddresses(prev => [...prev, newAddress]);
        if (addresses.length === 0) {
          setSelectedAddressId(newAddress.id);
        }
        triggerToast('New address saved to database!', 'success');
      }
    } catch (err) {
      console.error('Error saving address to Firestore:', err);
      triggerToast('Failed to save address to database.', 'error');
    }

    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (user) {
        const addrDocRef = doc(db, 'users', user.uid, 'addresses', id);
        await deleteDoc(addrDocRef);
      }
      setAddresses(prev => prev.filter(a => a.id !== id));
      triggerToast('Address deleted from cloud', 'info');
    } catch (err) {
      console.error('Error deleting address from Firestore:', err);
      triggerToast('Failed to delete address from database.', 'error');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      if (user) {
        // Batch set defaults
        const addrColRef = collection(db, 'users', user.uid, 'addresses');
        const addrSnap = await getDocs(addrColRef);
        for (const docSnap of addrSnap.docs) {
          const isTarget = docSnap.id === id;
          await updateDoc(doc(db, 'users', user.uid, 'addresses', docSnap.id), {
            isDefault: isTarget
          });
        }
      }
      setAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: a.id === id
      })));
      triggerToast('Default address updated in database!', 'success');
    } catch (err) {
      console.error('Error setting default address in Firestore:', err);
      triggerToast('Failed to sync default address.', 'error');
    }
  };

  // 4. Cart calculations & Promo Codes
  const gstRate = 0.18; // 18% GST
  const deliveryChargeBase = 40;
  
  // Waive delivery fees if free promo applied (e.g. FIRSTBITE)
  const isFreeDeliveryEligible = appliedPromo?.code === 'FIRSTBITE';
  const deliveryCharge = cartTotal > 0 && !isFreeDeliveryEligible ? deliveryChargeBase : 0;
  const gstAmount = Math.round(cartTotal * gstRate);
  
  const discountAmount = appliedPromo 
    ? Math.round(cartTotal * appliedPromo.discountPercent) 
    : 0;

  const orderTotal = cartTotal + gstAmount + deliveryCharge - discountAmount;

  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    if (code === 'MELCHOGOLD') {
      setAppliedPromo({ code: 'MELCHOGOLD', discountPercent: 0.20 });
      triggerToast('Coupon "MELCHOGOLD" applied: 20% off!', 'success');
    } else if (code === 'FIRSTBITE') {
      setAppliedPromo({ code: 'FIRSTBITE', discountPercent: 0.15 });
      triggerToast('Coupon "FIRSTBITE" applied: 15% off!', 'success');
    } else {
      triggerToast('Invalid promo code. Try "MELCHOGOLD" or "FIRSTBITE"', 'error');
    }
    setPromoInput('');
  };

  // 5. Checkout / Place Order
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      triggerToast('Your cart is empty', 'error');
      return;
    }

    const activeAddress = addresses.find(a => a.id === selectedAddressId);
    if (!activeAddress) {
      triggerToast('Please select or add a delivery address', 'error');
      setActiveSection('addresses');
      return;
    }

    setLoadingAction('checkout');
    
    try {
      const orderId = `MLC-${Math.floor(1000 + Math.random() * 9000)}-${['A','B','C','D','E','F'][Math.floor(Math.random() * 6)]}`;
      const newOrder: OrderHistoryItem = {
        id: orderId,
        items: cartItems.map(ci => ({
          item: {
            id: ci.item.id,
            name: ci.item.name,
            price: ci.item.price,
            category: ci.item.category,
            image: ci.item.image,
            description: ci.item.description,
            rating: ci.item.rating,
            isVeg: ci.item.isVeg
          },
          quantity: ci.quantity
        })),
        totalAmount: orderTotal,
        paymentMethod: 'UPI / GPay Online',
        status: 'Preparing',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        address: `${activeAddress.street}, ${activeAddress.city}`,
        estimatedTime: '30-45 mins',
        deliveryCharge,
        gst: gstAmount,
        discount: discountAmount
      };

      // Add points (10% of cart total)
      const earnedPoints = Math.round(cartTotal * 0.1);
      const earnedCashback = Math.round(cartTotal * 0.02);

      // Write order directly into Firestore
      if (user) {
        const orderDocRef = doc(db, 'orders', orderId);
        await setDoc(orderDocRef, {
          userId: user.uid,
          ...newOrder
        });

        // Update reward points & cashback in Firestore user document
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const currentPoints = userDocSnap.data().rewardPoints || 0;
          const currentCashback = userDocSnap.data().cashbackEarned || 0;
          
          await updateDoc(userDocRef, {
            rewardPoints: currentPoints + earnedPoints,
            cashbackEarned: currentCashback + earnedCashback
          });
        }
      }

      setOrders(prev => [newOrder, ...prev]);
      setProfile(prev => ({
        ...prev,
        rewardPoints: prev.rewardPoints + earnedPoints,
        cashbackEarned: prev.cashbackEarned + earnedCashback
      }));

      clearCart();
      setAppliedPromo(null);
      setActiveSection('orders');
      
      // Auto open tracking for this new order
      setTrackingOrder(newOrder);

      triggerToast(`Order placed & saved to database! Generated ${orderId}`, 'success');
      triggerToast(`Earned +${earnedPoints} Reward Points!`, 'info');
      
      // Simulated Email notification toast
      setTimeout(() => {
        triggerToast(`Invoice automated & dispatched to ${profile.email}!`, 'info');
      }, 3500);

    } catch (err) {
      console.error('Error during checkout & database save:', err);
      triggerToast('Checkout failed. Could not save order to database.', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  // Reorder action
  const handleReorder = (order: OrderHistoryItem) => {
    order.items.forEach(orderItem => {
      // Loop to add multiple quantity
      for (let i = 0; i < orderItem.quantity; i++) {
        addToCart(orderItem.item);
      }
    });
    triggerToast('All order items added back to your cart!', 'success');
    setActiveSection('cart');
  };

  // Download Invoice simulator
  const handleTriggerInvoiceDownload = (order: OrderHistoryItem) => {
    setInvoiceOrder(order);
  };

  const handleDownloadPDFLocal = (order: OrderHistoryItem) => {
    triggerToast('Generating PDF receipt locally...', 'info');
    setTimeout(() => {
      // Print window approach triggers browser's high quality PDF print layout
      const printContents = document.getElementById(`invoice-printable-container`)?.innerHTML;
      if (!printContents) {
        triggerToast('Error reading invoice container', 'error');
        return;
      }
      
      const originalContents = document.body.innerHTML;
      
      // Temporary write to document for clean PDF layout print
      document.body.innerHTML = `
        <html>
          <head>
            <title>Melcho_Invoice_${order.id}</title>
            <style>
              body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #120907; background: #fff; }
              .logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin: 30px 0; }
              th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
              th { background-color: #f8f8f8; font-weight: bold; }
              .totals { float: right; width: 300px; margin-top: 20px; line-height: 1.8; }
              .gold-badge { color: #b8860b; font-weight: bold; }
            </style>
          </head>
          <body>
            ${printContents}
            <script>window.print();</script>
          </body>
        </html>
      `;

      window.print();
      
      // Restore page state
      document.body.innerHTML = originalContents;
      // Reload page state parameters because DOM is reset
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen py-24 px-4 md:px-12 max-w-7xl mx-auto relative">
      {/* Toast notifications container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className={`p-4 rounded-xl border shadow-xl flex items-center gap-3 backdrop-blur-md pointer-events-auto ${
                toast.type === 'success' 
                  ? 'bg-green-950/70 border-green-500/40 text-green-300 shadow-green-950/20' 
                  : toast.type === 'error'
                  ? 'bg-red-950/70 border-red-500/40 text-red-300 shadow-red-950/20'
                  : 'bg-primary-brown/80 border-accent-gold/40 text-accent-gold shadow-primary-dark/50'
              }`}
            >
              {toast.type === 'success' && <Check className="w-5 h-5 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
              {toast.type === 'info' && <Sparkles className="w-5 h-5 shrink-0 animate-pulse" />}
              <span className="text-xs font-semibold">{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header section with page path and ambient glows */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs text-muted-gold uppercase tracking-wider mb-2 font-mono">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-accent-gold font-bold">Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-luxury-cream tracking-wide">
          Your <span className="text-accent-gold">Lounge Dashboard</span>
        </h1>
        <p className="text-sm text-luxury-cream/60 mt-2">Manage orders, check loyalty rewards, configure addresses, and edit your profile details.</p>
      </div>

      {/* Main dashboard container using flexbox for bulletproof layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        
        {/* SIDEBAR NAVIGATION COLUMN */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
          {/* Card 1: User Quick card summary */}
          <div className="glass-effect p-6 rounded-2xl border border-accent-gold/15 relative overflow-hidden text-center flex flex-col items-center">
            {/* VIP Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Avatar section with interactive change button */}
            <div className="relative group mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent-gold shadow-lg shadow-accent-gold/25 relative">
                <img 
                  src={profile.avatar} 
                  alt={profile.fullName} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button 
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark rounded-full shadow-lg border border-primary-dark cursor-pointer transition-transform group-hover:scale-110"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User credentials */}
            <h3 className="text-lg font-serif text-luxury-cream font-bold gold-glow">{profile.fullName}</h3>
            <p className="text-xs text-luxury-cream/60 mt-1 truncate max-w-full font-light">{profile.email}</p>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-accent-gold/10">
              <div className="text-center">
                <div className="text-lg font-serif font-bold text-accent-gold">{profile.rewardPoints}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-gold mt-1">Reward Points</div>
              </div>
              <div className="w-px h-8 bg-accent-gold/15 self-center mx-auto" />
              <div className="text-center">
                <div className="text-lg font-serif font-bold text-accent-gold">₹{profile.cashbackEarned}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-gold mt-1">Cashback</div>
              </div>
            </div>
          </div>

          {/* Card 2: Sidebar Navigation links */}
          <nav className="glass-effect rounded-2xl border border-accent-gold/15 overflow-hidden p-2">
            {[
              { id: 'profile', label: 'Profile Info', icon: <User className="w-4 h-4" /> },
              { id: 'orders', label: 'Order History', icon: <ShoppingBag className="w-4 h-4" />, badge: orders.length },
              { id: 'cart', label: 'Cart & Checkout', icon: <ShoppingBag className="w-4 h-4" />, badge: cartItems.length > 0 ? cartItems.length : undefined },
              { id: 'addresses', label: 'Address Book', icon: <MapPin className="w-4 h-4" /> },
              { id: 'rewards', label: 'Rewards & Offers', icon: <Gift className="w-4 h-4" /> },
              { id: 'settings', label: 'Account Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(tab => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer mb-1 last:mb-0 ${
                    isActive 
                      ? 'bg-accent-gold text-primary-dark shadow-[0_4px_15px_rgba(229,192,123,0.25)] font-bold' 
                      : 'text-luxury-cream/70 hover:text-accent-gold hover:bg-primary-brown/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-primary-dark text-accent-gold' : 'bg-accent-gold/15 text-accent-gold border border-accent-gold/25'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Quick Actions at footer of sidebar */}
            <div className="mt-4 pt-4 border-t border-accent-gold/15 px-2">
              <button 
                onClick={() => {
                  triggerToast('Logged out of your profile session', 'info');
                  setTimeout(() => logout(), 1000);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* DYNAMIC CONTENT PANELS */}
        <main className="flex-grow w-full glass-effect rounded-3xl border border-accent-gold/15 min-h-[500px] overflow-hidden p-6 md:p-8 relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >

              {/* ---------------------------------------------------- */}
              {/* SECTION: PROFILE INFO */}
              {/* ---------------------------------------------------- */}
              {activeSection === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif text-luxury-cream">Profile Settings</h2>
                    <p className="text-xs text-luxury-cream/60 mt-1">Configure your personal information and change your login credentials.</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent-gold/10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-accent-gold">Full Name</label>
                      <input 
                        type="text" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-3 text-sm text-luxury-cream focus:outline-none focus:border-accent-gold transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-accent-gold">Email Address</label>
                      <input 
                        type="email" 
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-3 text-sm text-luxury-cream focus:outline-none focus:border-accent-gold transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-accent-gold">Phone Number</label>
                      <input 
                        type="text" 
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-3 text-sm text-luxury-cream focus:outline-none focus:border-accent-gold transition-colors"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={loadingAction === 'save_profile'}
                        className="px-6 py-3 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_4px_15px_rgba(229,192,123,0.3)] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {loadingAction === 'save_profile' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
                            Saving Profile...
                          </>
                        ) : 'Save Personal Details'}
                      </button>
                    </div>
                  </form>

                  {/* Password block */}
                  <div className="pt-8 border-t border-accent-gold/10">
                    <h3 className="text-base font-serif text-luxury-cream mb-4">Security Credentials</h3>
                    
                    <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-accent-gold">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={passwordOld}
                          onChange={(e) => setPasswordOld(e.target.value)}
                          className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-3 text-sm text-luxury-cream focus:outline-none focus:border-accent-gold transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-accent-gold">New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={passwordNew}
                          onChange={(e) => setPasswordNew(e.target.value)}
                          className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-3 text-sm text-luxury-cream focus:outline-none focus:border-accent-gold transition-colors"
                        />
                      </div>

                      <div className="md:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={loadingAction === 'save_password'}
                          className="px-6 py-3 rounded-full border border-accent-gold/40 hover:border-accent-gold text-luxury-cream hover:bg-accent-gold/10 font-bold text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                          {loadingAction === 'save_password' ? (
                            <>
                              <div className="w-4 h-4 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
                              Updating Password...
                            </>
                          ) : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SECTION: ORDER HISTORY */}
              {/* ---------------------------------------------------- */}
              {activeSection === 'orders' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-serif text-luxury-cream">Order History</h2>
                      <p className="text-xs text-luxury-cream/60 mt-1">View active orders, track package delivery, and look at previous invoices.</p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                      <div className="p-4 bg-accent-gold/5 rounded-full border border-accent-gold/10 text-accent-gold">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                      <h3 className="text-lg font-serif text-luxury-cream">No orders yet</h3>
                      <p className="text-xs text-luxury-cream/60 max-w-sm">You haven't ordered any delicious desserts yet. Head over to our premium menu to satisfy your sweet tooth cravings!</p>
                      <button 
                        onClick={() => setActiveTab('menu')}
                        className="px-6 py-3 rounded-full bg-accent-gold text-primary-dark font-bold text-xs uppercase tracking-wider hover:bg-accent-gold/90 transition-all cursor-pointer"
                      >
                        Explore Menu
                      </button>
                    </div>
                  ) : (
                    /* Orders list */
                    <div className="space-y-6 pt-4 border-t border-accent-gold/10">
                      {orders.map(order => (
                        <div 
                          key={order.id}
                          className="bg-primary-brown/30 border border-accent-gold/15 rounded-2xl overflow-hidden hover:border-accent-gold/30 transition-all duration-300"
                        >
                          {/* Order Header summary */}
                          <div className="p-4 bg-primary-dark/40 border-b border-accent-gold/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-4 flex-wrap">
                              <div>
                                <span className="text-muted-gold">Order ID: </span>
                                <span className="font-mono font-bold text-luxury-cream">{order.id}</span>
                              </div>
                              <div className="w-px h-3 bg-accent-gold/25" />
                              <div>
                                <span className="text-muted-gold">Ordered Date: </span>
                                <span className="text-luxury-cream font-medium">{order.date}</span>
                              </div>
                            </div>
                            
                            {/* Order Status Badge */}
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              order.status === 'Preparing' 
                                ? 'bg-orange-950/40 border-orange-500/40 text-orange-400' 
                                : order.status === 'Out for Delivery'
                                ? 'bg-blue-950/40 border-blue-500/40 text-blue-400'
                                : order.status === 'Cancelled'
                                ? 'bg-red-950/40 border-red-500/40 text-red-400'
                                : 'bg-green-950/40 border-green-500/40 text-green-400'
                            }`}>
                              {order.status}
                            </div>
                          </div>

                          {/* Order Contents */}
                          <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                            
                            {/* Left: Product summary */}
                            <div className="w-full md:w-2/3 space-y-3">
                              {order.items.map((itemObj, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <img 
                                    src={itemObj.item.image} 
                                    alt={itemObj.item.name} 
                                    className="w-12 h-12 object-cover rounded-lg border border-accent-gold/10 shrink-0" 
                                  />
                                  <div>
                                    <h4 className="text-xs font-bold text-luxury-cream">{itemObj.item.name}</h4>
                                    <p className="text-[10px] text-accent-gold font-mono mt-0.5">₹{itemObj.item.price} × {itemObj.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Right: Payment details */}
                            <div className="w-full md:w-1/3 text-left md:text-right border-t md:border-t-0 md:border-l border-accent-gold/10 pt-4 md:pt-0 md:pl-6 space-y-1 text-xs shrink-0">
                              <div>
                                <span className="text-muted-gold">Payment Method: </span>
                                <span className="text-luxury-cream font-medium">{order.paymentMethod}</span>
                              </div>
                              <div>
                                <span className="text-muted-gold">Address: </span>
                                <span className="text-luxury-cream/80 truncate block md:inline-block max-w-[200px]" title={order.address}>
                                  {order.address}
                                </span>
                              </div>
                              <div className="pt-2">
                                <span className="text-base font-serif text-accent-gold font-bold">₹{order.totalAmount}</span>
                              </div>
                            </div>

                          </div>

                          {/* Order Action Buttons */}
                          <div className="p-4 bg-primary-dark/20 border-t border-accent-gold/10 flex flex-wrap gap-3 justify-end items-center">
                            {order.status === 'Preparing' || order.status === 'Out for Delivery' ? (
                              <button 
                                onClick={() => setTrackingOrder(order)}
                                className="px-4 py-2 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(229,192,123,0.2)] cursor-pointer"
                              >
                                <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Track Live Order
                              </button>
                            ) : null}

                            <button 
                              onClick={() => handleReorder(order)}
                              className="px-4 py-2 rounded-full border border-accent-gold/30 hover:border-accent-gold text-luxury-cream text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all hover:bg-accent-gold/10 cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> Reorder Items
                            </button>

                            <button 
                              onClick={() => handleTriggerInvoiceDownload(order)}
                              className="px-4 py-2 rounded-full border border-accent-gold/30 hover:border-accent-gold text-luxury-cream text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all hover:bg-accent-gold/10 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" /> Invoice Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SECTION: CART & CHECKOUT */}
              {/* ---------------------------------------------------- */}
              {activeSection === 'cart' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif text-luxury-cream">Shopping Cart</h2>
                    <p className="text-xs text-luxury-cream/60 mt-1">Manage items added to your cart, apply coupons, and checkout securely.</p>
                  </div>

                  {cartItems.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                      <div className="p-4 bg-accent-gold/5 rounded-full border border-accent-gold/10 text-accent-gold">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                      <h3 className="text-lg font-serif text-luxury-cream">Your cart is empty</h3>
                      <p className="text-xs text-luxury-cream/60 max-w-sm">No items in your cart. Add premium waffles, pancakes, and hot chocolates to start order!</p>
                      <button 
                        onClick={() => setActiveTab('menu')}
                        className="px-6 py-3 rounded-full bg-accent-gold text-primary-dark font-bold text-xs uppercase tracking-wider hover:bg-accent-gold/90 transition-all cursor-pointer"
                      >
                        Explore Menu
                      </button>
                    </div>
                  ) : (
                    /* Cart items split layout */
                    <div className="flex flex-col lg:flex-row gap-8 pt-4 border-t border-accent-gold/10 w-full">
                      
                      {/* Left: Cart Items List */}
                      <div className="w-full lg:w-7/12 space-y-4">
                        {cartItems.map((cartItem) => (
                          <div 
                            key={cartItem.item.id}
                            className="bg-primary-brown/20 border border-accent-gold/10 rounded-xl p-4 flex items-center justify-between gap-4"
                          >
                            <img 
                              src={cartItem.item.image} 
                              alt={cartItem.item.name} 
                              className="w-16 h-16 object-cover rounded-lg border border-accent-gold/10 shrink-0" 
                            />
                            
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs font-bold text-luxury-cream truncate">{cartItem.item.name}</h4>
                              <p className="text-[10px] text-accent-gold font-mono mt-1">₹{cartItem.item.price} each</p>
                              <button 
                                onClick={() => {
                                  removeFromCart(cartItem.item.id);
                                  triggerToast('Removed item from cart', 'info');
                                }}
                                className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase mt-2 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 bg-primary-dark/60 border border-accent-gold/20 rounded-full px-2 py-1">
                              <button 
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                className="text-xs font-mono font-bold text-accent-gold hover:text-white px-2 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-luxury-cream px-1">{cartItem.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                className="text-xs font-mono font-bold text-accent-gold hover:text-white px-2 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right shrink-0">
                              <span className="text-sm font-serif font-bold text-accent-gold">₹{cartItem.item.price * cartItem.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Checkout summary panel */}
                      <div className="w-full lg:w-5/12 space-y-6">
                        {/* 1. Address Selection for Checkout */}
                        <div className="bg-primary-brown/40 border border-accent-gold/15 p-4 rounded-2xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-accent-gold mb-3 flex items-center justify-between">
                            <span>Delivery Address</span>
                            <button 
                              onClick={() => handleOpenAddressModal()}
                              className="text-[10px] text-accent-gold hover:underline cursor-pointer"
                            >
                              + Add New
                            </button>
                          </h4>
                          {addresses.length === 0 ? (
                            <p className="text-[11px] text-red-300">No saved addresses found. Add one to checkout.</p>
                          ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {addresses.map(addr => (
                                <label 
                                  key={addr.id}
                                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                    selectedAddressId === addr.id
                                      ? 'bg-accent-gold/10 border-accent-gold/50 shadow-md'
                                      : 'bg-primary-dark/30 border-accent-gold/10 hover:border-accent-gold/25'
                                  }`}
                                >
                                  <input 
                                    type="radio" 
                                    name="checkout_address" 
                                    value={addr.id}
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                    className="accent-accent-gold mt-0.5 cursor-pointer"
                                  />
                                  <div className="text-[10px]">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-luxury-cream">{addr.type}</span>
                                      {addr.isDefault && <span className="bg-accent-gold/20 text-accent-gold px-1 rounded text-[8px] font-bold uppercase font-mono">Default</span>}
                                    </div>
                                    <p className="text-luxury-cream/80 mt-0.5 truncate max-w-[170px]">{addr.street}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 2. Promo Code Code Field */}
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Promo Code (e.g. MELCHOGOLD)" 
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            className="flex-grow bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-3 py-2 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold"
                          />
                          <button 
                            onClick={handleApplyPromo}
                            className="px-4 py-2 bg-primary-brown hover:bg-accent-gold hover:text-primary-dark border border-accent-gold/20 hover:border-accent-gold text-accent-gold text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>

                        {appliedPromo && (
                          <div className="bg-green-950/20 border border-green-500/20 p-2.5 rounded-xl flex items-center justify-between text-xs text-green-400">
                            <span>Promo <strong>{appliedPromo.code}</strong> Applied</span>
                            <button 
                              onClick={() => {
                                setAppliedPromo(null);
                                triggerToast('Promo coupon removed', 'info');
                              }}
                              className="text-red-400 hover:text-red-300 font-bold uppercase font-mono cursor-pointer"
                            >
                              [Remove]
                            </button>
                          </div>
                        )}

                        {/* 3. Detailed Price Breakdown */}
                        <div className="bg-primary-dark/40 border border-accent-gold/15 p-5 rounded-2xl space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-gold">Items Subtotal</span>
                            <span className="text-luxury-cream font-medium">₹{cartTotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-gold">GST (18% inclusive)</span>
                            <span className="text-luxury-cream font-medium">₹{gstAmount}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-muted-gold flex items-center gap-1">
                              Delivery Charges 
                              {isFreeDeliveryEligible && (
                                <span className="bg-accent-gold/15 text-accent-gold px-1 rounded text-[8px] font-bold uppercase font-mono border border-accent-gold/25" title="Free delivery promo coupon applied!">Promo Wave</span>
                              )}
                            </span>
                            <span className="text-luxury-cream font-medium">
                              {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}
                            </span>
                          </div>

                          {appliedPromo && (
                            <div className="flex justify-between text-green-400">
                              <span>Discount</span>
                              <span>-₹{discountAmount}</span>
                            </div>
                          )}

                          <div className="w-full h-px bg-accent-gold/15 pt-1" />

                          <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-luxury-cream font-serif">Total Payable</span>
                            <span className="text-lg font-serif text-accent-gold font-bold">₹{orderTotal}</span>
                          </div>

                          <div className="pt-4">
                            <button
                              onClick={handleCheckout}
                              disabled={loadingAction === 'checkout'}
                              className="w-full py-3.5 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold uppercase tracking-wider text-xs shadow-[0_4px_20px_rgba(229,192,123,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              {loadingAction === 'checkout' ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
                                  Placing Order...
                                </>
                              ) : 'Confirm Checkout & Pay'}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SECTION: ADDRESS BOOK */}
              {/* ---------------------------------------------------- */}
              {activeSection === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-serif text-luxury-cream">Address Management</h2>
                      <p className="text-xs text-luxury-cream/60 mt-1">Configure saved locations for faster delivery checkouts.</p>
                    </div>
                    <button 
                      onClick={() => handleOpenAddressModal()}
                      className="px-5 py-2.5 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_3px_10px_rgba(229,192,123,0.2)] cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" /> Add Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent-gold/10">
                    {addresses.map(addr => (
                      <div 
                        key={addr.id}
                        className={`p-5 rounded-2xl border transition-all relative ${
                          addr.isDefault 
                            ? 'bg-accent-gold/5 border-accent-gold/40 shadow-[0_4px_15px_rgba(229,192,123,0.05)]' 
                            : 'bg-primary-brown/20 border-accent-gold/15 hover:border-accent-gold/30'
                        }`}
                      >
                        {/* Address type & default tags */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-bold text-luxury-cream uppercase tracking-widest">{addr.type}</span>
                          {addr.isDefault ? (
                            <span className="bg-accent-gold/25 border border-accent-gold/30 text-accent-gold text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono">
                              Default Address
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[9px] text-muted-gold hover:text-accent-gold underline uppercase font-mono cursor-pointer"
                            >
                              Make Default
                            </button>
                          )}
                        </div>

                        {/* Location Details */}
                        <p className="text-xs text-luxury-cream/80 leading-relaxed font-light">{addr.street}</p>
                        <p className="text-xs text-luxury-cream/60 mt-1 font-light">{addr.city}</p>
                        
                        <div className="mt-4 pt-3 border-t border-accent-gold/10 flex items-center justify-between text-xs">
                          <div className="text-[10px] text-muted-gold font-mono">
                            <span>Phone: </span>
                            <span className="text-luxury-cream">{addr.phone}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleOpenAddressModal(addr)}
                              className="p-1.5 bg-primary-brown/40 border border-accent-gold/20 hover:border-accent-gold text-accent-gold rounded-full hover:scale-105 transition-all cursor-pointer"
                              title="Edit Address"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteAddress(addr.id, e)}
                              className="p-1.5 bg-red-950/20 border border-red-800/20 hover:border-red-500 text-red-400 rounded-full hover:scale-105 transition-all cursor-pointer"
                              title="Delete Address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SECTION: REWARDS & OFFERS */}
              {/* ---------------------------------------------------- */}
              {activeSection === 'rewards' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif text-luxury-cream">Rewards & Loyalty Program</h2>
                    <p className="text-xs text-luxury-cream/60 mt-1">Unlock exclusive dessert discounts and track your active loyalty points.</p>
                  </div>

                  {/* Loyalty Points Balance Bar */}
                  <div className="bg-primary-brown/40 border border-accent-gold/20 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-accent-gold font-mono">Loyalty Club Balance</span>
                        <h3 className="text-2xl font-serif text-luxury-cream font-bold flex items-center gap-2">
                          My Reward Points
                        </h3>
                        <p className="text-xs text-luxury-cream/60 mt-1">Earn points automatically on every sweet purchase. Redeem them for delicious desserts, loaded waffles, or custom toppings.</p>
                      </div>
                      
                      <div className="text-left md:text-right shrink-0">
                        <span className="text-3xl font-serif text-accent-gold font-bold">{profile.rewardPoints} PTS</span>
                        <div className="text-[9px] uppercase tracking-wider text-muted-gold mt-1">Balance Available</div>
                      </div>
                    </div>
                  </div>

                  {/* Cashbacks and referrals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-effect p-5 rounded-2xl border border-accent-gold/15 text-center">
                      <span className="text-accent-gold font-bold text-xs uppercase tracking-widest block mb-2">Cashback Earned</span>
                      <h4 className="text-2xl font-serif text-luxury-cream font-bold">₹{profile.cashbackEarned}</h4>
                      <p className="text-[10px] text-luxury-cream/60 mt-2">Earn 2% cashback automatically on every UPI/Card online order.</p>
                    </div>

                    <div className="glass-effect p-5 rounded-2xl border border-accent-gold/15 text-center">
                      <span className="text-accent-gold font-bold text-xs uppercase tracking-widest block mb-2">Referral Bonus</span>
                      <h4 className="text-2xl font-serif text-luxury-cream font-bold">₹{profile.referralBonus}</h4>
                      <p className="text-[10px] text-luxury-cream/60 mt-2">Earn ₹50 for each friend who places their first sweet order.</p>
                    </div>

                    <div className="glass-effect p-5 rounded-2xl border border-accent-gold/15 text-center flex flex-col justify-between">
                      <div>
                        <span className="text-accent-gold font-bold text-xs uppercase tracking-widest block mb-2">Your Referral Link</span>
                        <p className="text-[9px] bg-primary-dark/80 border border-accent-gold/10 p-2 rounded-lg text-muted-gold font-mono break-all">
                          melchodesserts.in/ref?c=yash2026
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('melchodesserts.in/ref?c=yash2026');
                          triggerToast('Copied referral link to clipboard!', 'success');
                        }}
                        className="w-full mt-3 py-1.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark text-[10px] font-bold rounded-lg uppercase transition-all cursor-pointer"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>

                  {/* Active exclusive coupons */}
                  <div className="pt-6 border-t border-accent-gold/10 space-y-4">
                    <h3 className="text-base font-serif text-luxury-cream">Your Exclusive Promo Offers</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Coupon 1 */}
                      <div className="bg-primary-brown/30 border border-dashed border-accent-gold/30 p-4 rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <div className="bg-accent-gold text-primary-dark text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono inline-block mb-1.5">
                            MELCHOGOLD
                          </div>
                          <h4 className="text-xs font-bold text-luxury-cream">20% Flat Discount</h4>
                          <p className="text-[10px] text-luxury-cream/60 mt-0.5">Applicable on all items above ₹299.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setPromoInput('MELCHOGOLD');
                            setActiveSection('cart');
                            triggerToast('Promo loaded to cart checkout!', 'info');
                          }}
                          className="px-3 py-1.5 bg-primary-dark hover:bg-accent-gold hover:text-primary-dark border border-accent-gold/20 hover:border-accent-gold text-accent-gold text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                        >
                          Use Code
                        </button>
                      </div>

                      {/* Coupon 2 */}
                      <div className="bg-primary-brown/30 border border-dashed border-accent-gold/30 p-4 rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <div className="bg-accent-gold text-primary-dark text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono inline-block mb-1.5">
                            FIRSTBITE
                          </div>
                          <h4 className="text-xs font-bold text-luxury-cream">15% Discount on Waffles</h4>
                          <p className="text-[10px] text-luxury-cream/60 mt-0.5">Get 15% off plus free delivery on waffles.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setPromoInput('FIRSTBITE');
                            setActiveSection('cart');
                            triggerToast('Promo loaded to cart checkout!', 'info');
                          }}
                          className="px-3 py-1.5 bg-primary-dark hover:bg-accent-gold hover:text-primary-dark border border-accent-gold/20 hover:border-accent-gold text-accent-gold text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                        >
                          Use Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SECTION: SETTINGS */}
              {/* ---------------------------------------------------- */}
              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif text-luxury-cream">Account Preferences</h2>
                    <p className="text-xs text-luxury-cream/60 mt-1">Configure security levels, theme mode, and manage system notifications.</p>
                  </div>

                  {/* Settings grid */}
                  <div className="space-y-6 pt-4 border-t border-accent-gold/10">
                    
                    {/* Theme section */}
                    <div className="bg-primary-brown/20 border border-accent-gold/10 rounded-2xl p-5 flex items-center justify-between gap-6">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-luxury-cream uppercase tracking-wide">Theme Color Configuration</h4>
                        <p className="text-[10px] text-luxury-cream/60">Switch colors dynamically between Dark Chocolate and Light Cream.</p>
                      </div>
                      <button 
                        onClick={toggleThemeMode}
                        className="px-4 py-2 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-[0_3px_10px_rgba(229,192,123,0.2)]"
                      >
                        Toggle Mode
                      </button>
                    </div>

                    {/* Notification Toggles */}
                    <div className="glass-effect p-6 rounded-2xl border border-accent-gold/15 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-accent-gold border-b border-accent-gold/10 pb-2">
                        Communication Toggles
                      </h3>

                      <div className="flex items-center justify-between gap-6">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-luxury-cream">Email Updates</span>
                          <p className="text-[10px] text-luxury-cream/60">Receive invoices, promo coupons, and menu additions via email.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={profile.emailNotifications}
                          onChange={(e) => setProfile(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                          className="w-4 h-4 accent-accent-gold cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-6 pt-3 border-t border-accent-gold/5">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-luxury-cream">Delivery Updates</span>
                          <p className="text-[10px] text-luxury-cream/60">Receive SMS / WhatsApp notifications for delivery driver tracking updates.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={profile.smsNotifications}
                          onChange={(e) => setProfile(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                          className="w-4 h-4 accent-accent-gold cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Privacy configs */}
                    <div className="glass-effect p-6 rounded-2xl border border-accent-gold/15 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-accent-gold border-b border-accent-gold/10 pb-2">
                        Account Privacy & Security
                      </h3>

                      <div className="flex items-center justify-between gap-6">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-luxury-cream">Profile Visibility</span>
                          <p className="text-[10px] text-luxury-cream/60">Set profile visibility status to Private to block tracking public points scoreboard.</p>
                        </div>
                        <select 
                          value={profile.accountPrivacy}
                          onChange={(e) => setProfile(prev => ({ ...prev, accountPrivacy: e.target.value as any }))}
                          className="bg-primary-dark/80 border border-accent-gold/20 text-xs text-luxury-cream px-3 py-1.5 rounded-lg focus:outline-none focus:border-accent-gold"
                        >
                          <option value="Public">Public Scoreboard</option>
                          <option value="Private">Private Mode</option>
                        </select>
                      </div>
                    </div>

                    {/* Danger zone delete account */}
                    <div className="border border-red-500/20 bg-red-950/5 p-5 rounded-2xl flex items-center justify-between gap-6">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-red-300 uppercase tracking-wide">Danger Zone</h4>
                        <p className="text-[10px] text-luxury-cream/60">Once you delete your customer account, all your reward points will be permanently cleared.</p>
                      </div>
                      <button 
                        onClick={() => {
                          const confirmDelete = window.confirm('Are you absolutely sure you want to permanently delete your Melcho account? This cannot be undone.');
                          if (confirmDelete) {
                            localStorage.clear();
                            triggerToast('Account data cleared successfully', 'error');
                            setTimeout(() => {
                              window.location.reload();
                            }, 1200);
                          }
                        }}
                        className="px-4 py-2 bg-red-900/20 hover:bg-red-900 border border-red-800/40 hover:border-red-500 text-red-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Delete Account
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: PREMIUM AVATAR GALLERY SELECTION */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary-dark/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-primary-brown/95 border border-accent-gold/30 rounded-3xl p-6 max-w-sm w-full space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="absolute top-4 right-4 text-muted-gold hover:text-accent-gold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h3 className="text-lg font-serif text-luxury-cream font-bold">Select Profile Avatar</h3>
                <p className="text-xs text-luxury-cream/60 mt-1">Choose a premium chef avatar or upload a custom image.</p>
              </div>

              {/* Preselected gallery */}
              <div className="flex justify-center gap-4 py-2">
                {AVATAR_OPTIONS.map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSelectAvatar(url)}
                    className="w-12 h-12 rounded-full overflow-hidden border border-accent-gold/20 hover:border-accent-gold hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <img src={url} alt={`Avatar option ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="text-center text-xs text-muted-gold uppercase tracking-wider font-mono">
                — OR —
              </div>

              {/* Custom upload selector */}
              <div className="flex flex-col items-center">
                <label className="w-full flex flex-col items-center justify-center px-4 py-5 bg-primary-dark/60 border border-dashed border-accent-gold/25 hover:border-accent-gold rounded-xl cursor-pointer transition-colors text-xs text-muted-gold">
                  <Camera className="w-6 h-6 text-accent-gold mb-2" />
                  <span>Upload custom image file</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCustomAvatarUpload}
                    className="hidden" 
                  />
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: ADD/EDIT ADDRESS BOOK FORM */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary-dark/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-primary-brown/95 border border-accent-gold/30 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="absolute top-4 right-4 text-muted-gold hover:text-accent-gold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-serif text-luxury-cream font-bold">
                {editAddress ? 'Edit Address' : 'Add Delivery Location'}
              </h3>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                {/* Type buttons */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent-gold">Address Type</label>
                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddressType(type as any)}
                        className={`flex-grow py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-all ${
                          addressType === type 
                            ? 'bg-accent-gold text-primary-dark font-bold border-accent-gold shadow-md' 
                            : 'bg-primary-dark/60 text-muted-gold border-accent-gold/25 hover:border-accent-gold/40'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Street address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent-gold">Street details & building</label>
                  <input 
                    type="text" 
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="e.g. Ground Floor, Rams VSR Apartments"
                    className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-2.5 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold"
                    required
                  />
                </div>

                {/* City details */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent-gold">City & PIN Code</label>
                  <input 
                    type="text" 
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="e.g. Vijayawada, AP - 520010"
                    className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-2.5 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold"
                    required
                  />
                </div>

                {/* Contact phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent-gold">Contact Phone number</label>
                  <input 
                    type="text" 
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                    placeholder="e.g. +91 89191 96565"
                    className="w-full bg-primary-dark/60 border border-accent-gold/20 rounded-xl px-4 py-2.5 text-xs text-luxury-cream focus:outline-none focus:border-accent-gold"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                  >
                    {editAddress ? 'Update Location' : 'Save New Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: ACTIVE LIVE ORDER TRACKING TIMELINE */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {trackingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary-dark/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-primary-brown/95 border border-accent-gold/30 rounded-3xl p-6 max-w-xl w-full space-y-6 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setTrackingOrder(null)}
                className="absolute top-4 right-4 text-muted-gold hover:text-accent-gold cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F59E0B] font-mono">Real-time Order Tracker</span>
                <h3 className="text-xl font-serif text-luxury-cream font-bold mt-1">
                  Tracking Order ID: <span className="font-mono text-accent-gold">{trackingOrder.id}</span>
                </h3>
              </div>

              {/* Mock map visual wrapper */}
              <div className="w-full h-40 bg-primary-dark/80 rounded-2xl border border-accent-gold/15 relative overflow-hidden flex items-center justify-center">
                <Map className="absolute inset-0 w-full h-full text-accent-gold/10 object-cover opacity-30" />
                
                {/* Live Delivery Route Visual Indicator */}
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <Compass className="w-8 h-8 text-[#F59E0B] mx-auto animate-spin-slow" />
                    <p className="text-[11px] text-luxury-cream font-bold tracking-wide">Rapido driver matches route details</p>
                    <p className="text-[9px] text-[#F59E0B] font-mono">Moghalrajpuram ➔ Your Address ({trackingOrder.estimatedTime})</p>
                  </div>
                </div>

                {/* Ambient beacon ping */}
                <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-[#F59E0B] rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-[#F59E0B] rounded-full border border-primary-dark" />

                <div className="absolute top-1/3 right-1/4 w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse flex items-center justify-center border border-primary-dark shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                  <MapPin className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* Progress Timeline nodes */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent-gold border-b border-accent-gold/10 pb-2">Status Timeline</h4>
                
                <div className="grid grid-cols-4 gap-2 relative">
                  {/* Progress Line connectors */}
                  <div className="absolute top-2 left-6 right-6 h-0.5 bg-primary-dark -z-10" />
                  <div 
                    className="absolute top-2 left-6 h-0.5 bg-accent-gold transition-all duration-1000 -z-10"
                    style={{ width: `${((trackingTimelineStep - 1) / 3) * 100}%` }}
                  />

                  {/* Step Nodes */}
                  {[
                    { step: 1, label: 'Confirmed', desc: 'Order received' },
                    { step: 2, label: 'Preparing', desc: 'Baking desserts' },
                    { step: 3, label: 'En Route', desc: 'Rapido parcel picked' },
                    { step: 4, label: 'Arriving', desc: 'At your door!' }
                  ].map(n => {
                    const isPassed = trackingTimelineStep >= n.step;
                    const isCurrent = trackingTimelineStep === n.step;
                    return (
                      <div key={n.step} className="text-center space-y-1">
                        <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold border transition-all ${
                          isPassed 
                            ? 'bg-accent-gold text-primary-dark border-accent-gold shadow-[0_0_8px_rgba(229,192,123,0.5)]' 
                            : 'bg-primary-dark text-muted-gold border-accent-gold/20'
                        } ${isCurrent ? 'animate-bounce' : ''}`}>
                          {isPassed && n.step < trackingTimelineStep ? '✓' : n.step}
                        </div>
                        <h5 className={`text-[10px] font-bold ${isPassed ? 'text-luxury-cream' : 'text-luxury-cream/45'}`}>{n.label}</h5>
                        <p className="text-[8px] text-muted-gold hidden sm:block font-light leading-none">{n.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery contact info */}
              <div className="bg-primary-dark/40 border border-accent-gold/10 p-4 rounded-2xl flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-gold/10 border border-accent-gold/25 flex items-center justify-center text-accent-gold shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-luxury-cream">Rapido Parcel Executive</h5>
                    <p className="text-[10px] text-muted-gold mt-0.5">Assigned driver id: RAP-8821</p>
                  </div>
                </div>
                <a 
                  href="tel:+918919196565"
                  className="px-4 py-2 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E] hover:text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3 h-3" /> Call Driver
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL 4: DETAILED ORDER RECEIPT / INVOICE VIEW */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {invoiceOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary-dark/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-primary-brown/95 border border-accent-gold/30 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative space-y-6 my-8"
            >
              <button 
                onClick={() => setInvoiceOrder(null)}
                className="absolute top-4 right-4 text-muted-gold hover:text-accent-gold cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-between items-center border-b border-accent-gold/15 pb-4">
                <h3 className="text-lg font-serif text-luxury-cream font-bold">Order Receipt</h3>
                <button
                  onClick={() => handleDownloadPDFLocal(invoiceOrder)}
                  className="px-4 py-1.5 rounded-full bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>

              {/* Printable Invoice Container */}
              <div 
                id="invoice-printable-container" 
                className="bg-white text-gray-900 p-6 md:p-8 rounded-2xl space-y-6 border border-gray-200 text-xs shadow-inner shadow-black/10"
              >
                
                {/* Branded Invoice Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {/* Logo fallback for raw HTML layout print */}
                      <span className="logo text-2xl font-serif font-bold text-gray-950">Melcho</span>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">The Desserts Boutique</p>
                    <p className="text-[9px] text-gray-400 mt-1 max-w-[200px] leading-relaxed">Rams VSR Apartments, Moghalrajpuram, Vijayawada, AP - 520010</p>
                  </div>

                  <div className="text-right space-y-1">
                    <h4 className="text-base font-bold text-gray-950 uppercase tracking-wider">Tax Invoice</h4>
                    <p className="font-mono text-gray-500">Invoice: <span className="font-bold text-gray-900">#INV-{invoiceOrder.id.replace('MLC-', '')}</span></p>
                    <p className="text-gray-500">GSTIN: <span className="font-bold text-gray-900 font-mono">37AAAAAM1026D1Z5</span></p>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-200" />

                {/* Customer / Order metadata */}
                <div className="grid grid-cols-2 gap-6 leading-relaxed">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase text-gray-400 mb-1">Customer Info</h5>
                    <p className="font-bold text-gray-900">{profile.fullName}</p>
                    <p className="text-gray-600 font-mono">{profile.email}</p>
                    <p className="text-gray-600 font-mono">{profile.phone}</p>
                  </div>

                  <div className="text-right">
                    <h5 className="text-[10px] font-bold uppercase text-gray-400 mb-1">Order Details</h5>
                    <p><span className="text-gray-500">Order ID: </span><span className="font-mono font-bold text-gray-900">{invoiceOrder.id}</span></p>
                    <p><span className="text-gray-500">Date: </span><span className="text-gray-900">{invoiceOrder.date}</span></p>
                    <p><span className="text-gray-500">Status: </span><span className="text-green-600 font-bold uppercase">{invoiceOrder.status}</span></p>
                  </div>
                </div>

                {/* Items Billing Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-t border-b border-gray-200 bg-gray-50">
                      <th className="py-2.5 px-3 text-gray-700 font-bold">Dessert Description</th>
                      <th className="py-2.5 px-3 text-center text-gray-700 font-bold">Qty</th>
                      <th className="py-2.5 px-3 text-right text-gray-700 font-bold">Unit Price</th>
                      <th className="py-2.5 px-3 text-right text-gray-700 font-bold">Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceOrder.items.map((itemObj, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-3 font-medium text-gray-900">
                          {itemObj.item.name}
                          <p className="text-[9px] text-gray-400 font-normal mt-0.5">{itemObj.item.category}</p>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-900 font-mono">{itemObj.quantity}</td>
                        <td className="py-3 px-3 text-right text-gray-600 font-mono">₹{itemObj.item.price}</td>
                        <td className="py-3 px-3 text-right text-gray-900 font-mono">₹{itemObj.item.price * itemObj.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Bottom billing calculations */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-2 text-right">
                    <div className="flex justify-between text-gray-600">
                      <span>Items Subtotal:</span>
                      <span className="font-mono text-gray-900">₹{invoiceOrder.totalAmount - invoiceOrder.gst - invoiceOrder.deliveryCharge + invoiceOrder.discount}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18% inclusive):</span>
                      <span className="font-mono text-gray-900">₹{invoiceOrder.gst}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee:</span>
                      <span className="font-mono text-gray-900">
                        {invoiceOrder.deliveryCharge > 0 ? `₹${invoiceOrder.deliveryCharge}` : '₹0 (FREE)'}
                      </span>
                    </div>

                    {invoiceOrder.discount > 0 && (
                      <div className="flex justify-between text-green-700 font-semibold">
                        <span>Promo Discount:</span>
                        <span className="font-mono">-₹{invoiceOrder.discount}</span>
                      </div>
                    )}

                    <div className="w-full h-px bg-gray-300 my-1" />

                    <div className="flex justify-between text-sm font-bold text-gray-950">
                      <span>Total Amount Paid:</span>
                      <span className="font-mono text-base">₹{invoiceOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-200 mt-6" />

                {/* Footer notes */}
                <div className="text-center text-[9px] text-gray-400 leading-normal space-y-0.5">
                  <p>This is a system generated electronic invoice and does not require signatures.</p>
                  <p>Thank you for choosing <span className="text-gray-600 font-bold">Melcho The Desserts</span>. Indulge again soon!</p>
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default ProfileDashboard;
