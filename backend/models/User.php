<?php
require_once __DIR__ . '/../config/Database.php';

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $staff_id;
    public $name;
    public $email;
    public $phone;
    public $address;
    public $photo;
    public $password;
    public $role;
    public $is_verified;
    public $verification_token;
    public $setup_completed;
    public $created_at;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function emailExists() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->staff_id = $row['staff_id'];
            $this->name = $row['name'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->is_verified = $row['is_verified'];
            $this->setup_completed = $row['setup_completed'];
            $this->photo = $row['photo'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, email=:email, password=:password, role=:role, verification_token=:token";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = $this->password;
        $this->role = htmlspecialchars(strip_tags($this->role ?? 'staff'));
        
        // Generate verification token
        $this->verification_token = bin2hex(random_bytes(16));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":token", $this->verification_token);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            
            // Auto-generate Staff ID based on inserted ID
            $prefix = $this->role === 'admin' ? 'ADM' : 'STF';
            $this->staff_id = $prefix . str_pad($this->id, 3, "0", STR_PAD_LEFT);
            
            $update_query = "UPDATE " . $this->table_name . " SET staff_id = :staff_id WHERE id = :id";
            $update_stmt = $this->conn->prepare($update_query);
            $update_stmt->bindParam(":staff_id", $this->staff_id);
            $update_stmt->bindParam(":id", $this->id);
            $update_stmt->execute();
            
            return true;
        }
        return false;
    }

    public function readAll() {
        $query = "SELECT id, staff_id, name, email, role, is_verified, setup_completed, created_at FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " SET name = :name, role = :role, phone = :phone, address = :address";
        
        if(!empty($this->photo)) {
             $query .= ", photo = :photo";
        }
        if(!empty($this->password)) {
             $query .= ", password = :password";
        }
        if($this->setup_completed !== null) {
            $query .= ", setup_completed = :setup";
        }
        
        $query .= " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->phone = htmlspecialchars(strip_tags($this->phone ?? ''));
        $this->address = htmlspecialchars(strip_tags($this->address ?? ''));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':id', $this->id);
        
        if(!empty($this->photo)) {
            $stmt->bindParam(':photo', $this->photo);
        }
        if(!empty($this->password)) {
            $this->password = $this->password;
            $stmt->bindParam(':password', $this->password);
        }
        if($this->setup_completed !== null) {
            $stmt->bindParam(':setup', $this->setup_completed);
        }

        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }
    
    public function verifyEmail($token) {
        $query = "UPDATE " . $this->table_name . " SET is_verified = 1, verification_token = NULL WHERE verification_token = :token AND is_verified = 0";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    // Allow admin to forcefully verify a user
    public function manualVerify() {
        $query = "UPDATE " . $this->table_name . " SET is_verified = 1, verification_token = NULL WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    public function getProfile() {
        $query = "SELECT id, staff_id, name, email, phone, address, photo, role, is_verified, setup_completed, created_at FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
