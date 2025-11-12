<?php
// backend/check_session.php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["admin_logged_in"]) && $_SESSION["admin_logged_in"] === true) {
    echo json_encode([
        "logged_in" => true,
        "admin_name" => $_SESSION["admin_name"]
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}
?>
