<?php
require('db.php');
header('Content-Type: application/json');
session_start();

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

// ✅ Admin override
if ($username === "admin@gmail.com" && $password === "123456") {
    $_SESSION["admin"] = true;
    echo json_encode([
        "success" => true,
        "isAdmin" => true,
        "message" => "Admin login successful!"
    ]);
    exit;
}

// ✅ Continue normal user login
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE username=? OR email=? LIMIT 1");
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

// Check password
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

$conn->close();
?>
