<?php
/**
 * Database Configuration
 * Handles MariaDB connection using PDO
 */

header('Content-Type: application/json');

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // XAMPP default is empty password
define('DB_NAME', 'mavrick_database');

try {
    // Create PDO connection
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        )
    );

    // Connection successful
    // Uncomment below for debugging:
    // echo json_encode(['status' => 'success', 'message' => 'Database connected']);

} catch (PDOException $e) {
    // Log error (don't expose sensitive info in production)
    error_log('Database connection error: ' . $e->getMessage());

    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed'
    ]);
    exit();
}
?>