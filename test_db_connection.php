<?php
require_once 'backend/config/Database.php';
$db = new Database();
$conn = $db->connect();
if ($conn) {
    echo "Connection SUCCESSFUL\n";
    $query = "SELECT COUNT(*) as count FROM users";
    try {
        $stmt = $conn->query($query);
        $row = $stmt->fetch();
        echo "Users count: " . $row['count'] . "\n";
    } catch (Exception $e) {
        echo "Error querying users table: " . $e->getMessage() . "\n";
    }
} else {
    echo "Connection FAILED\n";
}
?>
