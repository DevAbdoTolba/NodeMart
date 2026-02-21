# API Endpoint Map

This document outlines the available HTTP routes for the application, categorized by user role and functionality.

---

## Handler Factory — Flexible Lookup Pattern

All **single-resource** operations (`GET one`, `UPDATE`, `DELETE`) produced by the handler factory support **two mutually-exclusive route shapes**:

| Route Shape | Mongoose Method | When to Use |
|---|---|---|
| `/:id` | `findById` / `findByIdAndUpdate` / `findByIdAndDelete` | When you have the document's `_id`. |
| `/:searchBy/:value` | `findOne` / `findOneAndUpdate` / `findOneAndDelete` | When you want to look up by **any** field (e.g. `slug`, `email`, `sku`). |

### How it works

```
# By ObjectId
GET    /api/products/665a1b2c3d4e5f6a7b8c9d0e

# By any field (searchBy = field name, value = field value)
GET    /api/products/slug/iphone-15-pro
PATCH  /api/products/sku/SKU-12345
DELETE /api/products/slug/old-product
```

> **Note:** `searchBy` and `value` are **route parameters**, not query strings.  
> If the route contains two path segments after the resource base, they are interpreted as `/:searchBy/:value`.  
> If the route contains a single path segment, it is interpreted as `/:id`.

---

## 1. Authentication & Access Control

**Public Access**

### `POST /api/auth/register`
- **Description:** Register a new customer account.
- **Body:** `name`, `email`, `password`, `phone`

### `POST /api/auth/login`
- **Description:** Authenticate a user and receive a JWT.
- **Body:** `email`, `password`

### `POST /api/auth/guest`
- **Description:** Generate a temporary UUID and token for guest access.
- **Response:** Guest Token

### `GET /api/auth/confirm-email`
- **Description:** Verify email address via token link.
- **Query Params:** `?token=<verification_token>`

---

## 2. Storefront & Catalog

**Public Access**

### `GET /api/products`
- **Description:** Retrieve a paginated list of products.
- **Query Params:**
  - `?page=1&limit=10` — Pagination *(limit max 20, default 5)*
  - `?category=<categoryId>` — Filter by category
  - `?sort=-price,createdAt` — Sorting *(default: `-createdAt`)*
  - `?keyword=name` — Search by keyword
  - Any other model field can also be passed as a filter (e.g. `?brand=Apple`)

### `GET /api/products/:id` · `GET /api/products/:searchBy/:value`
- **Description:** Retrieve details for a specific product.
- **Branching:**
  - `/:id` → Looks up by `_id`
  - `/:searchBy/:value` → Looks up by any field
- **Examples:**
  - `GET /api/products/665a1b...` — by ObjectId
  - `GET /api/products/slug/iphone-15` — by slug

### `GET /api/products/:id/reviews`
- **Description:** List public reviews for a product.

### `GET /api/categories`
- **Description:** List all available product categories.

---

## 3. User Workspace

**Requires Authentication (Customer or Guest)**

### Profile Management

#### `GET /api/users/profile`
- **Description:** Retrieve current user details.

#### `PATCH /api/users/profile`
- **Description:** Update personal information.
- **Body:** `name`, `phone`

#### `DELETE /api/users/profile`
- **Description:** Deactivate or soft-delete the account.

### Shopping Cart

#### `GET /api/cart`
- **Description:** View current cart items.

#### `POST /api/cart`
- **Description:** Add an item to the cart.
- **Body:** `productId`, `quantity`

#### `PATCH /api/cart/:itemId`
- **Description:** Update quantity of a specific item.

#### `DELETE /api/cart/:itemId`
- **Description:** Remove a specific item from the cart.

#### `DELETE /api/cart`
- **Description:** Clear the entire cart.

### Checkout & Orders

#### `POST /api/checkout`
- **Description:** Process the cart and create an order.
- **Guest Body:** `email`, `address`, `phone`, `paymentMethod`
- **Customer Body:** `paymentMethod` *(uses saved profile data)*

#### `GET /api/orders/my-orders`
- **Description:** List order history for the logged-in user.

#### `GET /api/orders/:id` · `GET /api/orders/:searchBy/:value`
- **Description:** Retrieve a specific order receipt/status.
- **Branching:**
  - `/:id` → Looks up by `_id`
  - `/:searchBy/:value` → Looks up by any field (e.g. `orderNumber`)
- **Examples:**
  - `GET /api/orders/665a1b...` — by ObjectId
  - `GET /api/orders/orderNumber/ORD-20260217-001` — by order number

---

## 4. Administration

**Requires Admin Role**

### User Management

#### `GET /api/admin/users`
- **Description:** List all registered users.

#### `PATCH /api/admin/users/:id/status` · `PATCH /api/admin/users/:searchBy/:value`
- **Description:** Change user status (e.g., Approve, Restrict, Block).
- **Branching:**
  - `/:id/status` → Looks up by `_id`
  - `/:searchBy/:value` → Looks up by any field (e.g. `email`)
- **Examples:**
  - `PATCH /api/admin/users/665a1b.../status`
  - `PATCH /api/admin/users/email/john@example.com`

### Inventory Management

#### `POST /api/admin/products`
- **Description:** Create a new product.
- **Body:** Product fields (handled by `createOne`)

#### `PUT /api/admin/products/:id` · `PUT /api/admin/products/:searchBy/:value`
- **Description:** Update an existing product.
- **Branching:**
  - `/:id` → Looks up by `_id`
  - `/:searchBy/:value` → Looks up by any field (e.g. `slug`, `sku`)
- **Examples:**
  - `PUT /api/admin/products/665a1b...`
  - `PUT /api/admin/products/slug/iphone-15`

#### `DELETE /api/admin/products/:id` · `DELETE /api/admin/products/:searchBy/:value`
- **Description:** Remove a product.
- **Branching:**
  - `/:id` → Looks up by `_id`
  - `/:searchBy/:value` → Looks up by any field
- **Examples:**
  - `DELETE /api/admin/products/665a1b...`
  - `DELETE /api/admin/products/slug/old-product`

#### `POST /api/admin/categories`
- **Description:** Create a new category.

#### `PUT /api/admin/categories/:id` · `PUT /api/admin/categories/:searchBy/:value`
- **Description:** Update an existing category.
- **Branching:**
  - `/:id` → Looks up by `_id`
  - `/:searchBy/:value` → Looks up by any field (e.g. `name`, `slug`)
- **Examples:**
  - `PUT /api/admin/categories/665a1b...`
  - `PUT /api/admin/categories/slug/electronics`

### Sales & Order Fulfillment

#### `GET /api/admin/orders`
- **Description:** View all sales and orders.
- **Query Params:** `?status=Pending`

#### `PATCH /api/admin/orders/:id` · `PATCH /api/admin/orders/:searchBy/:value`
- **Description:** Update the status of an order (e.g., from Pending → Shipped).
- **Branching:**
  - `/:id` → Looks up by `_id`
  - `/:searchBy/:value` → Looks up by any field (e.g. `orderNumber`)
- **Examples:**
  - `PATCH /api/admin/orders/665a1b...`
  - `PATCH /api/admin/orders/orderNumber/ORD-20260217-001`

---

## Response Formats

### Success — Single Resource

```json
{
  "status": "success",
  "data": {
    "data": { /* document */ }
  }
}
```

### Success — Collection

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "data": [ /* documents */ ]
  }
}
```

### Success — Delete

```
HTTP 204 No Content
```

### Error

```json
{
  "status": "fail",
  "message": "No document found with that ID"
}
```