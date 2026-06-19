Monisha Inventory

Management System

Backend Architecture & Developer Documentation

Spring Boot 3.5 · Java 21 · MySQL · JWT Security · MapStruct

Written by Tinashe Gomo

This document explains every layer of the backend I built — why I structured it the way I did,

how every class connects, and how real-world operations flow through the system.

1. Project Overview and Purpose

I built Monisha Inventory Management System to replace a manual notebook-based uniform shop system. The old system had no way of tracking how much stock was left, which size combinations were still available, or how much a customer had paid versus how much they still owed. Staff made mistakes because there was nothing to enforce rules — they could write anything in the book.

The new system enforces strict rules at every level. It tracks warehouse stock all the way down to individual size quantities. It prevents invalid stock combinations. It automatically calculates totals. It records measurements for custom-tailored items. It tracks payments and balances. And it is built to grow — future modules for receipts, SMS notifications, and barcode scanning can be added on top of this foundation.

1.1 The Single Most Important Business Rule

THE WAREHOUSE IS THE SOURCE OF TRUTH

Everything in this system must originate from warehouse stock. You cannot create a product unless

it draws from a warehouse batch. You cannot process a ready-made order unless stock exists. The

backend enforces this at every level — the frontend cannot bypass it.

This rule exists because without it, the shop could sell stock that does not physically exist,

leading to overpromising to customers and embarrassing situations when items cannot be found.

1.2 Technology Stack

Backend Framework

Spring Boot 3.5.14 with Java 21 — industry standard for enterprise Java APIs

Database

MySQL — relational database, stores all persistent data with strict relationships

ORM Layer

Spring Data JPA + Hibernate — maps Java classes to database tables automatically

Object Mapping

MapStruct — compile-time code generation for converting between Entity and DTO

Boilerplate Reduction

Lombok — auto-generates getters, setters, constructors so I do not repeat myself

Security

Spring Security with JWT (JSON Web Tokens) — stateless authentication

Frontend

React.js with Axios, React Hook Form, Tailwind CSS

2. Backend Architecture — How The Layers Work

I structured the backend in clearly separated layers. Each layer has exactly one responsibility and should never reach into another layer's territory. This is called Separation of Concerns — one of the most important principles in software engineering. When each layer only does its own job, the codebase is easier to understand, easier to test, and easier to change.

Here is what each layer does and why I built it that way:

2.1 The Layers Explained

Layer 1 — Controller (Entry Point)

The controller is the front door of the backend. When the React frontend makes an HTTP request, the controller receives it. The controller's only job is to receive the request, hand it to the service, and return whatever the service gives back as a JSON response. I deliberately keep zero business logic in controllers. If I put logic there, it becomes harder to test and harder to reuse.

Example: OrderController receives POST /api/monishaInventory/order. It reads the request body into an OrderRequestDTO, calls orderService.createOrder(dto), and wraps the result in a ResponseEntity with HTTP 201 CREATED. That is all it does.

Layer 2 — Service (Business Logic)

The service is where all the important work happens. I put every business rule here: validate that paid amount does not exceed total, calculate totals from items, decide the order status based on whether items are custom-made, copy inventory snapshots into order items. Services coordinate between multiple repositories and other services. They are annotated @Service so Spring manages them as singleton beans.

I also chose to separate services where it made sense. OrderItemService and MeasurementService are internal helpers that only OrderService calls — they do not have controllers. This keeps the API surface clean and prevents the frontend from calling half-completed operations.

Layer 3 — Repository (Database Access)

Repositories are Spring Data JPA interfaces that extend JpaRepository. I never write SQL directly. Instead, I write method names following Spring Data's naming convention and it generates the SQL automatically. For example, findByOrderStatus(OrderStatus status) generates SELECT \* FROM orders WHERE order_status = ?. I use repositories only inside services — never in controllers.

Layer 4 — Entity (Database Table Mapping)

Each Entity class maps to one database table. When Spring Boot starts, Hibernate reads my entity classes and creates or updates the tables in MySQL automatically. The fields become columns, the annotations define constraints, and the relationship annotations (@ManyToOne, @OneToMany) become foreign keys.

Layer 5 — DTO (Data Transfer Objects)

DTOs are the interface between the frontend and backend. I use two types: Request DTOs (what the frontend sends me) and Response DTOs (what I send back). This separation is critical because I never expose my Entity classes directly to the frontend — entities contain sensitive data, generated fields, and relationships that should not be in the API response.

Layer 6 — Mapper (Entity ↔ DTO Conversion)

MapStruct mappers convert between entities and DTOs. I define an interface with method signatures, and MapStruct generates the implementation at compile time. This is faster than reflection-based mappers (like ModelMapper) and catches mismatches at compile time rather than at runtime.

2.2 The Request Journey — Step By Step

Every HTTP request from the React frontend travels through this exact path:

React sends HTTP request with JWT token in Authorization header

Spring Security's AuthFilter intercepts every request before it reaches any controller

AuthFilter extracts and validates the JWT token

If valid: SecurityContextHolder is populated with the user's identity and roles

Request reaches the correct Controller method

Controller validates the request body using @Valid (Bean Validation)

Controller calls the Service method with the Request DTO

Service executes all business logic — validates, calculates, coordinates

Service calls Repositories to read or write to MySQL

Repository returns Entity objects to the Service

Service uses Mapper to convert Entity → Response DTO

Service returns Response DTO to Controller

Controller wraps it in ResponseEntity and sends it back as JSON

2.3 Package Structure

com.tinasheGomo.MonishaInventoryManagementSystem

├── controller

│ ├── auth ← AuthController (register, login)

│ ├── customer ← CustomerController

│ ├── order ← OrderController

│ ├── user ← UserController

│ ├── school ← SchoolController

│ └── warehouse ← WarehouseBatchController

├── dto

│ ├── auth ← AuthRequestDTO, AuthResponseDTO

│ ├── customer ← CustomerRequestDTO, CustomerResponseDTO

│ ├── measurement ← MeasurementRequestDTO, MeasurementResponseDTO

│ ├── order ← OrderRequestDTO, OrderResponseDTO,

│ │ OrderItemRequestDTO, OrderItemResponseDTO

│ ├── product ← ProductRequestDTO, ProductResponseDTO, etc.

│ ├── user ← UserRequestDTO, UserResponseDTO

│ └── warehouse ← WarehouseBatchRequestDTO, WarehouseBatchResponseDTO, etc.

├── entity

│ ├── customer ← CustomerEntity

│ ├── measurement ← MeasurementEntity

│ ├── order ← OrderEntity, OrderItemEntity

│ ├── product ← ProductEntity, ProductSizeEntity

│ ├── school ← SchoolEntity

│ ├── user ← UserEntity

│ └── warehouse ← WarehouseBatchEntity, WarehouseBatchSizeEntity

├── enums ← OrderStatus, UserRole

├── exception ← NotFoundException, DuplicateException, GlobalExceptionHandler

├── mapper ← MapStruct interfaces (one per entity)

├── repository ← Spring Data JPA interfaces

