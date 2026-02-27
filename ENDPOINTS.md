# API Endpoint Map

This document outlines the available HTTP routes for the application, categorized by user role and functionality.

**Base URL:** `/api`  
**Auth Header:** `token: <jwt_token>`

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

**Base Path:** `/api/users`  
**Public Access**

### `POST /api/users/register`
- **Description:** Register a new customer account. Sends a verification email on success.
- **Middleware:** `validateEmail` → `validateData`
- **Body:** `name`, `email`, `password`, `phone`
- **Response:** `201` — User created (password omitted from response)

### `POST /api/users/login`
- **Description:** Authenticate a user and receive a JWT.
- **Middleware:** `validateLogin`
- **Body:** `email`, `password`
- **Response:** `200` — `{ message, token }`

### `POST /api/users/guest`
- **Description:** Create a guest user account with a UUID email and `"Guest"` status.
- **Response:** `201` — Guest user document + token

### `GET /api/users/confirmEmail/:token`
- **Description:** Verify email address via a signed JWT token sent by email. Sets user status to `"Approved"`.
- **Params:** `token` — JWT containing the user's email
- **Response:** `200` — `{ status: "Approved", message: "email verified successfully" }`

---

## 2. User Profile

**Base Path:** `/api/users`  
**Requires Authentication** — `protect` middleware

### `GET /api/users/me`
- **Description:** Retrieve current logged-in user profile (password excluded).
- **Response:** `200` — User object

### `PATCH /api/users/me`
- **Description:** Update personal information.
- **Middleware:** `validateUpdateMe`
- **Allowed Fields:** `name`, `email`, `phone`
- **Response:** `200` — Updated user object

### `DELETE /api/users/me`
- **Description:** Soft-delete the account (sets status to `"Deleted"`).
- **Response:** `204 No Content`

---

## 3. Storefront & Catalog

### Products

**Base Path:** `/api/products`  
**Public Access** (GET routes only)

#### `GET /api/products`
- **Description:** Retrieve a paginated list of products.
- **Query Params:**
  - `?page=1&limit=10` — Pagination *(limit max 20, default 5)*
  - `?sort=-price,createdAt` — Sorting *(default: `-createdAt`)*
  - `?fields=name,price` — Field selection
  - `?category=<categoryId>` — Filter by category
  - `?name=<exact name>` — Filter by exact name
  - Any other model field can also be passed as a filter (e.g. `?brand=Apple`)

#### `GET /api/products/:id`
- **Description:** Retrieve details for a specific product (populates `category`).
- **Middleware:** `validateId()`
- **Examples:**
  - `GET /api/products/665a1b...` — by ObjectId

### Categories

**Base Path:** `/api/categories`  
**Public Access** (GET routes only)

#### `GET /api/categories`
- **Description:** List all available product categories (paginated).
- **Query Params:**
  - `?page=1&limit=10` — Pagination *(limit max 20, default 5)*
  - `?sort=-createdAt` — Sorting
  - `?fields=name` — Field selection

#### `GET /api/categories/:id`
- **Description:** Retrieve a single category by ID.
- **Middleware:** `validateId()`

### Reviews

**Base Path:** `/api/reviews`

#### `GET /api/reviews/:productId`
- **Description:** List all reviews for a specific product (public).
- **Middleware:** `validateId('productId')`
- **Response:** `200` — `{ status, results, data, ratingsAverage }`

#### `POST /api/reviews`
- **Description:** Create a review for a product. Must have purchased the product (checks for a `"Completed"` order). One review per user per product.
- **Auth:** `protect`
- **Middleware:** `validateCreateReview`
- **Body:** `title`, `review`, `ratings`, `product` (productId)
- **Response:** `201` — Created review
- **Errors:**
  - `400` — Already reviewed this product
  - `403` — Must purchase product before reviewing
  - `404` — Product not found

#### `PATCH /api/reviews/:id`
- **Description:** Update your own review. Recalculates product average rating.
- **Auth:** `protect`
- **Middleware:** `validateId()`
- **Body:** `title`, `review`, `ratings` *(all optional)*
- **Errors:** `403` — Can only update your own reviews

#### `DELETE /api/reviews/:id`
- **Description:** Delete a review (owner or admin). Recalculates product average rating.
- **Auth:** `protect`
- **Middleware:** `validateId()`
- **Response:** `204 No Content`
- **Errors:** `403` — Can only delete your own reviews

---

## 4. Shopping Cart

**Base Path:** `/api/cart`

