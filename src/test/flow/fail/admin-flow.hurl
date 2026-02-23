# Admin Flow - Fail
# No auth, non-admin access, invalid inputs

# All orders without token -> 401
GET http://localhost:3000/api/orders/admin/all
HTTP 401

# Admin stats without token -> 401
GET http://localhost:3000/api/admin/stats
HTTP 401

# All orders with bad token -> 401
GET http://localhost:3000/api/orders/admin/all
token: badtoken
HTTP 401

# Register a regular user to test 403
POST http://localhost:3000/api/users/register
Content-Type: application/json
{
  "name": "Regular User",
  "email": "regular{{unix_timestamp}}@test.com",
  "phone": "01012345678",
  "password": "Test@1234"
}
HTTP 201

POST http://localhost:3000/api/users/login
Content-Type: application/json
{
  "email": "regular{{unix_timestamp}}@test.com",
  "password": "Test@1234"
}
HTTP 200
[Captures]
regular_token: jsonpath "$.token"

# All orders as regular user -> 403
GET http://localhost:3000/api/orders/admin/all
token: {{regular_token}}
HTTP 403

# Admin stats as regular user -> 403
GET http://localhost:3000/api/admin/stats
token: {{regular_token}}
HTTP 403

# Update order status as regular user -> 403
PATCH http://localhost:3000/api/orders/aaaaaaaaaaaaaaaaaaaaaaaa/status
Content-Type: application/json
token: {{regular_token}}
{
  "status": "Shipped"
}
HTTP 403

# Block user as regular user -> 403
PATCH http://localhost:3000/api/users/aaaaaaaaaaaaaaaaaaaaaaaa/status
Content-Type: application/json
token: {{regular_token}}
{
  "isBlocked": true
}
HTTP 403

# --- Test validation errors on admin-protected routes ---
# These routes require admin auth, so without admin token they return 401

# Update order with invalid ID without admin auth -> 401
PATCH http://localhost:3000/api/orders/not-valid-id/status
Content-Type: application/json
{
  "status": "Shipped"
}
HTTP 401

# Update order with invalid status without admin auth -> 401
PATCH http://localhost:3000/api/orders/aaaaaaaaaaaaaaaaaaaaaaaa/status
Content-Type: application/json
{
  "status": "InvalidStatus"
}
HTTP 401

# Block user with invalid ID without admin auth -> 401
PATCH http://localhost:3000/api/users/not-valid-id/status
Content-Type: application/json
{
  "isBlocked": true
}
HTTP 401

# Block user missing isBlocked without admin auth -> 401
PATCH http://localhost:3000/api/users/aaaaaaaaaaaaaaaaaaaaaaaa/status
Content-Type: application/json
{
}
HTTP 401

# Category with too short name without admin auth -> 401
POST http://localhost:3000/api/categories
Content-Type: application/json
{
  "name": "a"
}
HTTP 401

# Delete category with invalid ID without admin auth -> 401
DELETE http://localhost:3000/api/categories/not-valid-id
HTTP 401

# Delete product with invalid ID without admin auth -> 401
DELETE http://localhost:3000/api/products/not-valid-id
HTTP 401
