PROJECT REQUIREMENTS DOCUMENT (PRD)
Project Name: Baycarl Petshop E-Commerce & Management Platform
Date: October 26, 2023
Status: Development Brief

1. Executive Summary
Baycarl Petshop requires a comprehensive e-commerce and management platform that integrates a customer-facing storefront with a robust backend for inventory and financial oversight.
The primary objective is to move beyond simple sales to a system that ensures financial transparency and accountability. The system must serve three distinct user groups:
Customers: A seamless shopping experience with smart recommendations.
Operations Manager: Tools for inventory accuracy and automated product management.
Director: High-level insights into revenue, profit, and loss prevention.

2. Functional Requirements: Backend Dashboards
A. Admin Dashboard (Director Level)
Access: Full System Control
1. Revenue Overview
The dashboard must display real-time revenue data, filtered by timeframes:
Total Revenue (Current Week)
Total Revenue (Current Month)
Total Revenue (Year-to-Date)
2. Automated Profit Tracking
Logic: Profit must be calculated automatically based on the Cost Price vs. Selling Price of inventory.
Visuals: Display weekly, monthly, and yearly profit trends (via line graphs or bar charts).
3. Profit & Loss (P&L) Analysis
The system must automatically audit the business health by comparing:
Initial Capital Value: (Sum of Cost Price of all inventory)
Total Sales: (Revenue generated)
Remaining Inventory Value: (Current stock value)
Discrepancy Detection: The system must highlight if there is a mismatch between Expected Revenue (based on stock reduction) and Actual Revenue, flagging potential missing stock or cash.

B. Operations Manager Dashboard
Access: Product & Inventory Management Only
1. Product Management Module
CRUD Capabilities: Create, Read, Update, and Delete products.
Fields: Name, Category (e.g., Pet Food, Rabbits, Accessories), Cost Price, Selling Price, Quantity, Description.
Media: Support for uploading multiple images per product.
Status Toggles: Manually mark items as "Active" or "Out of Stock."
2. Real-Time Inventory Tracking
Automatic Deduction: Stock count must decrease immediately upon a confirmed customer purchase.
Automatic Addition: Stock count must increase immediately when new inventory is logged.
Low Stock Alerts: The system must trigger a notification when an item falls below a defined threshold.
3. Inventory Value & Reporting
The Operations Dashboard must display a live snapshot of:
Total Stock Value (Cost): Sum(Quantity × Cost Price)
Total Market Value (Sales): Sum(Quantity × Selling Price)
Total Profit Potential: Total Market Value - Total Stock Value
4. Notification Center
Note: This is an alert system, not a chat feature.
Triggers: Low inventory, Out-of-stock items, New orders, Revenue milestones, and System discrepancies.

3. Functional Requirements: Customer Storefront
1. User Interface (UI)
Clean, modern aesthetic focused on high-quality visuals.
Navigation: Categories (Pet Food, Vitamins, Accessories, Live Pets).
Sections: "Featured Products" and "Top Sellers" on the homepage.
2. Product Details
Multi-view image gallery.
Detailed product description.
Live stock availability indicator.
"Add to Cart" functionality.
3. Checkout & Payments
Gateway Integration: Secure integration with Paystack or Flutterwave (Nigeria-friendly).
Methods: Card payments, Bank Transfers, USSD.
Post-Purchase: Automatic digital receipt generation sent to customer email.
User Accounts: Order history available for registered customers.

4. Backend Logic & Data Automation
Feature
Logic Requirement
Sales Tracking
Every transaction must simultaneously:

1. Update Revenue

2. Reduce Stock Count

3. Log Profit Margin
Inventory Value
Must dynamically recalculate whenever a product is added or sold.
Reporting
Automated generation of Weekly, Monthly, and Yearly PDF reports covering sales volume and inventory movement.
Security
Role-Based Access Control (RBAC) is strict. Operations Managers cannot view overall Business Profit/Loss; only Inventory data.
