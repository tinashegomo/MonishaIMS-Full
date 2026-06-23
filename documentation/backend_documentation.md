Monisha Inventory Management System
Backend Architecture & Developer Documentation

Spring Boot 3.5.14 · Java 21 · JWT Security · MapStruct · Lombok

Written by Tinashe Gomo

This document explains every layer of the backend — why it is structured the way it is, how every class connects, and how operations flow through the system.

1. Project Overview and Purpose

The Monisha Inventory Management System replaces a manual notebook-based uniform shop system. The old system had no way of tracking how much stock was left, which size combinations were still available, or how much a customer had paid versus how much they still owed. Staff made mistakes because there was nothing to enforce rules.

The new system enforces strict rules at every level:
- It tracks warehouse stock down to individual size quantities.
- It prevents invalid stock combinations.
- It automatically calculates financials, balances, and payment statuses.
- It records measurements for custom-tailored items.
- It supports role-based user management (USER, MANAGER, ADMIN), audit logs, and profile security.

1.1 The Single Most Important Business Rule: The Warehouse is the Source of Truth

Everything in this system must originate from warehouse stock. You cannot create a product unless it draws from a warehouse batch. You cannot process a ready-made order unless stock exists. The backend enforces this at every level — the frontend cannot bypass it.

1.2 Technology Stack

- **Backend Framework:** Spring Boot 3.5.14 with Java 21 — industry standard for enterprise Java APIs.
- **Database:** PostgreSQL/MySQL (and H2 for lightweight local testing) with JPA + Hibernate.
- **Object Mapping:** MapStruct — compile-time code generation for converting between Entity and DTO safely.
- **Boilerplate Reduction:** Lombok (@Getter, @Setter, @NoArgsConstructor, @RequiredArgsConstructor).
- **Security:** Spring Security with JWT (JSON Web Tokens) — stateless authentication.

---

2. Backend Architecture — How The Layers Work

The backend is structured in clearly separated layers adhering to the principle of Separation of Concerns.

2.1 The Layers Explained

- **Layer 1 — Controller (Entry Point):** Receives HTTP requests, maps them to Request DTOs, validates them using `@Valid`, calls the appropriate Service method, and wraps results in a `ResponseEntity`. There is zero business logic in controllers.
- **Layer 2 — Service (Business Logic):** Enforces business rules (calculating totals, validating payments, deducting stock, setting status, copying inventory snapshots). Services coordinate between multiple repositories and helper services. They are annotated `@Service` and managed as singletons.
- **Layer 3 — Repository (Database Access):** Spring Data JPA interfaces extending `JpaRepository`. They generate SQL automatically from method names (e.g. `findByOrderStatus`).
- **Layer 4 — Entity (Database Table Mapping):** Java classes mapped to database tables via JPA annotations (`@Entity`, `@Table`). Primary keys use random UUIDs for security.
- **Layer 5 — DTO (Data Transfer Objects):** The contract between frontend and backend. Separated into Request DTOs (incoming validated data) and Response DTOs (outgoing flattened data, preventing exposure of sensitive database fields).
- **Layer 6 — Mapper (Entity ↔ DTO Conversion):** MapStruct compile-time mappers converting between entities and DTOs efficiently.

2.2 The Request Journey — Step By Step

1. React sends HTTP request with JWT token in `Authorization` header.
2. Spring Security's `AuthFilter` intercepts the request, extracts the JWT, and validates it.
3. If valid, `SecurityContextHolder` is populated with the user's identity and roles.
4. Request reaches the mapped `Controller` method (validated by `@Valid`).
5. Controller calls the `Service` method with the Request DTO.
6. Service executes business logic under `@Transactional` boundaries.
7. Service queries `Repositories` to read or write database entities.
8. Service uses `Mapper` to convert Entity → Response DTO.
9. Controller wraps the Response DTO in a `ResponseEntity` and returns it as JSON.

2.3 Package Structure

