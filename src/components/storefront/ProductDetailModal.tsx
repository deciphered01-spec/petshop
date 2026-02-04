"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Star, Minus, Plus, ShoppingCart, Heart, Check, Truck, Shield, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const isOutOfStock = product.status === "out-of-stock";
  const isLowStock = product.status === "low-stock";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-slate-600 shadow-md transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image Section */}
          <div className="relative bg-slate-50 p-6 md:p-8">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-24 w-24 text-slate-300" />
              </div>
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                  <Badge className="bg-rose-600 px-4 py-2 text-lg text-white">Out of Stock</Badge>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 bg-white/90 hover:bg-white"
              >
                <Heart className="h-5 w-5 text-slate-600" />
              </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="mt-4 flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? "border-emerald-500"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <Package className="h-6 w-6 text-slate-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col p-6 md:p-8">
            {/* Category & Rating */}
            <div className="flex items-center gap-3">
              <Badge className="bg-sky-50 text-sky-700">{product.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-2xl font-bold text-slate-900">{product.name}</h2>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-600">
                {formatCurrency(product.sellingPrice)}
              </span>
              {product.costPrice < product.sellingPrice && (
                <span className="text-lg text-slate-400 line-through">
                  {formatCurrency(Math.round(product.sellingPrice * 1.2))}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {isOutOfStock ? (
                <Badge className="border-rose-200 bg-rose-50 text-rose-700">
                  <X className="mr-1 h-3 w-3" />
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                  Only {product.stock} left in stock
                </Badge>
              ) : (
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  <Check className="mr-1 h-3 w-3" />
                  In Stock ({product.stock} available)
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-slate-600 leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mt-6">
              <label className="text-sm font-medium text-slate-700">Quantity</label>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    disabled={isOutOfStock}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    disabled={isOutOfStock || quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-500">
                  {formatCurrency(product.sellingPrice * quantity)} total
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-6 flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-200 bg-transparent hover:bg-slate-50"
              >
                <Heart className="h-5 w-5 text-slate-600" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
              <div className="text-center">
                <Truck className="mx-auto h-6 w-6 text-emerald-600" />
                <p className="mt-1 text-xs font-medium text-slate-600">Free Delivery</p>
                <p className="text-xs text-slate-400">Above ₦50,000</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto h-6 w-6 text-sky-600" />
                <p className="mt-1 text-xs font-medium text-slate-600">100% Authentic</p>
                <p className="text-xs text-slate-400">Verified products</p>
              </div>
              <div className="text-center">
                <Package className="mx-auto h-6 w-6 text-amber-600" />
                <p className="mt-1 text-xs font-medium text-slate-600">Easy Returns</p>
                <p className="text-xs text-slate-400">7-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
