"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";

// ============================================================
// TATU ANKARA - Complete E-Commerce Platform
// Single-file Next.js application with all features
// ============================================================

// --- Types ---
interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  price: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  images: string[];
  variants: ProductVariant[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  sizes: string[];
}

interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "payment_submitted" | "payment_confirmed" | "preparing" | "dispatched" | "delivered" | "cancelled";
  paymentMethod: string;
  mpesaMessage?: string;
  createdAt: string;
  statusHistory: { status: string; timestamp: string; by: string }[];
  notes?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  addresses: Address[];
}

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  phone: string;
}

// --- Demo Data ---
const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Floral Ankara Maxi Dress",
    slug: "floral-ankara-maxi-dress",
    description: "Elegant maxi dress crafted from premium Ankara fabric. Features a flattering A-line silhouette with side pockets and a comfortable elastic waistband. Perfect for special occasions or casual outings.",
    price: 4500,
    salePrice: 3800,
    category: "dresses",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop"],
    variants: [
      { id: "v1", size: "S", stock: 5, price: 4500 },
      { id: "v2", size: "M", stock: 8, price: 4500 },
      { id: "v3", size: "L", stock: 3, price: 4500 },
      { id: "v4", size: "XL", stock: 2, price: 4500 },
    ],
    featured: true,
    newArrival: true,
    bestSeller: false,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p2",
    name: "Geometric Ankara Skirt Set",
    slug: "geometric-ankara-skirt-set",
    description: "Stunning two-piece set featuring a geometric Ankara print skirt with a matching crop top. Versatile and stylish for both office and weekend wear.",
    price: 3200,
    category: "two-piece",
    images: ["https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"],
    variants: [
      { id: "v5", size: "S", stock: 4, price: 3200 },
      { id: "v6", size: "M", stock: 6, price: 3200 },
      { id: "v7", size: "L", stock: 5, price: 3200 },
    ],
    featured: true,
    newArrival: false,
    bestSeller: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: "p3",
    name: "Bold Print Ankara Jumpsuit",
    slug: "bold-print-ankara-jumpsuit",
    description: "Make a statement with this bold print Ankara jumpsuit. Features a tailored fit with wide-leg pants and a wrap-style top. Comfortable yet sophisticated.",
    price: 5200,
    category: "jumpsuits",
    images: ["https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop"],
    variants: [
      { id: "v8", size: "S", stock: 3, price: 5200 },
      { id: "v9", size: "M", stock: 4, price: 5200 },
      { id: "v10", size: "L", stock: 2, price: 5200 },
      { id: "v11", size: "XL", stock: 1, price: 5200 },
    ],
    featured: false,
    newArrival: true,
    bestSeller: false,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p4",
    name: "Classic Ankara Midi Dress",
    slug: "classic-ankara-midi-dress",
    description: "Timeless midi dress in classic Ankara print. Knee-length with a fitted bodice and flared skirt. Ideal for church, work, or dinner dates.",
    price: 3800,
    salePrice: 3400,
    category: "dresses",
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=600&h=800&fit=crop"],
    variants: [
      { id: "v12", size: "S", stock: 7, price: 3800 },
      { id: "v13", size: "M", stock: 9, price: 3800 },
      { id: "v14", size: "L", stock: 4, price: 3800 },
    ],
    featured: true,
    newArrival: false,
    bestSeller: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: "p5",
    name: "Ankara Kimono Jacket",
    slug: "ankara-kimono-jacket",
    description: "Versatile Ankara kimono jacket that can be worn over any outfit. Open-front design with wide sleeves. Perfect for layering.",
    price: 2800,
    category: "tops",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&h=800&fit=crop"],
    variants: [
      { id: "v15", size: "S", stock: 6, price: 2800 },
      { id: "v16", size: "M", stock: 8, price: 2800 },
      { id: "v17", size: "L", stock: 5, price: 2800 },
    ],
    featured: false,
    newArrival: true,
    bestSeller: false,
    sizes: ["S", "M", "L"],
  },
  {
    id: "p6",
    name: "Peplum Ankara Blouse",
    slug: "peplum-ankara-blouse",
    description: "Feminine peplum blouse in vibrant Ankara print. Fitted waist with flared peplum hem. Pairs beautifully with skirts or trousers.",
    price: 2500,
    category: "tops",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=600&h=800&fit=crop"],
    variants: [
      { id: "v18", size: "S", stock: 5, price: 2500 },
      { id: "v19", size: "M", stock: 7, price: 2500 },
      { id: "v20", size: "L", stock: 3, price: 2500 },
    ],
    featured: false,
    newArrival: false,
    bestSeller: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: "p7",
    name: "Ankara Pencil Skirt",
    slug: "ankara-pencil-skirt",
    description: "Sleek pencil skirt in Ankara fabric. High-waisted with a back slit for comfort. Professional yet stylish.",
    price: 2200,
    category: "skirts",
    images: ["https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop"],
    variants: [
      { id: "v21", size: "S", stock: 4, price: 2200 },
      { id: "v22", size: "M", stock: 6, price: 2200 },
      { id: "v23", size: "L", stock: 3, price: 2200 },
    ],
    featured: false,
    newArrival: true,
    bestSeller: false,
    sizes: ["S", "M", "L"],
  },
  {
    id: "p8",
    name: "Wrap Ankara Dress",
    slug: "wrap-ankara-dress",
    description: "Beautiful wrap dress that flatters every body type. Adjustable tie waist and flowing skirt. A wardrobe essential.",
    price: 4200,
    category: "dresses",
    images: ["https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop"],
    variants: [
      { id: "v24", size: "S", stock: 3, price: 4200 },
      { id: "v25", size: "M", stock: 5, price: 4200 },
      { id: "v26", size: "L", stock: 4, price: 4200 },
      { id: "v27", size: "XL", stock: 2, price: 4200 },
    ],
    featured: true,
    newArrival: false,
    bestSeller: true,
    sizes: ["S", "M", "L", "XL"],
  },
];

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "dresses", name: "Dresses" },
  { id: "two-piece", name: "Two-Piece Sets" },
  { id: "jumpsuits", name: "Jumpsuits" },
  { id: "tops", name: "Tops" },
  { id: "skirts", name: "Skirts" },
];

const SIZE_GUIDE: Record<string, { bust: string; waist: string; hips: string }> = {
  S: { bust: "32-34", waist: "26-28", hips: "34-36" },
  M: { bust: "34-36", waist: "28-30", hips: "36-38" },
  L: { bust: "36-38", waist: "30-32", hips: "38-40" },
  XL: { bust: "38-40", waist: "32-34", hips: "40-42" },
};

// --- Storage Helpers ---
const storage = {
  get: <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: <T,>(key: string, value: T) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  },
};

// --- Formatters ---
const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

// --- Status Config ---
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#C9A227", bg: "#FFF9E6" },
  payment_submitted: { label: "Payment Submitted", color: "#3B82F6", bg: "#EFF6FF" },
  payment_confirmed: { label: "Payment Confirmed", color: "#22C55E", bg: "#F0FDF4" },
  preparing: { label: "Preparing", color: "#8B5CF6", bg: "#F5F3FF" },
  dispatched: { label: "Dispatched", color: "#06B6D4", bg: "#ECFEFF" },
  delivered: { label: "Delivered", color: "#16A34A", bg: "#DCFCE7" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "#FEF2F2" },
};

const STATUS_FLOW = ["pending", "payment_submitted", "payment_confirmed", "preparing", "dispatched", "delivered"];

// ============================================================
// ICONS
// ============================================================
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Cart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  ),
  Heart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Minus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Package: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Truck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><path d="M17 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-2.48-2.87A1 1 0 0 0 16.24 9H14"/></svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  ShopIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
  ),
  Orders: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  Logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  ),
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  Products: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  ),
  ArrowLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  ),
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  XCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  ),
  TrendingUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  DollarSign: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Box: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
};

// ============================================================
// CONTEXT & TYPES
// ============================================================
type Page = "home" | "shop" | "product" | "cart" | "checkout" | "login" | "register" | "profile" | "orders" | "order-detail" | "admin" | "admin-products" | "admin-orders" | "admin-customers" | "about" | "contact";

interface AppContextType {
  currentPage: Page;
  navigate: (page: Page, params?: Record<string, any>) => void;
  pageParams: Record<string, any>;
  cart: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "statusHistory">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"], by?: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "slug">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string) => void;
  logout: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  filteredProducts: Product[];
}

const AppContext = React.createContext<AppContextType | null>(null);

const useApp = () => {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContext");
  return ctx;
};