├── security ← AuthFilter, AuthUser, JWTUtils, SecurityConfig,

│ CustomUserDetailsService, CorsConfig, SecurityUtils

└── service ← All business logic

3. DTOs — Data Transfer Objects

A DTO (Data Transfer Object) is a simple Java class whose only purpose is to carry data between the frontend and the backend. It has no business logic, no database annotations, no relationships — just fields with getters and setters (provided by @Getter @Setter from Lombok).

I use two types of DTOs for almost every feature: Request DTOs and Response DTOs. Understanding why I separate them is fundamental to understanding the entire backend design.

3.1 Why I Use DTOs Instead of Exposing Entities Directly

Security

My UserEntity has a userPassword field containing a BCrypt hash. If I returned the entity

directly as a JSON response, every API call would expose the password hash to the frontend.

With a UserResponseDTO, I simply do not include the password field — it never leaves the server.

Control Over Input

My WarehouseBatchEntity has totalQuantity and totalPrice fields. These are calculated by

the backend — the frontend should never send them. By using a WarehouseBatchRequestDTO

that does not include those fields, it is physically impossible for the frontend to set them.

The backend always calculates them correctly.

Validation

Request DTOs carry validation annotations like @NotBlank, @NotNull, @Min. When the

controller receives a request, @Valid triggers these checks before the service is even called.

Invalid data is rejected immediately with a clear error message.

3.2 Request DTOs — What The Frontend Sends

CustomerRequestDTO

The frontend only needs to send the customer's name. Everything else is generated by the backend.

// Frontend sends this JSON:

{ "customerName": "Tendai Moyo" }

// CustomerRequestDTO.java:

@NotBlank(message = "Customer name is required")

@Size(min = 2, max = 100)

private String customerName;

OrderItemRequestDTO — Three Modes

I structured this DTO carefully to support three different types of order items. The key insight is that for ready-made items, most fields come from inventory — the frontend only needs to send the ID, size, and quantity. Only custom-made items need type, variant, color, and price from the frontend.

// MODE 1 — Ready-made from product (frontend sends ONLY these 3 fields):

{

"productId": "abc-123-uuid",

"size": "32",

"quantity": 2

}

// MODE 2 — Ready-made from batch (frontend sends ONLY these 3 fields):

{

"batchId": "xyz-456-uuid",

"size": "32",

"quantity": 2

}

// MODE 3 — Custom-made (frontend sends all details because no inventory exists):

{

"type": "Blazer",

"variant": "Custom",

"color": "Navy",

"unitPrice": 85.00,

"quantity": 1,

"customMade": true,

"measurementsTaken": true,

"measurements": [

    { "measurementType": "CHEST", "value": 92.5, "unit": "cm" },

    { "measurementType": "SHOULDER", "value": 44.0, "unit": "cm" }

]

}

3.3 Response DTOs — What The Backend Returns

Response DTOs contain all the information the frontend needs, including fields the backend generated or calculated. They also flatten nested relationships so the frontend gets clean data without needing to navigate nested objects.

Example: OrderResponseDTO includes customerName and schoolName as flat string fields. The frontend does not need to know about the customer and school relationships — it just needs the names for display.

// What the backend returns after creating an order:

{

"orderId": "uuid-here",

"orderNumber": "ORD-1716123456-3f2a",

"customerId": "uuid-of-customer",

"customerName": "Tendai Moyo",

"schoolId": "uuid-of-school",

"schoolName": "Zimuto High School",

"totalAmount": 125.00,

"paidAmount": 40.00,

"balance": 85.00,

"fullyPaid": false,

"hasMeasurements": true,

"schoolOrder": true,

"orderStatus": "IN_PRODUCTION",

"orderItems": [ ... ],

"createdAt": "2024-01-15T10:30:00"

}

// Notice: totalAmount, balance, fullyPaid, hasMeasurements, schoolOrder, orderStatus

// were NEVER sent by the frontend. The backend calculated and derived all of them.

4. Entities and Database Tables

An Entity is a Java class annotated with @Entity. Hibernate reads these classes when Spring Boot starts and automatically creates the corresponding MySQL tables. Each field becomes a column, each annotation becomes a constraint, and each relationship annotation becomes a foreign key.

I annotate every entity with @Getter, @Setter, and @NoArgsConstructor from Lombok. This auto-generates all the getters, setters, and a no-argument constructor without me writing repetitive code. For fields like the primary key and createdAt, I add @Setter(AccessLevel.NONE) to prevent any code from accidentally overriding them — the database generates the ID and @PrePersist sets the timestamps.

4.1 Why I Use UUIDs Instead of Auto-Increment IDs

UUID vs Auto-Increment Integer

I use @GeneratedValue(strategy = GenerationType.UUID) for all primary keys. Auto-increment

integers (1, 2, 3...) are predictable — someone could guess that /order/4 exists after

seeing /order/3. UUIDs are random strings like 3f2a-1b4c-... — impossible to guess.

They are also safe to generate across multiple database servers without conflicts,

which matters if the system ever scales.

4.2 @PrePersist and @PreUpdate — Automatic Timestamps

Rather than setting createdAt and updatedAt manually in every service method, I use JPA lifecycle callbacks on every entity. @PrePersist runs automatically just before the first INSERT, and @PreUpdate runs automatically before every UPDATE.

@PrePersist

public void onCreate() {

    this.createdAt = LocalDateTime.now();

    this.updatedAt = LocalDateTime.now();

}

@PreUpdate

public void onUpdate() {

    this.updatedAt = LocalDateTime.now();

}

// I also lock createdAt so it can never be changed after insert:

@Column(nullable = false, updatable = false) // updatable=false prevents JPA from

@Setter(AccessLevel.NONE) // ever including this in an UPDATE query

private LocalDateTime createdAt;

4.3 CascadeType.ALL and orphanRemoval

On my @OneToMany relationships (Batch → BatchSizes, Product → ProductSizes, Order → OrderItems), I use CascadeType.ALL and orphanRemoval = true. Here is what each one does:

CascadeType.ALL means any operation on the parent cascades to children. When I save a Batch, all its BatchSizes are saved too. When I delete a Batch, all its BatchSizes are deleted too. I do not need to call save() or delete() on children separately.

orphanRemoval = true means if I remove a child from the parent's collection (e.g. batch.getBatchSizes().clear()), Hibernate automatically deletes those rows from the database. Without this, the rows would remain in the database disconnected from any parent — orphans.

4.4 FetchType.LAZY — Why I Avoid Eager Loading

On my @ManyToOne relationships (e.g. OrderItemEntity → ProductEntity), I use FetchType.LAZY. This tells Hibernate: do not load the related entity from the database until I actually access it. The alternative, FetchType.EAGER, loads everything immediately — even when I do not need it.

Example: if I load an OrderEntity and it eagerly loads its OrderItems, and each OrderItem eagerly loads its Product, and each Product eagerly loads its Batch, and the Batch eagerly loads all its BatchSizes — one simple query for an order could generate dozens of SQL queries. LAZY loading prevents this.

