# Baycarl Enterprise - Production Roadmap

## Overview
This roadmap outlines the strategic milestones required to transition "Baycarl Petshop" from its current prototype state to a fully functional, production-ready enterprise e-commerce and management platform.

---

## 🚩 Milestone 1: Core Foundation (Current Status: ✅ Complete)
*Goal: Solidify the backend and ensure all internal dashboards operate on live database data.*

- [x] **Project Structure & Schema**:
    - [x] Initial Scaffolding (Next.js 15, Supabase, Tailwind CSS v4).
    - [x] Database Schema (Products, Orders, Profiles, Expenses).
    - [x] Enterprise Extensions (RBAC, Restock Batches, Notifications).
- [x] **Dashboard Migration**:
    - [x] **Operations Dashboard**: Migrated to `useProducts` hook (Live).
    - [x] **Director Dashboard**:
        - [x] Replace mock `plData` with `revenue_logs` and `expenses` tables.
        - [x] Wire up `RestockAnalytics` to `restock_batches`.
        - [x] Integrate real-time `admin_notifications`.
    - [x] **Expenses Widget**: Migrate to live data (CRUD foundation).
- [x] **UI/UX Enhancements**:
    - [x] Theme system implementation (Light/Dark mode with global ThemeProvider).
    - [x] Brand identity integration (Baycarl logo green #006B3F, favicon.svg).
    - [x] Responsive mobile layouts for storefront and dashboard.

## 🔓 Milestone 2: User Access & Security (Current Status: ✅ Complete)
*Goal: Implement secure authentication and strict Role-Based Access Control (RBAC).*

- [x] **Authentication Flow**:
    - [x] Build Sign-in page (`/app/signin/page.tsx`) with email/password auth.
    - [x] Build Sign-up page (`/app/signup/page.tsx`) with customer registration.
    - [x] Google OAuth integration (Sign in with Google button).
    - [x] OAuth callback handler (`/app/auth/callback/route.ts`).
    - [x] Role-based redirect (Staff → `/admin`, Customers → `/`).
    - [x] AuthProvider context with user/role state management.
    - [ ] User Profile Management (Avatar, Phone, Password reset).
- [x] **Protected Routes**:
    - [x] Middleware checks for authentication and role-based access.
    - [x] Redirect unauthorized users to `/signin`.
- [x] **Role-Based Access Control (RBAC)**:
    - [x] Operations Manager restrictions (No Yearly Analytics, No Stock Value visibility).
    - [x] Inventory Manager restrictions (No Yearly Analytics).
    - [x] Admin gets full access including Yearly Analytics and Stock Value.
    - [x] Role badges in dashboard header.
    - [x] RoleManager UI for Admin to change user roles.
- [x] **Admin Notification System**:
    - [x] Database triggers for inventory edits by Operations Manager.
    - [x] NotificationsCenter component with detailed change tracking.
    - [x] Real-time notifications with 30s polling.
    - [x] "Moved from X to Y" change messages for compliance.

## 📈 Milestone 3: Advanced Analytics & Operations (Current Status: ✅ Complete)
*Goal: Enable sophisticated enterprise features for business intelligence.*

- [x] **Per-Batch Analytics**:
    - [x] Stock Value display (Remaining Qty × Cost Price).
    - [x] Market Value display (Remaining Qty × Selling Price).
    - [x] Profit Potential per batch.
    - [x] Enhanced RestockAnalytics table with 8 columns.
- [x] **Time-Range Filters**:
    - [x] RevenueMetrics component with Week/Month/Year filters.
    - [x] Revenue, Expenses, and Net Profit cards with growth indicators.
    - [x] Period-over-period comparison metrics.
- [x] **Pack vs Singles Logic**:
    - [x] Product form updates to use pack_size column.
    - [x] Sales calculations accounting for pack sizes.
    - [x] Inventory tracking per pack vs individual units.
- [x] **Recurring Expenses**:
    - [x] Auto-generation of monthly salary expenses.
    - [x] Cron job or scheduled function for recurring items.
    - [x] Net Profit calculation including recurring costs.

## 🛒 Milestone 4: Customer Storefront (Current Status: 🟡 In Progress)
*Goal: Enable public customers to browse, cart, and purchase products.*

- [x] **Storefront UI**:
    - [x] CustomerStorefront component with hero section and product grid.
    - [x] Mobile-responsive layout (text-left, image-right hero).
    - [x] Category filtering UI (All, Pet Food, Vitamins, Accessories, Live Pets).
    - [x] Search functionality.
    - [x] Cart sidebar component with add/remove items.
    - [ ] Connect `CustomerStorefront` to `useProducts` hook (Live data). ⏸️ **Deferred**
    - [ ] Implement "Featured" filtering with real data. ⏸️ **Deferred**
    - [ ] Build Product Detail Page (Dynamic routing `/products/[id]`). ⏸️ **Deferred**
- [x] **Shopping Cart**:
    - [x] Cart state management (local state in CustomerStorefront).
    - [x] CartSidebar UI component.
    - [x] Quantity adjustments.
    - [x] Cart Context/State (Persisted with localStorage or global state).
- [ ] **Checkout System**: ⏸️ **Deferred - Will revisit after Milestone 5**
    - [x] CheckoutModal UI component.
    - [ ] Checkout Form validation.
    - [ ] **Payment Integration**:
        - [ ] Paystack / Stripe Integration (Mock -> Live Sandbox).
        - [ ] Webhook handler for payment confirmation.
    - [ ] Order Generation (Create `order` and `order_items` records).
*Goal: Integrate intelligent automation.*

- [ ] **Receipt Scanning**:
    - [ ] Connect "Upload" button to an OCR service (e.g., GPT-4o Vision or specialized API).
    - [ ] Parse results into `receipt_scans` table.
- [ ] **Content Generation**:
    - [ ] AI Description Generator for new products.
    - [ ] Smart Tagging/Categorization.

## 🚀 Milestone 6: Production Readiness
*Goal: Prepare for deployment.*

- [ ] **Testing**:
    - [ ] Unit tests for critical calculations (Profit, Stock updates).
    - [ ] End-to-End flows (Visitor -> Buyer -> Admin Fulfillment).
- [ ] **Optimization**:
    - [ ] Image optimization (Next.js Image).
    - [ ] Query caching (React Query invalidation strategies).
- [ ] **Deployment**:
    - [ ] Environment Variables cleanup.
    - [ ] Deploy to Vercel/Netlify.
    - [ ] Supabase Production instance setup.
- [ ] **Handover**:
    - [ ] Admin User Manual.
    - [ ] Developer Documentation.
