<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$db = "mavrick_database";

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit();
}

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$roleid = intval($data["roleid"] ?? 0);
$identifier = trim($data["identifier"] ?? "");
$password = $data["password"] ?? "";

if (empty($identifier) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Identifier and password required"]);
    exit();
}

if ($roleid == 1) {
    $cashierQuery = $conn->prepare("SELECT cashier_id, name, password FROM cashier WHERE name = ? LIMIT 1");
    if (!$cashierQuery) {
        echo json_encode(["status" => "error", "message" => "Query prepare failed"]);
        $conn->close();
        exit();
    }

    $cashierQuery->bind_param("s", $identifier);
    $cashierQuery->execute();
    $cashierQuery->store_result();

    if ($cashierQuery->num_rows > 0) {
        $cashierQuery->bind_result($cashierId, $cashierName, $cashierPassword);
        $cashierQuery->fetch();
        if ($password === $cashierPassword) {
            echo json_encode(["status" => "success", "message" => "Cashier login successful", "userId" => $cashierId, "roleid" => 1]);
            $cashierQuery->close();
            $conn->close();
            exit();
        }

        echo json_encode(["status" => "error", "message" => "Incorrect password"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Cashier not found"]);
    }

    $cashierQuery->close();
    $conn->close();
    exit();

} elseif ($roleid == 3) {
    $adminQuery = $conn->prepare("SELECT admin_id, username, password FROM admin WHERE username = ? LIMIT 1");
    if (!$adminQuery) {
        echo json_encode(["status" => "error", "message" => "Query prepare failed"]);
        $conn->close();
        exit();
    }

    $adminQuery->bind_param("s", $identifier);
    $adminQuery->execute();
    $adminQuery->store_result();

    if ($adminQuery->num_rows > 0) {
        $adminQuery->bind_result($adminId, $adminUsername, $adminPassword);
        $adminQuery->fetch();
        if ($password === $adminPassword) {
            echo json_encode(["status" => "success", "message" => "Admin login successful", "userId" => $adminId, "roleid" => 3]);
            $adminQuery->close();
            $conn->close();
            exit();
        }

        echo json_encode(["status" => "error", "message" => "Incorrect password"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Admin not found"]);
    }

    $adminQuery->close();
    $conn->close();
    exit();

}
echo json_encode(["status" => "error", "message" => "User not found"]);
$conn->close();
exit();
?>