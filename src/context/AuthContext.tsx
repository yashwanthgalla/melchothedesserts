import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
  avatar: string;
  rewardPoints: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  redirectTab: string;
  setRedirectTab: (tab: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('melcho_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTabState] = useState<string>('home');
  const [redirectTab, setRedirectTab] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // Monitor actual Firebase Authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Fetch or initialize user profile from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let profileData = {
            fullName: firebaseUser.displayName || 'Dessert Lover',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            rewardPoints: 100, // 100 sign up points
            cashbackEarned: 0,
            referralBonus: 0
          };

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            profileData = {
              fullName: data.fullName || profileData.fullName,
              email: data.email || profileData.email,
              phone: data.phone || profileData.phone,
              rewardPoints: data.rewardPoints !== undefined ? data.rewardPoints : profileData.rewardPoints,
              cashbackEarned: data.cashbackEarned || 0,
              referralBonus: data.referralBonus || 0
            };
          } else {
            // Save initial user doc in Firestore
            await setDoc(userDocRef, profileData);
          }

          const loggedInUser: AuthUser = {
            uid: firebaseUser.uid,
            displayName: profileData.fullName,
            email: profileData.email,
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
            rewardPoints: profileData.rewardPoints
          };

          setUser(loggedInUser);
          localStorage.setItem('melcho_user', JSON.stringify(loggedInUser));
          
          // Also set the local storage melcho_profile to sync details immediately
          localStorage.setItem('melcho_profile', JSON.stringify({
            fullName: profileData.fullName,
            email: profileData.email,
            phone: profileData.phone,
            avatar: loggedInUser.avatar,
            joinedDate: 'June 2026',
            rewardPoints: profileData.rewardPoints,
            cashbackEarned: profileData.cashbackEarned,
            referralBonus: profileData.referralBonus,
            emailNotifications: true,
            smsNotifications: true,
            accountPrivacy: 'Public',
          }));

        } catch (error) {
          console.error('Error synchronizing user profile with Firestore:', error);
          
          // Fallback to local session details if Firestore blocks access (e.g. offline or security rules)
          const loggedInUser: AuthUser = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Dessert Lover',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
            rewardPoints: 100
          };
          
          setUser(loggedInUser);
          localStorage.setItem('melcho_user', JSON.stringify(loggedInUser));
          localStorage.setItem('melcho_profile', JSON.stringify({
            fullName: loggedInUser.displayName,
            email: loggedInUser.email,
            phone: '',
            avatar: loggedInUser.avatar,
            joinedDate: 'June 2026',
            rewardPoints: 100,
            cashbackEarned: 0,
            referralBonus: 0,
            emailNotifications: true,
            smsNotifications: true,
            accountPrivacy: 'Public',
          }));
        }
      } else {
        setUser(null);
        localStorage.removeItem('melcho_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setActiveTab = (tab: string) => {
    if (tab !== 'auth') {
      setRedirectTab(tab);
    }
    setActiveTabState(tab);
  };

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name in Firebase auth session
    await updateProfile(userCredential.user, {
      displayName: name
    });
  };

  const loginWithGoogle = async (): Promise<void> => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
    setActiveTab('home');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        activeTab,
        setActiveTab,
        redirectTab,
        setRedirectTab
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