4.5 The @Table(name = "orders") Annotation

Reserved SQL Keyword

ORDER is a reserved keyword in SQL (it is used in ORDER BY queries). If I name my

table 'order', MySQL would reject the SQL that Hibernate generates. I add

@Table(name = "orders") on OrderEntity to tell Hibernate to use 'orders' as the

table name instead of deriving it from the class name.

4.6 All Database Tables

user_entity

Column

Type

Constraints

Purpose

user_id

UUID

PRIMARY KEY

Auto-generated unique identifier

user_name

VARCHAR

NOT NULL, UNIQUE

Login username

user_email

VARCHAR

NOT NULL, UNIQUE

Used as JWT subject (identity)

user_password

VARCHAR

NOT NULL

BCrypt hashed — never plain text

user_role

VARCHAR

NOT NULL

ADMIN, STAFF, or VIEWER

created_at

DATETIME

NOT NULL, not updatable

Set once on first insert

updated_at

DATETIME

NOT NULL

Refreshed on every update

school_entity

Column

Type

Constraints

Purpose

school_id

UUID

PRIMARY KEY

Auto-generated unique identifier

school_name

VARCHAR

NOT NULL, UNIQUE

e.g. Zimuto High School

created_at

DATETIME

NOT NULL

Set once on first insert

updated_at

DATETIME

NOT NULL

Refreshed on update

warehouse_batch_entity

Column

Type

Constraints

Purpose

batch_id

UUID

PRIMARY KEY

Auto-generated unique identifier

batch_name

VARCHAR

NOT NULL, UNIQUE

e.g. Shirts Batch 01

type

VARCHAR

NOT NULL

Product category e.g. Shirt

variant

VARCHAR

NOT NULL

e.g. Short Sleeve, Long Sleeve

color

VARCHAR

NOT NULL

e.g. White, Navy, Sky Blue

batch_price

INT

NOT NULL

Cost price per unit

total_quantity

INT

NOT NULL

Sum of all sizes — backend calculates

total_price

INT

NOT NULL

total_quantity x batch_price — backend calculates

description

VARCHAR(1000)

NULLABLE

Optional notes

created_at

DATETIME

NOT NULL

Set once on insert

updated_at

DATETIME

NOT NULL

Refreshed on update

warehouse_batch_size_entity

This is a child of warehouse_batch_entity. One batch can have many sizes. The batch_id column is a foreign key pointing to the parent batch.

Column

Type

Constraints

Purpose

size_id

UUID

PRIMARY KEY

Auto-generated unique identifier

batch_id

UUID

FK → warehouse_batch_entity

Which batch this size belongs to

size

VARCHAR

NOT NULL

e.g. 30, 32, 34, XL

quantity

INT

NOT NULL

Available units of this size

created_at

DATETIME

NOT NULL

Set once on insert

updated_at

DATETIME

NOT NULL

Refreshed on update

Example rows after creating Shirts Batch 01 with 3 sizes:

size_id

batch_id (FK)

size

quantity

uuid-a

uuid-shirts-batch-01

30

80

uuid-b

uuid-shirts-batch-01

32

70

uuid-c

uuid-shirts-batch-01

34

50

The parent batch row would show: total_quantity = 200, total_price = 3000 (if batch_price = 15)

product_entity

Column

Type

Constraints

Purpose

product_id

UUID

PRIMARY KEY

Auto-generated unique identifier

product_name

VARCHAR

NOT NULL

e.g. Zimuto Size 32 Shirt

product_price

INT

NOT NULL

Selling price per unit

total_quantity

INT

NOT NULL

Sum of all product sizes — backend calculates

total_price

INT

NOT NULL

total_quantity x product_price — backend calculates

type

VARCHAR

NOT NULL

Copied from batch e.g. Shirt

variant

VARCHAR

NOT NULL

Copied from batch e.g. Short Sleeve

color

VARCHAR

NOT NULL

Copied from batch e.g. White

description

VARCHAR(1000)

NULLABLE

Optional notes

batch_id

UUID

FK → warehouse_batch_entity

Source batch — stock was drawn from here

school_id

UUID

FK → school_entity, NULLABLE

Optional link to a school

created_at

DATETIME

NOT NULL

Set once on insert

updated_at

DATETIME

NOT NULL

Refreshed on update

orders (note: table name is 'orders' not 'order' — reserved SQL keyword)

Column

Type

Constraints

Purpose

order_id

UUID

PRIMARY KEY

Auto-generated unique identifier

order_number

VARCHAR

NOT NULL, UNIQUE

e.g. ORD-1716123456-3f2a — human readable

customer_id

UUID

FK → customer_entity

Who placed the order

school_id

UUID

FK → school_entity, NULLABLE

Optional school link

total_amount

DECIMAL

NOT NULL

Sum of all item totals — backend calculates

paid_amount

DECIMAL

NOT NULL

What customer paid upfront

balance

DECIMAL

NOT NULL

total_amount - paid_amount — backend calculates

fully_paid

BOOLEAN

NOT NULL

true when balance = 0 — backend derives

has_measurements

BOOLEAN

NOT NULL

true if any item has measurements — backend derives

school_order

BOOLEAN

NOT NULL

true if school_id present — backend derives

order_status

VARCHAR(ENUM)

NOT NULL

PENDING, IN_PRODUCTION, READY_FOR_COLLECTION, COMPLETED, CANCELLED

collection_date

DATE

NULLABLE

When customer will collect

notes

VARCHAR(1000)

NULLABLE

Extra instructions

created_at

DATETIME

NOT NULL

Set once on insert

updated_at

DATETIME

NOT NULL

Refreshed on update

order_item_entity

Every field in this table is either a snapshot copied from inventory (type, variant, color, unit_price) or calculated by the backend (total_price). The frontend never provides these values for ready-made items.

Column

Type

Constraints

Purpose

order_item_id

UUID

PRIMARY KEY

Auto-generated unique identifier

order_id

UUID

FK → orders

Parent order — set by service

product_id

UUID

FK → product_entity, NULLABLE

Set for product inventory orders

batch_id

UUID

FK → warehouse_batch_entity, NULLABLE

Set for batch inventory orders

type

VARCHAR

NOT NULL

Snapshot — copied from product/batch or typed for custom

variant

VARCHAR

NOT NULL

Snapshot — copied from product/batch or typed for custom

color

VARCHAR

NOT NULL

Snapshot — copied from product/batch or typed for custom

size

VARCHAR

NOT NULL

The specific size requested

quantity

INT

NOT NULL

How many units ordered

unit_price

DECIMAL

NOT NULL

Snapshot price — from inventory or typed for custom

total_price

DECIMAL

NOT NULL

unit_price x quantity — backend calculates

custom_made

BOOLEAN

NOT NULL

true = needs tailoring production

measurements_taken

BOOLEAN

NOT NULL

true = customer was measured

created_at

DATETIME

NOT NULL

Set once on insert

updated_at

DATETIME

NOT NULL

Refreshed on update

measurement_entity

Column

Type

Constraints

Purpose

