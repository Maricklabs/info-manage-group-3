<?php
/**
 * Diagnostic endpoint to test database connection and foods
 */
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$diagnostics = [];

// Test 1: Check connection
try {
    $result = $pdo->query("SELECT 1");
    $diagnostics['database'] = 'Connected ✓';
} catch (Exception $e) {
    $diagnostics['database'] = 'Connection failed: ' . $e->getMessage();
}

// Test 2: Check Foods table exists
try {
    $result = $pdo->query("SHOW TABLES LIKE 'Foods'");
    if ($result->rowCount() > 0) {
        $diagnostics['foods_table'] = 'Exists ✓';
    } else {
        $diagnostics['foods_table'] = 'Table not found';
    }
} catch (Exception $e) {
    $diagnostics['foods_table'] = 'Error: ' . $e->getMessage();
}

// Test 3: Count foods
try {
    $result = $pdo->query("SELECT COUNT(*) as count FROM Foods");
    $count = $result->fetch()['count'];
    $diagnostics['food_count'] = $count . ' foods found';

    if ($count > 0) {
        $result = $pdo->query("SELECT food_id, food_name, price, stock_qty FROM Foods LIMIT 3");
        $diagnostics['sample_foods'] = $result->fetchAll();
    } else {
        $diagnostics['sample_foods'] = 'No foods in database. Insert sample data.';
    }
} catch (Exception $e) {
    $diagnostics['food_count'] = 'Error: ' . $e->getMessage();
}

echo json_encode($diagnostics, JSON_PRETTY_PRINT);
?>