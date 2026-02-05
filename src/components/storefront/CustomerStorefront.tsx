"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  ShoppingCart,
  Star,
  Heart,
  Package,
  Truck,
  Shield,
  Award,
  Headphones,
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products as mockProducts, formatCurrency, type Product, type CartItem } from "@/lib/mock-data";
import { ProductDetailModal } from "./ProductDetailModal";
import { CartSidebar } from "./CartSidebar";
import { CheckoutModal } from "./CheckoutModal";

const categories = ["All", "Pet Food", "Vitamins", "Accessories", "Live Pets"];

// ============================================
// ANIMAL SVG COMPONENTS
// ============================================

// Paw Print SVG
function PawPrint({ className = "", size = 24, style }: { className?: string; size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <ellipse cx="12" cy="17" rx="4" ry="3.5" />
      <ellipse cx="6" cy="10" rx="2.5" ry="3" />
      <ellipse cx="18" cy="10" rx="2.5" ry="3" />
      <ellipse cx="9" cy="6" rx="2" ry="2.5" />
      <ellipse cx="15" cy="6" rx="2" ry="2.5" />
    </svg>
  );
}

// Dog Silhouette SVG
function DogSilhouette({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <path d="M52 28c-2-8-8-12-14-12s-8 2-10 4c-2-2-4-4-10-4s-12 4-14 12c-2 6 0 12 4 16v8c0 2 2 4 4 4h4c2 0 4-2 4-4v-4h16v4c0 2 2 4 4 4h4c2 0 4-2 4-4v-8c4-4 6-10 4-16zM20 32a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm24 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    </svg>
  );
}

// Cat Silhouette SVG
function CatSilhouette({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <path d="M48 16l-4-12-8 8c-2-1-5-2-8-2s-6 1-8 2l-8-8-4 12c-4 4-6 10-6 16 0 12 10 20 22 20h8c12 0 22-8 22-20 0-6-2-12-6-16zM22 36a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm20 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm-6 8c-2 2-4 2-4 2s-2 0-4-2c-1-1 0-2 1-2h6c1 0 2 1 1 2z" />
    </svg>
  );
}

// Bird Silhouette SVG
function BirdSilhouette({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <path d="M56 24c-4-4-10-6-16-4l-8-12-4 8-12-4 8 12c-4 4-6 10-4 16 4 10 16 16 28 12s16-18 12-28l-4 0zm-20 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    </svg>
  );
}

// Fish Silhouette SVG
function FishSilhouette({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <path d="M52 32c0-12-12-20-24-20-4 0-8 1-12 3l-8-7v14c-4 3-6 6-6 10s2 7 6 10v14l8-7c4 2 8 3 12 3 12 0 24-8 24-20zm-32 0a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" />
    </svg>
  );
}

// Bone SVG
function BoneShape({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 80 32"
      fill="currentColor"
      className={className}
    >
      <ellipse cx="12" cy="8" rx="10" ry="8" />
      <ellipse cx="12" cy="24" rx="10" ry="8" />
      <ellipse cx="68" cy="8" rx="10" ry="8" />
      <ellipse cx="68" cy="24" rx="10" ry="8" />
      <rect x="12" y="8" width="56" height="16" />
    </svg>
  );
}

// Heart with Paw
function HeartPaw({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <path d="M32 56l-3-3C14 40 6 33 6 24c0-7 5-12 12-12 4 0 8 2 10 5h8c2-3 6-5 10-5 7 0 12 5 12 12 0 9-8 16-23 29l-3 3z" />
      <g fill="white" opacity="0.9">
        <ellipse cx="32" cy="36" rx="5" ry="4" />
        <ellipse cx="26" cy="28" rx="2.5" ry="3" />
        <ellipse cx="38" cy="28" rx="2.5" ry="3" />
        <ellipse cx="29" cy="23" rx="2" ry="2.5" />
        <ellipse cx="35" cy="23" rx="2" ry="2.5" />
      </g>
    </svg>
  );
}

// Floating Paw Prints Component
function FloatingPaws() {
  const paws = [
    { x: "5%", y: "20%", delay: 0, rotation: -15, size: 20 },
    { x: "15%", y: "60%", delay: 0.5, rotation: 25, size: 16 },
    { x: "85%", y: "30%", delay: 1, rotation: -30, size: 24 },
    { x: "90%", y: "70%", delay: 1.5, rotation: 15, size: 18 },
    { x: "75%", y: "15%", delay: 2, rotation: -20, size: 14 },
    { x: "25%", y: "80%", delay: 2.5, rotation: 35, size: 22 },
  ];

  return (
    <>
      {paws.map((paw, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: paw.x, top: paw.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [0, -15, 0],
            rotate: [paw.rotation, paw.rotation + 10, paw.rotation]
          }}
          transition={{
            duration: 4,
            delay: paw.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <PawPrint size={paw.size} className="text-white/20" />
        </motion.div>
      ))}
    </>
  );
}