```
com.tinasheGomo.MonishaInventoryManagementSystem
├── controller
│   ├── auth          ← AuthController (register, login)
│   ├── customer      ← CustomerController
│   ├── order         ← OrderController
│   ├── school        ← SchoolController
│   ├── user          ← UserController (users, profile, roles, activity)
│   └── warehouse     ← WarehouseBatchController
├── dto
│   ├── auth          ← Auth DTOs
│   ├── customer      ← Customer DTOs
│   ├── measurement   ← Measurement DTOs
│   ├── order         ← Order, OrderItem DTOs
│   ├── product       ← Product DTOs
│   ├── user          ← User, UserActivity DTOs
│   └── warehouse     ← WarehouseBatch DTOs
├── entity
│   ├── customer      ← CustomerEntity
│   ├── measurement   ← MeasurementEntity
│   ├── order         ← OrderEntity, OrderItemEntity
│   ├── product       ← ProductEntity, ProductSizeEntity
│   ├── school        ← SchoolEntity
│   ├── user          ← UserEntity
│   └── warehouse     ← WarehouseBatchEntity, WarehouseBatchSizeEntity
├── enums             ← OrderStatus, UserRole
├── exception         ← Custom exceptions (NotFoundException, DuplicateException, GlobalExceptionHandler)
├── mapper            ← MapStruct mappers
├── repository        ← JpaRepository interfaces
├── security          ← Security configuration, AuthFilter, AuthUser, JWTUtils, SecurityUtils, CorsConfig
└── service           ← All business logic classes
```

---

3. DTOs — Data Transfer Objects

Request DTOs carry validation annotations like `@NotBlank`, `@NotNull`, and `@Min`. Response DTOs flatten relationships and omit sensitive information (like passwords) before returning data.

3.1 Request DTOs
- **CustomerRequestDTO:** Simple payload containing `customerName` and `phoneNumber`.
- **OrderItemRequestDTO:** Supports three modes: Ready-made from Product, Ready-made from Batch, and Custom-made (which includes manual specifications and measurements).

3.2 Response DTOs
- **OrderResponseDTO:** Flat representation of an order including computed financials (`totalAmount`, `balance`, `fullyPaid`), helper flags, status, and nested `orderItems`.
- **UserActivityDTO:** Admin-level audit DTO delivering a user's details along with lists of the 10 most recent orders, products, and batches created by them.

---

4. Entities and Database Tables

Primary keys use UUIDs (`@GeneratedValue(strategy = GenerationType.UUID)`) for security and decentralized generation. Timestamps are managed automatically via `@PrePersist` and `@PreUpdate` hooks.

4.1 Complete Database Table Reference

### `user_entity`
- `user_id` (UUID, Primary Key)
- `user_name` (VARCHAR, Unique, Not Null)
- `user_email` (VARCHAR, Unique, Not Null)
- `user_password` (VARCHAR, Hashed, Not Null)
- `user_phone_number` (VARCHAR)
- `user_role` (VARCHAR, Not Null) — USER, MANAGER, ADMIN
- `created_at`, `updated_at` (DATETIME)

### `school_entity`
- `school_id` (UUID, Primary Key)
- `school_name` (VARCHAR, Unique, Not Null)
- `created_at`, `updated_at` (DATETIME)

### `warehouse_batch_entity`
- `batch_id` (UUID, Primary Key)
- `batch_name` (VARCHAR, Unique, Not Null)
- `type`, `variant`, `color` (VARCHAR, Not Null)
- `batch_price`, `total_quantity`, `total_price` (INT, Not Null)
- `description` (VARCHAR)
- `created_by` (VARCHAR) — tracks creator username
- `created_at`, `updated_at` (DATETIME)

### `warehouse_batch_size_entity` (Child of Batch)
- `size_id` (UUID, Primary Key)
- `batch_id` (UUID, Foreign Key)
- `size` (VARCHAR, Not Null)
- `quantity` (INT, Not Null)
- `created_at`, `updated_at` (DATETIME)

