from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import logging
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def get_db_connection():
    conn = sqlite3.connect('bookstore.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create products table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        _id TEXT PRIMARY KEY,
        bookName TEXT,
        author TEXT,
        originalPrice REAL,
        discountedPrice REAL,
        discountPercent INTEGER,
        imgSrc TEXT,
        imgAlt TEXT,
        badgeText TEXT,
        outOfStock BOOLEAN,
        fastDeliveryAvailable BOOLEAN,
        genre TEXT,
        rating INTEGER,
        description TEXT
    )
    ''')

    # Create wishlist table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT,
        FOREIGN KEY (book_id) REFERENCES products (_id)
    )
    ''')

    # Create cart table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT,
        FOREIGN KEY (book_id) REFERENCES products (_id)
    )
    ''')

    # Create users table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')

    # Create newArrivalList table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS newArrivalList (
        _id TEXT PRIMARY KEY,
        bookName TEXT,
        author TEXT,
        originalPrice REAL,
        discountedPrice REAL,
        discountPercent INTEGER,
        imgSrc TEXT,
        imgAlt TEXT,
        badgeText TEXT,
        outOfStock BOOLEAN,
        fastDeliveryAvailable BOOLEAN,
        genre TEXT,
        rating INTEGER,
        description TEXT
    )
    ''')
    
    conn.commit()
    conn.close()
    app.logger.info("Database initialized successfully")

# Initialize the database
with app.app_context():
    init_db()

