# API Endpoint Map

This document outlines the available HTTP routes for the application, categorized by user role and functionality.

## 1. Authentication & Access Control
**Public Access**

* `POST /api/auth/register`
    * **Description:** Register a new customer account.
    * **Body:** `name`, `email`, `password`, `phone`
* `POST /api/auth/login`
    * **Description:** Authenticate a user and receive a JWT.
    * **Body:** `email`, `password`
* `POST /api/auth/guest`
    * **Description:** Generate a temporary UUID and token for guest access.
    * **Response:** Guest Token
* `GET /api/auth/confirm-email`
    * **Description:** Verify email address via token link.
    * **Param:** `?token=...`

## 2. Storefront & Catalog
**Public Access**

* `GET /api/products`
    * **Description:** Retrieve a list of products.
    * **Query Params:**
        * `?page=1&limit=10` (Pagination)
        * `?category=id` (Filter)
        * `?sort=-price` (Sorting)
        * `?keyword=name` (Search)
* `GET /api/products/:id`
    * **Description:** Retrieve details for a specific product.
* `GET /api/products/:id/reviews`
    * **Description:** List public reviews for a product.
* `GET /api/categories`
    * **Description:** List all available product categories.

## 3. User Workspace
**Requires Authentication (Customer or Guest)**

### Profile Management
* `GET /api/users/profile`
    * **Description:** Retrieve current user details.
* `PATCH /api/users/profile`
    * **Description:** Update personal information.
    * **Body:** `name`, `phone`
* `DELETE /api/users/profile`
    * **Description:** Deactivate or soft-delete the account.

### Shopping Cart
* `GET /api/cart`
    * **Description:** View current cart items.
* `POST /api/cart`
    * **Description:** Add an item to the cart.
    * **Body:** `productId`, `quantity`
* `PATCH /api/cart/:itemId`
    * **Description:** Update quantity of a specific item.
* `DELETE /api/cart/:itemId`
    * **Description:** Remove a specific item from the cart.
* `DELETE /api/cart`
    * **Description:** Clear the entire cart.

### Checkout & Orders
* `POST /api/checkout`
    * **Description:** Process the cart and create an order.
    * **Guest Body:** `email`, `address`, `phone`, `paymentMethod`
    * **Customer Body:** `paymentMethod` (uses saved profile data)
* `GET /api/orders/my-orders`
    * **Description:** List order history for the logged-in user.
* `GET /api/orders/:id`
    * **Description:** Retrieve a specific order receipt/status.

## 4. Administration
**Requires Admin Role**

### User Management
* `GET /api/admin/users`
    * **Description:** List all registered users.
* `PATCH /api/admin/users/:id/status`
    * **Description:** Change user status (e.g., Approve, Restrict, Block).

### Inventory Management
* `POST /api/admin/products`
    * **Description:** Create a new product.
* `PUT /api/admin/products/:id`
    * **Description:** Update an existing product.
* `DELETE /api/admin/products/:id`
    * **Description:** Remove a product.
* `POST /api/admin/categories`
    * **Description:** Create a new category.
* `PUT /api/admin/categories/:id`
    * **Description:** Update an existing category.

### Sales & Order Fulfillment
* `GET /api/admin/orders`
    * **Description:** View all sales and orders.
    * **Query Param:** `?status=Pending`
* `PATCH /api/admin/orders/:id`
    * **Description:** Update the status of an order (e.g., from Pending to Shipped).