### `product_entity`
- `product_id` (UUID, Primary Key)
- `product_name` (VARCHAR, Not Null)
- `product_price`, `total_quantity`, `total_price` (INT, Not Null)
- `type`, `variant`, `color` (VARCHAR, Not Null)
- `description` (VARCHAR)
- `batch_id` (UUID, Foreign Key)
- `school_id` (UUID, Foreign Key, Nullable)
- `created_by` (VARCHAR) — tracks creator username
- `created_at`, `updated_at` (DATETIME)

### `orders` (Note: mapped to "orders" because "order" is a reserved SQL keyword)
- `order_id` (UUID, Primary Key)
- `order_number` (VARCHAR, Unique, Not Null)
- `customer_id` (UUID, Foreign Key, Not Null)
- `school_id` (UUID, Foreign Key, Nullable)
- `total_amount`, `paid_amount`, `balance` (DECIMAL, Not Null)
- `fully_paid`, `has_measurements`, `school_order` (BOOLEAN, Not Null)
- `order_status` (VARCHAR, Not Null) — PENDING, IN_PRODUCTION, READY_FOR_COLLECTION, COMPLETED, CANCELLED
- `collection_date` (DATE, Nullable) — automatically populated when completed
- `notes` (VARCHAR)
- `created_by` (VARCHAR) — tracks cashier username
- `created_at`, `updated_at` (DATETIME)

