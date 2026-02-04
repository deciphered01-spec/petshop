"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  Plus,
  ScanLine,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Sparkles,
  Search,
  LayoutDashboard,
  Shield,
  Boxes,
  DollarSign,
  BarChart3,
  Zap,
  Eye,
  ArrowUpRight,
  Filter,
  Moon,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  products as initialProducts,
  stockoutPredictions,
  type Product,
} from "@/lib/mock-data";
import { ProductModal } from "./ProductModal";
import { NotificationBell } from "./NotificationsCenter";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function OperationsDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [stockValues, setStockValues] = useState<Record<number, number>>(
    Object.fromEntries(initialProducts.map((item) => [item.id, item.stock]))
  );

  const isDark = theme === "dark";

  const inventoryStats = {
    totalProducts: products.length,
    totalStockValue: products.reduce((sum, p) => sum + p.costPrice * p.stock, 0),
    totalMarketValue: products.reduce((sum, p) => sum + p.sellingPrice * p.stock, 0),
    lowStockItems: products.filter((p) => p.status === "low-stock").length,
    outOfStockItems: products.filter((p) => p.status === "out-of-stock").length,
    profitPotential: products.reduce((sum, p) => sum + (p.sellingPrice - p.costPrice) * p.stock, 0),
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockChange = (id: number, value: string) => {
    const numValue = Number.parseInt(value) || 0;
    setStockValues((prev) => ({ ...prev, [id]: numValue }));
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? { ...p, ...productData } as Product : p))
      );
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        name: productData.name || "",
        sku: productData.sku || "",
        description: productData.description || "",
        category: productData.category || "Pet Food",
        costPrice: productData.costPrice || 0,
        sellingPrice: productData.sellingPrice || 0,
        stock: productData.stock || 0,
        threshold: productData.threshold || 5,
        rating: 4.5,
        reviews: 0,
        images: [],
        status: productData.status || "in-stock",
        featured: false,
      };
      setProducts((prev) => [...prev, newProduct]);
      setStockValues((prev) => ({ ...prev, [newProduct.id]: newProduct.stock }));
    }
    setSelectedProduct(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setSelectedProduct(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"}`}>
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`} />
        <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-500/5"}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${isDark ? "bg-cyan-500/5" : "bg-cyan-500/3"}`} />
      </div>

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${isDark ? "border-white/10 bg-slate-900/80" : "border-slate-200 bg-white/80 shadow-sm"}`}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/25">
                  <Boxes className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Operations Dashboard</h1>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Inventory Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"}`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-64 h-9 pl-9 rounded-lg ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500/50" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"}`}
                />
              </div>

              {/* Go to Admin */}
              <Link href="/admin">
                <Button
                  variant="outline"
                  className={`${isDark ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-blue-400" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600"}`}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>

              <NotificationBell />

              {/* User Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-sm font-bold text-white">
                OP
              </div>
            </div>
          </div>
        </motion.header>

        <main className="p-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Inventory Control</h2>
                <p className="text-slate-400">Stock management and forecasting</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <ScanLine className="mr-2 h-4 w-4" />
                  Scan Receipt
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 border-0"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                title: "Total Products",
                value: inventoryStats.totalProducts.toString(),
                icon: Package,
                gradient: "from-blue-500 to-cyan-600",
                bgGradient: "from-blue-500/10 to-cyan-600/10",
              },
              {
                title: "Stock Value",
                value: `₦${inventoryStats.totalStockValue.toLocaleString()}`,
                icon: DollarSign,
                gradient: "from-emerald-500 to-teal-600",
                bgGradient: "from-emerald-500/10 to-teal-600/10",
              },
              {
                title: "Low Stock Items",
                value: inventoryStats.lowStockItems.toString(),
                icon: AlertTriangle,
                gradient: "from-amber-500 to-orange-600",
                bgGradient: "from-amber-500/10 to-orange-600/10",
                alert: inventoryStats.lowStockItems > 0,
              },
              {
                title: "Out of Stock",
                value: inventoryStats.outOfStockItems.toString(),
                icon: XCircle,
                gradient: "from-rose-500 to-pink-600",
                bgGradient: "from-rose-500/10 to-pink-600/10",
                alert: inventoryStats.outOfStockItems > 0,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className={`relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ${stat.alert ? 'ring-1 ring-rose-500/50' : ''}`}>
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-xl p-3 bg-gradient-to-br ${stat.bgGradient}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Inventory Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Boxes className="h-5 w-5 text-blue-400" />
                        Inventory List
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {filteredProducts.length} products • Real-time stock levels
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/10">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-900/95 backdrop-blur-sm">
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-slate-400 font-semibold">Product</TableHead>
                          <TableHead className="text-slate-400 font-semibold">SKU</TableHead>
                          <TableHead className="text-slate-400 font-semibold text-center">Stock</TableHead>
                          <TableHead className="text-slate-400 font-semibold text-right">Price</TableHead>
                          <TableHead className="text-slate-400 font-semibold">Status</TableHead>
                          <TableHead className="text-slate-400 font-semibold text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((item) => (
                          <TableRow
                            key={item.id}
                            className={`border-white/5 hover:bg-white/5 transition-colors ${item.status === "out-of-stock"
                              ? "bg-rose-500/5"
                              : item.status === "low-stock"
                                ? "bg-amber-500/5"
                                : ""
                              }`}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">
                                  <Package className="h-5 w-5 text-slate-400" />
                                </div>
                                <span className="font-medium text-white">{item.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-slate-400">{item.sku}</TableCell>
                            <TableCell className="text-center">
                              {editingId === item.id ? (
                                <Input
                                  type="number"
                                  value={stockValues[item.id]}
                                  onChange={(e) => handleStockChange(item.id, e.target.value)}
                                  className="h-8 w-20 text-center bg-white/10 border-white/20 text-white mx-auto"
                                  min={0}
                                  autoFocus
                                  onBlur={() => setEditingId(null)}
                                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                                />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setEditingId(item.id)}
                                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1 font-semibold hover:bg-white/10 transition-colors"
                                >
                                  <span
                                    className={
                                      item.status === "out-of-stock"
                                        ? "text-rose-400"
                                        : item.status === "low-stock"
                                          ? "text-amber-400"
                                          : "text-white"
                                    }
                                  >
                                    {stockValues[item.id]}
                                  </span>
                                  <Edit3 className="h-3 w-3 text-slate-500" />
                                </button>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <span className="text-emerald-400 font-medium">₦{item.sellingPrice.toLocaleString()}</span>
                                <span className="block text-xs text-slate-500">Cost: ₦{item.costPrice.toLocaleString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`border-0 ${item.status === "in-stock"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : item.status === "low-stock"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-rose-500/20 text-rose-400"
                                  }`}
                              >
                                {item.status === "in-stock" && <CheckCircle className="mr-1 h-3 w-3" />}
                                {item.status === "low-stock" && <AlertTriangle className="mr-1 h-3 w-3" />}
                                {item.status === "out-of-stock" && <XCircle className="mr-1 h-3 w-3" />}
                                {item.status === "in-stock"
                                  ? "In Stock"
                                  : item.status === "low-stock"
                                    ? "Low Stock"
                                    : "Out of Stock"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                                onClick={() => setSelectedProduct(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Forecasting Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-400">AI Stockout Predictions</CardTitle>
                      <CardDescription className="text-blue-300/60">
                        Forecasted issues
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {stockoutPredictions.map((prediction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`rounded-xl border p-4 ${prediction.severity === "critical"
                          ? "border-rose-500/30 bg-rose-500/10"
                          : prediction.severity === "warning"
                            ? "border-amber-500/30 bg-amber-500/10"
                            : "border-blue-500/30 bg-blue-500/10"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`font-semibold text-sm ${prediction.severity === "critical"
                              ? "text-rose-400"
                              : prediction.severity === "warning"
                                ? "text-amber-400"
                                : "text-blue-400"
                              }`}
                          >
                            {prediction.product}
                          </span>
                          <Badge
                            className={`border-0 text-xs ${prediction.severity === "critical"
                              ? "bg-rose-500 text-white"
                              : prediction.severity === "warning"
                                ? "bg-amber-500 text-white"
                                : "bg-blue-500 text-white"
                              }`}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {prediction.daysUntilStockout}d
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          Avg. daily: {prediction.avgDailySales} units
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Stockout:{" "}
                            {new Date(
                              Date.now() + prediction.daysUntilStockout * 24 * 60 * 60 * 1000
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-400 hover:bg-blue-500/10 p-2">
                            Restock
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                  >
                    View Full Forecast
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Inventory Value Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  Inventory Value Summary
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Current stock valuation and profit potential
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 text-center"
                  >
                    <p className="text-sm font-medium text-slate-400">Stock Value (Cost)</p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      ₦{inventoryStats.totalStockValue.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Based on cost price</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 p-6 text-center"
                  >
                    <p className="text-sm font-medium text-emerald-400">Market Value</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-400">
                      ₦{inventoryStats.totalMarketValue.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-1 text-xs text-emerald-500">
                      <TrendingUp className="h-3 w-3" />
                      Based on selling price
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 p-6 text-center"
                  >
                    <p className="text-sm font-medium text-blue-400">Profit Potential</p>
                    <p className="mt-2 text-3xl font-bold text-blue-400">
                      ₦{inventoryStats.profitPotential.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-blue-500">If all stock is sold</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isAddModalOpen || !!selectedProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}
