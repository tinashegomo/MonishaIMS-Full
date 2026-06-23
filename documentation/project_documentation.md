Monisha Inventory Management System Documentation

1. Project Overview

Introduction

This project is a stock-controlled uniform shop management system designed for a clothing and uniform manufacturing business. The system manages warehouse inventory, school uniforms, product allocation, stock deduction, and custom tailoring workflows with measurements.

The system replaces the traditional notebook/book-based manual system previously used in the shop with a secure, responsive, and robust digital platform.

The application uses:
- React 19 for the frontend (Vite 8 build tool)
- Spring Boot 3.5.14 for the backend (Java 21)
- MySQL / H2 for database storage (stateless JWT authentication)

2. Main Goal of the System

The main purpose of the system is to:
- Manage warehouse stock properly from a central source of truth
- Prevent invalid stock combinations (Type → Variant → Color → Size)
- Track uniform inventory dynamically (reducing overselling and manual entry errors)
- Allocate stock to sellable products smoothly
- Support school-based uniforms and general non-school items
- Deduct stock automatically upon product creation and order placement
- Support full customer order flows, measurements, custom-made items, payments, and tailoring production statuses

3. Problem Being Solved

The manual book system had severe limitations:
- Difficult to track stock accurately across sizes
- Difficult to know remaining quantities in real-time
- No automatic stock deduction or validations
- No validation of available stock combinations (leads to invalid product specifications)
- Human errors in bookkeeping, payments, and outstanding balances
- Hard to search historical records or audit user actions
- No relationship between warehouse stock, products, and customer orders
- Difficult to manage custom tailoring requests and tailoring queues

The digital system solves these problems by enforcing structured inventory relationships and automated calculations.

4. Core System Concept

The warehouse is the source of truth.
Everything in the system must originate from warehouse inventory.

The system follows this hierarchy:
Batch
↓
Type
↓
Variant
↓
Color
↓
Size
↓
Size Quantity

Every product created must draw its characteristics and stock directly from an existing warehouse stock combination.

5. System Architecture

Frontend

Technology:
- React 19
- Vite 8
- Axios (with centralized JWT request/response interceptors)
- React Hook Form + Yup (schema-driven validation)
- Tailwind CSS v4 (native CSS-based semantic theme tokens)
- Recharts (analytical dashboard charts)
- Lucide React (vector icons)

Responsibilities:
- Forms and validation feedback
- Dynamic dropdown filtering (Type → Variant → Color → Batch)
- Responsive display layouts
- Dashboard reporting and real-time warnings
- Audit trail display

Layout & Navigation:
- **Desktop (lg+):** Horizontal TopNav bar with branding, primary navigation links (Dashboard, Warehouse, Products, Orders, Tailoring), and a custom profile dropdown containing Profile, Users (Admin only), and Sign Out.
- **Mobile (<lg):** Fixed BottomNav tab bar containing 5 quick-action icon links, plus a sliding "More" profile dropdown.

Backend

Technology:
- Spring Boot 3.5.14
- Java 21
- Maven
- Spring Web
- Spring Data JPA + Hibernate
- Jakarta Validation
- Spring Security (stateless JWT authentication)
- MapStruct (compile-time entity/DTO mapping)
- Lombok

Responsibilities:
- Business logic validation
- Database transactions (atomic rollbacks)
- Inventory deduction algorithms
- Role-based security (ADMIN, MANAGER, USER)
- API endpoint controllers (verb-suffixed structure)

Database

Technology:
- MySQL (or H2 for local test environments)

Responsibilities:
- Persistent storage
- Relational mapping (foreign keys, cascading deletes, orphan removals)
- Audit fields (tracking `createdBy` per entry)

6. Core Business Logic

Warehouse Is the Master Inventory

Warehouse inventory represents the actual physical stock available in the business.

Example:
Batch Name: Shirts Batch 01
Type: Shirt
Variant:
- Short Sleeve
- Long Sleeve
Color:
- White
- Yellow
- Sky Blue
Sizes:
- 30
- 32
- 34
- XL
Size Quantities:
- 30 = 100
- 32 = 80
- 34 = 50

This is the foundation of the entire system.

7. Warehouse Module

Purpose

The warehouse module stores all available raw inventory batches.

Warehouse Batch

A warehouse batch is a physical stock group.
Example: Shirts Batch 01

A batch contains:
- One main Category/Type (e.g. Shirt)
- One Variant (e.g. Short Sleeve)
- One Color (e.g. White)
- Multiple sizes and their respective quantities

Warehouse Breakdown Structure

