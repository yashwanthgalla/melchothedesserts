/**
 * MELCHO THE DESSERTS - BACKEND DATABASE SCHEMAS TEMPLATE
 * 
 * This file contains data schemas and database scripts to store customer profiles,
 * addresses, loyalty points, cart structures, and order histories.
 * 
 * Frameworks: MongoDB (Mongoose Schemas) & Supabase (PostgreSQL DDL + RLS Policies)
 */

import { Schema, model, Document, models } from 'mongoose';

// ====================================================
// 1. MONGODB (MONGOOSE) SCHEMAS
// ====================================================

// A. Saved Address Schema
export interface IAddress {
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>({
  type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// B. User Profile Schema (with loyalty & settings)
export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  membershipStatus: 'Silver' | 'Gold' | 'Platinum';
  rewardPoints: number;
  cashbackEarned: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  addresses: IAddress[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  avatar: { type: String, default: '' },
  membershipStatus: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Silver' },
  rewardPoints: { type: Number, default: 0 },
  cashbackEarned: { type: Number, default: 0 },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: true },
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = models.User || model<IUser>('User', UserSchema);

// C. Order Schema
export interface IOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  gst: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  deliveryStatus: 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryAddress: string;
  estimatedDeliveryTime: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderNumber: { type: String, required: true, unique: true, index: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  gst: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  deliveryStatus: { 
    type: String, 
    enum: ['Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Preparing' 
  },
  deliveryAddress: { type: String, required: true },
  estimatedDeliveryTime: { type: String, default: '30-45 mins' },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = models.Order || model<IOrder>('Order', OrderSchema);


// ====================================================
// 2. SUPABASE (POSTGRESQL DDL + ROW-LEVEL SECURITY)
// ====================================================
/*
-- Run this in your Supabase SQL Editor to configure tables & enable secure RLS access:

-- A. Users Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  membership_status TEXT CHECK (membership_status IN ('Silver', 'Gold', 'Platinum')) DEFAULT 'Silver',
  reward_points INTEGER DEFAULT 0,
  cashback_earned NUMERIC DEFAULT 0.00,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read and write only their own profile
CREATE POLICY "Allow users to view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);


-- B. Addresses Table
CREATE TABLE public.addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('Home', 'Work', 'Other')) DEFAULT 'Home',
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage own addresses" 
  ON public.addresses FOR ALL 
  USING (auth.uid() = user_id);


-- C. Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL, -- Array of items: [{id, name, price, qty, img}]
  subtotal NUMERIC NOT NULL,
  gst NUMERIC NOT NULL,
  delivery_charge NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('Pending', 'Paid', 'Failed')) DEFAULT 'Pending',
  delivery_status TEXT CHECK (delivery_status IN ('Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')) DEFAULT 'Preparing',
  delivery_address TEXT NOT NULL,
  estimated_delivery_time TEXT DEFAULT '30-45 mins',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view own order history" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create new orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
*/
