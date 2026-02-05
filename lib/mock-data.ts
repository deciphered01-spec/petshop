// Centralized mock data store for demo purposes

export interface Product {
  id: number | string;
  name: string;
  sku?: string;
  description?: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  threshold?: number;
  rating?: number;
  reviews?: number;
  images: string[];
  status?: "in-stock" | "low-stock" | "out-of-stock";
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentMethod: string;
}

export interface Transaction {
  date: string;
  description: string;
  category: string;
  aiTag: string;
  amount: number;
  status: "Completed" | "Verified" | "Flagged";
}

export interface Notification {
  id: number;
  type: "low-stock" | "out-of-stock" | "new-order" | "revenue" | "anomaly";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
}

// Products data
export const products: Product[] = [
  {
    id: 1,
    name: "Royal Canin Puppy Food",
    sku: "RC-PUP-001",
    description: "Premium nutrition for growing puppies. Formulated with high-quality proteins to support healthy muscle development and optimal energy levels. Contains antioxidants and vitamins for a strong immune system.",
    category: "Pet Food",
    costPrice: 35000,
    sellingPrice: 45000,
    stock: 24,
    threshold: 10,
    rating: 4.8,
    reviews: 124,
    images: ["/products/royal-canin-1.jpg", "/products/royal-canin-2.jpg"],
    status: "in-stock",
    featured: true,
  },
  {
    id: 2,
    name: "Rabbit Pellets Premium",
    sku: "RP-PRM-002",
    description: "High-fiber rabbit pellets made with timothy hay and essential nutrients. Supports digestive health and maintains optimal body weight. Free from artificial preservatives.",
    category: "Pet Food",
    costPrice: 6500,
    sellingPrice: 8500,
    stock: 45,
    threshold: 15,
    rating: 4.5,
    reviews: 89,
    images: ["/products/rabbit-pellets.jpg"],
    status: "in-stock",
    featured: true,
  },
  {
    id: 3,
    name: "Cat Vitamin Chews",
    sku: "CV-CHW-003",
    description: "Delicious vitamin-enriched chews that cats love. Contains taurine for heart health, omega-3 for skin and coat, and essential vitamins for overall wellness.",
    category: "Vitamins",
    costPrice: 9000,
    sellingPrice: 12000,
    stock: 8,
    threshold: 10,
    rating: 4.7,
    reviews: 156,
    images: ["/products/cat-vitamins.jpg"],
    status: "low-stock",
    featured: true,
  },
  {
    id: 4,
    name: "Dog Collar Leather Premium",
    sku: "DC-LTH-004",
    description: "Handcrafted genuine leather collar with durable brass hardware. Adjustable sizing for small to medium dogs. Comfortable and stylish for everyday wear.",
    category: "Accessories",
    costPrice: 4500,
    sellingPrice: 6500,
    stock: 32,
    threshold: 5,
    rating: 4.3,
    reviews: 67,
    images: ["/products/dog-collar.jpg"],
    status: "in-stock",
    featured: false,
  },
  {
    id: 5,
    name: "Fish Tank Filter Pro",
    sku: "FT-FLT-005",
    description: "Advanced 3-stage filtration system for aquariums up to 50 gallons. Quiet operation with adjustable flow rate. Includes activated carbon and bio-media.",
    category: "Accessories",
    costPrice: 14000,
    sellingPrice: 18000,
    stock: 0,
    threshold: 5,
    rating: 4.6,
    reviews: 43,
    images: ["/products/fish-filter.jpg"],
    status: "out-of-stock",
    featured: false,
  },
  {
    id: 6,
    name: "Bird Seed Mix Premium",
    sku: "BS-MIX-006",
    description: "Nutritious seed blend for parakeets, canaries, and finches. Contains sunflower seeds, millet, and safflower with added vitamins for feather health.",
    category: "Pet Food",
    costPrice: 2500,
    sellingPrice: 3500,
    stock: 67,
    threshold: 20,
    rating: 4.4,
    reviews: 98,
    images: ["/products/bird-seed.jpg"],
    status: "in-stock",
    featured: true,
  },
  {
    id: 7,
    name: "Hamster Cage Deluxe",
    sku: "HC-DLX-007",
    description: "Spacious two-story hamster habitat with exercise wheel, water bottle, and food dish included. Features easy-clean pull-out tray and multiple ventilation panels.",
    category: "Accessories",
    costPrice: 25000,
    sellingPrice: 35000,
    stock: 0,
    threshold: 3,
    rating: 4.9,
    reviews: 34,
    images: ["/products/hamster-cage.jpg"],
    status: "out-of-stock",
    featured: false,
  },
  {
    id: 8,
    name: "Dog Multivitamin Tablets",
    sku: "DM-TAB-008",
    description: "Complete daily multivitamin for adult dogs. Supports joint health, immune function, and energy levels. Easy to administer with meals.",
    category: "Vitamins",
    costPrice: 7500,
    sellingPrice: 11000,
    stock: 52,
    threshold: 15,
    rating: 4.6,
    reviews: 203,
    images: ["/products/dog-vitamins.jpg"],
    status: "in-stock",
    featured: true,
  },
  {
    id: 9,
    name: "Holland Lop Rabbit",
    sku: "HL-RBT-009",
    description: "Adorable Holland Lop rabbit, perfect for families. Gentle temperament and easy to care for. Comes with health certificate and initial care kit.",
    category: "Live Pets",
    costPrice: 45000,
    sellingPrice: 65000,
    stock: 4,
    threshold: 2,
    rating: 5.0,
    reviews: 28,
    images: ["/products/holland-lop.jpg"],
    status: "in-stock",
    featured: true,
  },
  {
    id: 10,
    name: "Cat Scratching Post Tower",
    sku: "CS-TWR-010",
    description: "Multi-level cat tree with sisal scratching posts, cozy platforms, and dangling toys. Sturdy base prevents tipping. Perfect for climbing and lounging.",
    category: "Accessories",
    costPrice: 18000,
    sellingPrice: 28000,
    stock: 12,
    threshold: 5,
    rating: 4.7,
    reviews: 87,
    images: ["/products/cat-tower.jpg"],
    status: "in-stock",
    featured: false,
  },
];

