# General User Flows

## Browse Products
**As a** USER  
**I want to** Browse  
**So that** I can shop  

**Acceptance Criteria:**
- Products are displayed in a grid or list view.
- Pagination or infinite scrolling is implemented to handle a large number of products.
- Product cards display essential info: image, name, price, and average rating.
- Empty states are handled gracefully if no products are available.

## Search Products
**As a** USER  
**I want to** Search  
**So that** I can get results faster  

**Acceptance Criteria:**
- Search bar is accessible from the main navigation.
- Search supports partial matches for product names and descriptions.
- "No results found" message is displayed clearly when no matches exist.
- Search query is preserved in the input field after searching.

## Filter Products
**As a** USER  
**I want to** Filter products  
**So that** I can navigate in fewer results  

**Acceptance Criteria:**
- Filters are available for categories, price ranges, and ratings.
- Multiple filters can be combined (AND logic).
- Filter selections are reflected in the URL for easy sharing.
- User can clear all filters with a single click.

## Signup
**As a** USER  
**I want to** Signup  
**So that** I can have an account  

**Acceptance Criteria:**
- User can input Name, Email, Phone, and Password via a well-designed form.
- Validations are triggered for required fields, valid email structures, and password strength requirements.
- Meaningful error messages are shown for invalid inputs.

## Confirm Email
**As a** USER  
**I want to** Confirm my Email  
**So that** my account becomes active and I can login  

**Acceptance Criteria:**
- User receives an email with a unique confirmation token.
- Clicking the link triggers the validation endpoint, setting the user status to verified.
- User is successfully routed toward login upon confirmation.

## Login
**As a** USER  
**I want to** Login  
**So that** I can Shop securely and see my details  

**Acceptance Criteria:**
- Has a valid account.
- Account is active, not deleted, and not Restricted.
- Password/email mismatch displays a generic, secure error message ("Invalid credentials").

## Manage Account
**As a** USER  
**I want to** Manage my account (update data or delete mine)  
**So that** I can update my data  

**Acceptance Criteria:**
- Has a valid account, active, not deleted, and not Restricted.
- User can update their contact info (Name, Phone, Address).
- User can delete their account (soft delete triggering GDPR/account removal protocols).