### `GET /api/cart`
- **Description:** View current cart items (populated with product details).
- **Auth:** `protect` → `accountGuard('viewCart')`
- **Response:** `200` — Array of cart items

### `POST /api/cart`
- **Description:** Add an item to the cart. Automatically creates a guest user if no token is provided. Checks product stock before adding. Merges duplicate products.
- **Middleware:** `validateAddToCart`
- **Auth:** Optional (auto-creates guest if missing)
- **Body:** `productId`, `quantity`
- **Response:** `200` — `{ message, token, isGuestCreated, data: { cart } }`
- **Errors:**
  - `400` — Missing productId, invalid quantity, or not enough stock
  - `404` — Product not found

### `PATCH /api/cart/:itemId`
- **Description:** Update quantity of a specific cart item. Checks product stock.
- **Auth:** Optional (resolves user from token)
- **Middleware:** `validateId('itemId')` → `validateUpdateCart`
- **Params:** `itemId` — The **productId** of the cart item
- **Body:** `quantity`
- **Errors:**
  - `400` — Not enough stock
  - `404` — Cart item not found

### `DELETE /api/cart/:itemId`
- **Description:** Remove a specific item from the cart.
- **Auth:** Optional (resolves user from token)
- **Middleware:** `validateId('itemId')`
- **Params:** `itemId` — The **productId** of the cart item
- **Errors:** `404` — Cart item not found

---

## 5. Checkout & Payments

**Base Path:** `/api/cart`

### `POST /api/cart/checkout`
- **Description:** Process the cart and create an order. Supports three payment methods.
- **Auth:** `protect` → `accountGuard('checkout')`
- **Body:**
  - `paymentMethod` — `"wallet"`, `"paypal"`, or `"COD"`
  - `address` *(required for guests)*
  - `phone` *(required for guests)*
- **Payment Flows:**
  - **`wallet`** — Deducts from user's `walletBalance`, creates order, decrements stock, clears cart.
  - **`COD`** — Creates order with `paymentStatus: "Completed"` and `COD: true`, decrements stock, clears cart.
  - **`paypal`** — Creates a PayPal order, returns `approvalUrl` for buyer approval. Cart is cleared after payment confirmation.
- **Response:** `200` — Order object (+ `approvalUrl` for PayPal)
- **Errors:**
  - `400` — Insufficient wallet balance, invalid payment method, or stock issues

### `POST /api/cart/payments/paypal/confirm`
- **Description:** Confirm a PayPal payment after buyer approval. Updates order status, decrements stock, and clears cart.
- **Auth:** None (called after PayPal redirect)
- **Body:** `paypalOrderId`
- **Response:** `200` — `{ status, message, data: order }`
- **Errors:**
  - `400` — Payment not approved/completed, or missing `paypalOrderId`
  - `404` — Order not found

### `POST /api/cart/payments/paypal/webhook`
- **Description:** PayPal webhook handler for `CHECKOUT.ORDER.APPROVED` events. Handles both `"order"` and `"walletCharge"` order types. For wallet charges, increments user's `walletBalance`.
- **Auth:** None (PayPal server-to-server)
- **Body:** PayPal webhook event payload

### `POST /api/cart/payments/wallet`
- **Description:** Charge (top-up) wallet via PayPal. Creates a PayPal order of type `"walletCharge"` and returns the approval URL.
- **Auth:** Token required (via `req.headers.token`)
- **Body:** `amount`
- **Response:** `200` — `{ status, data: order, approvalUrl }`

---

## 6. Wishlist

**Base Path:** `/api/wishlist`  
**Requires Authentication** — `protect` + `accountGuard`

### `GET /api/wishlist`
- **Description:** View all wishlist items (populated with product details).
- **Auth:** `protect` → `accountGuard('viewWishlist')`
- **Response:** `200` — `{ status, results, data: { data: items } }`

### `POST /api/wishlist`
- **Description:** Add a product to the wishlist. Prevents duplicates.
- **Auth:** `protect` → `accountGuard('addToWishlist')`
- **Middleware:** `validateAddToWishlist`
- **Body:** `productId`
- **Errors:**
  - `400` — Missing productId or product already in wishlist
  - `404` — Product not found

### `DELETE /api/wishlist/:itemId`
- **Description:** Remove a product from the wishlist.
- **Auth:** `protect` → `accountGuard('removeFromWishlist')`
- **Middleware:** `validateId('itemId')`
- **Params:** `itemId` — The **productId** to remove
- **Errors:** `404` — Wishlist item not found