// ============================================================
// MAIN APP
// ============================================================
export default function TatuAnkaraApp() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const savedCart = storage.get<CartItem[]>("tatu_cart", []);
    const savedOrders = storage.get<Order[]>("tatu_orders", []);
    const savedUser = storage.get<User | null>("tatu_user", null);
    const savedWishlist = storage.get<string[]>("tatu_wishlist", []);
    setCart(savedCart);
    setOrders(savedOrders);
    setUser(savedUser);
    setWishlist(savedWishlist);
  }, []);

  useEffect(() => { storage.set("tatu_cart", cart); }, [cart]);
  useEffect(() => { storage.set("tatu_orders", orders); }, [orders]);
  useEffect(() => { storage.set("tatu_user", user); }, [user]);
  useEffect(() => { storage.set("tatu_wishlist", wishlist); }, [wishlist]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigate = useCallback((page: Page, params?: Record<string, any>) => {
    setCurrentPage(page);
    setPageParams(params || {});
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const addToCart = useCallback((product: Product, variantId: string, quantity: number = 1) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant || variant.stock < 1) {
      showToast("Sorry, this size is out of stock", "error");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) {
        return prev.map(item =>
          item.variantId === variantId
            ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        variantId,
        name: product.name,
        size: variant.size,
        price: product.salePrice || product.price,
        quantity,
        image: product.images[0],
      }];
    });
    showToast(`${product.name} (Size ${variant.size}) added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
    showToast("Item removed from cart");
  }, [showToast]);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity < 1) { removeFromCart(variantId); return; }
    setCart(prev => prev.map(item => item.variantId === variantId ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) { showToast("Removed from wishlist"); return prev.filter(id => id !== productId); }
      showToast("Added to wishlist"); return [...prev, productId];
    });
  }, [showToast]);

  const createOrder = useCallback((orderData: Omit<Order, "id" | "createdAt" | "status" | "statusHistory">) => {
    const newOrder: Order = {
      ...orderData,
      id: `TA-${Date.now().toString(36).toUpperCase()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: "pending", timestamp: new Date().toISOString(), by: "System" }],
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"], by: string = "Staff") => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return { ...order, status, statusHistory: [...order.statusHistory, { status, timestamp: new Date().toISOString(), by }] };
    }));
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id" | "slug">) => {
    const newProduct: Product = { ...product, id: `p${Date.now()}`, slug: product.name.toLowerCase().replace(/\s+/g, "-") };
    setProducts(prev => [newProduct, ...prev]);
    showToast("Product added successfully");
  }, [showToast]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast("Product updated");
  }, [showToast]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Product deleted");
  }, [showToast]);

  const login = useCallback((email: string, password: string) => {
    if (email === "admin@tatuankara.com" && password === "admin123") {
      const adminUser: User = { id: "admin1", name: "Admin User", email: "admin@tatuankara.com", phone: "+254712345678", role: "admin", addresses: [] };
      setUser(adminUser);
      showToast("Welcome back, Admin!");
      navigate("admin");
      return true;
    }
    const customerUser: User = { id: `cust${Date.now()}`, name: email.split("@")[0], email, phone: "+254700000000", role: "customer", addresses: [] };
    setUser(customerUser);
    showToast("Welcome to Tatu Ankara!");
    navigate("home");
    return true;
  }, [navigate, showToast]);

  const register = useCallback((name: string, email: string, phone: string, password: string) => {
    const newUser: User = { id: `cust${Date.now()}`, name, email, phone, role: "customer", addresses: [] };
    setUser(newUser);
    showToast("Account created successfully!");
    navigate("home");
  }, [navigate, showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    showToast("Logged out successfully");
    navigate("home");
  }, [navigate, showToast]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return result;
  }, [products, activeCategory, searchQuery]);

  const ctx: AppContextType = {
    currentPage, navigate, pageParams,
    cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
    orders, createOrder, updateOrderStatus,
    products, addProduct, updateProduct, deleteProduct,
    user, login, register, logout,
    isCartOpen, setIsCartOpen,
    mobileMenuOpen, setMobileMenuOpen,
    searchQuery, setSearchQuery,
    showToast,
    activeCategory, setActiveCategory,
    wishlist, toggleWishlist,
    filteredProducts,
  };

  return (
    <AppContext.Provider value={ctx}>
      <Head>
        <title>Tatu Ankara | Elegant African Fashion</title>
        <meta name="description" content="Tatu Ankara - Kenyan fashion brand specializing in contemporary women's clothing crafted from premium Ankara fabrics." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="app-container">
        <style>{`
          :root {
            --gold: #C9A227; --gold-light: #E8D5A3; --black: #111111; --white: #FFFFFF;
            --gray-50: #F7F7F7; --gray-100: #EEEEEE; --gray-200: #DDDDDD; --gray-300: #CCCCCC;
            --gray-400: #999999; --gray-500: #666666; --gray-600: #444444; --gray-700: #333333;
            --success: #22C55E; --error: #EF4444; --warning: #F59E0B; --info: #3B82F6;
            --radius-sm: 8px; --radius-md: 10px; --radius-lg: 12px;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05); --shadow-md: 0 4px 12px rgba(0,0,0,0.08); --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
            --transition: all 0.2s ease;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: var(--black); background: var(--white); line-height: 1.6; -webkit-font-smoothing: antialiased; }
          button { cursor: pointer; border: none; background: none; font-family: inherit; }
          a { text-decoration: none; color: inherit; }
          img { max-width: 100%; display: block; }
          input, textarea, select { font-family: inherit; }
          .app-container { min-height: 100vh; display: flex; flex-direction: column; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: var(--gray-50); }
          ::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: var(--gray-400); }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          .fade-in { animation: fadeIn 0.3s ease-out; }
          .slide-in-right { animation: slideInRight 0.3s ease-out; }
          .skeleton { background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%); background-size: 200% 100%; animation: skeleton 1.5s infinite; border-radius: var(--radius-sm); }
          @keyframes skeleton { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: var(--radius-md); font-size: 14px; font-weight: 500; letter-spacing: 0.3px; transition: var(--transition); cursor: pointer; }
          .btn-primary { background: var(--black); color: var(--white); }
          .btn-primary:hover { background: var(--gray-700); }
          .btn-gold { background: var(--gold); color: var(--black); }
          .btn-gold:hover { background: #B8941F; }
          .btn-outline { background: transparent; color: var(--black); border: 1.5px solid var(--gray-200); }
          .btn-outline:hover { border-color: var(--black); }
          .btn-ghost { background: transparent; color: var(--gray-500); }
          .btn-ghost:hover { color: var(--black); }
          .btn-sm { padding: 8px 16px; font-size: 13px; }
          .btn-lg { padding: 14px 32px; font-size: 15px; }
          .btn-full { width: 100%; }
          .btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .input { width: 100%; padding: 12px 16px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-md); font-size: 14px; transition: var(--transition); background: var(--white); }
          .input:focus { outline: none; border-color: var(--black); box-shadow: 0 0 0 3px rgba(17,17,17,0.08); }
          .input::placeholder { color: var(--gray-400); }
          .card { background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--gray-100); transition: var(--transition); }
          .card-hover:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
          .badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; }
          .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
          .section { padding: 48px 16px; max-width: 1200px; margin: 0 auto; }
          @media (min-width: 768px) { .section { padding: 64px 24px; } }
          .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
          @media (min-width: 640px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
          @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
          @media (max-width: 768px) { .hide-mobile { display: none !important; } }
          @media (min-width: 769px) { .hide-desktop { display: none !important; } }
        `}</style>

        <Header />
        <main style={{ flex: 1 }}>
          {currentPage === "home" && <HomePage />}
          {currentPage === "shop" && <ShopPage />}
          {currentPage === "product" && <ProductPage />}
          {currentPage === "cart" && <CartPage />}
          {currentPage === "checkout" && <CheckoutPage />}
          {currentPage === "login" && <LoginPage />}
          {currentPage === "register" && <RegisterPage />}
          {currentPage === "profile" && <ProfilePage />}
          {currentPage === "orders" && <OrdersPage />}
          {currentPage === "order-detail" && <OrderDetailPage />}
          {currentPage === "admin" && <AdminDashboard />}
          {currentPage === "admin-products" && <AdminProducts />}
          {currentPage === "admin-orders" && <AdminOrders />}
          {currentPage === "admin-customers" && <AdminCustomers />}
          {currentPage === "about" && <AboutPage />}
          {currentPage === "contact" && <ContactPage />}
        </main>
        <Footer />
        <CartDrawer />
        <MobileNav />
        <Toast toast={toast} />
      </div>
    </AppContext.Provider>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header() {
  const { navigate, cartCount, setIsCartOpen, searchQuery, setSearchQuery, user, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--gray-100)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <button className="hide-desktop" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ padding: 8 }}><Icons.Menu /></button>
        <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--black)" }}>TA</div>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: 1 }}>TATU ANKARA</span>
        </div>
        <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 28, flex: 1, justifyContent: "center" }}>
          {[["home","Home"],["shop","Shop"],["about","About"],["contact","Contact"]].map(([p,l]) => (
            <button key={p} onClick={() => navigate(p as Page)} style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-600)", transition: "var(--transition)", background: "none", border: "none", cursor: "pointer" }} onMouseEnter={e => (e.target as HTMLElement).style.color="var(--black)"} onMouseLeave={e => (e.target as HTMLElement).style.color="var(--gray-600)"}>{l}</button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSearchOpen(!searchOpen)} style={{ padding: 8, borderRadius: "50%", transition: "var(--transition)" }} onMouseEnter={e => (e.target as HTMLElement).style.background="var(--gray-50)"} onMouseLeave={e => (e.target as HTMLElement).style.background="transparent"}><Icons.Search /></button>
          <button onClick={() => user ? navigate("profile") : navigate("login")} style={{ padding: 8, borderRadius: "50%", transition: "var(--transition)" }} onMouseEnter={e => (e.target as HTMLElement).style.background="var(--gray-50)"} onMouseLeave={e => (e.target as HTMLElement).style.background="transparent"}><Icons.User /></button>
          <button onClick={() => setIsCartOpen(true)} style={{ padding: 8, borderRadius: "50%", transition: "var(--transition)", position: "relative" }} onMouseEnter={e => (e.target as HTMLElement).style.background="var(--gray-50)"} onMouseLeave={e => (e.target as HTMLElement).style.background="transparent"}>
            <Icons.Cart />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "var(--gold)", color: "var(--black)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div style={{ padding: "0 16px 12px", maxWidth: 1200, margin: "0 auto" }} className="fade-in">
          <div style={{ position: "relative" }}>
            <input type="text" placeholder="Search dresses, skirts, jumpsuits..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" style={{ paddingLeft: 44 }} />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}><Icons.Search /></span>
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}><Icons.Close /></button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ============================================================
// MOBILE NAV
// ============================================================
function MobileNav() {
  const { mobileMenuOpen, setMobileMenuOpen, navigate, user, logout } = useApp();
  if (!mobileMenuOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
      <div style={{ flex: 1, background: "rgba(0,0,0,0.4)" }} onClick={() => setMobileMenuOpen(false)} />
      <div className="slide-in-right" style={{ width: 280, background: "var(--white)", height: "100vh", overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}><Icons.Close /></button>
        </div>
        {user && (
          <div style={{ padding: "16px 0", borderBottom: "1px solid var(--gray-100)", marginBottom: 8 }}>
            <p style={{ fontWeight: 600 }}>{user.name}</p>
            <p style={{ fontSize: 13, color: "var(--gray-500)" }}>{user.email}</p>
          </div>
        )}
        {[["home","Home",Icons.Home],["shop","Shop",Icons.ShopIcon],["orders","My Orders",Icons.Orders],["profile","Profile",Icons.User]].map(([p,l,I]) => (
          <button key={p as string} onClick={() => navigate(p as Page)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", fontSize: 15, color: "var(--gray-700)", borderBottom: "1px solid var(--gray-50)", textAlign: "left" }}>
            <I />{l}
          </button>
        ))}
        {user?.role === "admin" && (
          <button onClick={() => navigate("admin")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", fontSize: 15, color: "var(--gold)", fontWeight: 600, borderBottom: "1px solid var(--gray-50)", textAlign: "left" }}>
            <Icons.Dashboard />Admin Dashboard
          </button>
        )}
        {user ? (
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", fontSize: 15, color: "var(--error)", marginTop: "auto" }}><Icons.Logout />Logout</button>
        ) : (
          <button onClick={() => navigate("login")} className="btn btn-primary btn-full" style={{ marginTop: "auto" }}>Sign In</button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const { navigate } = useApp();
  return (
    <footer style={{ background: "var(--black)", color: "var(--white)", padding: "48px 16px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--black)" }}>TA</div>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>TATU ANKARA</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--gray-400)", lineHeight: 1.7, marginBottom: 16 }}>Kenyan fashion brand specializing in contemporary women's clothing crafted from premium Ankara fabrics.</p>
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#25D366", color: "white", borderRadius: 24, fontSize: 14, fontWeight: 500 }}><Icons.WhatsApp /> Chat on WhatsApp</a>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Shop</h4>
            {[["shop","All Products"],["shop","Dresses"],["shop","Two-Piece Sets"],["shop","Jumpsuits"]].map(([p,l]) => (
              <button key={l} onClick={() => navigate(p as Page)} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "var(--gray-400)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>{l}</button>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Support</h4>
            {[["about","About Us"],["contact","Contact"],["orders","Track Order"],["profile","My Account"]].map(([p,l]) => (
              <button key={l} onClick={() => navigate(p as Page)} style={{ display: "block", padding: "6px 0", fontSize: 14, color: "var(--gray-400)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>{l}</button>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Contact</h4>
            <p style={{ fontSize: 14, color: "var(--gray-400)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Icons.MapPin /> Nairobi, Kenya</p>
            <p style={{ fontSize: 14, color: "var(--gray-400)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Icons.Phone /> +254 712 345 678</p>
            <p style={{ fontSize: 14, color: "var(--gray-400)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Icons.Mail /> hello@tatuankara.com</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--gray-700)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "var(--gray-500)" }}>© 2026 Tatu Ankara. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "var(--gray-600)" }}>Crafted with love in Kenya</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// TOAST
// ============================================================
function Toast({ toast }: { toast: { message: string; type: "success" | "error" } | null }) {
  if (!toast) return null;
  return (
    <div className="fade-in" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 300, padding: "12px 24px", borderRadius: 24, background: toast.type === "error" ? "var(--error)" : "var(--black)", color: "var(--white)", fontSize: 14, fontWeight: 500, boxShadow: "var(--shadow-lg)", whiteSpace: "nowrap" }}>
      {toast.message}
    </div>
  );
}

// ============================================================
// CART DRAWER
// ============================================================
function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal, navigate } = useApp();
  if (!isCartOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex" }}>
      <div style={{ flex: 1, background: "rgba(0,0,0,0.4)" }} onClick={() => setIsCartOpen(false)} />
      <div className="slide-in-right" style={{ width: "100%", maxWidth: 420, background: "var(--white)", height: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Shopping Cart ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ padding: 4 }}><Icons.Close /></button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Icons.Cart />
              <p style={{ marginTop: 16, fontSize: 15, color: "var(--gray-500)" }}>Your cart is empty</p>
              <button onClick={() => { setIsCartOpen(false); navigate("shop"); }} className="btn btn-outline" style={{ marginTop: 16 }}>Continue Shopping</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cart.map(item => (
                <div key={item.variantId} style={{ display: "flex", gap: 12, padding: 12, borderRadius: 12, border: "1px solid var(--gray-100)" }}>
                  <img src={item.image} alt={item.name} style={{ width: 80, height: 100, objectFit: "cover", borderRadius: 8 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                    <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 8 }}>Size: {item.size}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--gray-200)", borderRadius: 8, padding: "2px 8px" }}>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} style={{ padding: 4, color: "var(--gray-500)" }}><Icons.Minus /></button>
                        <span style={{ fontSize: 14, fontWeight: 500, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} style={{ padding: 4, color: "var(--gray-500)" }}><Icons.Plus /></button>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.variantId)} style={{ padding: 4, color: "var(--gray-400)", alignSelf: "flex-start" }}><Icons.Trash /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: 20, borderTop: "1px solid var(--gray-100)", background: "var(--gray-50)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: "var(--gray-500)" }}>Subtotal</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: "var(--gray-500)" }}>Delivery</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Calculated at checkout</span>
            </div>
            <button onClick={() => { setIsCartOpen(false); navigate("checkout"); }} className="btn btn-primary btn-full btn-lg">Proceed to Checkout</button>
            <button onClick={() => { setIsCartOpen(false); navigate("shop"); }} className="btn btn-ghost btn-full" style={{ marginTop: 8 }}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({ product }: { product: Product }) {
  const { navigate, addToCart, wishlist, toggleWishlist } = useApp();
  const isWished = wishlist.includes(product.id);

  return (
    <div className="card card-hover" style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => navigate("product", { slug: product.slug })}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={product.images[0]} alt={product.name} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", transition: "transform 0.4s ease" }} onMouseEnter={e => (e.target as HTMLElement).style.transform="scale(1.05)"} onMouseLeave={e => (e.target as HTMLElement).style.transform="scale(1)"} />
        {product.salePrice && (
          <span className="badge" style={{ position: "absolute", top: 12, left: 12, background: "var(--error)", color: "white" }}>Sale</span>
        )}
        {product.newArrival && !product.salePrice && (
          <span className="badge" style={{ position: "absolute", top: 12, left: 12, background: "var(--gold)", color: "var(--black)" }}>New</span>
        )}
        <button onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", transition: "var(--transition)" }}>
          <span style={{ color: isWished ? "var(--error)" : "var(--gray-400)" }}><Icons.Heart /></span>
        </button>
        <button onClick={e => { e.stopPropagation(); const v = product.variants.find(v => v.stock > 0); if (v) addToCart(product, v.id); }} className="btn btn-primary btn-sm" style={{ position: "absolute", bottom: 12, left: 12, right: 12, opacity: 0, transition: "opacity 0.2s" }} onMouseEnter={e => (e.target as HTMLElement).style.opacity="1"}>
          Quick Add
        </button>
      </div>
      <div style={{ padding: "12px 16px 16px" }}>
        <p style={{ fontSize: 13, color: "var(--gray-500)", textTransform: "capitalize", marginBottom: 4 }}>{product.category}</p>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{formatPrice(product.salePrice || product.price)}</span>
          {product.salePrice && <span style={{ fontSize: 13, color: "var(--gray-400)", textDecoration: "line-through" }}>{formatPrice(product.price)}</span>}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {product.sizes.map(size => {
            const variant = product.variants.find(v => v.size === size);
            const inStock = variant && variant.stock > 0;
            return (
              <span key={size} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, border: `1px solid ${inStock ? "var(--gray-200)" : "var(--gray-100)"}`, color: inStock ? "var(--gray-600)" : "var(--gray-300)", textDecoration: inStock ? "none" : "line-through" }}>{size}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage() {
  const { navigate, products } = useApp();
  const featured = products.filter(p => p.featured);
  const newArrivals = products.filter(p => p.newArrival);
  const bestSellers = products.filter(p => p.bestSeller);

  return (
    <div className="fade-in">
      {/* Hero */}
      <section style={{ position: "relative", height: "70vh", minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&h=900&fit=crop" alt="Hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 600 }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>Tatu Ankara</p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 600, color: "var(--white)", lineHeight: 1.1, marginBottom: 20 }}>Ready-Made Ankara Fashion You'll Love</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 32, lineHeight: 1.6 }}>Discover stylish dresses and outfits crafted for the modern woman. Premium Ankara fabrics, expert tailoring.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("shop")} className="btn btn-gold btn-lg">Shop Now</button>
            <button onClick={() => navigate("about")} className="btn btn-outline btn-lg" style={{ borderColor: "rgba(255,255,255,0.4)", color: "var(--white)" }}>Our Story</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, textAlign: "center", marginBottom: 8 }}>Shop by Category</h2>
        <p style={{ textAlign: "center", color: "var(--gray-500)", marginBottom: 40 }}>Find your perfect style</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {CATEGORIES.filter(c => c.id !== "all").map(cat => (
            <button key={cat.id} onClick={() => navigate("shop")} className="card card-hover" style={{ padding: "32px 16px", textAlign: "center", border: "none", cursor: "pointer", background: "var(--gray-50)" }}>
              <p style={{ fontSize: 18, fontWeight: 600, textTransform: "capitalize" }}>{cat.name}</p>
              <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{products.filter(p => p.category === cat.id).length} items</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ background: "var(--gray-50)", padding: "64px 16px" }}>
          <div className="section" style={{ padding: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600 }}>Featured Collection</h2>
              <button onClick={() => navigate("shop")} className="btn btn-ghost">View All <Icons.ChevronRight /></button>
            </div>
            <div className="product-grid">
              {featured.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600 }}>New Arrivals</h2>
            <button onClick={() => navigate("shop")} className="btn btn-ghost">View All <Icons.ChevronRight /></button>
          </div>
          <div className="product-grid">
            {newArrivals.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section style={{ background: "var(--gray-50)", padding: "64px 16px" }}>
          <div className="section" style={{ padding: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600 }}>Best Sellers</h2>
              <button onClick={() => navigate("shop")} className="btn btn-ghost">View All <Icons.ChevronRight /></button>
            </div>
            <div className="product-grid">
              {bestSellers.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="section">
        <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, textAlign: "center", marginBottom: 40 }}>Why Choose Tatu Ankara</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {[
            { icon: <Icons.Package />, title: "Ready Made", desc: "No waiting. Pick your size and go." },
            { icon: <Icons.Star />, title: "Premium Quality", desc: "Authentic Ankara fabrics, expert tailoring." },
            { icon: <Icons.Truck />, title: "Nationwide Delivery", desc: "Fast shipping across Kenya." },
            { icon: <Icons.Shield />, title: "Secure Shopping", desc: "Safe payments and easy returns." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--gold)" }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--gray-500)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section style={{ background: "var(--black)", padding: "48px 16px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "var(--white)", marginBottom: 12 }}>Need Help Choosing?</h2>
          <p style={{ fontSize: 15, color: "var(--gray-400)", marginBottom: 24 }}>Chat with us on WhatsApp for personalized styling advice and custom orders.</p>
          <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg" style={{ display: "inline-flex" }}>
            <Icons.WhatsApp /> Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// SHOP PAGE
// ============================================================
function ShopPage() {
  const { filteredProducts, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useApp();
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const sorted = useMemo(() => {
    let result = [...filteredProducts];
    if (sortBy === "price-low") result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    if (sortBy === "price-high") result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    if (sortBy === "newest") result.sort((a, b) => (a.newArrival === b.newArrival ? 0 : a.newArrival ? -1 : 1));
    return result.filter(p => (p.salePrice || p.price) >= priceRange[0] && (p.salePrice || p.price) <= priceRange[1]);
  }, [filteredProducts, sortBy, priceRange]);

  return (
    <div className="fade-in">
      <div className="section">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, marginBottom: 8 }}>Shop Collection</h1>
          <p style={{ color: "var(--gray-500)" }}>{sorted.length} products</p>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* Filters - Desktop */}
          <div className="hide-mobile" style={{ width: 240, flexShrink: 0, position: "sticky", top: 80 }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Categories</h3>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, fontSize: 14, marginBottom: 4, background: activeCategory === cat.id ? "var(--black)" : "transparent", color: activeCategory === cat.id ? "var(--white)" : "var(--gray-600)", transition: "var(--transition)" }}>
                  {cat.name}
                </button>
              ))}
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Price Range</h3>
              <input type="range" min="0" max="10000" step="100" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} style={{ width: "100%", marginBottom: 8 }} />
              <p style={{ fontSize: 13, color: "var(--gray-500)" }}>Up to {formatPrice(priceRange[1])}</p>
            </div>
          </div>

          {/* Products */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <button className="btn btn-outline btn-sm hide-desktop" onClick={() => setShowFilters(!showFilters)}>
                <Icons.Filter /> Filters
              </button>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input" style={{ width: "auto", padding: "8px 16px", fontSize: 13 }}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {showFilters && (
              <div className="hide-desktop fade-in" style={{ padding: 16, background: "var(--gray-50)", borderRadius: 12, marginBottom: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Categories</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: "6px 12px", borderRadius: 20, fontSize: 13, background: activeCategory === cat.id ? "var(--black)" : "var(--white)", color: activeCategory === cat.id ? "var(--white)" : "var(--gray-600)", border: "1px solid var(--gray-200)" }}>{cat.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Price: Up to {formatPrice(priceRange[1])}</h3>
                  <input type="range" min="0" max="10000" step="100" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} style={{ width: "100%" }} />
                </div>
              </div>
            )}

            {sorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <Icons.Search />
                <p style={{ marginTop: 16, fontSize: 16, color: "var(--gray-500)" }}>No products found</p>
                <button onClick={() => { setActiveCategory("all"); setSearchQuery(""); setPriceRange([0, 10000]); }} className="btn btn-outline" style={{ marginTop: 16 }}>Clear Filters</button>
              </div>
            ) : (
              <div className="product-grid">
                {sorted.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT PAGE
// ============================================================
function ProductPage() {
  const { pageParams, products, addToCart, navigate, wishlist, toggleWishlist } = useApp();
  const product = products.find(p => p.slug === pageParams.slug);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "size-guide" | "delivery">("description");

  if (!product) {
    return (
      <div className="section" style={{ textAlign: "center", padding: "80px 20px" }}>
        <Icons.AlertCircle />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Product Not Found</h2>
        <p style={{ color: "var(--gray-500)", marginBottom: 24 }}>The product you are looking for does not exist.</p>
        <button onClick={() => navigate("shop")} className="btn btn-primary">Continue Shopping</button>
      </div>
    );
  }

  const selectedVariant = product.variants.find(v => v.size === selectedSize);
  const isWished = wishlist.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="fade-in">
      <div className="section">
        <button onClick={() => navigate("shop")} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}><Icons.ArrowLeft /> Back to Shop</button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "start" }}>
          {/* Images */}
          <div>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
              <img src={product.images[activeImage]} alt={product.name} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }} />
              {product.salePrice && <span className="badge" style={{ position: "absolute", top: 16, left: 16, background: "var(--error)", color: "white" }}>Sale</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} style={{ width: 72, height: 96, borderRadius: 8, overflow: "hidden", border: activeImage === i ? "2px solid var(--black)" : "2px solid transparent", padding: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: 13, color: "var(--gray-500)", textTransform: "capitalize", marginBottom: 8 }}>{product.category}</p>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 600, marginBottom: 12 }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 24, fontWeight: 600 }}>{formatPrice(product.salePrice || product.price)}</span>
              {product.salePrice && <span style={{ fontSize: 16, color: "var(--gray-400)", textDecoration: "line-through" }}>{formatPrice(product.price)}</span>}
              {product.salePrice && <span className="badge" style={{ background: "var(--error)", color: "white" }}>{Math.round((1 - product.salePrice / product.price) * 100)}% OFF</span>}
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Select Size</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map(size => {
                  const variant = product.variants.find(v => v.size === size);
                  const inStock = variant && variant.stock > 0;
                  return (
                    <button key={size} onClick={() => inStock ? setSelectedSize(size) : null} disabled={!inStock} style={{
                      width: 48, height: 48, borderRadius: 8, fontSize: 14, fontWeight: 500,
                      border: selectedSize === size ? "2px solid var(--black)" : "1.5px solid var(--gray-200)",
                      background: selectedSize === size ? "var(--black)" : "var(--white)",
                      color: selectedSize === size ? "var(--white)" : inStock ? "var(--black)" : "var(--gray-300)",
                      cursor: inStock ? "pointer" : "not-allowed",
                      textDecoration: inStock ? "none" : "line-through",
                    }}>{size}</button>
                  );
                })}
              </div>
              {!selectedSize && <p style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 8 }}>Please select a size</p>}
              {selectedVariant && <p style={{ fontSize: 12, color: selectedVariant.stock < 3 ? "var(--error)" : "var(--gray-500)", marginTop: 8 }}>{selectedVariant.stock < 3 ? `Only ${selectedVariant.stock} left in stock` : `${selectedVariant.stock} in stock`}</p>}
            </div>

            {/* Quantity & Actions */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid var(--gray-200)", borderRadius: 10, padding: "4px 12px" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: 8, color: "var(--gray-500)" }}><Icons.Minus /></button>
                <span style={{ fontSize: 15, fontWeight: 500, minWidth: 32, textAlign: "center" }}>{quantity}</span>
                <button onClick={() => selectedVariant && setQuantity(Math.min(selectedVariant.stock, quantity + 1))} style={{ padding: 8, color: "var(--gray-500)" }}><Icons.Plus /></button>
              </div>
              <button onClick={() => selectedVariant && addToCart(product, selectedVariant.id, quantity)} disabled={!selectedVariant} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 200 }}>
                Add to Cart
              </button>
              <button onClick={() => toggleWishlist(product.id)} style={{ width: 48, height: 48, borderRadius: 10, border: "1.5px solid var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "center", color: isWished ? "var(--error)" : "var(--gray-400)" }}>
                <Icons.Heart />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: 24 }}>
              <div style={{ display: "flex", gap: 24, marginBottom: 16, borderBottom: "1px solid var(--gray-100)" }}>
                {(["description","size-guide","delivery"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 0", fontSize: 14, fontWeight: 500, borderBottom: activeTab === tab ? "2px solid var(--black)" : "2px solid transparent", color: activeTab === tab ? "var(--black)" : "var(--gray-500)", background: "none", marginBottom: -1 }}>
                    {tab === "size-guide" ? "Size Guide" : tab === "delivery" ? "Delivery" : "Description"}
                  </button>
                ))}
              </div>
              {activeTab === "description" && <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.7 }}>{product.description}</p>}
              {activeTab === "size-guide" && (
                <div>
                  <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "1px solid var(--gray-200)" }}><th style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Size</th><th style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Bust (in)</th><th style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Waist (in)</th><th style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Hips (in)</th></tr></thead>
                    <tbody>
                      {Object.entries(SIZE_GUIDE).map(([size, measurements]) => (
                        <tr key={size} style={{ borderBottom: "1px solid var(--gray-100)" }}>
                          <td style={{ padding: "8px 0", fontWeight: 500 }}>{size}</td>
                          <td style={{ padding: "8px 0", color: "var(--gray-600)" }}>{measurements.bust}</td>
                          <td style={{ padding: "8px 0", color: "var(--gray-600)" }}>{measurements.waist}</td>
                          <td style={{ padding: "8px 0", color: "var(--gray-600)" }}>{measurements.hips}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "delivery" && (
                <div style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.7 }}>
                  <p style={{ marginBottom: 12 }}><strong>Standard Delivery:</strong> 2-4 business days within Nairobi. 3-7 business days for upcountry.</p>
                  <p style={{ marginBottom: 12 }}><strong>Express Delivery:</strong> Same-day delivery available within Nairobi for orders placed before 12 PM.</p>
                  <p style={{ marginBottom: 12 }}><strong>Delivery Fee:</strong> KES 300 within Nairobi. KES 500 for upcountry.</p>
                  <p><strong>Returns:</strong> We accept returns within 7 days of delivery. Items must be unworn with tags attached.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>You May Also Like</h2>
            <div className="product-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CART PAGE
// ============================================================
function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, navigate } = useApp();

  if (cart.length === 0) {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icons.Cart />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: "var(--gray-500)", marginBottom: 24 }}>Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate("shop")} className="btn btn-primary btn-lg">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="section fade-in">
      <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, marginBottom: 32 }}>Shopping Cart</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {cart.map(item => (
            <div key={item.variantId} className="card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
              <img src={item.image} alt={item.name} style={{ width: 100, height: 120, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{item.name}</h3>
                <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 12 }}>Size: {item.size}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--gray-200)", borderRadius: 8, padding: "2px 8px" }}>
                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} style={{ padding: 4 }}><Icons.Minus /></button>
                    <span style={{ fontSize: 14, fontWeight: 500, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} style={{ padding: 4 }}><Icons.Plus /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.variantId)} style={{ color: "var(--gray-400)", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><Icons.Trash /> Remove</button>
                </div>
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, whiteSpace: "nowrap" }}>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24, height: "fit-content", position: "sticky", top: 80 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
            <span style={{ color: "var(--gray-500)" }}>Subtotal</span>
            <span style={{ fontWeight: 500 }}>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
            <span style={{ color: "var(--gray-500)" }}>Delivery</span>
            <span style={{ fontWeight: 500 }}>Calculated at checkout</span>
          </div>
          <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: 16, marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 600 }}>{formatPrice(cartTotal)}</span>
          </div>
          <button onClick={() => navigate("checkout")} className="btn btn-primary btn-full btn-lg">Proceed to Checkout</button>
          <button onClick={() => navigate("shop")} className="btn btn-ghost btn-full" style={{ marginTop: 8 }}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage() {
  const { cart, cartTotal, createOrder, navigate, user } = useApp();
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", address: "", city: "Nairobi", mpesaMessage: "" });
  const [orderId, setOrderId] = useState("");

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Your cart is empty</h2>
        <button onClick={() => navigate("shop")} className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Start Shopping</button>
      </div>
    );
  }

  const deliveryFee = form.city.toLowerCase() === "nairobi" ? 300 : 500;
  const total = cartTotal + deliveryFee;

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const order = createOrder({
      customerName: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      items: cart.map(item => ({ productId: item.productId, variantId: item.variantId, name: item.name, size: item.size, price: item.price, quantity: item.quantity })),
      subtotal: cartTotal,
      deliveryFee,
      total,
      paymentMethod: "M-Pesa",
      mpesaMessage: form.mpesaMessage,
    });
    setOrderId(order.id);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "80px 20px", maxWidth: 600 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span style={{ color: "white" }}><Icons.Check /></span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ color: "var(--gray-500)", marginBottom: 8 }}>Thank you for your order, {form.name}.</p>
        <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 24 }}>Order ID: <strong>{orderId}</strong></p>
        <div style={{ background: "var(--gray-50)", borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "left" }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}><strong>M-Pesa Payment Instructions:</strong></p>
          <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.6 }}>
            1. Go to M-Pesa on your phone<br/>
            2. Select Lipa na M-Pesa &gt; Buy Goods<br/>
            3. Enter Till Number: <strong>123456</strong><br/>
            4. Enter Amount: <strong>{formatPrice(total)}</strong><br/>
            5. Enter your M-Pesa PIN and confirm
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("order-detail", { orderId })} className="btn btn-primary">Track Order</button>
          <button onClick={() => navigate("shop")} className="btn btn-outline">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section fade-in">
      <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, marginBottom: 32 }}>Checkout</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 40 }}>
        <div>
          {step === "info" ? (
            <form onSubmit={handleSubmitInfo} className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Delivery Information</h3>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="Jane Doe" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Phone</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+254 712 345 678" />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Delivery Address</label>
                  <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input" rows={3} placeholder="123 Kimathi Street, Nairobi" style={{ resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>City</label>
                  <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input">
                    <option>Nairobi</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Nakuru</option>
                    <option>Eldoret</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 24 }}>Continue to Payment</button>
            </form>
          ) : (
            <form onSubmit={handleSubmitPayment} className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>M-Pesa Payment</h3>
              <div style={{ background: "var(--gold-light)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Payment Instructions</p>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--gray-700)" }}>
                  <p>1. Go to M-Pesa on your phone</p>
                  <p>2. Select <strong>Lipa na M-Pesa &gt; Buy Goods</strong></p>
                  <p>3. Enter Till Number: <strong style={{ color: "var(--black)" }}>123456</strong></p>
                  <p>4. Enter Amount: <strong style={{ color: "var(--black)" }}>{formatPrice(total)}</strong></p>
                  <p>5. Enter your M-Pesa PIN and confirm</p>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Paste M-Pesa Confirmation Message (Optional)</label>
                <textarea value={form.mpesaMessage} onChange={e => setForm({ ...form, mpesaMessage: e.target.value })} className="input" rows={4} placeholder="Paste your M-Pesa confirmation message here..." style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setStep("info")} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }}>Place Order</button>
              </div>
            </form>
          )}
        </div>
        <div className="card" style={{ padding: 24, height: "fit-content", position: "sticky", top: 80 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Order Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {cart.map(item => (
              <div key={item.variantId} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={item.image} alt={item.name} style={{ width: 60, height: 72, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: "var(--gray-500)" }}>Size {item.size} x {item.quantity}</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: "var(--gray-500)" }}>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: "var(--gray-500)" }}>Delivery</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--gray-100)" }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AUTH PAGES
