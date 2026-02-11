# 1. Auth & Guest Access (4)
POST /api/auth/guest Generate Guest Token (UUID)
POST /api/auth/register Register new Customer (Email/Phone)
POST /api/auth/login Login (Returns JWT)
GET /api/auth/confirm-email Verify email token

# 2. User Profile (3)
$ GET /api/users/profile Get details (Guest or Customer)
$ PATCH /api/users/profile Update info (Name, Phone)
$ DELETE /api/users/profile Soft delete account

# 3. Products (Catalog) (3)
GET /api/products Search (?q=name) & Filter (?cat=id&minPrice=x)
GET /api/products/:id Single product details
GET /api/categories List all categories

# 4. Shopping Cart (5)
$ GET /api/cart Get current cart items
$ POST /api/cart Add item (Body: productId, qty)
$ PATCH /api/cart/:itemId Update quantity
$ DELETE /api/cart/:itemId Remove item
$ DELETE /api/cart Clear cart

# 5. Checkout & Payments (4)
$ POST /api/checkout Create Order. Guests must send email, address, phone in body. Returns paymentUrl (PayPal) or Success (COD).
$ GET /api/orders/my-orders List user history
$ GET /api/orders/:id Order receipt/status
POST /api/payments/paypal/webhook PayPal Listener (No Auth, Signature Verified)

# 6. Admin Panel (10)
$ GET /api/admin/users List all users
$ PATCH /api/admin/users/:id/status Approve/Restrict/Block user
$ POST /api/admin/categories Create Category
$ PUT /api/admin/categories/:id Update Category
$ DELETE /api/admin/categories/:id Delete Category
$ POST /api/admin/products Create Product
$ PUT /api/admin/products/:id Update Product
$ DELETE /api/admin/products/:id Delete Product
$ GET /api/admin/orders View all sales
$ PATCH /api/admin/orders/:id Update order status (Pending → Shipped)

# 7. Reviews (3)
GET /api/products/:id/reviews Public reviews list
$ POST /api/products/:id/reviews Add review (Customer only)
$ DELETE /api/reviews/:id Delete review (Owner/Admin)