measurement_id

UUID

PRIMARY KEY

Auto-generated unique identifier

order_item_id

UUID

FK → order_item_entity

Belongs to this order item — NOT the order

measurement_type

VARCHAR

NOT NULL

e.g. CHEST, SHOULDER, SLEEVE, WAIST

value

DECIMAL

NOT NULL

The measurement number e.g. 92.5

unit

VARCHAR

NOT NULL

e.g. cm or inches

created_at

DATETIME

NOT NULL

Set once on insert

updated_at

DATETIME

NOT NULL

Refreshed on update

I link measurements to order items (not orders) because one order can have multiple custom items. A custom blazer needs different measurements than custom trousers. Each item must carry its own set of measurements.

5. Mappers — Converting Between Entities and DTOs

MapStruct is a code generation library. At compile time, it reads my mapper interfaces and generates full Java implementation classes. When the application runs, Spring injects these generated classes as beans. I never write conversion code manually — MapStruct does it all.

5.1 Why I Chose MapStruct Over ModelMapper

MapStruct generates code at compile time — it is as fast as hand-written code

ModelMapper uses reflection at runtime — slower and can fail at runtime with cryptic errors

MapStruct catches mismatched field names at compile time — I see the problem before I run anything

The generated code is readable Java — I can open the generated class and see exactly what it does

5.2 How MapStruct Matches Fields

MapStruct matches fields by name. If my ProductEntity has a field called productName and my ProductResponseDTO also has a field called productName, MapStruct copies it automatically. No annotation needed. This is why I chose consistent naming across my entities and DTOs.

5.3 Handling Nested Relationships With @Mapping

When a Response DTO needs a flat field from a nested object (e.g. schoolName from school.schoolName), I use the dot notation in a @Mapping annotation:

@Mapper(componentModel = "spring")

public interface OrderMapper {

    // Flatten nested objects into response DTO fields:

    @Mapping(source = "customer.customerId",  target = "customerId")

    @Mapping(source = "customer.customerName", target = "customerName")

    @Mapping(source = "school.schoolId",   target = "schoolId")

    @Mapping(source = "school.schoolName", target = "schoolName")

    OrderResponseDTO toResponse(OrderEntity order);



    // toEntity — many fields are ignored because the SERVICE sets them:

    @Mapping(target = "customer",      ignore = true)

    @Mapping(target = "school",        ignore = true)

    @Mapping(target = "orderItems",    ignore = true)

    @Mapping(target = "totalAmount",   ignore = true)

    @Mapping(target = "paidAmount",    ignore = true)

    @Mapping(target = "balance",       ignore = true)

    @Mapping(target = "fullyPaid",     ignore = true)

    @Mapping(target = "hasMeasurements", ignore = true)

    @Mapping(target = "schoolOrder",   ignore = true)

    @Mapping(target = "orderStatus",   ignore = true)

    @Mapping(target = "orderNumber",   ignore = true)

    OrderEntity toEntity(OrderRequestDTO requestDTO);

}

5.4 Why I Ignore Fields In toEntity

The @Mapping(target = ..., ignore = true) annotations in toEntity are critical. Without them, MapStruct would try to copy those fields from the DTO — which would either set them to null (crashing the application at the NOT NULL constraint) or allow the frontend to override backend-controlled values like prices and totals.

By explicitly ignoring them in the mapper, the service becomes the only place that sets them — always from the correct source (inventory, calculations, or business logic). This is one of the most important safety mechanisms in the design.

6. Repositories — Database Access Layer

A Repository is a Spring Data JPA interface that extends JpaRepository<EntityType, IDType>. By extending it, I get about 20 free methods — save(), findById(), findAll(), delete(), count(), existsById(), etc. — without writing a single SQL statement.

6.1 Custom Query Methods By Naming Convention

Spring Data JPA parses my method names and generates SQL automatically. This is called derived queries. Here are examples from my repositories:

// WarehouseBatchRepository:

boolean existsByBatchName(String batchName);

// Generated SQL: SELECT COUNT(\*) > 0 FROM warehouse_batch_entity WHERE batch_name = ?

// WarehouseBatchSizeRepository:

List<WarehouseBatchSizeEntity> findAllByBatch(WarehouseBatchEntity batch);

// Generated SQL: SELECT \* FROM warehouse_batch_size_entity WHERE batch_id = ?

boolean existsByBatchAndSize(WarehouseBatchEntity batch, String size);

// SQL: SELECT COUNT(\*) > 0 FROM ... WHERE batch_id = ? AND size = ?

// OrderRepository:

Optional<OrderEntity> findByOrderId(UUID orderId);

Optional<OrderEntity> findByOrderNumber(String orderNumber);

List<OrderEntity> findByOrderStatus(OrderStatus orderStatus);

// CustomerRepository:

boolean existsByCustomerName(String customerName);

Optional<CustomerEntity> findByCustomerId(UUID customerId);

6.2 Why Optional Instead of Entity Directly

Most findBy... methods return Optional<Entity> rather than Entity directly. Optional is a Java wrapper that forces me to explicitly handle the case where the record does not exist. If I just returned the entity and it was null, I would get a NullPointerException somewhere unexpected. With Optional, I use .orElseThrow() to throw a meaningful NotFoundException immediately:

CustomerEntity customer = customerRepository.findByCustomerId(customerId)

        .orElseThrow(() -> new NotFoundException("Customer not found"));

// This is far better than:

CustomerEntity customer = customerRepository.findByCustomerId(customerId); // could be null

customer.getCustomerName(); // NullPointerException if not found — confusing error

7. Services — The Business Logic Layer

Services are the most important layer in my backend. This is where I enforced every business rule, calculated every total, validated every input, and coordinated between repositories. I designed them carefully and I want to explain every major decision.

7.1 Why I Annotate Services With @Transactional

@Transactional wraps a service method in a database transaction. If anything fails in the middle of the method, the entire transaction is rolled back — meaning none of the changes are saved. Without this, a partial failure could leave the database in an inconsistent state.

Example: OrderService.createOrder() saves the order, creates multiple order items, deducts stock from multiple sizes, and saves measurements. If the last measurement fails to save, without @Transactional the order and deducted stock would still be in the database even though the operation did not complete. With @Transactional, everything is rolled back.

For read-only methods (getAllOrders, getBatchById), I use @Transactional(readOnly = true). This tells Hibernate it does not need to track changes to the entities it loads — a performance optimisation.

7.2 WarehouseBatchService — Detailed Walkthrough

When createBatch() is called:

Check if batchName already exists — throw DuplicateException if it does

Map the DTO to a WarehouseBatchEntity using batchMapper.toEntity(). The entity has no sizes yet because the mapper does not set them.

Loop through the batchSizes list in the request DTO

For each size DTO: map it to a WarehouseBatchSizeEntity, then call size.setBatch(batch) to set the foreign key relationship

Set the full list on the batch: batch.setBatchSizes(sizes)

Calculate totalQuantity by looping through sizes and summing quantities

Calculate totalPrice = totalQuantity × batchPrice

