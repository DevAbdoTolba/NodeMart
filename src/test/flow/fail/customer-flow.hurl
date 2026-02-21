# Customer Flow - Fail
# Bad registration, bad login, missing auth, invalid inputs

# Register with missing name
POST http://localhost:3000/api/auth/register
Content-Type: application/json
{
  "email": "bad@test.com",
  "phone": "01012345678",
  "password": "Test@1234"
}
HTTP 400

# Register with weak password
POST http://localhost:3000/api/auth/register
Content-Type: application/json
{
  "name": "Bad User",
  "email": "bad2@test.com",
  "phone": "01012345678",
  "password": "weak"
}
HTTP 400

# Register with invalid phone
POST http://localhost:3000/api/auth/register
Content-Type: application/json
{
  "name": "Bad Phone",
  "email": "bad3@test.com",
  "phone": "12345",
  "password": "Test@1234"
}
HTTP 400

# Login with missing email
POST http://localhost:3000/api/auth/login
Content-Type: application/json
{
  "password": "Test@1234"
}
HTTP 400

# Login with missing password
POST http://localhost:3000/api/auth/login
Content-Type: application/json
{
  "email": "test@test.com"
}
HTTP 400

# Login with wrong credentials
POST http://localhost:3000/api/auth/login
Content-Type: application/json
{
  "email": "doesnotexist@test.com",
  "password": "Wrong@1234"
}
HTTP 401

# Get profile without token
GET http://localhost:3000/api/user/me
HTTP 401

# Get product with invalid ID
GET http://localhost:3000/api/products/not-a-valid-id
HTTP 400

# Create product with missing fields
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "stock": 10
}
HTTP 400

# Create product with negative price
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "name": "Bad Product",
  "price": -5
}
HTTP 400

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
