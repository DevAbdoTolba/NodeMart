# NodeMart
nodejs ecommerace app api only


# ERD
```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String email UK
        String phone
        String password
        String role
        String status
        Boolean isBlocked
        Number walletBalance
        Date createdAt
        Date updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        String name
        Date createdAt
        Date updatedAt
    }

    PRODUCT {
        ObjectId _id PK
        String name
        Number price
        Number stock
        Number ratingsAverage
        String image
        ObjectId category FK "ref: Category"
        Date createdAt
        Date updatedAt
    }

    CART {
        ObjectId _id PK
        ObjectId user FK "ref: User, Unique"
        Array items "Embedded [{ productId, quantity }]"
        Date createdAt
        Date updatedAt
    }

    ORDER {
        ObjectId _id PK
        ObjectId user FK "ref: User"
        Array items "Embedded [{ product, quantity, price }]"
        String type
        Number totalPrice
        String status
        String paypalOrderId
        String paymentStatus
        Boolean COD
        Date createdAt
        Date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        String title
        String review
        Number ratings
        ObjectId user FK "ref: User"
        ObjectId product FK "ref: Product"
        Date createdAt
        Date updatedAt
    }

    WISHLIST {
        ObjectId _id PK
        ObjectId user FK "ref: User, Unique"
        Array items "Embedded [{ productId }]"
        Date createdAt
        Date updatedAt
    }

    %% Mongoose References (Populations)
    USER ||--o| CART : "has (1:1)"
    USER ||--o| WISHLIST : "has (1:1)"
    USER ||--o{ ORDER : "places (1:N)"
    USER ||--o{ REVIEW : "writes (1:N)"
    
    CATEGORY ||--o{ PRODUCT : "contains (1:N)"
    PRODUCT ||--o{ REVIEW : "receives (1:N)"
```

## Team Members

- [@Youssef Mohamed](https://github.com/Youssefmo7)
- [@Nesma Eid](https://github.com/NESMA47)
- [@Abdo Tolba](https://github.com/DevAbdoTolba)

Supervised by:
[Eng. @Mariam Hady](https://github.com/masterhady)