Call batchRepository.save(batch) — because of CascadeType.ALL, all sizes are saved in the same operation

Map the saved entity to a WarehouseBatchResponseDTO and return it

7.3 OrderService — The Most Complex Operation

Creating an order is the most complex operation in the system. It involves multiple repositories, multiple services, multiple calculations, and multiple business rules. Here is every step:

public OrderResponseDTO createOrder(OrderRequestDTO dto) {

    // Step 1: Map basic fields only (mapper ignores everything else)

    OrderEntity order = orderMapper.toEntity(dto);



    // Step 2: Fetch and attach customer

    CustomerEntity customer = customerRepository.findById(dto.getCustomerId())

            .orElseThrow(() -> new NotFoundException("Customer not found"));

    order.setCustomer(customer);



    // Step 3: Attach school and derive schoolOrder flag

    if (dto.getSchoolId() != null) {

        SchoolEntity school = schoolRepository.findById(dto.getSchoolId())

                .orElseThrow(() -> new NotFoundException("School not found"));

        order.setSchool(school);

        order.setSchoolOrder(true);

    } else {

        order.setSchoolOrder(false);

    }



    // Step 4: Set financial and flag defaults

    order.setTotalAmount(BigDecimal.ZERO);

    order.setPaidAmount(BigDecimal.ZERO);

    order.setBalance(BigDecimal.ZERO);

    order.setFullyPaid(false);

    order.setHasMeasurements(false);



    // Step 5: Generate unique order number

    order.setOrderNumber("ORD-" + System.currentTimeMillis() + "-"

            + UUID.randomUUID().toString().substring(0, 4));



    // Step 6: SAVE ORDER FIRST — children need the orderId as FK

    OrderEntity savedOrder = orderRepository.save(order);



    // Step 7: Process each order item

    List<OrderItemEntity> items = new ArrayList<>();

    for (OrderItemRequestDTO itemDTO : dto.getOrderItems()) {

        items.add(orderItemService.createOrderItem(savedOrder, itemDTO));

    }

    savedOrder.setOrderItems(items);



    // Step 8: Calculate total

    BigDecimal total = BigDecimal.ZERO;

    for (OrderItemEntity item : items) {

        total = total.add(item.getTotalPrice());

    }



    // Step 9: Validate payment

    if (dto.getPaidAmount().compareTo(total) > 0) {

        throw new RuntimeException("Paid amount cannot exceed total amount");

    }



    // Step 10: Set all financial fields

    savedOrder.setTotalAmount(total);

    savedOrder.setPaidAmount(dto.getPaidAmount());

    savedOrder.setBalance(total.subtract(dto.getPaidAmount()));

    savedOrder.setFullyPaid(savedOrder.getBalance().compareTo(BigDecimal.ZERO) == 0);



    // Step 11: Derive hasMeasurements from actual items

    boolean hasMeasurements = false;

    for (OrderItemEntity item : items) {

        if (Boolean.TRUE.equals(item.getMeasurementsTaken())) {

            hasMeasurements = true;

            break;

        }

    }

    savedOrder.setHasMeasurements(hasMeasurements);



    // Step 12: Set order status from actual items

    boolean hasCustomItems = false;

    for (OrderItemEntity item : items) {

        if (Boolean.TRUE.equals(item.getCustomMade())) {

            hasCustomItems = true;

            break;

        }

    }

    savedOrder.setOrderStatus(hasCustomItems ? OrderStatus.IN_PRODUCTION : OrderStatus.PENDING);



    // Step 13: Save final order with all values

    return orderMapper.toResponse(orderRepository.save(savedOrder));

}

7.4 OrderItemService — The Inventory Snapshot Pattern

The most important design decision in OrderItemService is the inventory snapshot. For ready-made items, I do NOT take type, variant, color, or price from the frontend DTO. I fetch them FROM the database entity and copy them into the order item. Here is why this matters:

Why Snapshot Instead of Reference?

If I only stored a foreign key to the product (product_id), then when the product's name

or price changes in the future, all old orders would show the new name and price.

That is historically inaccurate and potentially fraudulent.

By copying the values at the time of the order, the order item permanently records

what was sold, at what price, with what description — forever. This is how enterprise

order management systems work.

if (dto.getProductId() != null) {

    // READY-MADE from product:

    ProductEntity product = productRepository.findByProductId(dto.getProductId())

            .orElseThrow(() -> new NotFoundException("Product not found"));



    item.setProduct(product);



    // SNAPSHOT — copy from inventory, not from DTO:

    item.setType(product.getType());

    item.setVariant(product.getVariant());

    item.setColor(product.getColor());

    item.setUnitPrice(BigDecimal.valueOf(product.getProductPrice()));



    // Deduct stock:

    productSizeService.deductStock(product.getProductId(), dto.getSize(), dto.getQuantity());

} else if (dto.getBatchId() != null) {

    // READY-MADE from batch: same pattern

    ...

} else {

    // CUSTOM-MADE: no inventory exists, take from DTO

    item.setType(dto.getType());

    item.setVariant(dto.getVariant());

    item.setColor(dto.getColor());

    item.setUnitPrice(dto.getUnitPrice());

}

7.5 Why OrderItemService and MeasurementService Have No Controllers

I deliberately did not create controllers for OrderItemService and MeasurementService. They are internal helpers — they are only called by OrderService. This design decision has several benefits:

The API is simpler. The frontend only talks to OrderController for order operations.

Partial operations are prevented. The frontend cannot create an OrderItem without an Order, or a Measurement without an OrderItem. The flow is always complete.

Consistency is guaranteed. All validation and stock deduction always happens through the same code path.

7.6 The Stock Deduction Chain — Complete Example

Here is a concrete step-by-step trace of how stock flows through the system:

INITIAL DATABASE STATE:

warehouse_batch_size (Shirts Batch 01, size 32): quantity = 70

product_size (Zimuto Sz32 Shirt, size 32): quantity = 0 (not yet created)

─────────────────────────────────────────────────────────────

EVENT 1: Staff creates product (Zimuto Size 32 Shirt, qty 50)

─────────────────────────────────────────────────────────────

ProductService.createProduct() is called.

It finds the matching BatchSize for size 32 in Shirts Batch 01.

It deducts 50 from BatchSize: 70 → 20

It creates ProductSize with quantity 50.

It sets product.totalQuantity = 50.

STATE AFTER EVENT 1:

warehouse_batch_size (size 32): quantity = 20

product_size (size 32): quantity = 50

─────────────────────────────────────────────────────────────

EVENT 2: Tendai orders 2 x size 32 shirts

─────────────────────────────────────────────────────────────

OrderItemService.createOrderItem() is called.

It calls productSizeService.deductStock(productId, "32", 2).

ProductSize quantity: 50 → 48

STATE AFTER EVENT 2:

warehouse_batch_size (size 32): quantity = 20 (unchanged)

product_size (size 32): quantity = 48

─────────────────────────────────────────────────────────────

CONCLUSION: Two levels of stock tracking.

Batch = raw physical warehouse stock

