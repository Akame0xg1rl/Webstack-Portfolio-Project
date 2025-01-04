import sqlite3

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('bookstore.db')
cursor = conn.cursor()

# Create the products table
cursor.execute('''
CREATE TABLE IF NOT EXISTS products (
    _id TEXT PRIMARY KEY,
    bookName TEXT,
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

# List of products to insert
products = [
    ('623012bb16d6b222d99D64b2', 'Mindful Planner 2024', 300.0, 150.0, 50, 'https://i.imgur.com/nFwVxck.png', 'Mindfulness Planner', 'New Arrival', 1, 1, 'Health & Wellness', 4, 'The Mindful Planner is designed for those who want to embrace mindfulness in their day-to-day activities. This planner features prompts and spaces for reflection, making it perfect for maintaining a healthy balance in life.'),
    ('623012bb16d6b222d99D64b3', 'Creative Designer Planner 2024', 500.0, 250.0, 50, 'https://i.imgur.com/4K0nX9g.png', 'Creative Planner', 'Limited Edition', 0, 1, 'Design', 5, 'This unique planner is perfect for creative minds, offering plenty of room for sketches, notes, and design ideas. It’s a must-have for designers and artists alike.'),
    ('623012bb16d6b222d99D64b4', 'Ultimate Goal Setting Planner 2024', 450.0, 225.0, 50, 'https://i.imgur.com/xGzFqsO.png', 'Goal Planner', 'Best Seller', 0, 1, 'Personal Development', 5, 'Achieve your goals with the Ultimate Goal Setting Planner, featuring pages for monthly, weekly, and daily goal tracking, and motivation boosters to keep you on track.'),
    ('623012bb16d6b222d99D64b5', 'Lifestyle Organizer 2024',  400.0, 200.0, 50, 'https://i.imgur.com/mkllzRk.png', 'Lifestyle Planner', 'Top Pick', 0, 1, 'Lifestyle', 4, 'Stay organized and keep track of everything in your life, from health and fitness to finances and daily activities, all in one beautiful planner.'),
    ('623012bb16d6b222d99D64b6', 'Travel Planner 2024', 350.0, 175.0, 50, 'https://i.imgur.com/BhkhHYZ.png', 'Travel Planning', 'New Arrival', 0, 1, 'Travel', 5, 'Plan your next adventure with this travel planner that features sections for destinations, itineraries, packing lists, and more. Perfect for any wanderluster.'),
    ('623012bb16d6b222d99D64b7', 'Academic Planner 2024', 250.0, 125.0, 50, 'https://i.imgur.com/tz8L2k5.png', 'Student Planner', 'Top Rated', 1, 1, 'Education', 4, 'Designed for students, this planner helps you keep track of assignments, exams, and study schedules while staying on top of all your academic goals.'),
    ('623012bb16d6b222d99D64b8', 'Fitness Planner 2024', 300.0, 150.0, 50, 'https://i.imgur.com/8PB7xoK.png', 'Fitness Planner', 'Limited Edition', 0, 1, 'Health & Fitness', 5, 'Track your workouts, nutrition, and fitness goals with this comprehensive fitness planner that helps you stay focused and motivated on your fitness journey.'),
    ('623012bb16d6b222d99D64b9', 'Budget Planner 2024', 250.0, 125.0, 50, 'https://i.imgur.com/zWiPeZO.png', 'Budgeting Planner', 'Best Seller', 0, 1, 'Finance', 5, 'This planner is designed to help you manage your finances, track your expenses, set up budgets, and save for future goals with ease.')
]

# Insert each product into the table
cursor.executemany('''
INSERT OR REPLACE INTO products (
    _id, bookName, author, originalPrice, discountedPrice, discountPercent,
    imgSrc, imgAlt, badgeText, outOfStock, fastDeliveryAvailable, genre, rating, description
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', products)

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Products inserted successfully!")
