```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        _id: { bsonType: "objectId" },
        status: { 
          enum: ["Guest", "Approved", "Restricted", "Deleted"],
          description: "Status is required for everyone"
        },
        cart: { bsonType: "array" }, // Guests need a cart
        wishlist: { bsonType: "array" },
        role: { enum: ["customer", "admin"], default: "customer" }
      },
      required: ["status"], 
      oneOf: [
        {
          properties: { status: { const: "Guest" } }
        },
        {
          required: ["name", "email", "password"], // Required only if NOT Guest
          properties: {
            name: { bsonType: "string" },
            email: { bsonType: "string", pattern: "^.+@.+$" },
            password: { bsonType: "string" }
          }
        }
      ]
    }
  }
});
```


```js
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "items", "totalAmount", "paymentMethod", "paymentStatus", "shippingDetails"],
      properties: {
        userId: { bsonType: "objectId" }, // Links to User (or converted Guest)
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["productId", "productName", "price", "quantity"],
            properties: {
              productId: { bsonType: "objectId" },
              productName: { bsonType: "string" }, // Snapshot name (in case it changes)
              price: { bsonType: "double" }, // Snapshot price
              quantity: { bsonType: "int" }
            }
          }
        },
        totalAmount: { bsonType: "double" },
        paymentMethod: { 
          enum: ["Credit_Card", "PayPal", "COD", "Wallet"] 
        },
        paymentStatus: {
          enum: ["Pending", "Completed", "Failed", "Refunded"],
          default: "Pending"
        },
        gatewayReference: { 
          bsonType: "string",
          description: "PayPal Transaction ID" 
        },
        shippingDetails: {
          bsonType: "object",
          required: ["address", "city", "phone"],
          properties: {
            address: { bsonType: "string" },
            city: { bsonType: "string" },
            phone: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  }
});
```