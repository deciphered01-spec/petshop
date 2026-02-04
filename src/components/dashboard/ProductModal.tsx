"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Sparkles,
  Loader2,
  Package,
  Save,
  Trash2,
  DollarSign,
  Boxes,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@/lib/mock-data";

interface ProductModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  onDelete?: (productId: number) => void;
}

const categories = ["Pet Food", "Vitamins", "Accessories", "Live Pets"] as const;

const categoryIcons: Record<string, string> = {
  "Pet Food": "🦴",
  "Vitamins": "💊",
  "Accessories": "🎀",
  "Live Pets": "🐾",
};

export function ProductModal({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ProductModalProps) {
  const isEditing = !!product;
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "Pet Food",
    description: product?.description || "",
    costPrice: product?.costPrice || 0,
    sellingPrice: product?.sellingPrice || 0,
    stock: product?.stock || 0,
    threshold: product?.threshold || 5,
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        stock: product.stock,
        threshold: product.threshold,
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        category: "Pet Food",
        description: "",
        costPrice: 0,
        sellingPrice: 0,
        stock: 0,
        threshold: 5,
      });
    }
  }, [product]);

  const handleGenerateDescription = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const descriptions: Record<string, string> = {
        "Pet Food":
          "Premium quality pet food formulated with high-quality proteins and essential nutrients. Supports healthy digestion, strong bones, and a shiny coat. Made with natural ingredients and free from artificial preservatives.",
        Vitamins:
          "Comprehensive vitamin supplement designed to support overall pet health. Contains essential vitamins and minerals for immune support, energy, and vitality. Easy to administer and suitable for daily use.",
        Accessories:
          "High-quality pet accessory designed for comfort and durability. Made with premium materials that are safe for your pet. Perfect for everyday use and built to last.",
        "Live Pets":
          "Healthy and well-cared-for pet from certified breeders. Comes with health certificate and care instructions. Our team ensures each pet receives proper nutrition and socialization before finding their forever home.",
      };
      setFormData((prev) => ({
        ...prev,
        description:
          descriptions[prev.category] ||
          "Premium quality product for your beloved pet.",
      }));
      setIsGenerating(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: product?.id,
      status:
        formData.stock === 0
          ? "out-of-stock"
          : formData.stock <= formData.threshold
            ? "low-stock"
            : "in-stock",
    });
    onClose();
  };

  const profitMargin =
    formData.sellingPrice > 0
      ? (
        ((formData.sellingPrice - formData.costPrice) / formData.sellingPrice) *
        100
      ).toFixed(1)
      : 0;

  const profitAmount = formData.sellingPrice - formData.costPrice;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl shadow-black/50"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isEditing ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {isEditing
                      ? `Editing ${product?.name}`
                      : "Add a new product to your inventory"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                  Product Images
                </label>
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex h-28 w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 cursor-pointer"
                  >
                    <Package className="h-8 w-8 text-slate-500" />
                    <span className="mt-1 text-xs text-slate-500">Main</span>
                  </motion.div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    className="flex h-28 w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10"
                  >
                    <Upload className="h-6 w-6 text-slate-500" />
                    <span className="mt-1 text-xs text-slate-500">Add more</span>
                  </motion.button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Tag className="h-4 w-4 text-slate-400" />
                    Product Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Royal Canin Puppy Food"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:bg-white/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Boxes className="h-4 w-4 text-slate-400" />
                    SKU
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="e.g. RC-PUP-001"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:bg-white/10 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${formData.category === cat
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <span>{categoryIcons[cat]}</span>
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Description with AI */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    Description
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    AI Generate
                  </Button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the product..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                  required
                />
              </div>

              {/* Pricing Card */}
              <div className="mb-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Profit
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Cost Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        ₦
                      </span>
                      <Input
                        type="number"
                        value={formData.costPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            costPrice: Number(e.target.value),
                          })
                        }
                        className="pl-8 bg-white/5 border-white/10 text-white"
                        min={0}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Selling Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        ₦
                      </span>
                      <Input
                        type="number"
                        value={formData.sellingPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sellingPrice: Number(e.target.value),
                          })
                        }
                        className="pl-8 bg-white/5 border-white/10 text-white"
                        min={0}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Profit
                    </label>
                    <div className="flex h-9 items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3">
                      <span
                        className={`font-semibold ${profitAmount > 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                      >
                        ₦{profitAmount.toLocaleString()}
                      </span>
                      <Badge
                        className={`border-0 ${Number(profitMargin) > 20
                            ? "bg-emerald-500/20 text-emerald-400"
                            : Number(profitMargin) > 10
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                      >
                        {profitMargin}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Card */}
              <div className="mb-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-blue-400">
                  <Boxes className="h-5 w-5" />
                  Inventory Settings
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Current Stock
                    </label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: Number(e.target.value) })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      min={0}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Low Stock Threshold
                    </label>
                    <Input
                      type="number"
                      value={formData.threshold}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          threshold: Number(e.target.value),
                        })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      min={1}
                      required
                    />
                  </div>
                </div>

                {/* Stock Status Indicators */}
                <AnimatePresence>
                  {formData.stock <= formData.threshold && formData.stock > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4"
                    >
                      <Badge className="gap-2 border-amber-500/30 bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        Stock below threshold - will trigger low stock alert
                      </Badge>
                    </motion.div>
                  )}
                  {formData.stock === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4"
                    >
                      <Badge className="gap-2 border-rose-500/30 bg-rose-500/20 text-rose-400">
                        <AlertTriangle className="h-3 w-3" />
                        Product will be marked as Out of Stock
                      </Badge>
                    </motion.div>
                  )}
                  {formData.stock > formData.threshold && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4"
                    >
                      <Badge className="gap-2 border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        Good stock level
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                {isEditing && onDelete ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    onClick={() => {
                      onDelete(product!.id);
                      onClose();
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border-0"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Save Changes" : "Add Product"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
