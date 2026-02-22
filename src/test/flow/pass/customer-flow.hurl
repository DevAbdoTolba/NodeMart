# Customer Flow - Pass
# Register -> Login -> Browse Products -> Cart -> Review

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

# Create a Product
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "name": "Test Product",
  "price": 99.99,
  "stock": 10
}
HTTP 201
[Captures]
product_id: jsonpath "$.data.data._id"

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

# Get Cart
GET http://localhost:3000/api/cart
token: {{token}}
HTTP 200

# Update Cart Item
PATCH http://localhost:3000/api/cart/{{product_id}}
Content-Type: application/json
token: {{token}}
{
  "quantity": 5
}
HTTP 200

# Delete Cart Item
DELETE http://localhost:3000/api/cart/{{product_id}}
token: {{token}}
HTTP 200

# Create Review
POST http://localhost:3000/api/reviews
Content-Type: application/json
token: {{token}}
{
  "title": "Great Product",
  "review": "Really enjoyed this product",
  "ratings": 5,
  "product": "{{product_id}}"
}
HTTP 201

# Get All Reviews
GET http://localhost:3000/api/reviews
HTTP 200