// Transactions data for Director Dashboard
export const transactions: Transaction[] = [
  {
    date: "2024-01-15",
    description: "Royal Canin Bulk Order",
    category: "Inventory Purchase",
    aiTag: "Recurring",
    amount: -125000,
    status: "Completed",
  },
  {
    date: "2024-01-14",
    description: "Weekend Sales Revenue",
    category: "Sales",
    aiTag: "Peak Period",
    amount: 245000,
    status: "Verified",
  },
  {
    date: "2024-01-13",
    description: "Utility Bill - January",
    category: "Operating Expense",
    aiTag: "Fixed",
    amount: -45000,
    status: "Completed",
  },
  {
    date: "2024-01-12",
    description: "Pet Accessories Sale",
    category: "Sales",
    aiTag: "Normal",
    amount: 78500,
    status: "Verified",
  },
  {
    date: "2024-01-11",
    description: "Staff Salary - Week 2",
    category: "Payroll",
    aiTag: "Fixed",
    amount: -180000,
    status: "Completed",
  },
  {
    date: "2024-01-10",
    description: "Cash Withdrawal - Unverified",
    category: "Unknown",
    aiTag: "Anomaly",
    amount: -35000,
    status: "Flagged",
  },
  {
    date: "2024-01-09",
    description: "Live Pets Revenue",
    category: "Sales",
    aiTag: "High Value",
    amount: 195000,
    status: "Verified",
  },
  {
    date: "2024-01-08",
    description: "Shop Rent - January",
    category: "Operating Expense",
    aiTag: "Fixed",
    amount: -350000,
    status: "Completed",
  },
];

