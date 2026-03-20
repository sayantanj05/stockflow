<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class UserController {
    public function handleRequest($method, $id) {
        // All user actions (other than login/reg) require auth, ideally Admin
        $user_ctx = AuthController::verifyToken();
        if ($user_ctx->role !== 'admin' && $method !== 'GET') {
            http_response_code(403);
            echo json_encode(["message" => "Only admins can perform this action"]);
            return;
        }

        switch($method) {
            case 'GET':
                $this->getUsers();
                break;
            case 'PUT':
                if($id) $this->updateUser($id);
                break;
            case 'DELETE':
                if($id) $this->deleteUser($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
    }

    private function getUsers() {
        $user = new User();
        $stmt = $user->readAll();
        $num = $stmt->rowCount();

        if($num > 0) {
            $users_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($users_arr, [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "role" => $row['role'],
                    "created_at" => $row['created_at']
                ]);
            }
            http_response_code(200);
            echo json_encode($users_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }

    private function updateUser($id) {
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->action) && $data->action === 'verify') {
            $user = new User();
            $user->id = $id;
            if ($user->manualVerify()) {
                http_response_code(200);
                echo json_encode(["message" => "User verified successfully by Admin."]);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "User already verified or not found."]);
            }
            return;
        }

        if(!empty($data->name) && !empty($data->role)) {
            $user = new User();
            $user->id = $id;
            $user->name = $data->name;
            $user->role = $data->role;
            if(isset($data->password) && !empty($data->password)){
                $user->password = password_hash($data->password, PASSWORD_BCRYPT);
            }
            if($user->update()) {
                http_response_code(200);
                echo json_encode(["message" => "User updated"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update user"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Include name and role"]);
        }
    }

    private function deleteUser($id) {
        $user = new User();
        $user->id = $id;
        if($user->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "User deleted"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete user"]);
        }
    }
}
?>
