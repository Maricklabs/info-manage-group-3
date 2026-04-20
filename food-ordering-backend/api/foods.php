<?php

require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
$host = "localhost";
$user = "root";
$pass = "";
$db = "mavrick_database";
//select all foods
try {
    $query = "SELECT food_id, food_name, category, price, stock_qty FROM Foods ORDER BY food_name";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $foods = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $foods
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch foods: ' . $e->getMessage()
    ]);
}
?>