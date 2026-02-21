# Admin Flow - Fail
# No auth, non-admin access, invalid inputs

# Admin orders without token -> 401
GET http://localhost:3000/api/admin/orders
HTTP 401

# Admin stats without token -> 401
GET http://localhost:3000/api/admin/stats
HTTP 401

# Admin orders with bad token -> 401
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
regular_token: jsonpath "$.token"

# Admin orders as regular user -> 403
GET http://localhost:3000/api/admin/orders
token: {{regular_token}}
HTTP 403

# Admin stats as regular user -> 403
GET http://localhost:3000/api/admin/stats
token: {{regular_token}}
HTTP 403

# Admin update order as regular user -> 403 (restrictTo blocks before validateId)
PATCH http://localhost:3000/api/admin/orders/not-valid-id
Content-Type: application/json
token: {{regular_token}}
{
  "status": "Shipped"
}
HTTP 403

# Block user as regular user -> 403
PATCH http://localhost:3000/api/user/aaaaaaaaaaaaaaaaaaaaaaaa/status
Content-Type: application/json
token: {{regular_token}}
{
  "isBlocked": true
}
HTTP 403

# --- Now login as actual admin to test validation (400s) ---
POST http://localhost:3000/api/auth/login
Content-Type: application/json
{
  "email": "nesmaaa@example.com",
  "password": "my@Password123"
}
HTTP 200
[Captures]
admin_token: jsonpath "$.token"

# Update order with invalid ID -> 400 (admin token so restrictTo passes, validateId catches)
PATCH http://localhost:3000/api/admin/orders/not-valid-id
Content-Type: application/json
token: {{admin_token}}
{
  "status": "Shipped"
}
HTTP 400

# Update order with invalid status -> 400
PATCH http://localhost:3000/api/admin/orders/aaaaaaaaaaaaaaaaaaaaaaaa
Content-Type: application/json
token: {{admin_token}}
{
  "status": "InvalidStatus"
}
HTTP 400

# Block user with invalid ID -> 400
PATCH http://localhost:3000/api/user/not-valid-id/status
Content-Type: application/json
token: {{admin_token}}
{
  "isBlocked": true
}
HTTP 400

# Block user missing isBlocked -> 400
PATCH http://localhost:3000/api/user/aaaaaaaaaaaaaaaaaaaaaaaa/status
Content-Type: application/json
token: {{admin_token}}
{
}
HTTP 400

# Category with too short name -> 400
POST http://localhost:3000/api/categories
Content-Type: application/json
{
  "name": "a"
}
HTTP 400

# Delete category with invalid ID -> 400
DELETE http://localhost:3000/api/categories/not-valid-id
HTTP 400

# Delete product with invalid ID -> 400
DELETE http://localhost:3000/api/products/not-valid-id
HTTP 400
