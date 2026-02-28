# Customer Shopping Flows

## Add Product To Cart
**As a** Customer  
**I want to** Add Product To Cart  
**So that** I can Shop  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Quantity of the product asked for are Less than or equal the quantity in stock.
- The interface properly responds with a visual "Added to Cart" toast or notification.

## Remove Product from Cart
**As a** Customer  
**I want to** Remove Product from Cart  
**So that** I can manage my cart  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Products can be completely removed from cart, updating total counts and costs.

## View Cart
**As a** Customer  
**I want to** View Cart  
**So that** I can monitor my selected products  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Subtotals, shipping estimations, and totals are evaluated in real-time.

## View Order History
**As a** Customer  
**I want to** view my order history  
**So that** I can track past purchases  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Successfully retrieves a list of all historically checked-out carts.

## View Order Details
**As a** Customer  
**I want to** view specific order details  
**So that** I can check the exact contents of a past order  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Details return if the Order ID is valid and belongs to the active user.

## Create an Order
**As a** Customer  
**I want to** create an order  
**So that** I can checkout  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Cart is not Empty.
- Address, phone, and payment methods (paypal, wallet, COD) are confirmed here.

## Pay for Order (PayPal)
**As a** Customer  
**I want to** pay for order via PayPal  
**So that** I can safely checkout  

**Acceptance Criteria:**
- Setup includes a webhook endpoint for PayPal approval logic.
- An explicit confirmation is required before modifying order state out of "Pending" towards "Paid".
- On confirmation, stock is updated and the cart is cleared.

## Pay for Order (Wallet)
**As a** Customer  
**I want to** pay using my internal Wallet balance  
**So that** I can finish checkout without an external provider  

**Acceptance Criteria:**
- Assumes the user has sufficient wallet balance or it gets charged appropriately.
- Confirms the payment, adjusts order status, updates database stock, and clears the cart simultaneously.

## Add a Review for Product
**As a** Customer  
**I want to** add a review for product  
**So that** I can give my honest opinion  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Must have completed an order with that specific product.
- System enforces a Single review per product.

## Edit my Review for Product
**As a** Customer  
**I want to** edit my review for product  
**So that** I can update my honest opinion  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Must have completed order with that product.
- Has already made a review for that product previously.

## Add to Wishlist
**As a** Customer  
**I want to** add to wishlist  
**So that** I can return again to the product  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Easily toggleable from product cards and product detail views.

## Remove a Product from Wishlist
**As a** Customer  
**I want to** remove a product from wishlist  
**So that** I can manage my wishlist effectively  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- Product is currently in wishlist.
- Action reflects instantly and persistently in user lists.
