<?php
session_start();
header('Content-Type: application/json');

$response = ["logged_in" => false, "is_admin" => false, "username" => null];

if (isset($_SESSION['admin']) && $_SESSION['admin'] === true) {
    $response["logged_in"] = true;
    $response["is_admin"] = true;
    $response["username"] = $_SESSION['fullname'] ?? 'Administrator';
} elseif (isset($_SESSION['user_id'])) {
    $response["logged_in"] = true;
    $response["is_admin"] = false;
    $response["username"] = $_SESSION['fullname'] ?? null;
}

echo json_encode($response);
?>
