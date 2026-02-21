# Admin Flow - Pass
# Register admin -> Login -> Categories -> Products -> Orders/Stats -> Block User

# Register Admin
POST http://localhost:3000/api/auth/register
Content-Type: application/json
{
  "name": "Test Admin",
  "email": "admin{{unix_timestamp}}@test.com",
  "phone": "01112345678",
  "password": "Admin@1234",
  "role": "admin"
}
HTTP 201

# Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json
{
  "email": "admin{{unix_timestamp}}@test.com",
  "password": "Admin@1234"
}
HTTP 200
[Captures]
token: jsonpath "$.token"

# Create Category
POST http://localhost:3000/api/categories
Content-Type: application/json
{
  "name": "Electronics"
}
HTTP 201
[Captures]
category_id: jsonpath "$.data.data._id"

# Get All Categories
GET http://localhost:3000/api/categories
HTTP 200

# Update Category
PATCH http://localhost:3000/api/categories/{{category_id}}
Content-Type: application/json
{
  "name": "Updated Electronics"
}
HTTP 200

# Create Product
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "name": "Admin Product",
  "price": 199.99,
  "stock": 50,
  "category": "{{category_id}}"
}
HTTP 201
[Captures]
product_id: jsonpath "$.data.data._id"

# Update Product
PATCH http://localhost:3000/api/products/{{product_id}}
Content-Type: application/json
{
  "price": 149.99
}
HTTP 200

# Get Orders
GET http://localhost:3000/api/admin/orders
token: {{token}}
HTTP 200

# Get Stats
GET http://localhost:3000/api/admin/stats
token: {{token}}
HTTP 200

# Register a user to block
POST http://localhost:3000/api/auth/register
Content-Type: application/json
{
  "name": "Block Me",
  "email": "blockme{{unix_timestamp}}@test.com",
  "phone": "01212345678",
  "password": "Block@1234"
}
HTTP 201
[Captures]
user_id: jsonpath "$.data.data._id"

# Block User
PATCH http://localhost:3000/api/user/{{user_id}}/status
Content-Type: application/json
token: {{token}}
{
  "isBlocked": true
}
HTTP 200

# Unblock User
PATCH http://localhost:3000/api/user/{{user_id}}/status
Content-Type: application/json
token: {{token}}
{
  "isBlocked": false
}
HTTP 200

# Delete Product
DELETE http://localhost:3000/api/products/{{product_id}}
HTTP 204

# Delete Category
DELETE http://localhost:3000/api/categories/{{category_id}}
HTTP 204
