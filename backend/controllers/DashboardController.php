<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class DashboardController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function handleRequest($method, $id) {
        AuthController::verifyToken();

        if ($method !== 'GET') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            return;
        }

        $this->getDashboardData();
    }

    private function getDashboardData() {
        $data = [];

        try {
            // Total Products
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM products");
            $data['total_products'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Total Categories
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM categories");
            $data['total_categories'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Total Suppliers
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM suppliers");
            $data['total_suppliers'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Total Users
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM users");
            $data['total_users'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Total Stock Quantity Let
            $stmt = $this->conn->query("SELECT SUM(quantity) as total FROM products");
            $data['total_stock_quantity'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

            // Low Stock Alerts Count
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM products WHERE quantity <= 10");
            $data['low_stock_count'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Recent Activities / Stock Transactions
            $stmt = $this->conn->query("SELECT st.id, p.name, st.type, st.quantity, st.date 
                                        FROM stock_transactions st 
                                        JOIN products p ON st.product_id = p.id 
                                        ORDER BY st.date DESC LIMIT 5");
            $data['recent_activities'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Chart Data (Stock by Category)
            $stmt = $this->conn->query("SELECT c.name as category, SUM(p.quantity) as total_stock 
                                        FROM products p 
                                        JOIN categories c ON p.category_id = c.id 
                                        GROUP BY c.id");
            $data['inventory_chart'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error fetching dashboard data: " . $e->getMessage()]);
        }
    }
}
?>