---

## 7. Orders

**Base Path:** `/api/orders`  
**Requires Authentication** — `protect` (applied to all routes)

### `GET /api/orders`
- **Description:** List all orders for the current logged-in user.
- **Response:** `200` — `{ status, results, data: [orders] }`

### `GET /api/orders/:id`
- **Description:** Retrieve a specific order. Only the order owner can view it.
- **Middleware:** `validateId()`
- **Errors:**
  - `403` — Not your order
  - `404` — Order not found

### `GET /api/orders/admin/all` *(Admin Only)*
- **Description:** View all orders (paginated).
- **Auth:** `restrictTo("admin")`
- **Query Params:**
  - `?page=1&limit=10` — Pagination *(limit max 20, default 5)*
  - `?sort=-createdAt,totalPrice` — Sorting
  - `?fields=status,totalPrice` — Field selection
  - `?status=Pending` — Filter by status

### `PATCH /api/orders/:id/status` *(Admin Only)*
- **Description:** Update the status of an order.
- **Auth:** `restrictTo("admin")`
- **Middleware:** `validateId()` → `validateUpdateOrderStatus`
- **Body:** `status` — `"Pending"`, `"Shipped"`, or `"Delivered"`

---

## 8. Administration

### User Management

**Base Path:** `/api/users`

#### `PATCH /api/users/:id/status` *(Admin Only)*
- **Description:** Block or unblock a user by updating `isBlocked` field.
- **Auth:** `protect` → `restrictTo("admin")`
- **Middleware:** `validateId('id')` → `validateUpdateUserStatus`
- **Body:** `isBlocked` — `true` or `false`
- **Errors:** `404` — User not found

### Product Management *(Admin Only)*

**Base Path:** `/api/products`  
**Auth:** `protect` → `restrictTo("admin")` *(applied via `router.use`)*

#### `POST /api/products`
- **Description:** Create a new product.
- **Middleware:** `validateCreateProduct`
- **Body:** `name`, `price`, `stock`, `image`, `category` (categoryId)
- **Response:** `201` — Created product

#### `PATCH /api/products/:id`
- **Description:** Update an existing product.
- **Middleware:** `validateId()` → `validateUpdateProduct`
- **Body:** `name`, `price`, `stock`, `image`, `category` *(all optional)*

#### `DELETE /api/products/:id`
- **Description:** Remove a product.
- **Middleware:** `validateId()`
- **Response:** `204 No Content`

### Category Management *(Admin Only)*

**Base Path:** `/api/categories`  
**Auth:** `protect` → `restrictTo("admin")` *(applied via `router.use`)*

#### `POST /api/categories`
- **Description:** Create a new category. Rejects duplicates by name.
- **Middleware:** `validateCreateCategory`
- **Body:** `name`, `description`
- **Response:** `201` — Created category
- **Errors:** `400` — Category already exists

#### `PATCH /api/categories/:id`
- **Description:** Update an existing category.
- **Middleware:** `validateId()` → `validateUpdateCategory`
- **Body:** `name`, `description` *(all optional)*

#### `DELETE /api/categories/:id`
- **Description:** Remove a category.
- **Middleware:** `validateId()`
- **Response:** `204 No Content`

### Dashboard Stats *(Admin Only)*

**Base Path:** `/api/admin`  
**Auth:** `protect` → `restrictTo("admin")`

#### `GET /api/admin/stats`
- **Description:** Get aggregated stats — total revenue and total order count.
- **Response:** `200` — `{ status, data: { totalRevenue, totalOrders } }`

---

## Account Guard — Status-Based Access Control

The `accountGuard` middleware restricts route access based on user `status`:

| User Status | Behavior |
|---|---|
| `Deleted` | → `404` User not found |
| `Restricted` | → `403` Account is restricted |
| `Unverified` | → `403` Please verify your email first |
| `Guest` + `checkout` | → Requires `phone` and `address` in body |
| `Approved` | → ✅ Full access |
| `Guest` (non-checkout) | → ✅ Allowed |

---

## User Statuses

| Status | Description |
|---|---|
| `Guest` | Auto-created temporary account (UUID email, no password) |
| `Unverified` | Registered but email not yet confirmed (default) |
| `Approved` | Email verified, full access |
| `Restricted` | Blocked by admin from performing actions |
| `Deleted` | Soft-deleted account |

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
    "data": [ /* documents */ ],
    "page": 1,
    "pages": 2
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