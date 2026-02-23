# Customer Flow - Fail
# Bad registration, bad login, missing auth, invalid inputs, accountGuard blocks

# Register with missing name
POST http://localhost:3000/api/users/register
Content-Type: application/json
{
  "email": "bad@test.com",
  "phone": "01012345678",
  "password": "Test@1234"
}
HTTP 400

# Register with weak password
POST http://localhost:3000/api/users/register
Content-Type: application/json
{
  "name": "Bad User",
  "email": "bad2@test.com",
  "phone": "01012345678",
  "password": "weak"
}
HTTP 400

# Register with invalid phone
POST http://localhost:3000/api/users/register
Content-Type: application/json
{
  "name": "Bad Phone",
  "email": "bad3@test.com",
  "phone": "12345",
  "password": "Test@1234"
}
HTTP 400

# Login with missing email
POST http://localhost:3000/api/users/login
Content-Type: application/json
{
  "password": "Test@1234"
}
HTTP 400

# Login with missing password
POST http://localhost:3000/api/users/login
Content-Type: application/json
{
  "email": "test@test.com"
}
HTTP 400

# Login with wrong credentials
POST http://localhost:3000/api/users/login
Content-Type: application/json
{
  "email": "doesnotexist@test.com",
  "password": "Wrong@1234"
}
HTTP 401

# Get profile without token
GET http://localhost:3000/api/users/me
HTTP 401

# Get product with invalid ID
GET http://localhost:3000/api/products/not-a-valid-id
HTTP 400

# Create product without auth -> 401 (protect middleware runs first)
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "stock": 10
}
HTTP 401

# Create product without auth -> 401 (protect middleware runs first)
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "name": "Bad Product",
  "price": -5
}
HTTP 401

# Add to cart missing productId
POST http://localhost:3000/api/cart
Content-Type: application/json
{
  "quantity": 2
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

# Create review missing fields
POST http://localhost:3000/api/reviews
Content-Type: application/json
token: faketoken
{
  "title": "Incomplete"
}
HTTP 401

# Create review with rating out of range
POST http://localhost:3000/api/reviews
Content-Type: application/json
token: faketoken
{
  "title": "Bad",
  "review": "Should fail",
  "ratings": 10,
  "product": "aaaaaaaaaaaaaaaaaaaaaaaa"
}
HTTP 401

# Confirm PayPal with missing paypalOrderId
POST http://localhost:3000/api/cart/payments/paypal/confirm
Content-Type: application/json
{
}
HTTP 400

# Confirm PayPal with fake order ID
POST http://localhost:3000/api/cart/payments/paypal/confirm
Content-Type: application/json
{
  "paypalOrderId": "FAKE_ORDER_123"
}
HTTP 500
