<?php
require_once __DIR__ . '/../config/Database.php';

class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $category_id;
    public $supplier_id;
    public $price;
    public $quantity;
    public $created_at;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, category_id=:category_id, supplier_id=:supplier_id, price=:price, quantity=:quantity";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id ?? 'NULL'));
        $this->supplier_id = htmlspecialchars(strip_tags($this->supplier_id ?? 'NULL'));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity ?? 0));

        $stmt->bindParam(":name", $this->name);
        
        if($this->category_id === 'NULL') {
            $stmt->bindValue(":category_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(":category_id", $this->category_id);
        }

        if($this->supplier_id === 'NULL') {
            $stmt->bindValue(":supplier_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(":supplier_id", $this->supplier_id);
        }
        
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":quantity", $this->quantity);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readAll() {
        $query = "SELECT p.id, p.name, p.price, p.quantity, p.created_at, 
                  c.name as category_name, p.category_id, 
                  s.name as supplier_name, p.supplier_id
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  LEFT JOIN suppliers s ON p.supplier_id = s.id
                  ORDER BY p.name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " SET name=:name, category_id=:category_id, supplier_id=:supplier_id, price=:price, quantity=:quantity WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id ?? 'NULL'));
        $this->supplier_id = htmlspecialchars(strip_tags($this->supplier_id ?? 'NULL'));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity ?? 0));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        
        if($this->category_id === 'NULL') {
            $stmt->bindValue(":category_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(":category_id", $this->category_id);
        }

        if($this->supplier_id === 'NULL') {
            $stmt->bindValue(":supplier_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(":supplier_id", $this->supplier_id);
        }

        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id=?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
