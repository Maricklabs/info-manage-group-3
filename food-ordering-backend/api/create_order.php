<?php
/**
 * Create an order and its items
 * Expects POST with:
 *   - items: array of {food_id, quantity, price}
 *   - total_amount: total order amount
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
    error_log("Request URI: " . $_SERVER['REQUEST_URI']);
    echo json_encode(["status" => "error", "message" => "Invalid request method. Expected POST, got " . $_SERVER['REQUEST_METHOD']]);
    exit();
}

require_once '../config/db.php';

try {
    $rawInput = file_get_contents('php://input');
    error_log("Raw input received: " . $rawInput);

    $input = json_decode($rawInput, true);
    error_log("Parsed input: " . json_encode($input));

    if (!isset($input['items']) || !isset($input['total_amount'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: items or total_amount'
        ]);
        exit;
    }

    $items = $input['items'];
    $totalAmount = floatval($input['total_amount']);

    // Start transaction
    $pdo->beginTransaction();

    // 1. Create Order_Record (kiosk orders use System Kiosk cashier_id = 7)
    $orderQuery = "INSERT INTO Order_Record (customer_id, cashier_id, order_datetime, total_amount, status) 
                   VALUES (NULL, 7, NOW(), :total_amount, 'Pending')";
    $orderStmt = $pdo->prepare($orderQuery);
    $orderStmt->execute([':total_amount' => $totalAmount]);

    $orderId = $pdo->lastInsertId();

    // 2. Insert each item into OrderItems
    $itemQuery = "INSERT INTO OrderItems (order_id, food_id, order_quantity, price, subtotal_amount) 
                  VALUES (:order_id, :food_id, :quantity, :price, :subtotal)";
    $itemStmt = $pdo->prepare($itemQuery);

    foreach ($items as $item) {
        $subtotal = floatval($item['price']) * intval($item['quantity']);

        $itemStmt->execute([
            ':order_id' => $orderId,
            ':food_id' => intval($item['food_id']),
            ':quantity' => intval($item['quantity']),
            ':price' => floatval($item['price']),
            ':subtotal' => $subtotal
        ]);
    }

    // Commit transaction
    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Order placed successfully!',
        'order_id' => $orderId
    ]);

} catch (PDOException $e) {
    // Rollback transaction if error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>