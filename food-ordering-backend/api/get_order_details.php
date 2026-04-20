<?php
/**
 * Fetch order details with all items
 */
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (!isset($_GET['order_id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing order_id']);
    exit;
}

$orderId = intval($_GET['order_id']);

try {
    // Get order details
    $orderQuery = "
        SELECT 
            o.order_id,
            o.order_datetime,
            o.total_amount,
            o.status,
            c.name as cashier_name
        FROM Order_Record o
        LEFT JOIN Cashier c ON o.cashier_id = c.cashier_id
        WHERE o.order_id = :order_id
    ";

    $orderStmt = $pdo->prepare($orderQuery);
    $orderStmt->execute([':order_id' => $orderId]);
    $order = $orderStmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found']);
        exit;
    }

    // Get order items
    $itemsQuery = "
        SELECT 
            oi.order_item_id,
            oi.food_id,
            f.food_name,
            f.category,
            oi.order_quantity,
            oi.price,
            oi.subtotal_amount
        FROM OrderItems oi
        JOIN Foods f ON oi.food_id = f.food_id
        WHERE oi.order_id = :order_id
    ";

    $itemsStmt = $pdo->prepare($itemsQuery);
    $itemsStmt->execute([':order_id' => $orderId]);
    $items = $itemsStmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => [
            'order' => $order,
            'items' => $items
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch order details: ' . $e->getMessage()
    ]);
}
?>