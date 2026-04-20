<?php
/**
 * Update order status and assign cashier
 * Expects POST with:
 *   - order_id: order to update
 *   - status: new status (e.g., 'Completed', 'Cancelled')
 *   - cashier_id: cashier updating the order
 */
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method. Use POST."]);
    exit();
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['order_id']) || !isset($input['status']) || !isset($input['cashier_id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: order_id, status, or cashier_id'
        ]);
        exit;
    }

    $orderId = intval($input['order_id']);
    $status = $input['status'];
    $cashierId = intval($input['cashier_id']);

    // Validate status
    $validStatuses = ['Pending', 'Completed', 'Cancelled'];
    if (!in_array($status, $validStatuses)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid status. Must be: Pending, Completed, or Cancelled'
        ]);
        exit;
    }

    // Update order status and assign cashier
    $updateQuery = "UPDATE Order_Record 
                    SET status = :status, cashier_id = :cashier_id 
                    WHERE order_id = :order_id";
    $updateStmt = $pdo->prepare($updateQuery);
    $updateStmt->execute([
        ':status' => $status,
        ':cashier_id' => $cashierId,
        ':order_id' => $orderId
    ]);

    if ($updateStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Order not found'
        ]);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Order updated successfully!',
        'order_id' => $orderId
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>