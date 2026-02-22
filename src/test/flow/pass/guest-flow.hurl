# Guest Flow - Pass
# Guest auto-creation via cart -> Cart operations -> Checkout tests

# Create a Product (needed for cart)
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "name": "Guest Product",
  "price": 49.99,
  "stock": 20
}
HTTP 201
[Captures]
product_id: jsonpath "$.data.data._id"

# Add to Cart without token (auto-creates guest)
POST http://localhost:3000/api/cart
Content-Type: application/json
{
  "productId": "{{product_id}}",
  "quantity": 1
}
HTTP 200
[Captures]
token: jsonpath "$.data.token"

# Get Cart (Guest can view cart)
GET http://localhost:3000/api/cart
token: {{token}}
HTTP 200

# Update Cart Item
PATCH http://localhost:3000/api/cart/{{product_id}}
Content-Type: application/json
token: {{token}}
{
  "quantity": 3
}
HTTP 200

# Delete Cart Item
DELETE http://localhost:3000/api/cart/{{product_id}}
token: {{token}}
HTTP 200

# Add item back for checkout test
POST http://localhost:3000/api/cart
Content-Type: application/json
token: {{token}}
{
  "productId": "{{product_id}}",
  "quantity": 2
}
HTTP 200

# Checkout as Guest without phone/address -> 400 (accountGuard blocks)
POST http://localhost:3000/api/cart/checkout
Content-Type: application/json
token: {{token}}
{
  "paymentMethod": "wallet"
}
HTTP 400

# Checkout as Guest with phone/address using PayPal -> 200 (creates order + approvalUrl)
POST http://localhost:3000/api/cart/checkout
Content-Type: application/json
token: {{token}}
{
  "paymentMethod": "paypal",
  "phone": "01012345678",
  "address": "123 Test Street, Cairo"
}
HTTP 200

# Browse Products (no auth needed)
GET http://localhost:3000/api/products
HTTP 200

# Browse Reviews for Product (no auth needed)
GET http://localhost:3000/api/reviews/{{product_id}}
HTTP 200
