<?php
/**
 * Fetch all orders with their items
 */
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    // Get all orders with cashier info
    $query = "
        SELECT 
            o.order_id,
            o.order_datetime,
            o.total_amount,
            o.status,
            c.name as cashier_name,
            COUNT(oi.order_item_id) as item_count
        FROM Order_Record o
        LEFT JOIN Cashier c ON o.cashier_id = c.cashier_id
        LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
        GROUP BY o.order_id
        ORDER BY o.order_datetime DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $orders = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $orders
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch orders: ' . $e->getMessage()
    ]);
}
?>