// ============================================================
function LoginPage() {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="section fade-in" style={{ maxWidth: 420, paddingTop: 80 }}>
      <div className="card" style={{ padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 18, fontWeight: 700 }}>TA</div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 4 }}>Sign in to your Tatu Ankara account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg">Sign In</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>Don't have an account? <button onClick={() => navigate("register")} style={{ color: "var(--gold)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Sign Up</button></p>
        </div>
        <div style={{ marginTop: 24, padding: 16, background: "var(--gray-50)", borderRadius: 8, fontSize: 12, color: "var(--gray-500)" }}>
          <p style={{ fontWeight: 600, marginBottom: 4, color: "var(--gray-600)" }}>Demo Credentials:</p>
          <p>Admin: admin@tatuankara.com / admin123</p>
          <p>Customer: Any email / Any password</p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const { register, navigate } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, phone, password);
  };

  return (
    <div className="section fade-in" style={{ maxWidth: 420, paddingTop: 80 }}>
      <div className="card" style={{ padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 18, fontWeight: 700 }}>TA</div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 4 }}>Join the Tatu Ankara family</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Full Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Jane Doe" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Phone</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="+254 712 345 678" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Create a password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg">Create Account</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>Already have an account? <button onClick={() => navigate("login")} style={{ color: "var(--gold)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Sign In</button></p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROFILE PAGE
// ============================================================
function ProfilePage() {
  const { user, logout, navigate } = useApp();

  if (!user) {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <Icons.User />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Please Sign In</h2>
        <p style={{ color: "var(--gray-500)", marginBottom: 24 }}>You need to be logged in to view your profile.</p>
        <button onClick={() => navigate("login")} className="btn btn-primary">Sign In</button>
      </div>
    );
  }

  return (
    <div className="section fade-in">
      <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, marginBottom: 32 }}>My Account</h1>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32 }}>
        <div className="card" style={{ padding: 24, height: "fit-content" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24, fontWeight: 700, color: "var(--black)" }}>{user.name.charAt(0).toUpperCase()}</div>
            <p style={{ fontWeight: 600 }}>{user.name}</p>
            <p style={{ fontSize: 13, color: "var(--gray-500)" }}>{user.email}</p>
            <span className="badge" style={{ marginTop: 8, background: user.role === "admin" ? "var(--gold-light)" : "var(--gray-100)", color: user.role === "admin" ? "var(--black)" : "var(--gray-600)" }}>{user.role === "admin" ? "Administrator" : "Customer"}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => navigate("orders")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "10px 12px" }}><Icons.Orders /> My Orders</button>
            {user.role === "admin" && (
              <button onClick={() => navigate("admin")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "10px 12px", color: "var(--gold)" }}><Icons.Dashboard /> Admin Dashboard</button>
            )}
            <button onClick={logout} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "10px 12px", color: "var(--error)" }}><Icons.Logout /> Logout</button>
          </div>
        </div>
        <div>
          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Account Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Full Name</label>
                <input type="text" value={user.name} readOnly className="input" style={{ background: "var(--gray-50)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Email</label>
                <input type="email" value={user.email} readOnly className="input" style={{ background: "var(--gray-50)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Phone</label>
                <input type="tel" value={user.phone} readOnly className="input" style={{ background: "var(--gray-50)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage() {
  const { orders, user, navigate } = useApp();
  const myOrders = user ? orders.filter(o => o.email === user.email) : [];

  if (!user) {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <Icons.Orders />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Please Sign In</h2>
        <p style={{ color: "var(--gray-500)", marginBottom: 24 }}>You need to be logged in to view your orders.</p>
        <button onClick={() => navigate("login")} className="btn btn-primary">Sign In</button>
      </div>
    );
  }

  return (
    <div className="section fade-in">
      <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, marginBottom: 32 }}>My Orders</h1>
      {myOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <Icons.Orders />
          <p style={{ marginTop: 16, fontSize: 16, color: "var(--gray-500)" }}>No orders yet</p>
          <button onClick={() => navigate("shop")} className="btn btn-primary" style={{ marginTop: 16 }}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {myOrders.map(order => (
            <div key={order.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{order.id}</p>
                  <p style={{ fontSize: 13, color: "var(--gray-500)" }}>{formatDate(order.createdAt)}</p>
                </div>
                <span className="status-badge" style={{ background: STATUS_CONFIG[order.status].bg, color: STATUS_CONFIG[order.status].color }}>
                  {STATUS_CONFIG[order.status].label}
                </span>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--gray-50)", borderRadius: 8 }}>
                    <span style={{ fontSize: 13 }}>{item.name} (Size {item.size}) x {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 600 }}>{formatPrice(order.total)}</p>
                <button onClick={() => navigate("order-detail", { orderId: order.id })} className="btn btn-outline btn-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ORDER DETAIL PAGE
// ============================================================
function OrderDetailPage() {
  const { pageParams, orders, navigate } = useApp();
  const order = orders.find(o => o.id === pageParams.orderId);

  if (!order) {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "80px 20px" }}>
        <Icons.AlertCircle />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Order Not Found</h2>
        <button onClick={() => navigate("orders")} className="btn btn-primary" style={{ marginTop: 16 }}>Back to Orders</button>
      </div>
    );
  }

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="section fade-in">
      <button onClick={() => navigate("orders")} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}><Icons.ArrowLeft /> Back to Orders</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        <div>
          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Order {order.id}</h1>
                <p style={{ fontSize: 14, color: "var(--gray-500)" }}>Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className="status-badge" style={{ background: STATUS_CONFIG[order.status].bg, color: STATUS_CONFIG[order.status].color, fontSize: 13, padding: "6px 14px" }}>
                {STATUS_CONFIG[order.status].label}
              </span>
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Order Status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {STATUS_FLOW.map((status, i) => {
                  const isCompleted = i <= currentStatusIndex;
                  const isCurrent = i === currentStatusIndex;
                  const historyEntry = order.statusHistory.find(h => h.status === status);
                  return (
                    <div key={status} style={{ display: "flex", gap: 16, position: "relative" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: isCompleted ? "var(--success)" : "var(--gray-200)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: isCurrent ? "3px solid var(--gold)" : "none",
                        }}>
                          {isCompleted && <span style={{ color: "white", fontSize: 12 }}><Icons.Check /></span>}
                        </div>
                        {i < STATUS_FLOW.length - 1 && (
                          <div style={{ width: 2, height: 40, background: isCompleted ? "var(--success)" : "var(--gray-200)" }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 24 }}>
                        <p style={{ fontSize: 14, fontWeight: isCurrent ? 600 : 500, color: isCompleted ? "var(--black)" : "var(--gray-400)" }}>
                          {STATUS_CONFIG[status]?.label || status}
                        </p>
                        {historyEntry && (
                          <p style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>
                            {formatDate(historyEntry.timestamp)} by {historyEntry.by}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Order Items</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--gray-100)" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</p>
                    <p style={{ fontSize: 13, color: "var(--gray-500)" }}>Size: {item.size} x {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: "var(--gray-500)" }}>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: "var(--gray-500)" }}>Delivery</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--gray-100)" }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{formatPrice(order.total)}</span>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Delivery Details</h3>
            <p style={{ fontSize: 14, marginBottom: 8 }}><strong>{order.customerName}</strong></p>
            <p style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: 4 }}>{order.address}</p>
            <p style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: 8 }}>{order.city}</p>
            <p style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: 4 }}><Icons.Phone /> {order.phone}</p>
            <p style={{ fontSize: 14, color: "var(--gray-600)" }}><Icons.Mail /> {order.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminDashboard() {
  const { orders, products, user, navigate } = useApp();

  if (!user || user.role !== "admin") {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <Icons.AlertCircle />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Access Denied</h2>
        <p style={{ color: "var(--gray-500)", marginBottom: 24 }}>You need admin privileges to access this page.</p>
        <button onClick={() => navigate("home")} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingPayments = orders.filter(o => o.status === "payment_submitted").length;
  const pendingDispatch = orders.filter(o => o.status === "payment_confirmed").length;
  const lowStock = products.filter(p => p.variants.some(v => v.stock < 3)).length;

  const stats = [
    { label: "Today's Orders", value: todayOrders.length.toString(), icon: <Icons.Orders />, color: "var(--info)" },
    { label: "Today's Sales", value: formatPrice(todaySales), icon: <Icons.DollarSign />, color: "var(--success)" },
    { label: "Pending Payments", value: pendingPayments.toString(), icon: <Icons.Clock />, color: "var(--warning)" },
    { label: "Pending Dispatch", value: pendingDispatch.toString(), icon: <Icons.Truck />, color: "var(--gold)" },
    { label: "Low Stock Items", value: lowStock.toString(), icon: <Icons.AlertCircle />, color: "var(--error)" },
    { label: "Total Products", value: products.length.toString(), icon: <Icons.Box />, color: "var(--gray-600)" },
  ];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        {/* Sidebar */}
        <div className="hide-mobile" style={{ width: 260, background: "var(--black)", color: "var(--white)", padding: 24, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--black)" }}>TA</div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Admin Panel</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => navigate("admin")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--white)", padding: "10px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}><Icons.Dashboard /> Dashboard</button>
            <button onClick={() => navigate("admin-products")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Products /> Products</button>
            <button onClick={() => navigate("admin-orders")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Orders /> Orders</button>
            <button onClick={() => navigate("admin-customers")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Users /> Customers</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 32, background: "var(--gray-50)", overflow: "auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Dashboard</h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
            {stats.map((stat, i) => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  <span style={{ fontSize: 13, color: "var(--gray-500)" }}>{stat.label}</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 600 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Recent Orders</h3>
              <button onClick={() => navigate("admin-orders")} className="btn btn-ghost btn-sm">View All</button>
            </div>
            {orders.slice(0, 5).length === 0 ? (
              <p style={{ color: "var(--gray-500)", textAlign: "center", padding: 40 }}>No orders yet</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--gray-200)" }}>
                      <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Order ID</th>
                      <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Customer</th>
                      <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Total</th>
                      <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Status</th>
                      <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} style={{ borderBottom: "1px solid var(--gray-100)", cursor: "pointer" }} onClick={() => navigate("order-detail", { orderId: order.id })}>
                        <td style={{ padding: "12px 8px", fontWeight: 500 }}>{order.id}</td>
                        <td style={{ padding: "12px 8px" }}>{order.customerName}</td>
                        <td style={{ padding: "12px 8px", fontWeight: 500 }}>{formatPrice(order.total)}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span className="status-badge" style={{ background: STATUS_CONFIG[order.status].bg, color: STATUS_CONFIG[order.status].color }}>
                            {STATUS_CONFIG[order.status].label}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", color: "var(--gray-500)", fontSize: 13 }}>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PRODUCTS
// ============================================================
function AdminProducts() {
  const { products, deleteProduct, navigate, user } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!user || user.role !== "admin") {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <Icons.AlertCircle />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Access Denied</h2>
        <button onClick={() => navigate("home")} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <div className="hide-mobile" style={{ width: 260, background: "var(--black)", color: "var(--white)", padding: 24, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--black)" }}>TA</div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Admin Panel</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => navigate("admin")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Dashboard /> Dashboard</button>
            <button onClick={() => navigate("admin-products")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--white)", padding: "10px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}><Icons.Products /> Products</button>
            <button onClick={() => navigate("admin-orders")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Orders /> Orders</button>
            <button onClick={() => navigate("admin-customers")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Users /> Customers</button>
          </div>
        </div>

        <div style={{ flex: 1, padding: 32, background: "var(--gray-50)", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600 }}>Products</h1>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary"><Icons.Plus /> Add Product</button>
          </div>

          <div className="card" style={{ padding: 24, overflow: "auto" }}>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--gray-200)" }}>
                  <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Product</th>
                  <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Category</th>
                  <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Price</th>
                  <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Stock</th>
                  <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                  return (
                    <tr key={product.id} style={{ borderBottom: "1px solid var(--gray-100)" }}>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={product.images[0]} alt="" style={{ width: 48, height: 60, objectFit: "cover", borderRadius: 6 }} />
                          <span style={{ fontWeight: 500 }}>{product.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px", textTransform: "capitalize", color: "var(--gray-600)" }}>{product.category}</td>
                      <td style={{ padding: "12px 8px", fontWeight: 500 }}>{formatPrice(product.salePrice || product.price)}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{ color: totalStock < 3 ? "var(--error)" : "var(--gray-600)" }}>{totalStock} units</span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {product.featured && <span className="badge" style={{ background: "var(--gold-light)", color: "var(--black)", fontSize: 10 }}>Featured</span>}
                          {product.newArrival && <span className="badge" style={{ background: "var(--info)", color: "white", fontSize: 10 }}>New</span>}
                          {product.bestSeller && <span className="badge" style={{ background: "var(--success)", color: "white", fontSize: 10 }}>Best</span>}
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <button onClick={() => setEditingProduct(product)} style={{ padding: 6, color: "var(--gray-500)", marginRight: 8 }}><Icons.Edit /></button>
                        <button onClick={() => { if (confirm("Delete this product?")) deleteProduct(product.id); }} style={{ padding: 6, color: "var(--error)" }}><Icons.Trash /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && <ProductModal onClose={() => setShowAddModal(false)} />}
      {editingProduct && <ProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />}
    </div>
  );
}

function ProductModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const { addProduct, updateProduct } = useApp();
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    salePrice: product?.salePrice || undefined,
    category: product?.category || "dresses",
    images: product?.images || [""],
    sizes: product?.sizes || ["S", "M", "L"],
    featured: product?.featured || false,
    newArrival: product?.newArrival || false,
    bestSeller: product?.bestSeller || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const variants = form.sizes.map((size, i) => ({
      id: product ? product.variants.find(v => v.size === size)?.id || `v${Date.now()}${i}` : `v${Date.now()}${i}`,
      size,
      stock: product ? product.variants.find(v => v.size === size)?.stock || 5 : 5,
      price: form.price,
    }));
    if (product) {
      updateProduct(product.id, { ...form, variants });
    } else {
      addProduct({ ...form, variants, images: form.images.filter(Boolean) } as any);
    }
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: 16 }}>
      <div className="fade-in card" style={{ width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto", padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose}><Icons.Close /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Product Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Description</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" rows={3} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Price (KES)</label>
              <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="input" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Sale Price (Optional)</label>
              <input type="number" value={form.salePrice || ""} onChange={e => setForm({ ...form, salePrice: e.target.value ? parseInt(e.target.value) : undefined })} className="input" />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">
              {CATEGORIES.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Image URL</label>
            <input type="url" value={form.images[0]} onChange={e => setForm({ ...form, images: [e.target.value] })} className="input" placeholder="https://..." />
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <input type="checkbox" checked={form.newArrival} onChange={e => setForm({ ...form, newArrival: e.target.checked })} />
              New Arrival
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <input type="checkbox" checked={form.bestSeller} onChange={e => setForm({ ...form, bestSeller: e.target.checked })} />
              Best Seller
            </label>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{product ? "Update Product" : "Add Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN ORDERS
// ============================================================
function AdminOrders() {
  const { orders, updateOrderStatus, navigate, user } = useApp();
  const [filter, setFilter] = useState("all");

  if (!user || user.role !== "admin") {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <Icons.AlertCircle />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Access Denied</h2>
        <button onClick={() => navigate("home")} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const nextStatus: Record<string, Order["status"]> = {
    pending: "payment_submitted",
    payment_submitted: "payment_confirmed",
    payment_confirmed: "preparing",
    preparing: "dispatched",
    dispatched: "delivered",
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <div className="hide-mobile" style={{ width: 260, background: "var(--black)", color: "var(--white)", padding: 24, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--black)" }}>TA</div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Admin Panel</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => navigate("admin")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Dashboard /> Dashboard</button>
            <button onClick={() => navigate("admin-products")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Products /> Products</button>
            <button onClick={() => navigate("admin-orders")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--white)", padding: "10px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}><Icons.Orders /> Orders</button>
            <button onClick={() => navigate("admin-customers")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Users /> Customers</button>
          </div>
        </div>

        <div style={{ flex: 1, padding: 32, background: "var(--gray-50)", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600 }}>Orders</h1>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="input" style={{ width: "auto", padding: "8px 16px" }}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="payment_submitted">Payment Submitted</option>
              <option value="payment_confirmed">Payment Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="card" style={{ padding: 24, overflow: "auto" }}>
            {filtered.length === 0 ? (
              <p style={{ color: "var(--gray-500)", textAlign: "center", padding: 40 }}>No orders found</p>
            ) : (
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse", minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--gray-200)" }}>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Order ID</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Customer</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Items</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Total</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id} style={{ borderBottom: "1px solid var(--gray-100)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500 }}>{order.id}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <p style={{ fontWeight: 500 }}>{order.customerName}</p>
                        <p style={{ fontSize: 12, color: "var(--gray-500)" }}>{order.phone}</p>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        {order.items.map((item, i) => (
                          <p key={i} style={{ fontSize: 13 }}>{item.name} (Size {item.size}) x {item.quantity}</p>
                        ))}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 500 }}>{formatPrice(order.total)}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <span className="status-badge" style={{ background: STATUS_CONFIG[order.status].bg, color: STATUS_CONFIG[order.status].color }}>
                          {STATUS_CONFIG[order.status].label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>
                          <button onClick={() => navigate("order-detail", { orderId: order.id })} style={{ padding: 6, color: "var(--gray-500)" }}><Icons.Eye /></button>
                          {nextStatus[order.status] && (
                            <button onClick={() => updateOrderStatus(order.id, nextStatus[order.status])} className="btn btn-primary btn-sm" style={{ fontSize: 12 }}>
                              {nextStatus[order.status] === "payment_confirmed" ? "Confirm Payment" : nextStatus[order.status] === "preparing" ? "Start Prep" : nextStatus[order.status] === "dispatched" ? "Dispatch" : "Complete"}
                            </button>
                          )}
                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <button onClick={() => updateOrderStatus(order.id, "cancelled")} className="btn btn-outline btn-sm" style={{ fontSize: 12, color: "var(--error)", borderColor: "var(--error)" }}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN CUSTOMERS
// ============================================================
function AdminCustomers() {
  const { orders, navigate, user } = useApp();

  if (!user || user.role !== "admin") {
    return (
      <div className="section fade-in" style={{ textAlign: "center", padding: "100px 20px" }}>
        <Icons.AlertCircle />
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "16px 0 8px" }}>Access Denied</h2>
        <button onClick={() => navigate("home")} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; orders: number; total: number }>();
    orders.forEach(order => {
      const existing = map.get(order.email);
      if (existing) {
        existing.orders += 1;
        existing.total += order.total;
      } else {
        map.set(order.email, { name: order.customerName, email: order.email, phone: order.phone, orders: 1, total: order.total });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <div className="hide-mobile" style={{ width: 260, background: "var(--black)", color: "var(--white)", padding: 24, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--black)" }}>TA</div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Admin Panel</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => navigate("admin")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Dashboard /> Dashboard</button>
            <button onClick={() => navigate("admin-products")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Products /> Products</button>
            <button onClick={() => navigate("admin-orders")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--gray-400)", padding: "10px 12px" }}><Icons.Orders /> Orders</button>
            <button onClick={() => navigate("admin-customers")} className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--white)", padding: "10px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}><Icons.Users /> Customers</button>
          </div>
        </div>

        <div style={{ flex: 1, padding: 32, background: "var(--gray-50)", overflow: "auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Customers</h1>
          <div className="card" style={{ padding: 24, overflow: "auto" }}>
            {customers.length === 0 ? (
              <p style={{ color: "var(--gray-500)", textAlign: "center", padding: 40 }}>No customers yet</p>
            ) : (
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--gray-200)" }}>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Name</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Email</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Phone</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Orders</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontWeight: 600, color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase" }}>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--gray-100)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 500 }}>{customer.name}</td>
                      <td style={{ padding: "12px 8px" }}>{customer.email}</td>
                      <td style={{ padding: "12px 8px" }}>{customer.phone}</td>
                      <td style={{ padding: "12px 8px" }}>{customer.orders}</td>
                      <td style={{ padding: "12px 8px", fontWeight: 500 }}>{formatPrice(customer.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage() {
  const { navigate } = useApp();
  return (
    <div className="fade-in">
      <div className="section" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, marginBottom: 16, textAlign: "center" }}>About Tatu Ankara</h1>
        <p style={{ textAlign: "center", color: "var(--gray-500)", marginBottom: 48, fontSize: 16 }}>Celebrating African heritage through contemporary fashion</p>

        <div style={{ marginBottom: 48 }}>
          <img src="https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=1200&h=600&fit=crop" alt="About Tatu Ankara" style={{ width: "100%", borderRadius: 12, marginBottom: 32 }} />
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Our Story</h2>
          <p style={{ fontSize: 15, color: "var(--gray-600)", lineHeight: 1.8, marginBottom: 16 }}>
            Tatu Ankara was born from a passion for African textiles and a vision to bring authentic Ankara fashion to the modern woman. 
            Founded in Nairobi, Kenya, we specialize in creating elegant, stylish, and custom-made pieces that celebrate African heritage 
            while offering comfort and confidence for every occasion.
          </p>
          <p style={{ fontSize: 15, color: "var(--gray-600)", lineHeight: 1.8, marginBottom: 16 }}>
            Each garment is crafted with meticulous attention to detail, using premium Ankara fabrics sourced from the finest suppliers. 
            Our designs blend traditional African patterns with contemporary silhouettes, creating pieces that are both timeless and on-trend.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 48 }}>
          {[
            { title: "Authentic Fabrics", desc: "We use only premium, genuine Ankara wax print fabrics sourced from trusted suppliers." },
            { title: "Expert Tailoring", desc: "Every piece is crafted by skilled Kenyan tailors with years of experience." },
            { title: "Custom Fitting", desc: "We offer made-to-measure services to ensure the perfect fit for every body." },
            { title: "Sustainable", desc: "We are committed to ethical production and minimizing our environmental footprint." },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--gray-500)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--gray-50)", borderRadius: 12 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Ready to Shop?</h2>
          <p style={{ color: "var(--gray-500)", marginBottom: 24 }}>Discover our latest collection of Ankara fashion.</p>
          <button onClick={() => navigate("shop")} className="btn btn-primary btn-lg">Shop Collection</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="fade-in">
      <div className="section" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, marginBottom: 16, textAlign: "center" }}>Contact Us</h1>
        <p style={{ textAlign: "center", color: "var(--gray-500)", marginBottom: 48 }}>We would love to hear from you</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          <div>
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Get in Touch</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}><Icons.MapPin /></div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Visit Us</p>
                    <p style={{ fontSize: 13, color: "var(--gray-500)" }}>Nairobi, Kenya</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}><Icons.Phone /></div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Call Us</p>
                    <p style={{ fontSize: 13, color: "var(--gray-500)" }}>+254 712 345 678</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}><Icons.Mail /></div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Email Us</p>
                    <p style={{ fontSize: 13, color: "var(--gray-500)" }}>hello@tatuankara.com</p>
                  </div>
                </div>
              </div>
            </div>
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-full" style={{ display: "inline-flex", marginBottom: 24 }}>
              <Icons.WhatsApp /> Chat on WhatsApp
            </a>
          </div>

          <div className="card" style={{ padding: 32 }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <span style={{ color: "white" }}><Icons.Check /></span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: "var(--gray-500)", fontSize: 14 }}>We will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" placeholder="your@email.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--gray-600)" }}>Message</label>
                  <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input" rows={4} placeholder="How can we help you?" style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="btn btn-primary btn-full">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
