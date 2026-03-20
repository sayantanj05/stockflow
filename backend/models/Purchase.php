<?php
require_once __DIR__ . '/../config/Database.php';

class Purchase {
    private $conn;
    private $table_name = "purchases";
    private $items_table = "purchase_items";
    private $product_table = "products";

    public $id;
    public $supplier_id;
    public $total_amount;
    public $items = []; // Array of {product_id, quantity, price}

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function create() {
        $this->conn->beginTransaction();

        try {
            // 1. Insert into purchases
            $query = "INSERT INTO " . $this->table_name . " SET supplier_id=:supplier_id, total_amount=:total_amount";
            $stmt = $this->conn->prepare($query);

            $this->supplier_id = htmlspecialchars(strip_tags($this->supplier_id));
            $this->total_amount = htmlspecialchars(strip_tags($this->total_amount));

            $stmt->bindParam(":supplier_id", $this->supplier_id);
            $stmt->bindParam(":total_amount", $this->total_amount);
            $stmt->execute();
            
            $purchase_id = $this->conn->lastInsertId();

            // 2. Insert into purchase_items and update product stock
            foreach($this->items as $item) {
                // Insert item
                $query2 = "INSERT INTO " . $this->items_table . " SET purchase_id=:purchase_id, product_id=:product_id, quantity=:quantity, price=:price";
                $stmt2 = $this->conn->prepare($query2);
                $stmt2->bindParam(":purchase_id", $purchase_id);
                $stmt2->bindParam(":product_id", $item->product_id);
                $stmt2->bindParam(":quantity", $item->quantity);
                $stmt2->bindParam(":price", $item->price);
                $stmt2->execute();

                // Update product stock directly
                $query3 = "UPDATE " . $this->product_table . " SET quantity = quantity + :qty WHERE id = :pid";
                $stmt3 = $this->conn->prepare($query3);
                $stmt3->bindParam(":qty", $item->quantity);
                $stmt3->bindParam(":pid", $item->product_id);
                $stmt3->execute();

                // Optional: Insert into stock_transactions as 'add' transaction
                $query4 = "INSERT INTO stock_transactions SET product_id=:pid, type='add', quantity=:qty";
                $stmt4 = $this->conn->prepare($query4);
                $stmt4->bindParam(":pid", $item->product_id);
                $stmt4->bindParam(":qty", $item->quantity);
                $stmt4->execute();
            }

            $this->conn->commit();
            return true;
        } catch(PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function readAll() {
        $query = "SELECT p.id, p.total_amount, p.date, s.name as supplier_name 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN suppliers s ON p.supplier_id = s.id 
                  ORDER BY p.date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>
