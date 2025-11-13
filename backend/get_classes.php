<?php
require("db.php");
header("Content-Type: application/json");

$sql = "SELECT * FROM classes ORDER BY id DESC";
$result = $conn->query($sql);

$classes = [];
while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

echo json_encode(["success" => true, "data" => $classes]);
$conn->close();
?>
