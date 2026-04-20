<?php
include 'config/db.php';

try {
    // Test a query
    $stmt = $pdo->query("SELECT 1 as connection_test");
    $result = $stmt->fetch();

    echo json_encode([
        'status' => 'success',
        'message' => 'Database connected successfully!',
        'database' => 'food_ordering_db'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>