### `order_item_entity`
- `order_item_id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key, Not Null)
- `product_id` (UUID, Foreign Key, Nullable)
- `batch_id` (UUID, Foreign Key, Nullable)
- `type`, `variant`, `color` (VARCHAR, Not Null)
- `size` (VARCHAR, Nullable)
- `quantity` (INT, Not Null)
- `unit_price`, `total_price` (DECIMAL, Not Null)
- `custom_made`, `measurements_taken` (BOOLEAN, Not Null)
- `created_at`, `updated_at` (DATETIME)

### `measurement_entity`
- `measurement_id` (UUID, Primary Key)
- `order_item_id` (UUID, Foreign Key, Not Null)
- `measurement_name` (VARCHAR, Not Null)
- `measurement_value` (DECIMAL, Not Null)
- `created_at`, `updated_at` (DATETIME)

---

5. Mappers — MapStruct Configurations

Compile-time safe object mappers are defined as interfaces. MapStruct copies matching properties automatically. Fields managed exclusively by services (such as generated codes, derived fields, or computed financial metrics) are ignored explicitly during entity creation using `@Mapping(target = "fieldName", ignore = true)`.

---

6. Custom Repositories & `@EntityGraph`

Spring Data JPA derived methods are named descriptively to auto-generate queries:
- `existsByBatchName(String name)`
- `findByBatch_BatchIdAndSize(UUID batchId, String size)` (used in granular stock deduction)

### N+1 Query Prevention
To avoid executing multiple queries when reading child collections, `@EntityGraph` forces an eager `LEFT JOIN` on critical endpoints:
```java
@EntityGraph(attributePaths = {"batchSizes"})
Optional<WarehouseBatchEntity> findByBatchId(UUID batchId);
```

---

7. Services & Business Logic

7.1 Refactored Bulk Order Item Processing

During order creation, the loop logic for order item assembly has been refactored out of `OrderService` into a specialized, transaction-safe method inside `OrderItemService`:

```java
// Inside OrderService.createOrder()
List<OrderItemEntity> items = orderItemService.addOrderItemsToOrder(savedOrder, dto.getOrderItems());
```

And in `OrderItemService.java`:
```java
@Transactional
public List<OrderItemEntity> addOrderItemsToOrder(OrderEntity order, List<OrderItemRequestDTO> dtos) {
    List<OrderItemEntity> items = new ArrayList<>();
    for (OrderItemRequestDTO dto : dtos) {
        OrderItemEntity item = orderItemMapper.toEntity(dto);
        item.setOrder(order);

        // Resolve item source: Product, Batch, or Custom Made
        if (dto.getProductId() != null) {
            // Ready-made product flow: deduct stock, copy snapshots
        } else if (dto.getBatchId() != null) {
            // Ready-made batch flow: deduct stock, copy snapshots
        } else {
            // Custom-made tailoring flow
        }
        
        // Calculate totals, save item, create measurements, and collect
        items.add(savedItem);
    }
    return items;
}
```

7.2 Audit Logs & Tracking
Whenever products, batches, or orders are created, the backend calls `SecurityUtils.getCurrentUser().getUser().getUserName()` and commits it to the `createdBy` database column. This guarantees complete accountability.

---

8. Complete API Reference

All requests route through `/api/monishaInventory`.

### Authentication
- `POST /auth/register` — Create new account (Public)
- `POST /auth/login` — Sign in and receive JWT (Public)

### Users & Administration
- `GET /user/get-current-user` — Get logged-in user profile details (Auth)
- `GET /user/get-current-user-role` — Get logged-in user role (Auth)
- `GET /user/get-all-users` — Get all users list (Auth, ADMIN only)
- `GET /user/get-user-byId/{id}` — Get single user info (Auth, ADMIN only)
- `DELETE /user/delete-user/{id}` — Delete a user with safety constraints (Auth, ADMIN only)
- `PUT /user/update-user-role/{userId}?userRole=...` — Modify user role permissions (Auth, ADMIN only)
- `PATCH /user/change-password?newPassword=...` — Secure password reset bypassing current password barriers (Auth)
- `PATCH /user/update-user/{id}` — Edit user details (name, email, phone) with uniqueness validation (Auth)
- `GET /user/get-user-activity/{id}` — Complete user action audits and historic activity logs (Auth, ADMIN only)

### Warehouse
- `POST /warehouse/create-batch` — Log new warehouse batch (Auth)
- `GET /warehouse/get-all-batches` — List all batches with size summaries (Auth)
- `GET /warehouse/get-batch-by-id/{batchId}` — Fetch batch details and related products eagerly (Auth)
- `DELETE /warehouse/delete-batch-by-id/{batchId}` — Delete batch and cascade delete sizes (Auth)

### Products
- `POST /product/create-product` — Create sellable product drawing stock from batch (Auth)
- `GET /product/get-all-products` — Get sellable catalog list (Auth)
- `GET /product/get-product-by-id/{productId}` — Get product sizes, specifications, and financials (Auth)
- `DELETE /product/delete-product-by-id/{productId}` — Remove product and cascade delete product size rows (Auth)

### Orders & Customers
- `POST /order/create-order` — Process ready-made sales and custom tailoring items atomic-style (Auth)
- `GET /order/get-all-orders` — View order lists (Auth)
- `GET /order/get-order-by-id/{orderId}` — Complete order snapshot detail, notes, and metrics (Auth)
- `GET /order/get-orders-by-status/{status}` — Filter order list by lifecycle status (Auth)
- `PATCH /order/update-order-status/{orderId}?status=...` — Transition orders through lifecycles (Auth)

### Schools & Customers
- `/school/create-school`, `/school/get-all-schools`, `/school/update-school/{id}`, `/school/delete-school/{id}`
- `/customer/get-all-customers`, `/customer/create-customer`, `/customer/delete-customer/{id}`, `/customer/update-customer/{id}`

---

## 9. Security & CORS Configuration

- **Stateless Authorization:** Authenticated via standard stateless JWT Bearer token in the `Authorization` header.
- **CORS Config:** Custom `CorsConfig` is registered inside Spring Boot to allow connection requests from:
  - `http://localhost:5173` (Local dev)
  - `http://localhost:3000` (Local dev CRA)
  - `https://monisha-ims.vercel.app` (Production Vercel frontend)