Each warehouse stock entry contains:
- **Batch Name:** Unique identifier name
- **Type / Category:** Product category (e.g., Shirt, Blazer)
- **Variant:** Style variation (e.g., Short Sleeve, Long Sleeve, Custom)
- **Color:** Fabric color
- **Size:** Individual sizes loaded
- **Quantity:** Quantity of that size
- **Total Quantity:** Calculated sum of all sizes (recalculated on stock deduction)
- **Batch Price:** Cost price per unit
- **Total Price:** Total batch value (Total Quantity × Batch Price)
- **Created By:** Audit field tracking who logged the batch
- **Description:** Optional notes

8. School Module

Purpose

The school module stores school names associated with school uniforms (e.g., Pamushana High School, Zimuto High School).

Important Rule:
School is optional.
This allows the system to manage both school uniforms and general shop items (non-school products) seamlessly.

Examples:
- White shirt → no school (general)
- Pamushana blazer → linked to school

9. Product Module

Purpose

Products represent sellable items on the shop shelf.
All products must draw their stock from raw warehouse batches.

Product Creation Rules:
The user cannot freely type type, variant, or color. Instead, they choose an existing warehouse batch, and those fields are copied over automatically to ensure data consistency.

10. Dynamic Dependent Dropdown Logic

The product form utilizes dependent dropdown cascades:
1. **Select Type:** Loads available batch types.
2. **Select Variant:** Filters variants available for that type.
3. **Select Color:** Filters colors available for that type + variant.
4. **Select Batch:** Displays the specific batch matching these criteria.
5. **Select Sizes:** The system displays the available quantities in the warehouse for each size and validates that the requested quantity is within stock limits.

11. Inventory Deduction Logic

When a product is created:
1. Warehouse batch size stock is checked and validated.
2. Stock is deducted from the selected warehouse batch sizes.
3. Remaining warehouse stock is updated.
4. The product is created with its own set of sizes, now available on the shelf.

12. Order & Customer Module

Purpose

Handles client transactions with a dual-path fulfillment flow.

Dual-Path Order Processing:
- **Ready-Made (Product / Batch):** Sourced from shelf stock (Product) or directly from warehouse raw stock (Batch). Selling prices are snapshot-copied, and stock is deducted immediately.
- **Custom-Made:** Intended for garments that require custom sewing. Cashiers type details manually and record **measurements**. No stock is deducted, and the order goes directly into `IN_PRODUCTION`.

Financial Computations:
- **Total Amount:** Computed as the sum of all order items.
- **Paid Amount:** User-entered deposit.
- **Balance:** Total Amount − Paid Amount.
- **Fully Paid:** Automatically set to true if Balance is zero.
- **Order Status:** Derived automatically (if any custom-made item is present, status starts as `IN_PRODUCTION`, otherwise `PENDING` waiting for collection).

13. Measurements & Tailoring Module

Purpose

Tracks custom-tailored orders and production queues.

Fulfillment Pipeline:
- Orders containing custom items are listed on the **Tailoring Board** with `IN_PRODUCTION` status.
- Tailors can inspect the detailed measurements (CHEST, WAIST, SHOULDER, SLEEVE, etc.) recorded for each line item.
- Once completed, tailors mark the order as `READY_FOR_COLLECTION`. This updates the status and auto-sets the collection date to the current date.

14. Analytics Dashboard

A modern SaaS dashboard provides:
- **Hero Stats:** Total Revenue, Outstanding Balance (Hero level, prominent layout).
- **Secondary Stats:** Profit, Loss, Orders Count, Products Count, Active Production items.
- **Trend Charts:** 12-week natural line chart showing orders over time.
- **Status & Type Visuals:** Status donut chart (thin ring design with center value), Stock by Type horizontal progress bars, Revenue collected vs outstanding bar.
- **Operational Panels:** Low Stock warnings and Upcoming Collections alert board.

15. Admin & User Hub

Includes full user management controls:
- Promotes/demotes user roles (USER, MANAGER, ADMIN) using standard security controls.
- Safe user deletion with confirmation modals.
- **User Activity Audit:** Allows administrators to select any user and view their full history of created batches, products, and orders.

16. Security & Profile

- JWT-based authentication with standard stateless security filters.
- **Profile Page:** Merged settings into a clean layout enabling profile info updates (name, email, phone with uniqueness checks) and secure password resets directly without current password barriers.

17. Current Development Status

Phase 1 — School Management (Completed)
Phase 2 — Warehouse Inventory (Completed)
Phase 3 — Product Management & Stock Allocation (Completed)
Phase 4 — Authentication & Security (Completed)
Phase 5 — Orders, Customers & Financials (Completed)
Phase 6 — Measurements, Custom Tailoring & Boards (Completed)
Phase 7 — Admin Dashboard & User Activity Audits (Completed)
Phase 8 — Profile Updates & Password Resets (Completed)
