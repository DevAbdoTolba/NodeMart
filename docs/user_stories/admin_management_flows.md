# Admin Management Flows

## Manage Users
**As an** Admin  
**I want to** Manage Users  
**So that** I can CRUD USER info  

**Acceptance Criteria:**
- Has a valid account.
- Account is active.
- Role is an Admin.
- Currently limited to Blocking/Unblocking users (adjusting their status). Read-all access is not active in the current implementation.
- Cannot self-delete or override roles of other equal admins unelss Super Admin.

## Restrict (Ban) Users
**As an** Admin  
**I want to** Restrict (Ban) Users  
**So that** I can stop USER interactions  

**Acceptance Criteria:**
- Has a valid account, active, and Role is Admin.
- Flagging a user automatically drops their active sessions / JWT invalidation depending on implementation.
- Restricted user gets a generic "Account restricted. Contact support." message on subsequent login attempts.

## Manage Products
**As an** Admin  
**I want to** Manage Products  
**So that** I can CRUD Product info  

**Acceptance Criteria:**
- Has a valid account, active, and Role is Admin.
- Can create new items with image uploads, set stock limits, and prices.
- Deleting products is handled via soft-delete to not corrupt older historical order data.

## Assign Categories to Products
**As an** Admin  
**I want to** Assign Categories to Products  
**So that** I can Group Products by Category  

**Acceptance Criteria:**
- Has a valid account, active, and Role is Admin.
- Selectively map one-to-many relationships for Category -> Product mapping.

## Manage Categories
**As an** Admin  
**I want to** Manage Categories  
**So that** I can CRUD Category info  

**Acceptance Criteria:**
- Has a valid account, active, and Role is Admin.
- Category names must be unique.
- Editing a category propagates changes globally to all products using it.

## Manage Reviews
**As an** Admin  
**I want to** Manage Reviews  
**So that** I can Delete reviews  

**Acceptance Criteria:**
- Has a valid account, active, and Role is Admin.
- Can delete specific reviews if they violate guidelines.
- Product average rating recalculates after deletion of a review.

## Manage Orders
**As an** Admin  
**I want to** Manage Orders  
**So that** I can update status of an Order  

**Acceptance Criteria:**
- Has a valid account, active, and Role is Admin.
- Order is paid (Completed).
- Can track and update status updates between explicitly defined states (e.g., Pending, Shipped, Delivered).

## View Store Stats
**As an** Admin  
**I want to** View Store Stats  
**So that** I can monitor business performance  

**Acceptance Criteria:**
- Has a valid account, active, and Role is Admin.
- Dashboard displays Total Revenue and Total Orders aggregated efficiently from the database.
