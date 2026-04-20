-- 1. Independent Tables (Base Data)
CREATE TABLE UserRole (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE Customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20),
    address TEXT
);

CREATE TABLE Venue (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_name VARCHAR(100) NOT NULL,
    venue_address TEXT,
    capacity INT
);

CREATE TABLE Utilities (
    utility_id INT PRIMARY KEY AUTO_INCREMENT,
    utility_name VARCHAR(100) NOT NULL,
    description TEXT,
    rental_price DECIMAL(10, 2),
    stock_qty INT NOT NULL
);

CREATE TABLE Foods (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    stock_qty INT NOT NULL
);

-- 2. Staff & Logging
CREATE TABLE Cashier (
    cashier_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES UserRole(role_id)
);

CREATE TABLE TransactionLog (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    cashier_id INT,
    action VARCHAR(255),
    tablename VARCHAR(50),
    reference_id INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cashier_id) REFERENCES Cashier(cashier_id)
);

-- 3. Core Transactions (Orders & Bookings)
CREATE TABLE Order_Record (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NULL, 
    cashier_id INT NOT NULL,
    order_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (cashier_id) REFERENCES Cashier(cashier_id)
);

CREATE TABLE Booking (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    event_date DATE NOT NULL,
    venue_id INT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    start_time TIME,
    end_time TIME,
    cashier_id INT NULL,
    booking_type VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id),
    FOREIGN KEY (cashier_id) REFERENCES Cashier(cashier_id)
);

-- 4. Transaction Details (Junction Tables)
CREATE TABLE OrderItems (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    order_quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Order_Record(order_id),
    FOREIGN KEY (food_id) REFERENCES Foods(food_id)
);

CREATE TABLE BookingUtilities (
    booking_utility_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    utility_id INT NOT NULL,
    requested_qty INT NOT NULL,
    rental_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (utility_id) REFERENCES Utilities(utility_id)
);

CREATE TABLE BookingFoods (
    booking_food_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    food_id INT NOT NULL,
    qty_requested INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (food_id) REFERENCES Foods(food_id)
);

-- 5. Financials (Invoices & Payments)
CREATE TABLE Invoice (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NULL,
    booking_id INT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid',
    FOREIGN KEY (order_id) REFERENCES Order_Record(order_id),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
);

CREATE TABLE Sales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    sale_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
);