Product = sellable stock on the shelf

Every sale reduces product stock.

Every product creation reduces batch stock.

─────────────────────────────────────────────────────────────

8. Controllers — HTTP Entry Points

Controllers are the public-facing layer of my API. They receive HTTP requests, delegate to services, and return responses. I keep them intentionally thin — no business logic lives here.

8.1 HTTP Status Codes I Use

201 CREATED

Returned after POST operations that create a new resource. e.g. create order, create customer.

200 OK

Returned for GET and PUT/PATCH operations that succeed.

204 NO CONTENT

Returned after DELETE. The operation succeeded but there is nothing to return.

400 BAD REQUEST

Returned by @Valid when the request body fails validation. e.g. missing required fields.

401 UNAUTHORIZED

Returned by Spring Security when no token is provided.

403 FORBIDDEN

Returned when a valid token exists but the user lacks permission.

404 NOT FOUND

Returned by my GlobalExceptionHandler when NotFoundException is thrown.

8.2 Why I Use @Valid on Request Bodies

The @Valid annotation triggers Bean Validation on the request body DTO before my controller method even executes. If any validation constraint fails (@NotBlank, @NotNull, @Min etc.), Spring returns a 400 BAD REQUEST response with details about which fields failed. My service method is never even called with invalid data.

8.3 Why DELETE Returns 204 Instead of a Message

When I delete a customer, there is nothing meaningful to return. The resource no longer exists. HTTP 204 NO CONTENT is the correct status for this — it tells the frontend the operation succeeded without sending a response body. Returning a plain string message like 'Customer deleted' is not RESTful.

8.4 PATCH vs PUT for Status Updates

The OrderController has a PATCH endpoint for updating order status. I chose PATCH because it updates one specific field on an existing resource. PUT means replace the entire resource — the frontend would need to send the complete order JSON just to change the status. PATCH is leaner and more semantically correct for partial updates.

// PATCH /api/monishaInventory/order/{orderId}/status?status=READY_FOR_COLLECTION

// This is all the frontend needs to send — no request body needed.

@PatchMapping("/{orderId}/status")

public ResponseEntity<OrderResponseDTO> updateOrderStatus(

        @PathVariable UUID orderId,

        @RequestParam OrderStatus status) {

    return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));

}

8.5 Complete API Reference

Authentication

Method

Endpoint

Description

Auth?

POST

/api/monishaInventory/auth/register

Create new staff account

No

POST

/api/monishaInventory/auth/login

Login, receive JWT token

No

Users

Method

Endpoint

Description

Auth?

GET

/api/monishaInventory/user

Get all users

Yes

GET

/api/monishaInventory/user/{id}

Get one user

Yes

DELETE

/api/monishaInventory/user/{id}

Delete user

Yes

Orders

Method

Endpoint

Description

Auth?

POST

/api/monishaInventory/order

Create order (full flow)

Yes

GET

/api/monishaInventory/order

Get all orders

Yes

GET

/api/monishaInventory/order/{orderId}

Get one order

Yes

GET

/api/monishaInventory/order/status/{status}

Filter by status

Yes

PATCH

/api/monishaInventory/order/{orderId}/status

Update order status

Yes

9. Spring Security and JWT — How Authentication Works

Security is one of the most important and most misunderstood parts of a Spring Boot backend. I want to explain exactly what each class does, why I chose this architecture, and how the entire security flow works from the moment a user logs in to the moment a protected endpoint is accessed.

9.1 What JWT Is and Why I Use It

JWT stands for JSON Web Token. It is a signed string that carries information about a user. After login, the server generates a JWT and sends it to the frontend. The frontend stores it and sends it back with every subsequent request. The server verifies the signature and trusts the token — without needing to look up a session in the database.

Why JWT Instead of Server-Side Sessions?

Traditional session-based auth stores a session ID in the database. Every request requires

a database lookup to find the session. Under high load this is slow.

JWT is stateless — the server stores nothing. The token carries everything needed.

Verification is done by checking the cryptographic signature — no database needed.

This makes the API faster and easier to scale.

9.2 The Structure of a JWT Token

A JWT has three parts separated by dots. Here is a real example broken down:

eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGVtYWlsLmNvbSIsImlhdCI6MTcxNjE4MjQwMCwiZXhwIjoxNzIzOTU4NDAwfQ.signature

Part 1 — Header (base64 decoded):

{ "alg": "HS256" }

Algorithm used to sign this token: HmacSHA256

Part 2 — Payload (base64 decoded):

{ "sub": "test@email.com", "iat": 1716182400, "exp": 1723958400 }

