/**
 * MELCHO THE DESSERTS - BACKEND AUTHENTICATION TEMPLATE
 * 
 * This file provides implementation blueprints for secure user authentication,
 * JWT session management, and verification middleware.
 * 
 * Stack: Firebase Auth & Auth.js (NextAuth)
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import admin from 'firebase-admin';

// ==========================================
// 1. FIREBASE AUTH CONFIGURATION (ADMIN SDK)
// ==========================================

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

/**
 * Middleware function to verify Firebase ID tokens sent from the client headers.
 * Useful when using Firebase Auth directly on the frontend.
 */
export async function verifyFirebaseToken(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing bearer token');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // Contains: uid, email, name, picture
  } catch (error) {
    throw new Error('Unauthorized: Invalid firebase token verification failed');
  }
}

// ==========================================
// 2. AUTH.JS (NEXTAUTH) CONFIGURATION
// ==========================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Melcho Account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'patron@melcho.in' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        // 1. Fetch user from MongoDB database
        // const user = await db.collection('users').findOne({ email: credentials.email });
        // if (!user) throw new Error('No user found with this email');

        // 2. Validate hashed password (using bcrypt)
        // const isPasswordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        // if (!isPasswordMatch) throw new Error('Invalid credentials');

        // Mock return for compilation reference
        const mockUser = {
          id: 'usr_9831',
          name: 'Yashwanth Galla',
          email: credentials.email,
          membership: 'Gold Member',
        };

        return mockUser;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // JSON Web Token strategy for modern session caching
    maxAge: 30 * 24 * 60 * 60, // 30 Days session expiration
  },
  callbacks: {
    // Inject custom properties (like membership status and points) into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.membership = (user as any).membership;
      }
      return token;
    },
    // Expose those token details to the frontend session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).membership = token.membership;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // redirect user if unauthorized
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
