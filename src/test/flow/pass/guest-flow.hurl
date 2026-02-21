# Guest Flow - Pass
# Guest auto-creation via cart -> Cart operations -> Browse

# Create a Product (needed for cart)
POST http://localhost:3000/api/products
Content-Type: application/json
{
  "name": "Guest Product",
  "price": 49.99,
  "stock": 5
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

# Get Cart
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

# Browse Products (no auth needed)
GET http://localhost:3000/api/products
HTTP 200

# Browse Reviews (no auth needed)
GET http://localhost:3000/api/reviews
HTTP 200
