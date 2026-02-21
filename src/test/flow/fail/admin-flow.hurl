# Admin Flow - Fail
# No auth, non-admin access, invalid inputs

# Admin orders without token
GET http://localhost:3000/api/admin/orders
HTTP 401

# Admin stats without token
GET http://localhost:3000/api/admin/stats
HTTP 401

# Admin orders with bad token
GET http://localhost:3000/api/admin/orders
token: badtoken
HTTP 401

# Register a regular user to test 403
POST http://localhost:3000/api/auth/register
Content-Type: application/json
{
  "name": "Regular User",
  "email": "regular{{unix_timestamp}}@test.com",
  "phone": "01012345678",
  "password": "Test@1234"
}
HTTP 201

POST http://localhost:3000/api/auth/login
Content-Type: application/json
{
  "email": "regular{{unix_timestamp}}@test.com",
  "password": "Test@1234"
}
HTTP 200
[Captures]
token: jsonpath "$.token"

# Admin orders as regular user -> 403
GET http://localhost:3000/api/admin/orders
token: {{token}}
HTTP 403

# Admin stats as regular user -> 403
GET http://localhost:3000/api/admin/stats
token: {{token}}
HTTP 403

# Update order with invalid ID
PATCH http://localhost:3000/api/admin/orders/not-valid-id
Content-Type: application/json
token: {{token}}
{
  "status": "Shipped"
}
HTTP 400

# Update order with invalid status
PATCH http://localhost:3000/api/admin/orders/aaaaaaaaaaaaaaaaaaaaaaaa
Content-Type: application/json
token: {{token}}
{
  "status": "InvalidStatus"
}
HTTP 400

# Block user with invalid ID
PATCH http://localhost:3000/api/user/not-valid-id/status
Content-Type: application/json
token: {{token}}
{
  "isBlocked": true
}
HTTP 400

# Block user missing isBlocked
PATCH http://localhost:3000/api/user/aaaaaaaaaaaaaaaaaaaaaaaa/status
Content-Type: application/json
token: {{token}}
{
}
HTTP 400

# Category with too short name
POST http://localhost:3000/api/categories
Content-Type: application/json
{
  "name": "a"
}
HTTP 400

# Delete category with invalid ID
DELETE http://localhost:3000/api/categories/not-valid-id
HTTP 400

# Delete product with invalid ID
DELETE http://localhost:3000/api/products/not-valid-id
HTTP 400