// Notifications data
export const notifications: Notification[] = [
  {
    id: 1,
    type: "low-stock",
    title: "Low Stock Alert",
    message: "Cat Vitamin Chews is running low (8 units remaining)",
    timestamp: "5 minutes ago",
    read: false,
    severity: "warning",
  },
  {
    id: 2,
    type: "out-of-stock",
    title: "Out of Stock",
    message: "Fish Tank Filter Pro is now out of stock",
    timestamp: "1 hour ago",
    read: false,
    severity: "critical",
  },
  {
    id: 3,
    type: "new-order",
    title: "New Order Received",
    message: "Order #ORD-2024-0156 for ₦78,500 placed",
    timestamp: "2 hours ago",
    read: false,
    severity: "info",
  },
  {
    id: 4,
    type: "revenue",
    title: "Revenue Milestone",
    message: "Daily revenue exceeded ₦100,000!",
    timestamp: "3 hours ago",
    read: true,
    severity: "info",
  },
  {
    id: 5,
    type: "anomaly",
    title: "Financial Anomaly Detected",
    message: "Unverified cash withdrawal of ₦35,000 flagged",
    timestamp: "1 day ago",
    read: true,
    severity: "critical",
  },
  {
    id: 6,
    type: "out-of-stock",
    title: "Out of Stock",
    message: "Hamster Cage Deluxe is now out of stock",
    timestamp: "2 days ago",
    read: true,
    severity: "critical",
  },
];

// Sample orders for order history
export const sampleOrders: Order[] = [
  {
    id: "ORD-2024-0156",
    date: "2024-01-15",
    items: [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 2 },
    ],
    subtotal: 69000,
    delivery: 2500,
    total: 71500,
    status: "processing",
    paymentMethod: "Card",
  },
  {
    id: "ORD-2024-0142",
    date: "2024-01-10",
    items: [
      { product: products[5], quantity: 3 },
      { product: products[7], quantity: 1 },
    ],
    subtotal: 21500,
    delivery: 1500,
    total: 23000,
    status: "delivered",
    paymentMethod: "Bank Transfer",
  },
];

// Analytics data for Director Dashboard
export const analyticsData = {
  revenue: {
    thisWeek: 845000,
    thisMonth: 2845000,
    yearToDate: 28450000,
    changeWeek: 8.5,
    changeMonth: 12.5,
    changeYear: 22.3,
  },
  profit: {
    thisWeek: 265000,
    thisMonth: 892400,
    yearToDate: 8924000,
    changeWeek: 5.2,
    changeMonth: 8.2,
    changeYear: 18.7,
  },
  inventory: {
    totalProducts: products.length,
    totalStockValue: products.reduce((sum, p) => sum + p.costPrice * p.stock, 0),
    totalMarketValue: products.reduce((sum, p) => sum + p.sellingPrice * p.stock, 0),
    lowStockItems: products.filter((p) => p.status === "low-stock").length,
    outOfStockItems: products.filter((p) => p.status === "out-of-stock").length,
  },
  monthlyRevenue: [
    { month: "Jan", amount: 2100000 },
    { month: "Feb", amount: 1800000 },
    { month: "Mar", amount: 2450000 },
    { month: "Apr", amount: 2100000 },
    { month: "May", amount: 2800000 },
    { month: "Jun", amount: 2350000 },
    { month: "Jul", amount: 2650000 },
    { month: "Aug", amount: 2400000 },
    { month: "Sep", amount: 2900000 },
    { month: "Oct", amount: 2700000 },
    { month: "Nov", amount: 2850000 },
    { month: "Dec", amount: 3100000 },
  ],
  anomalies: [
    {
      type: "Mismatched Receipt",
      description: "Receipt #4521 shows ₦45,000 but POS records ₦42,500",
      severity: "high" as const,
      date: "Jan 10, 2024",
    },
    {
      type: "Unusual Withdrawal",
      description: "Cash withdrawal of ₦35,000 without documented purpose",
      severity: "medium" as const,
      date: "Jan 10, 2024",
    },
    {
      type: "Stock Discrepancy",
      description: "5 units of Royal Canin missing from inventory count",
      severity: "high" as const,
      date: "Jan 8, 2024",
    },
  ],
};

// AI Stockout Predictions
export const stockoutPredictions = [
  {
    product: "Royal Canin Puppy Food",
    daysUntilStockout: 3,
    avgDailySales: 8,
    severity: "critical" as const,
  },
  {
    product: "Cat Vitamin Chews",
    daysUntilStockout: 5,
    avgDailySales: 1.6,
    severity: "warning" as const,
  },
  {
    product: "Fish Tank Filter Pro",
    daysUntilStockout: 0,
    avgDailySales: 0.4,
    severity: "critical" as const,
  },
];

// Helper functions
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function getProductById(id: number | string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      (p.description || "").toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
  );
}
