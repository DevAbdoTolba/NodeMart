# Customer Flow - Pass
# Setup product via admin -> Register -> Login -> Profile -> Products -> Cart (Unverified gets 403) -> Review

# Login as admin to create a product for testing
POST http://localhost:3000/api/users/login
Content-Type: application/json
{
  "email": "nesmaaa@example.com",
  "password": "my@Password123"
}
HTTP 200
[Captures]
admin_token: jsonpath "$.token"

# Create a Product as admin
POST http://localhost:3000/api/products
Content-Type: application/json
token: {{admin_token}}
{
  "name": "Customer Test Product {{unix_timestamp}}",
  "price": 99.99,
  "stock": 10
}
HTTP 201
[Captures]
product_id: jsonpath "$.data.data._id"

# Register
POST http://localhost:3000/api/users/register
Content-Type: application/json
{
  "name": "Test Customer",
  "email": "customer{{unix_timestamp}}@test.com",
  "phone": "01012345678",
  "password": "Test@1234"
}
HTTP 201

# Login
POST http://localhost:3000/api/users/login
Content-Type: application/json
{ 
  "email": "customer{{unix_timestamp}}@test.com",
  "password": "Test@1234"
}
HTTP 200
[Captures]
token: jsonpath "$.token"

# Get Profile
GET http://localhost:3000/api/users/me
token: {{token}}
HTTP 200

# Update Profile
PATCH http://localhost:3000/api/users/me
Content-Type: application/json
token: {{token}}
{
  "name": "Updated Customer"
}
HTTP 200

# Get All Products
GET http://localhost:3000/api/products
HTTP 200

# Get Single Product
GET http://localhost:3000/api/products/{{product_id}}
HTTP 200

# Add to Cart
POST http://localhost:3000/api/cart
Content-Type: application/json
token: {{token}}
{
  "productId": "{{product_id}}",
  "quantity": 2
}
HTTP 200

# Get Cart (Unverified user -> 403)
GET http://localhost:3000/api/cart
token: {{token}}
HTTP 403

# Checkout (Unverified user -> 403)
POST http://localhost:3000/api/cart/checkout
Content-Type: application/json
token: {{token}}
{
  "paymentMethod": "wallet"
}
HTTP 403

# Create Review (Unverified user who hasn't purchased -> 403)
POST http://localhost:3000/api/reviews
Content-Type: application/json
token: {{token}}
{
  "title": "Great Product",
  "review": "Really enjoyed this product",
  "ratings": 5,
  "product": "{{product_id}}"
}
HTTP 403

# Get All Reviews for Product
GET http://localhost:3000/api/reviews/{{product_id}}
HTTP 200
