Monisha Inventory Management System Documentation

1. Project Overview

Introduction

This project is a stock-controlled uniform shop management system designed for a clothing and uniform manufacturing business. The system manages warehouse inventory, school uniforms, product allocation, stock deduction, and future order processing.

The system is intended to replace the traditional notebook/book-based system currently used in the shop.

The application will use:

React for the frontend

Spring Boot for the backend

MySQL for database storage

2. Main Goal of the System

The main purpose of the system is to:

Manage warehouse stock properly

Prevent invalid stock combinations

Track uniform inventory by:

type

variant

color

size

Allocate stock to products

Support school-based uniforms

Support general non-school items

Deduct stock automatically

Prevent overselling

Prepare the system for future:

customer orders

measurements

payments

tailoring workflows

3. Problem Being Solved

The current book system has several limitations:

Difficult to track stock accurately

Difficult to know remaining quantities

No automatic deduction

No filtering of available stock combinations

Easy to make mistakes

Hard to search historical records

No relationship between warehouse stock and products

Difficult to manage custom tailoring requests

The digital system solves these problems by enforcing structured inventory relationships.

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

Every product created must match an existing warehouse stock combination.

5. System Architecture

Frontend

Technology:

React

React Router

Axios

React Hook Form

Tailwind CSS

Responsibilities:

Forms

Dropdown filtering

Data display

User interaction

Validation feedback

Backend

Technology:

Spring Boot 3.5.14

Java 21

Maven

Spring Web

Spring Data JPA

Validation

Spring Security

MySQL

Lombok

Responsibilities:

Business logic

Validation

Database operations

Security

Inventory deduction

API exposure

Database

Technology:

MySQL

Responsibilities:

Persistent storage

Inventory tracking

Product management

Relationship management

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

The warehouse module stores all available inventory combinations.

Warehouse Batch

A warehouse batch is a stock group.

Example:

Shirts Batch 01

A batch may contain:

multiple variants

multiple colors

multiple sizes

Warehouse Breakdown Structure

Each warehouse stock entry contains:

Field

Description

Batch Name

Group name

Type

Product category

Variant

Variation under type

Color

Product color

Size

Product size

Size Quantity

Quantity available

Total Quantity

Sum of all quantities

Description

Additional notes

8. School Module

Purpose

The school module stores schools associated with uniforms.

Example:

Zimuto High School

Important Rule

School is optional.

This allows:

school uniforms

general shop items

non-school products

Examples:

White shirt → no school

Pamushana blazer → linked to school

9. Product Module

Purpose

Products represent sellable or assignable stock.

Products must originate from warehouse inventory.

10. Product Creation Rules

The user cannot freely type:

type

variant

color

size

Instead, the user selects values from warehouse inventory.

11. Dynamic Dropdown Logic

The frontend must implement dependent dropdowns.

Step 1 — Select Type

Example:

Shirt

The system loads only variants related to shirts.

Step 2 — Select Variant

Example:

Short Sleeve

The system loads only colors related to:

Shirt + Short Sleeve

Step 3 — Select Color

Example:

White

The system loads only sizes related to:

Shirt + Short Sleeve + White

Step 4 — Select Size

Example:

32

The system shows:

Available Quantity = 80

Step 5 — Enter Quantity

Example:

Quantity Requested = 10

The system validates:

10 <= 80

If valid:

product is created

warehouse quantity becomes 70

12. Why Dependent Dropdowns Are Important

Dependent dropdowns prevent invalid combinations.

Example of invalid combination:

Type = Shirt
Variant = Long Sleeve
Color = Green
Size = XXL

If this combination does not exist in warehouse stock, the system must block it.

13. Inventory Deduction Logic

When a product is created:

Warehouse stock is checked

Quantity availability is validated

Quantity is deducted

Remaining stock is updated

14. Inventory Accuracy

The system must always know:

original stock

allocated stock

remaining stock

15. Product Quantity Validation

The backend must reject:

negative quantities

quantities greater than available stock

invalid size combinations

16. Backend Validation Responsibilities

The backend is the final authority.

Even if the frontend filters correctly, the backend must still verify:

type exists

variant belongs to type

color belongs to type + variant

size belongs to type + variant + color

requested quantity exists

17. Frontend Responsibilities

The frontend is responsible for:

displaying forms

filtering dropdowns

showing available quantities

showing validation messages

submitting requests

18. Backend Responsibilities

The backend is responsible for:

enforcing rules

validating requests

saving records

updating inventory

preventing invalid stock manipulation

19. Recommended Backend Structure

com.yourapp
├── config
├── controller
├── dto
├── entity
├── exception
├── mapper
├── repository
├── security
├── service
└── util

20. Recommended Development Phases

Phase 1 — School Management

Features:

create school

update school

delete school

list schools

Phase 2 — Warehouse Inventory

Features:

create batches

create stock combinations

store quantities

calculate totals

Phase 3 — Product Management

Features:

create products from warehouse stock

dependent dropdowns

quantity validation

stock deduction

Phase 4 — Authentication & Security

Features:

login

roles

protected routes

JWT authentication

Phase 5 — Orders & Customers

Features:

customer management

order creation

order tracking

payment handling

Phase 6 — Measurements & Tailoring

Features:

measurement recording

tailoring tracking

custom manufacturing

21. Security Design

The system should support roles.

Examples:

ADMIN

STAFF

VIEWER

Example Permissions

Role

Permission

ADMIN

Full access

STAFF

Manage products/orders

VIEWER

Read-only access

22. API Design Philosophy

The backend should expose REST APIs.

Examples:

GET /api/schools
POST /api/schools

GET /api/warehouse
POST /api/warehouse

GET /api/products
POST /api/products

23. Validation Philosophy

Validation must happen:

frontend side

backend side

Backend validation is mandatory.

24. Database Philosophy

The database must preserve relationships between:

warehouse stock

products

schools

future orders

This ensures:

accurate tracking

reliable reporting

proper inventory control

25. Future Expansion Possibilities

The system can later support:

customer orders

tailoring workflow

measurements

balances

receipts

dashboards

reporting

offline synchronization

mobile support

barcode scanning

SMS notifications

26. Long-Term Vision

This project is not just a small CRUD application.

It is evolving into:

an inventory management system

a production management system

a school uniform management system

a tailoring workflow system

The architecture should therefore be designed carefully from the beginning to support growth.

27. Final System Summary

The system works like this:

Warehouse stock is entered

Stock is organized by:

type

variant

color

size

Products are created from warehouse stock

Dropdowns filter valid combinations

Quantity is validated

Inventory is deducted

Schools remain optional

Backend enforces all rules

Frontend provides user interaction

MySQL stores all relationships and records

The warehouse remains the source of truth for all inventory operations.
