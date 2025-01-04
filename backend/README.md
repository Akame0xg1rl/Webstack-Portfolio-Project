# Bookstore API Documentation

## Base URL
`http://localhost:1337/api`

## Usage

- install libraries for the flask

```bash
pip3 install flask
pip3 install requests
```
- Run the backend server with the command below:

```bash
bash$ python3 app.py
```

## Authentication
Simple authentication system using email and password.

### Authentication Endpoints
- `POST /signup` - Register new user
- `POST /login` - Authenticate user

## Products

### Endpoints
- `GET /home/products` - Retrieve all products
- `POST /home/products` - Add new product
- `DELETE /home/products/:id` - Remove product

## Cart Management

### Endpoints
- `PATCH /cart` - Add item to cart
- `DELETE /cart/:id` - Remove item from cart

## Wishlist Management

### Endpoints
- `PATCH /wishlist` - Add item to wishlist
- `DELETE /wishlist/:id` - Remove item from wishlist

## User Data

### Endpoints
- `GET /user` - Get user's cart and wishlist data

## New Arrivals

### Endpoints
- `GET /newArrivalList` - Get all new arrivals
- `POST /newArrival` - Add new arrival
- `DELETE /newArrival/:id` - Remove new arrival

## Order Management

### Endpoints
- `POST /order` - Create new order
  - Sends order confirmation to Discord webhook
  - Automatically clears cart after successful order

## Error Handling
- All endpoints return appropriate HTTP status codes
- JSON responses include status and message fields
- Detailed error logging implemented

## Database
- SQLite database with tables for:
  - Products
  - Users
  - Cart
  - Wishlist
  - New Arrivals