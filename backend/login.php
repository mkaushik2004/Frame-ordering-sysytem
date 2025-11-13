<?php
require('db.php');
header('Content-Type: application/json');
session_start();

// Get input data
$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

// Validate input
if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Username and password required"]);
    exit;
}

// 🔒 ADMIN LOGIN (hardcoded)
if ($username === "admin@gmail.com" && $password === "123456") {
    $_SESSION["admin"] = true;
    $_SESSION["fullname"] = "Administrator";

    echo json_encode([
        "success" => true,
        "isAdmin" => true,
        "message" => "Admin login successful",
        "user" => ["name" => "Administrator"]
    ]);
    exit;
}

// 🔍 NORMAL USER LOGIN
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, fullname, password FROM users WHERE username=? OR email=? LIMIT 1");
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['fullname'] = $user['fullname'];

    echo json_encode([
        "success" => true,
        "isAdmin" => false,
        "message" => "Login successful",
        "user" => [
            "id" => $user['id'],
            "name" => $user['fullname']
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid password"]);
}

$stmt->close();
$conn->close();
?>
