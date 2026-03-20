<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class ReportController {
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

        switch($id) {
            case 'inventory':
                $this->getInventoryReport();
                break;
            case 'low-stock':
                $this->getLowStockReport();
                break;
            case 'purchases':
                $this->getPurchaseReport();
                break;
            default:
                http_response_code(400);
                echo json_encode(["message" => "Invalid report type."]);
                break;
        }
    }

    private function getInventoryReport() {
        $query = "SELECT p.id, p.name, c.name as category, s.name as supplier, p.price, p.quantity, (p.price * p.quantity) as total_value 
                  FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  LEFT JOIN suppliers s ON p.supplier_id = s.id 
                  ORDER BY p.name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($result);
    }

    private function getLowStockReport() {
        $threshold = isset($_GET['threshold']) ? (int)$_GET['threshold'] : 10;
        
        $query = "SELECT p.id, p.name, p.quantity, s.name as supplier, s.phone 
                  FROM products p 
                  LEFT JOIN suppliers s ON p.supplier_id = s.id 
                  WHERE p.quantity <= :threshold 
                  ORDER BY p.quantity ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':threshold', $threshold, PDO::PARAM_INT);
        $stmt->execute();
        
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($result);
    }

    private function getPurchaseReport() {
        $query = "SELECT p.id, p.total_amount, p.date, s.name as supplier, 
                  (SELECT COUNT(*) FROM purchase_items pi WHERE pi.purchase_id = p.id) as total_items 
                  FROM purchases p 
                  LEFT JOIN suppliers s ON p.supplier_id = s.id 
                  ORDER BY p.date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($result);
    }
}
?>