@app.route('/api/home/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    conn.close()
    
    return jsonify({"productsList": [dict(product) for product in products]})

@app.route('/api/home/products', methods=['POST'])
def add_product():
    data = request.json
    product = data.get('productDetails')
    
    if not product or '_id' not in product:
        return jsonify({"status": "error", "message": "Invalid product data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO products 
            (_id, bookName, author, originalPrice, discountedPrice, discountPercent, 
            imgSrc, imgAlt, badgeText, outOfStock, fastDeliveryAvailable, genre, 
            rating, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['_id'], product['bookName'], product['author'], product['originalPrice'],
            product['discountedPrice'], product['discountPercent'], product['imgSrc'],
            product['imgAlt'], product['badgeText'], product['outOfStock'],
            product['fastDeliveryAvailable'], product['genre'], product['rating'],
            product['description']
        ))
        conn.commit()
        return jsonify({"status": "ok", "message": "Product added successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error adding product: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to add product"}), 500
    finally:
        conn.close()

@app.route('/api/home/products/<string:id>', methods=['DELETE'])
def remove_product(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM products WHERE _id = ?", (id,))
        conn.commit()
        return jsonify({"status": "ok", "message": "Product removed successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error removing product: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to remove product"}), 500
    finally:
        conn.close()

@app.route('/api/user', methods=['GET'])
def get_user_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Fetch wishlist
        cursor.execute('''
            SELECT p.* FROM products p
            JOIN wishlist w ON p._id = w.book_id
        ''')
        wishlist = cursor.fetchall()

        # Fetch cart
        cursor.execute('''
            SELECT p.* FROM products p
            JOIN cart c ON p._id = c.book_id
        ''')
        cart = cursor.fetchall()
        
        return jsonify({
            "status": "ok",
            "user": {
                "wishlist": [dict(book) for book in wishlist],
                "cart": [dict(item) for item in cart]
            }
        }), 200
    except Exception as e:
        app.logger.error(f"Unexpected error fetching user data: {str(e)}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/api/wishlist', methods=['PATCH'])
def add_to_wishlist():
    data = request.json
    product = data.get('productdetails')
    
    if not product or '_id' not in product:
        return jsonify({"status": "error", "message": "Invalid product data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Add product to products table if not exists
        cursor.execute("INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                       (product['_id'], product['bookName'], product['author'], product['originalPrice'],
                        product['discountedPrice'], product['discountPercent'], product['imgSrc'],
                        product['imgAlt'], product['badgeText'], product['outOfStock'],
                        product['fastDeliveryAvailable'], product['genre'], product['rating'],
                        product['description']))

        # Add to wishlist
        cursor.execute("INSERT OR IGNORE INTO wishlist (book_id) VALUES (?)", (product['_id'],))
        conn.commit()

        return jsonify({"status": "ok", "message": "Product added to wishlist"}), 200
    except Exception as e:
        app.logger.error(f"Error adding product to wishlist: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to add product to wishlist"}), 500
    finally:
        conn.close()

@app.route('/api/wishlist/<string:id>', methods=['DELETE'])
def remove_from_wishlist(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM wishlist WHERE book_id = ?", (id,))
        conn.commit()
        return jsonify({"status": "ok", "message": "Product removed from wishlist"}), 200
    except Exception as e:
        app.logger.error(f"Error removing product from wishlist: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to remove product from wishlist"}), 500
    finally:
        conn.close()

@app.route('/api/cart', methods=['PATCH'])
def add_to_cart():
    try:
        # Validate request has JSON data
        if not request.is_json:
            app.logger.error("Request does not contain JSON data")
            return jsonify({"status": "error", "message": "Request must be JSON"}), 400

        data = request.json
        app.logger.debug(f"Received data: {data}")  # Log received data

        # Check for both possible key names
        product = data.get('productdetails') or data.get('productDetails')
        
        if not product:
            app.logger.error("No product details found in request")
            return jsonify({"status": "error", "message": "No product details found"}), 400

        if '_id' not in product:
            app.logger.error("Product ID missing from request")
            return jsonify({"status": "error", "message": "Product ID is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # First check if product exists in products table
            cursor.execute("SELECT _id FROM products WHERE _id = ?", (product['_id'],))
            existing_product = cursor.fetchone()

            if not existing_product:
                # Add product to products table if it doesn't exist
                cursor.execute("""
                    INSERT INTO products 
                    (_id, bookName, author, originalPrice, discountedPrice, discountPercent,
                    imgSrc, imgAlt, badgeText, outOfStock, fastDeliveryAvailable, genre,
                    rating, description)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    product['_id'], 
                    product.get('bookName', ''),
                    product.get('author', ''),
                    product.get('originalPrice', 0),
                    product.get('discountedPrice', 0),
                    product.get('discountPercent', 0),
                    product.get('imgSrc', ''),
                    product.get('imgAlt', ''),
                    product.get('badgeText', ''),
                    product.get('outOfStock', False),
                    product.get('fastDeliveryAvailable', False),
                    product.get('genre', ''),
                    product.get('rating', 0),
                    product.get('description', '')
                ))

            # Check if item already exists in cart
            cursor.execute("SELECT id FROM cart WHERE book_id = ?", (product['_id'],))
            existing_cart_item = cursor.fetchone()

            if not existing_cart_item:
                # Add to cart only if not already present
                cursor.execute("INSERT INTO cart (book_id) VALUES (?)", (product['_id'],))
                
            conn.commit()
            return jsonify({"status": "ok", "message": "Product added to cart successfully"}), 200

        except sqlite3.Error as e:
            app.logger.error(f"Database error: {str(e)}")
            return jsonify({"status": "error", "message": "Database error occurred"}), 500
        finally:
            conn.close()

    except Exception as e:
        app.logger.error(f"Unexpected error in add_to_cart: {str(e)}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

@app.route('/api/cart/<string:id>', methods=['DELETE', 'OPTIONS'])
def remove_from_cart(id):
    # Handle OPTIONS request for CORS
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        # Add required CORS headers
        response.headers['Access-Control-Allow-Methods'] = 'DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if item exists in cart
        cursor.execute("SELECT id FROM cart WHERE book_id = ?", (id,))
        existing_item = cursor.fetchone()
        
        if not existing_item:
            return jsonify({
                "status": "error", 
                "message": "Item not found in cart"
            }), 404
            
        # Remove item from cart
        cursor.execute("DELETE FROM cart WHERE book_id = ?", (id,))
        conn.commit()
        
        return jsonify({
            "status": "ok", 
            "message": "Product removed from cart successfully"
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error removing product from cart: {str(e)}")
        return jsonify({
            "status": "error", 
            "message": "Failed to remove product from cart"
        }), 500
        
    finally:
        conn.close()

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('newUserName')
    email = data.get('newUserEmail')
    password = data.get('newUserPassword')

    if not username or not email or not password:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                       (username, email, hashed_password))
        conn.commit()
        return jsonify({"status": "ok"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "Username or email already exists"}), 409
    except Exception as e:
        app.logger.error(f"Error during signup: {str(e)}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('userEmail')
    password = data.get('userPassword')

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password'], password):
            return jsonify({"status": "ok", "user": user['id']}), 200
        else:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    except Exception as e:
        app.logger.error(f"Error during login: {str(e)}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/api/newArrivalList', methods=['GET'])
def get_new_arrivals():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM newArrivalList")
    new_arrivals = cursor.fetchall()
    conn.close()
    
    return jsonify({"newArrivalList": [dict(product) for product in new_arrivals]})

@app.route('/api/newArrival', methods=['POST'])
def add_new_arrival():
    data = request.json
    product = data.get('productDetails')
    
    if not product or '_id' not in product:
        return jsonify({"status": "error", "message": "Invalid product data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO newArrivalList 
            (_id, bookName, author, originalPrice, discountedPrice, discountPercent, 
            imgSrc, imgAlt, badgeText, outOfStock, fastDeliveryAvailable, genre, 
            rating, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['_id'], product['bookName'], product['author'], product['originalPrice'],
            product['discountedPrice'], product['discountPercent'], product['imgSrc'],
            product['imgAlt'], product['badgeText'], product['outOfStock'],
            product['fastDeliveryAvailable'], product['genre'], product['rating'],
            product['description']
        ))
        conn.commit()
        return jsonify({"status": "ok", "message": "New arrival added successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error adding new arrival: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to add new arrival"}), 500
    finally:
        conn.close()

@app.route('/api/newArrival/<string:id>', methods=['DELETE'])
def remove_new_arrival(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM newArrivalList WHERE _id = ?", (id,))
        conn.commit()
        return jsonify({"status": "ok", "message": "New arrival removed successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error removing new arrival: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to remove new arrival"}), 500
    finally:
        conn.close()


DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/"  # Replace with your webhook URL

@app.route('/api/order', methods=['POST', 'OPTIONS'])
def create_order():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        data = request.json
        customer_info = data.get('customerInfo', {})
        order_details = data.get('orderDetails', {})

        if not customer_info or not order_details:
            return jsonify({
                "status": "error",
                "message": "Missing required information"
            }), 400

        # Safely get values with defaults
        total_amount = float(order_details.get('totalAmount', 0))
        discount = float(order_details.get('discount', 0))
        items = order_details.get('items', [])

        # Format items for Discord message
        items_formatted = "\n".join([
            f"• {item.get('bookName', 'Unknown Book')} x{item.get('quantity', 1)} - MAD {float(item.get('discountedPrice', 0)) * float(item.get('quantity', 1))}"
            for item in items
        ]) or "No items"

        # Create Discord message embed
        embed = {
            "embeds": [{
                "title": "📚 New Order Received! 🛍️",
                "color": 0xFF69B4,
                "fields": [
                    {
                        "name": "👤 Customer Information",
                        "value": f"""
                            **Name:** {customer_info.get('fullName', 'N/A')}
                            **Email:** {customer_info.get('email', 'N/A')}
                            **Phone:** {customer_info.get('phone', 'N/A')}
                            **Address:** {customer_info.get('address', 'N/A')}
                            **City:** {customer_info.get('city', 'N/A')}
                        """.strip(),
                        "inline": False
                    },
                    {
                        "name": "📖 Order Items",
                        "value": items_formatted,
                        "inline": False
                    },
                    {
                        "name": "💰 Order Summary",
                        "value": f"""
                            **Subtotal:** MAD {total_amount - 50 if total_amount > 50 else 0}
                            **Discount:** MAD {discount}
                            **Delivery:** MAD 50
                            **Total:** MAD {total_amount}
                        """.strip(),
                        "inline": False
                    }
                ],
                "footer": {
                    "text": f"Order received at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
                }
            }]
        }

        # Add notes if provided
        if customer_info.get('notes'):
            embed["embeds"][0]["fields"].append({
                "name": "📝 Additional Notes",
                "value": customer_info.get('notes'),
                "inline": False
            })

        # Send to Discord
        response = requests.post(
            DISCORD_WEBHOOK_URL,
            json=embed,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code != 204:
            app.logger.error(f"Discord webhook error: {response.text}")
            return jsonify({
                "status": "error",
                "message": "Failed to send order notification"
            }), 500

        # Clear the user's cart after successful order
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM cart")
            conn.commit()
        except Exception as e:
            app.logger.error(f"Error clearing cart: {str(e)}")
        finally:
            conn.close()

        return jsonify({
            "status": "ok",
            "message": "Order placed successfully"
        }), 200

    except Exception as e:
        app.logger.error(f"Error processing order: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337, debug=True)