<?php
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/config/Database.php';

echo "=== Database Connection Test ===\n";
echo "DB Host: " . ($_ENV['DB_HOST'] ?? 'localhost') . "\n";
echo "DB Name: " . ($_ENV['DB_NAME'] ?? 'inventory_system') . "\n";
echo "DB User: " . ($_ENV['DB_USER'] ?? 'root') . "\n\n";

try {
    $database = new Database();
    $conn = $database->connect();
    
    if ($conn) {
        echo "✓ Database connection successful!\n";
        
        // Test a simple query
        $stmt = $conn->query("SELECT 1");
        $result = $stmt->fetch();
        echo "✓ Query executed successfully\n";
        
        // Check if database tables exist
        $tables_query = "SELECT table_name FROM information_schema.tables WHERE table_schema = ?";
        $stmt = $conn->prepare($tables_query);
        $stmt->execute([$_ENV['DB_NAME'] ?? 'inventory_system']);
        $tables = $stmt->fetchAll();
        
        if (count($tables) > 0) {
            echo "✓ Found " . count($tables) . " tables in database:\n";
            foreach ($tables as $table) {
                echo "  - " . $table['table_name'] . "\n";
            }
        } else {
            echo "⚠ No tables found - database may be empty or not initialized\n";
        }
    } else {
        echo "✗ Database connection failed\n";
    }
} catch(PDOException $e) {
    echo "✗ Connection Error: " . $e->getMessage() . "\n";
} catch(Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
?>
