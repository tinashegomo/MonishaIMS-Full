# Project Brief — Monisha Inventory Management System

## What This Is

A full-stack web application for **Monisha**, a school-uniform shop, to manage their inventory, customers, schools they supply, orders, and bespoke-tailoring jobs in one place. The system replaces manual/spreadsheet workflows with a single source of truth for stock and order status.

## Business Context

- **Domain:** Retail (school uniforms) + light manufacturing (custom-tailored garments).
- **Customer base:** Walk-in retail customers **and** bulk school orders (where the shop supplies an entire school).
- **Inventory model:** "Batches" — every uniform item belongs to a **batch** that has a type (e.g. "Shirt"), a variant (e.g. "Short Sleeve"), a color, and a set of sizes with quantities. This is the shop's stockkeeping unit. Products are created from batches and represent sellable stock.
- **Two product flows:**
  1. **Ready-made** — items are pulled from existing batch stock and sold (or assigned to a school order). Stock is deducted at two levels: batch→product creation deducts from batch, order→product sale deducts from product.
  2. **Custom-made** — items are sewn to a customer's measurements; the cashier sets a price, no inventory is deducted at sale time.
- **Pricing rule:** All item prices are **per item**. Total order value is `sum(items[].quantity * items[].unitPrice)`.
- **Stock rule:** A sale of ready-made items **must reduce batch size quantities** atomically when the order is placed. Insufficient stock rejects the order.

## Goals

1. **Single source of truth for stock** — every batch has a current count per size; no other place in the system stores the count.
2. **Fast order capture** — staff can create an order quickly with customer + items + measurements if custom.
3. **Traceable orders** — every order has a unique human-readable order number (e.g. `ORD-1716123456789-3f2a`), a status, and a full history of items with snapshot fields.
4. **Role-based access** — `ADMIN`, `MANAGER`, `USER` roles exist; auth is JWT-based. Currently no `@PreAuthorize` enforcement yet.
5. **Mobile-friendly UI** — staff often use tablets at the counter; layout must be responsive.

## Non-Goals (for v1)

- Payments processing (orders track amounts but no payment gateway).
- Customer self-service portal.
- Multi-warehouse / multi-location stock (single shop assumed).
- Reporting/analytics dashboards.

## Core Modules

| Module | Backend | Frontend |
|---|---|---|
| Auth (register, login) | ✓ complete | ✓ Login + Register pages (react-hook-form, yup) |
| Users (role management) | ✓ complete | ✗ sidebar/header hardcoded to "Tinashe Gomo" / ADMIN |
| Schools (CRUD) | ✓ complete (name only) | ✗ placeholder |
| Customers (CRUD) | ✓ complete (name, phone, altPhone, address) | ✗ placeholder |
| Warehouse / Batches (CRUD) | ✓ complete (batchName, type, variant, color, batchPrice, nested sizes) | ✗ placeholder |
| Products (CRUD) | ✓ complete (linked to batch + school, nested sizes) | ✗ placeholder |
| Orders (CRUD + status transitions) | ✓ complete (orderNumber, paidAmount, balance, measurements, items) | ✗ placeholder |
| Tailoring / Measurements | ✓ complete (entity + service, linked to order items) | ✗ placeholder |
| Dashboard | n/a | ✗ placeholder |
| Settings / Profile | n/a | ✗ placeholder |

## Why Warehouse Is the Source of Truth

The data model is designed so that **`WarehouseBatch` + `WarehouseBatchSize` represent current physical stock**, and **`Product` is sellable stock drawn from a batch**. When an order is placed:

1. Validates stock exists in the product's size.
2. Decrements `ProductSize.quantity` (and propagates to `Product.totalQuantity`).
3. Snapshots `type`, `variant`, `color`, and `unitPrice` into `OrderItem` so historical orders remain valid even if the batch is later restocked or repriced.
4. The batch-level stock is deducted when the product is created, not when the order is placed.

## User Roles

- `ADMIN` — full access, including user management.
- `MANAGER` — operational access; can manage schools, customers, batches, products, orders.
- `USER` — front-counter staff; can create orders and view inventory.

**Note:** Role-based endpoint authorization is declared in `SecurityConfig` but `@EnableMethodSecurity` is enabled. Role-based `@PreAuthorize` annotations on individual methods are NOT yet implemented — any authenticated user can hit any endpoint.

## Default Admin

`DataSeeder` creates: `tinashegomo96@gmail.com` / password `Tinashe@123` with `ADMIN` role on first boot.

## Documentation

- `documentation/project_documentation.md` — original requirements (background only).
- `documentation/backend_documentation.md` — architecture reference by Tinashe Gomo.

**Source of truth = Java code.** DTO field names, request/response shapes, and behavior are defined in `dto/`, `entity/`, `service/`, and `controller/` packages.
