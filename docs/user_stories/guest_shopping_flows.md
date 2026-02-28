# Guest Shopping Flows

## Add Product To Cart
**As a** Guest  
**I want to** Add Product To Cart  
**So that** I can Shop  

**Acceptance Criteria:**
- Quantity of the product asked for are less than or equal to the quantity in stock.
- The backend initializes a temporary "Guest" user in the Database providing a JWT token.
- Cart items are persisted against this database Guest account.

## Remove Product from Cart
**As a** Guest  
**I want to** Remove Product from Cart  
**So that** I can manage my cart  

**Acceptance Criteria:**
- Dynamically updates the database cart associated with the active Guest JWT token.

## View Cart
**As a** Guest  
**I want to** View Cart  
**So that** I can monitor my selected products  

**Acceptance Criteria:**
- Views all relevant summaries and prompts guest towards either checking out entirely as a guest or logging in.

## Create an Order
**As a** Guest  
**I want to** create an order  
**So that** I can checkout  

**Acceptance Criteria:**
- Cart is not Empty.
- Must provide thorough contact info (Email/phone/shipping address) since no account holds this info.

## Pay for Order
**As a** Guest  
**I want to** pay for order  
**So that** I can have my items delivered  

**Acceptance Criteria:**
- Provide contact info (Email/phone/address).
- There is a checkout validated for that cart.
- Order ties natively back to the provided email instead of User ID database mapping.

## Add/Edit a Review for a Product
**As a** Guest  
**I want to** add/edit a review for a product  
**So that** I can give my honest opinion  

**Acceptance Criteria:**
- Initially blocked. Guest is informed they "Must be signed up as a Customer".
- If they follow through signing up, they must still tie backward to having completed an order via email indexing to be validated as a buyer. Only then can a Single review per product be added/edited.
