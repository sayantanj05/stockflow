<?php
require_once __DIR__ . '/../config/Database.php';

class Stock {
    private $conn;
    private $table_name = "stock_transactions";
    private $product_table = "products";

    public $id;
    public $product_id;
    public $type;
    public $quantity;
    public $date;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function addTransaction() {
        // Start transaction
        $this->conn->beginTransaction();

        try {
            // 1. Insert into stock_transactions
            $query = "INSERT INTO " . $this->table_name . " SET product_id=:product_id, type=:type, quantity=:quantity";
            $stmt = $this->conn->prepare($query);

            $this->product_id = htmlspecialchars(strip_tags($this->product_id));
            $this->type = htmlspecialchars(strip_tags($this->type));
            $this->quantity = htmlspecialchars(strip_tags($this->quantity));

            $stmt->bindParam(":product_id", $this->product_id);
            $stmt->bindParam(":type", $this->type);
            $stmt->bindParam(":quantity", $this->quantity);

            $stmt->execute();

            // 2. Update product quantity
            if($this->type == 'add') {
                $query2 = "UPDATE " . $this->product_table . " SET quantity = quantity + :qty WHERE id = :pid";
            } else {
                // Check if sufficient stock exists first
                $check_query = "SELECT quantity FROM " . $this->product_table . " WHERE id = :pid FOR UPDATE";
                $check_stmt = $this->conn->prepare($check_query);
                $check_stmt->bindParam(":pid", $this->product_id);
                $check_stmt->execute();
                $row = $check_stmt->fetch(PDO::FETCH_ASSOC);
                $current_qty = $row ? (int)$row['quantity'] : 0;

                if ($current_qty < $this->quantity) {
                    throw new Exception("Insufficient stock. Available: " . $current_qty);
                }

                $query2 = "UPDATE " . $this->product_table . " SET quantity = quantity - :qty WHERE id = :pid";
            }
            
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(":qty", $this->quantity);
            $stmt2->bindParam(":pid", $this->product_id);
            $stmt2->execute();

            // Commit transaction
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function readAll() {
        $query = "SELECT st.id, st.product_id, p.name as product_name, st.type, st.quantity, st.date 
                  FROM " . $this->table_name . " st 
                  LEFT JOIN " . $this->product_table . " p ON st.product_id = p.id 
                  ORDER BY st.date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>