sub = subject (the user's email — their identity)

iat = issued at (Unix timestamp of when the token was created)

exp = expiration (Unix timestamp of when the token expires)

Part 3 — Signature:

HMAC-SHA256(base64(header) + '.' + base64(payload), secretKey)

This is a cryptographic hash. If anyone tampers with the header or payload,

the signature will no longer match and the token is rejected.

Token expiry in my system: 3 months (7,776,000,000 milliseconds)

Secret key: stored in application.properties as SecretJwtString

9.3 JWTUtils — Token Factory

JWTUtils is a Spring component that handles all token operations. I annotate it with @PostConstruct so the secret key is initialised once when Spring creates the bean — not on every token operation.

@PostConstruct

public void init() {

    byte[] keyBytes = secretJwtString.getBytes(StandardCharsets.UTF_8);

    key = new SecretKeySpec(keyBytes, "HmacSHA256");

    // Converts my string secret from application.properties into a

    // proper cryptographic signing key usable by the JWT library.

}

public String generateToken(String email) {

    // Called after successful login.

    // Creates a signed JWT containing the user's email as subject.

    return Jwts.builder()

            .subject(email)

            .issuedAt(new Date())

            .expiration(new Date(System.currentTimeMillis() + TOKEN_EXPIRATION))

            .signWith(key)

            .compact();

}

public boolean isTokenValid(String token, UserDetails userDetails) {

    // Two checks:

    // 1. Does the email in the token match the user we loaded from the database?

    // 2. Has the token expired?

    String username = getUsernameFromToken(token);

    return username.equals(userDetails.getUsername()) && !isTokenExpired(token);

}

9.4 AuthUser — The Bridge Between My UserEntity and Spring Security

Spring Security does not know what a UserEntity is. It works with an interface called UserDetails. I created AuthUser to wrap my UserEntity and implement UserDetails — acting as a bridge between my domain model and Spring Security's world.

// Spring Security asks AuthUser three important questions:

getUsername() → returns user.getUserEmail()

                   This is used as the JWT subject — the user's identity.

getPassword() → returns user.getUserPassword()

                   The BCrypt hash. Spring Security uses this to verify login.

getAuthorities() → returns [ new SimpleGrantedAuthority("ROLE_" + userRole) ]

                   e.g. UserRole.ADMIN becomes "ROLE_ADMIN".

                   Spring Security requires the ROLE_ prefix for role-based checks.

// The other four methods (isAccountNonExpired, isAccountNonLocked,

// isCredentialsNonExpired, isEnabled) all return true because I have not

// implemented account locking or expiry yet. In a full system, these

// could check database flags to lock compromised accounts.

9.5 CustomUserDetailsService — Loading Users For Security

When Spring Security needs to verify credentials during login, or when AuthFilter needs to validate a token, it calls CustomUserDetailsService.loadUserByUsername(email). This method queries my database and returns an AuthUser wrapping the found UserEntity.

I throw UsernameNotFoundException (not my custom NotFoundException) because Spring Security specifically catches UsernameNotFoundException to handle the 'user not found' case during authentication.

9.6 AuthFilter — The Request Interceptor

AuthFilter is the most important security class. It extends OncePerRequestFilter — Spring guarantees it runs exactly once per HTTP request, before any controller is reached. Here is every step it takes:

Read the request path. If it starts with /api/monishaInventory/auth, skip all checks and pass the request through — login and register are public.

Read the Authorization header: Authorization: Bearer eyJ...

If the header is missing or does not start with 'Bearer ', set jwtToken and username to null and skip to step 10.

Extract the token by removing the first 7 characters ('Bearer ').

Call jwtUtils.getUsernameFromToken(token) to extract the email from the payload.

Check if username is not null AND SecurityContextHolder has no authentication yet (prevents re-processing already authenticated requests).

Call userDetailsService.loadUserByUsername(email) to load the full user from the database.

Call jwtUtils.isTokenValid(token, userDetails) — checks email matches and token is not expired.

If valid: create a UsernamePasswordAuthenticationToken with the user's authorities. Attach request details (IP address, session info) with WebAuthenticationDetailsSource. Store in SecurityContextHolder.

Call filterChain.doFilter(request, response) to continue the request to the next filter or controller.

What Is SecurityContextHolder?

SecurityContextHolder is a thread-local storage area. It holds the Authentication object

for the current request. Once AuthFilter stores authentication there, every part of

the application (services, controllers, SecurityUtils) can access the current user

without it being passed as a parameter everywhere.

At the end of each request, Spring Security clears the SecurityContextHolder

automatically — ensuring one request's authentication never leaks into another.

9.7 SecurityConfig — Master Security Rules

SecurityConfig is where I define all the rules for the entire application. Every important security decision is made here:

.csrf(csrf -> csrf.disable())

// CSRF (Cross-Site Request Forgery) protection is designed for browser sessions.

// It works by checking a secret cookie on every state-changing request.

// Since my API is stateless (JWT, no sessions, no cookies), CSRF is not needed.

// Leaving it enabled would break all POST/PUT/DELETE requests from the frontend.

.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

// Tell Spring Security: never create or use HTTP sessions.

// Every request must carry its own JWT token.

// This is essential for a stateless API.

.authorizeHttpRequests(auth -> auth

    .requestMatchers("/api/monishaInventory/auth/**").permitAll()

    .anyRequest().authenticated()

)

// auth/\*\* is public — login and register need no token.

// Everything else requires a valid JWT token.

.authenticationProvider(authenticationProvider())

// Register my DaoAuthenticationProvider which uses:

// - CustomUserDetailsService to load users from MySQL

// - BCryptPasswordEncoder to verify hashed passwords

.addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)

// Insert my JWT filter BEFORE Spring's default form-login filter.

// This ensures JWT validation runs first, before Spring tries to do its own auth.

9.8 CorsConfig — Allowing The Frontend To Connect

CORS (Cross-Origin Resource Sharing) is a browser security feature. When my React app running on localhost:5173 tries to call my Spring Boot API on localhost:8080, the browser blocks it because they are on different origins (different ports = different origin).

CorsConfig tells the browser: requests from localhost:5173 and localhost:3000 are allowed. The browser then lets the request through. I allow all headers (for the Authorization header to work) and all the HTTP methods I use. setAllowCredentials(true) allows the Authorization header to be sent.

9.9 SecurityUtils — Accessing The Current User Anywhere

SecurityUtils is a utility class I can call from any service to find out who is making the current request. This is useful for audit logging, for restricting certain operations to specific roles, or for personalising responses.

// In any service, I can do:

String email = SecurityUtils.getCurrentUserEmail();

UserRole role = SecurityUtils.getCurrentUserRole();

AuthUser user = SecurityUtils.getCurrentUser();

// These all read from SecurityContextHolder which AuthFilter populated.

// No database query needed — the user is already in memory for this request.

9.10 The Complete Authentication Flow — Login

Staff member sends: POST /api/monishaInventory/auth/login with { email, password }

AuthFilter sees the path is /auth/\*\* — skips JWT check, passes the request through

Request reaches AuthController.login()

AuthService.login() calls authenticationManager.authenticate() with email + password

AuthenticationManager calls CustomUserDetailsService.loadUserByUsername(email)

CustomUserDetailsService queries MySQL and returns an AuthUser

BCryptPasswordEncoder.matches(plainPassword, storedHash) is called — compares the plain password against the stored BCrypt hash

If they match: authentication is successful

AuthService fetches the UserEntity from the database

jwtUtils.generateToken(email) creates a signed JWT with 3-month expiry

AuthResponseDTO { token, userName, userEmail, userRole } is returned to the frontend

Frontend stores the token (e.g. localStorage)

9.11 The Complete Authentication Flow — Protected Request

Frontend sends a request with: Authorization: Bearer eyJ...

AuthFilter runs before any controller

AuthFilter extracts the email from the JWT payload

AuthFilter loads the user from MySQL via CustomUserDetailsService

AuthFilter calls jwtUtils.isTokenValid() — checks email match and expiry

AuthFilter stores a UsernamePasswordAuthenticationToken in SecurityContextHolder

Request continues to the controller method

Controller calls the service — security is already verified

If the token is missing or invalid: SecurityContextHolder stays empty, Spring returns 401 or 403

10. Complete Real-World Order Walkthrough

I want to trace one complete real-world scenario from the moment a customer walks in to the moment the data is saved in every table. This ties together every layer I have explained.

Scenario: Tendai orders 2 ready-made Zimuto shirts (size 32) and 1 custom navy blazer with measurements

Step 1 — Staff Logs In

Staff sends POST /auth/login with their email and password. BCrypt verifies the password. A JWT is returned. The React app stores it. All subsequent requests include: Authorization: Bearer eyJ...

Step 2 — Staff Finds or Creates Tendai

Staff searches for Tendai Moyo. If not found, sends POST /customer with { customerName: 'Tendai Moyo' }. CustomerService checks for duplicate names, maps DTO to entity, saves it, returns the CustomerResponseDTO with the generated customerId.

Step 3 — Frontend Sends The Order

POST /api/monishaInventory/order

Authorization: Bearer eyJ...

Content-Type: application/json

