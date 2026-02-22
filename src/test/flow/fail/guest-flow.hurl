# Guest Flow - Fail
# Missing tokens, bad cart inputs, invalid IDs, accountGuard blocks

# Get cart without token
GET http://localhost:3000/api/cart
HTTP 401

# Get cart with bad token
GET http://localhost:3000/api/cart
token: broken_token
HTTP 401

# Add to cart missing productId
POST http://localhost:3000/api/cart
Content-Type: application/json
{
  "quantity": 2
}
HTTP 400

# Add to cart missing quantity
POST http://localhost:3000/api/cart
Content-Type: application/json
{
  "productId": "aaaaaaaaaaaaaaaaaaaaaaaa"
}
HTTP 400

# Add to cart with zero quantity
POST http://localhost:3000/api/cart
Content-Type: application/json
{
  "productId": "aaaaaaaaaaaaaaaaaaaaaaaa",
  "quantity": 0
}
HTTP 400

# Add to cart with negative quantity
POST http://localhost:3000/api/cart
Content-Type: application/json
{
  "productId": "aaaaaaaaaaaaaaaaaaaaaaaa",
  "quantity": -3
}
HTTP 400

# Update cart with invalid ID
PATCH http://localhost:3000/api/cart/not-valid-id
Content-Type: application/json
token: faketoken
{
  "quantity": 2
}
HTTP 400

# Update cart missing quantity
PATCH http://localhost:3000/api/cart/aaaaaaaaaaaaaaaaaaaaaaaa
Content-Type: application/json
token: faketoken
{
}
HTTP 400

# Delete cart with invalid ID
DELETE http://localhost:3000/api/cart/not-valid-id
token: faketoken
HTTP 400

# Checkout without token -> 401
POST http://localhost:3000/api/cart/checkout
Content-Type: application/json
{
  "paymentMethod": "wallet"
}
HTTP 401

# Checkout with bad token -> 401
POST http://localhost:3000/api/cart/checkout
Content-Type: application/json
token: broken_token
{
  "paymentMethod": "wallet"
}
HTTP 401