// Floating Animals Component for Hero
function FloatingAnimals() {
  return (
    <>
      {/* Dog */}
      <motion.div
        className="absolute left-[8%] top-[35%] pointer-events-none"
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <DogSilhouette size={60} className="text-white/10" />
      </motion.div>

      {/* Cat */}
      <motion.div
        className="absolute right-[10%] top-[20%] pointer-events-none"
        animate={{
          y: [0, 15, 0],
          rotate: [5, -5, 5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <CatSilhouette size={50} className="text-white/10" />
      </motion.div>

      {/* Bird */}
      <motion.div
        className="absolute left-[20%] bottom-[25%] pointer-events-none"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <BirdSilhouette size={35} className="text-white/15" />
      </motion.div>

      {/* Fish */}
      <motion.div
        className="absolute right-[15%] bottom-[30%] pointer-events-none"
        animate={{
          x: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <FishSilhouette size={40} className="text-white/10" />
      </motion.div>
    </>
  );
}

// Decorative Bones
function DecorativeBones() {
  return (
    <>
      <motion.div
        className="absolute left-[5%] top-[15%] pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <BoneShape size={40} className="text-white/5" />
      </motion.div>
      <motion.div
        className="absolute right-[8%] bottom-[20%] pointer-events-none"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <BoneShape size={50} className="text-white/5" />
      </motion.div>
    </>
  );
}

// Animated Paw Trail
function PawTrail() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
      <motion.div
        className="flex gap-12 absolute bottom-4"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(10)].map((_, i) => (
          <PawPrint
            key={i}
            size={16}
            className="text-emerald-500/20"
            style={{ transform: `rotate(${i % 2 === 0 ? -20 : 20}deg)` } as React.CSSProperties}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

// Animated section component
function AnimatedSection({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// STOREFRONT COMPONENT
// ============================================

interface CustomerStorefrontProps {
  initialProducts?: Product[];
}

export function CustomerStorefront({ initialProducts = mockProducts }: CustomerStorefrontProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const trustBadges = [
    { icon: Truck, title: "Fast Delivery", subtitle: "2-5 business days", color: "emerald" },
    { icon: Shield, title: "Secure Payment", subtitle: "Paystack protected", color: "sky" },
    { icon: Award, title: "Quality Products", subtitle: "100% authentic", color: "amber" },
    { icon: Headphones, title: "24/7 Support", subtitle: "Always here to help", color: "violet" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Header with glassmorphism and paw icon */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-lg shadow-sm"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo-blue.png"
                alt="Baycarl Pet Shop"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </motion.div>
            <nav className="hidden gap-1 md:flex">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  type="button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-full ${selectedCategory === category
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                    }`}
                >
                  {category}
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 rounded-full bg-emerald-100 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className="relative hidden w-64 sm:block"
              whileFocus={{ scale: 1.02 }}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border-slate-200 bg-slate-50/50 pl-9 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all rounded-full"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-rose-50">
                <Heart className="h-5 w-5 text-slate-600 hover:text-rose-500 transition-colors" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-emerald-50"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signin">
                <Button className="hidden bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/25 sm:inline-flex rounded-full">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Animal Decorations */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#006B3F] via-[#005C35] to-[#003D23]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl"
          />

          {/* Floating Paw Prints */}
          <FloatingPaws />

          {/* Floating Animal Silhouettes */}
          <FloatingAnimals />

          {/* Decorative Bones */}
          <DecorativeBones />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:py-8 sm:px-6 lg:py-12 lg:px-8">
          {/* Mobile: text left + image right side-by-side. Desktop: original two-column layout */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 lg:grid-cols-2 lg:gap-8">
            <motion.div
              className="text-left lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1
                variants={fadeInUp}
                className="text-balance text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-lg"
              >
                Premium Pet{" "}
                <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                  Nutrition
                </span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="mt-1.5 max-w-xl text-sm leading-relaxed text-emerald-100/90 sm:text-lg sm:mt-3"
              >
                Give your furry friends the best. Quality pet food, vitamins, and accessories delivered to your doorstep across Nigeria.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="mt-3 flex flex-col gap-1.5 sm:mt-5 sm:flex-row sm:justify-center sm:gap-2 lg:justify-start"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className="w-full h-8 text-xs sm:h-10 sm:text-sm sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-black/20 rounded-full px-3 sm:px-4 font-semibold group">
                    <PawPrint size={14} className="mr-1.5 sm:mr-2 group-hover:animate-bounce" />
                    Shop Now
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs sm:h-10 sm:text-sm sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4"
                  >
                    <Zap className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    View Deals
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Image - right side on mobile, original position on desktop */}
            <motion.div
              className="lg:order-last"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="relative mx-auto h-[140px] w-[140px] sm:h-[220px] sm:w-[220px] lg:h-[300px] lg:w-[300px] rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-2 sm:p-3 backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Decorative paws around image */}
                <motion.div
                  className="absolute -left-3 -top-3"
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <PawPrint size={24} className="text-amber-400/60" />
                </motion.div>
                <motion.div
                  className="absolute -right-3 -bottom-3"
                  animate={{ rotate: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <PawPrint size={24} className="text-amber-400/60" />
                </motion.div>

                <div className="relative h-full w-full rounded-2xl overflow-hidden">
                  <Image
                    src="/hero-pet.jpg"
                    alt="Happy pets - Premium pet nutrition"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Floating badges - Hidden on mobile */}
                <motion.div
                  className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-xl px-3 py-2 hidden xl:block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Delivery</div>
                      <div className="text-sm font-semibold text-slate-900">Free & Fast</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-xl px-3 py-2 hidden xl:block"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <HeartPaw size={24} className="text-rose-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Love</div>
                      <div className="text-sm font-semibold text-slate-900">For All Pets</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Paw Trail at bottom */}
        <PawTrail />
      </section>

      {/* Shop by Category Section - compact to fit in landing view */}
      <section className="mx-auto max-w-7xl px-4 py-3 sm:py-8 sm:px-6 lg:py-12 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-2 sm:mb-8">
            <h2 className="text-base font-bold text-slate-900 sm:text-3xl flex items-center justify-center gap-2 sm:gap-3">
              <PawPrint size={18} className="text-emerald-500 sm:hidden" />
              <PawPrint size={28} className="text-emerald-500 hidden sm:block" />
              Shop by Category
            </h2>
            <p className="mt-0.5 text-[10px] text-slate-600 sm:text-base sm:mt-2">Find the perfect products for your furry, feathered, or scaly friends</p>
          </div>
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4 lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            { name: "Pet Food", image: "/categories/pet-food.jpg", color: "from-emerald-500 to-emerald-600", icon: "🍖" },
            { name: "Vitamins", image: "/categories/vitamins.jpg", color: "from-sky-500 to-sky-600", icon: "💊" },
            { name: "Accessories", image: "/categories/accessories.jpg", color: "from-amber-500 to-amber-600", icon: "🎀" },
            { name: "Live Pets", image: "/categories/live-pets.jpg", color: "from-rose-500 to-rose-600", icon: "🐾" },
          ].map((category, index) => (
            <motion.div
              key={category.name}
              variants={scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedCategory(category.name)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[5/4] sm:aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                {/* Category Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-3xl sm:text-5xl lg:text-6xl drop-shadow-lg">{category.icon}</span>
                  </motion.div>
                  <PawPrint size={60} className="absolute -bottom-4 -right-4 text-white/10 rotate-[-20deg]" />
                </div>
                {/* Category name */}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-3 lg:p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white font-semibold text-[10px] sm:text-sm lg:text-base">{category.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products with scroll animations */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        {/* Decorative paws in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <PawPrint size={120} className="absolute -left-10 top-20 text-emerald-100/30 rotate-[-20deg]" />
          <PawPrint size={80} className="absolute right-10 bottom-40 text-emerald-100/20 rotate-[25deg]" />
        </div>

        <AnimatedSection>
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PawPrint size={32} className="text-emerald-500" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {selectedCategory === "All" ? "Featured Products" : selectedCategory}
                </h2>
                <p className="mt-1 text-slate-600">
                  {filteredProducts.length} products {searchQuery && `matching "${searchQuery}"`}
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-emerald-200 bg-transparent text-emerald-700 hover:bg-emerald-50 rounded-full"
                onClick={() => setSelectedCategory("All")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {filteredProducts.map((product, index) => {
            const isOutOfStock = product.status === "out-of-stock";
            return (
              <motion.div
                key={product.id}
                variants={scaleIn}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border-slate-200/80 bg-white transition-all hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                        <Badge className="bg-rose-600 text-white px-4 py-1">Out of Stock</Badge>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute right-2 top-2"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 shadow-lg hover:bg-white hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    {/* Decorative paw on hover */}
                    <motion.div
                      className="absolute left-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <PawPrint size={20} className="text-emerald-400/50" />
                    </motion.div>
                  </div>
                  <CardContent className="p-2 sm:p-3 md:p-4">
                    <Badge variant="secondary" className="mb-1 text-[10px] sm:text-xs bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 border-0 py-0.5 px-2">
                      {product.category}
                    </Badge>
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">{product.name}</h3>
                    <div className="mt-0.5 sm:mt-1.5 flex items-center gap-0.5 sm:gap-1">
                      <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-700">{product.rating}</span>
                      <span className="text-[10px] sm:text-xs md:text-sm text-slate-400">({product.reviews})</span>
                    </div>
                    <div className="mt-1.5 sm:mt-2 md:mt-3 flex items-center justify-between gap-1.5 sm:gap-2">
                      <span className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        {formatCurrency(product.sellingPrice)}
                      </span>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="icon"
                          disabled={isOutOfStock}
                          className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-300 shadow-lg shadow-emerald-500/20 rounded-full h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Trust Badges with pet theming */}
      <AnimatedSection>
        <section className="relative border-y border-slate-200/50 bg-gradient-to-r from-slate-50 via-white to-slate-50 py-16 overflow-hidden">
          {/* Background paws */}
          <PawPrint size={200} className="absolute -left-20 -top-10 text-emerald-100/20 rotate-[-30deg]" />
          <PawPrint size={150} className="absolute -right-10 -bottom-10 text-emerald-100/20 rotate-[20deg]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-2 gap-8 md:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {trustBadges.map((item, index) => {
                const Icon = item.icon;
                const colorClasses = {
                  emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
                  sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
                  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
                  violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
                };
                return (
                  <motion.div
                    key={item.title}
                    className="group text-center"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${colorClasses[item.color as keyof typeof colorClasses]}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="h-8 w-8" />
                    </motion.div>
                    <h4 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section with pet theme */}
      <AnimatedSection>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#006B3F] via-[#005C35] to-[#003D23] p-8 sm:p-12 lg:p-16"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background decoration with animals */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
              <CatSilhouette size={120} className="absolute right-10 top-5 text-white/5" />
              <DogSilhouette size={100} className="absolute left-10 bottom-5 text-white/5" />
              <PawPrint size={40} className="absolute right-1/4 bottom-1/4 text-white/10" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:text-left lg:justify-between">
              <div className="mb-8 lg:mb-0">
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                  <HeartPaw size={40} className="text-amber-300" />
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">
                    Join Our Pet Family
                  </h2>
                </div>
                <p className="max-w-xl text-emerald-100">
                  Subscribe for exclusive deals, pet care tips, and 10% off your first order. Because every pet deserves the best! 🐾
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Input
                  placeholder="Enter your email"
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 rounded-full px-6 min-w-[280px]"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-full px-8 font-semibold shadow-xl group">
                    <PawPrint size={18} className="mr-2 group-hover:animate-bounce" />
                    Subscribe
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection>
        <section className="relative border-y border-slate-200/50 bg-gradient-to-r from-slate-50 via-white to-slate-50 py-12 overflow-hidden">
          {/* Background paws */}
          <PawPrint size={200} className="absolute -left-20 -top-10 text-emerald-100/20 rotate-[-30deg]" />
          <PawPrint size={150} className="absolute -right-10 -bottom-10 text-emerald-100/20 rotate-[20deg]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { value: "10K+", label: "Happy Pets", icon: HeartPaw, color: "emerald" },
                { value: "500+", label: "Products", icon: Package, color: "sky" },
                { value: "4.9", label: "Rating", icon: Star, color: "amber" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                const colorClasses = {
                  emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
                  sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
                  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
                };
                return (
                  <motion.div
                    key={stat.label}
                    className="group text-center"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${colorClasses[stat.color as keyof typeof colorClasses]}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="h-8 w-8" />
                    </motion.div>
                    <h4 className="text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{stat.value}</h4>
                    <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer with paw accents */}
      <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 text-slate-400 overflow-hidden">
        {/* Decorative paws */}
        <PawPrint size={80} className="absolute left-10 top-10 text-white/5 rotate-[-15deg]" />
        <PawPrint size={60} className="absolute right-20 bottom-10 text-white/5 rotate-[25deg]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/logo-white.png"
                alt="Baycarl Pet Shop"
                width={120}
                height={35}
                className="h-8 w-auto"
              />
              <PawPrint size={24} className="text-emerald-500" />
            </motion.div>
            <p className="text-sm flex items-center gap-2">
              Made with <HeartPaw size={20} className="text-rose-500" /> for pets everywhere
            </p>
            <p className="text-sm">
              © 2024 Baycarl Petshop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        subtotal={subtotal}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
}