{

"customerId": "uuid-of-tendai",

"schoolId": "uuid-of-zimuto",

"paidAmount": 40.00,

"collectionDate": "2024-02-15",

"notes": "Press the blazer please",

"orderItems": [

    { "productId": "uuid-of-zimuto-shirt", "size": "32", "quantity": 2 },

    {

      "type": "Blazer", "variant": "Custom", "color": "Navy",

      "unitPrice": 85.00, "quantity": 1, "customMade": true,

      "measurementsTaken": true,

      "measurements": [

        { "measurementType": "CHEST", "value": 92.5, "unit": "cm" },

        { "measurementType": "SHOULDER", "value": 44.0, "unit": "cm" }

      ]

    }

]

}

Step 4 — AuthFilter Verifies The Token

AuthFilter extracts the email from the JWT, loads the staff user from MySQL, verifies the signature and expiry. SecurityContextHolder is populated. Request passes to OrderController.

Step 5 — OrderService Begins

Mapper creates an OrderEntity with only collectionDate and notes. Service fetches Tendai from database, attaches him. Fetches Zimuto school, attaches it, sets schoolOrder = true. Sets all financial fields to zero. Generates order number ORD-1716182400000-3f2a. Saves the order to get an orderId.

Step 6 — OrderItemService: Shirt Item

productId was sent. Service fetches the Zimuto shirt product. Copies type=Shirt, variant=Short Sleeve, color=White, unitPrice=20 FROM the product — ignores anything the frontend might have sent. Calls productSizeService.deductStock(productId, '32', 2). ProductSize quantity drops: 50 → 48. Sets totalPrice = 20 × 2 = 40.00. Saves OrderItemEntity.

Step 7 — OrderItemService: Blazer Item

Neither productId nor batchId was sent — custom path. Reads type=Blazer, variant=Custom, color=Navy, unitPrice=85.00 FROM the DTO. No stock deduction. Sets totalPrice = 85 × 1 = 85.00. Saves OrderItemEntity. Then calls measurementService.createMeasurementsBulk(savedItem, measurements). Saves 2 measurement rows linked to the blazer order item.

Step 8 — OrderService Completes

total = 40.00 + 85.00 = 125.00. paidAmount (40.00) is less than total — validation passes. balance = 85.00. fullyPaid = false. Loop finds blazer has customMade=true → orderStatus = IN_PRODUCTION. Loop finds blazer has measurementsTaken=true → hasMeasurements = true. Final order is saved. OrderResponseDTO is returned.

10.1 Database State After The Order

orders — 1 new row

order_number

total_amount

paid_amount

balance

order_status

school_order

ORD-1716...-3f2a

125.00

40.00

85.00

IN_PRODUCTION

true

order_item_entity — 2 new rows

type

variant

color

size

qty

unit_price

total_price

custom_made

Shirt

Short Sleeve

White

32

2

20.00

40.00

false

Blazer

Custom

Navy

N/A

1

85.00

85.00

true

measurement_entity — 2 new rows (linked to blazer order item)

measurement_type

value

unit

CHEST

92.5

cm

SHOULDER

44.0

cm

product_size_entity — size 32 quantity reduced

product_name

size

before

after

Zimuto Size 32 Shirt

32

50

48

Step 9 — Tailoring Completes

When the tailor finishes the blazer, staff send:

PATCH /api/monishaInventory/order/{orderId}/status?status=READY_FOR_COLLECTION

OrderService.updateOrderStatus() fetches the order, sets orderStatus = READY_FOR_COLLECTION,

saves it, returns the updated OrderResponseDTO.

No stock changes. No financial changes. Status update only.

11. Order Status Lifecycle

Every order moves through a defined set of statuses stored in the OrderStatus enum. I chose to store the status as a VARCHAR (via @Enumerated(EnumType.STRING)) rather than an integer so the database values are human-readable — PENDING instead of 0.

PENDING

Ready-made items only. Stock has been deducted. Waiting for customer to collect.

IN_PRODUCTION

At least one item is custom-made. Set automatically by the backend when any item has customMade=true.

READY_FOR_COLLECTION

All items ready. Set manually by staff via PATCH endpoint when tailoring or prep is done.

COMPLETED

Customer collected. Order closed.

CANCELLED

Order was cancelled before completion.

12. Enterprise Backend Concepts — Why I Designed It This Way

12.1 Separation of Concerns

Every layer does exactly one job. Controllers receive requests. Services contain logic. Repositories access data. Mappers convert objects. Security handles authentication. When a bug appears, I know exactly which layer to look in. When requirements change, I change exactly one layer without touching the others.

12.2 The Backend Is The Final Authority

I never trust the frontend to send correct calculated values. Even if the frontend correctly calculates a total, my service recalculates it anyway. Even if the frontend sends the correct type and color for a ready-made item, my service ignores those values and reads them from the database. This is not distrust of the frontend developer — it is protection against bugs, malicious users, and API clients that are not the official frontend.

12.3 Fail Fast With Clear Errors

I throw exceptions as early as possible with clear messages. If a customer ID does not exist, I throw NotFoundException('Customer not found') immediately — not five steps later when a null pointer would have been confusing. My GlobalExceptionHandler catches these and returns clean JSON error responses to the frontend.

12.4 Historical Accuracy Through Snapshots

Order items store snapshot copies of inventory data. This means order history is immutable and accurate — it reflects what was sold at the time, not what the current inventory says. This is how every real e-commerce and inventory system works.

12.5 Internal Services Have No Public API

OrderItemService and MeasurementService are internal helpers. They do not have controllers and cannot be called from outside OrderService. This enforces a complete and consistent operation every time. You cannot create orphaned order items or measurements without a valid parent order.

12.6 Why I Chose MySQL Over NoSQL

The relationships in this system are deeply relational — orders have items, items have measurements, products belong to batches, batches have sizes. MySQL enforces these relationships with foreign keys, preventing orphaned records. A NoSQL database would require me to enforce these relationships in code, making the system more fragile.

13. Summary — How It All Connects

Here is the complete connection between every part of my backend in plain English:

A staff member logs in via AuthController → AuthService validates with BCrypt → JWTUtils generates a token → frontend stores it

Every subsequent request carries the JWT → AuthFilter validates it → SecurityContextHolder holds the authenticated user

Staff create warehouse batches via WarehouseBatchController → WarehouseBatchService saves the batch and its sizes, calculates totals

Staff create products from batches via ProductController → ProductService deducts from BatchSize, creates ProductSizes

When a customer arrives, staff create a customer via CustomerController → CustomerService saves it

Staff place an order via OrderController → OrderService fetches the customer and school, generates an order number, saves the order to get an ID

For each item in the order, OrderItemService determines the path: product inventory, batch inventory, or custom. Snapshots are copied. Stock is deducted via ProductSizeService or WarehouseBatchSizeService.

For custom items with measurements, MeasurementService.createMeasurementsBulk() saves measurement rows linked to the order item

OrderService calculates totals, validates payment, derives flags and status, saves the final order

When tailoring is done, staff call PATCH /order/{id}/status → OrderService updates the status to READY_FOR_COLLECTION

At every step, MySQL stores the complete relational picture — orders linked to customers, items linked to orders, measurements linked to items, products linked to batches

This is a production-quality enterprise backend. Every design decision was made with real-world consequences in mind: security, accuracy, consistency, maintainability, and future growth.
