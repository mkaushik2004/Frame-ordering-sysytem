<?php
require('db.php');
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

// Collect data safely
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$age = intval($data['age'] ?? 0);
$sessionDate = $data['sessionDate'] ?? '';
$sessionTime = $data['sessionTime'] ?? '';
$sessionType = trim($data['sessionType'] ?? '');
$artMedium = trim($data['artMedium'] ?? '');
$experienceLevel = trim($data['experienceLevel'] ?? '');
$classDuration = trim($data['classDuration'] ?? '');
$classSize = trim($data['classSize'] ?? '');
$budget = trim($data['budget'] ?? '');
$learningGoals = trim($data['learningGoals'] ?? '');
$specialRequests = trim($data['specialRequests'] ?? '');

if (empty($name) || empty($email) || empty($phone) || empty($sessionDate)) {
    echo json_encode(["success" => false, "message" => "Please fill in all required fields"]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO classes 
    (name, email, phone, age, session_date, session_time, session_type, art_medium, 
     experience_level, class_duration, class_size, budget, learning_goals, special_requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssssssssssss",
    $name, $email, $phone, $age, $sessionDate, $sessionTime, $sessionType, $artMedium,
    $experienceLevel, $classDuration, $classSize, $budget, $learningGoals, $specialRequests
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Class booking submitted successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
