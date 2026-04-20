<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$user = "root";        // default XAMPP user
$pass = "";            // default XAMPP password (empty)
$db = "mavrick_database";

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "message" => "Database connection failed"]));
    }
    // Get POST data
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'] ?? '';
    $contactNumber = $data['contactNumber'] ?? '';
    $password = $data['password'] ?? '';

    // Basic validation
    if (empty($name) || empty($contactNumber) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit();
    }

    // Insert user into database
    $stmt = $conn->prepare("INSERT INTO cashier (name, contact_no, password) VALUES (?, ?, ?)");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        $conn->close();
        exit();
    }


    $stmt->bind_param("sss", $name, $contactNumber, $password);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User registered successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to register user: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>