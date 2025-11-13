<?php
require("db.php");
header("Content-Type: application/json");

$sql = "SELECT * FROM orders ORDER BY id DESC";
$result = $conn->query($sql);

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode(["success" => true, "data" => $orders]);
$conn->close();
?>
