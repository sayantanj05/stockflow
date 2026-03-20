<?php
require_once __DIR__ . '/../models/User.php';

class AuthController {
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->email) && !empty($data->password)) {
            $user = new User();
            $user->email = $data->email;

            if ($user->emailExists() && password_verify($data->password, $user->password)) {
                
                // For a simple REST API, we can generate a basic token (this is not full JWT, but serves the purpose for this demo if needed, or simple session)
                // In production, use standard JWT. For simplicity and robustness here, we'll return a token struct.
                $token = base64_encode(json_encode([
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role,
                    "is_verified" => $user->is_verified,
                    "setup_completed" => $user->setup_completed,
                    "exp" => time() + (60 * 60 * 24) // 1 day expiration
                ]));

                http_response_code(200);
                echo json_encode([
                    "message" => "Successful login.",
                    "token" => $token,
                    "user" => [
                        "id" => $user->id,
                        "staff_id" => $user->staff_id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "role" => $user->role,
                        "is_verified" => (bool)$user->is_verified,
                        "setup_completed" => (bool)$user->setup_completed
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["message" => "Login failed. Incorrect email or password."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete login data."]);
        }
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
            $user = new User();
            $user->email = $data->email;

            if ($user->emailExists()) {
                http_response_code(400);
                echo json_encode(["message" => "Email already exists."]);
                return;
            }

            $user->name = $data->name;
            $user->password = password_hash($data->password, PASSWORD_BCRYPT);
            $user->role = isset($data->role) ? $data->role : 'staff';

            if ($user->create()) {
                http_response_code(201);
                echo json_encode(["message" => "User was created successfully."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create user."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }
    
    // Simple helper to verify tokens
    public static function verifyToken() {
        $headers = function_exists('apache_request_headers') ? apache_request_headers() : $_SERVER;
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : null);
        
        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $decoded = json_decode(base64_decode($token));
            
            if ($decoded && isset($decoded->exp) && $decoded->exp > time()) {
                return $decoded;
            }
        }
        
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized access."]);
        exit();
    }
}
?>
