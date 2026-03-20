<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class StaffController {
    
    public function verifyEmail() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->token)) {
            $user = new User();
            if ($user->verifyEmail($data->token)) {
                http_response_code(200);
                echo json_encode(["message" => "Email successfully verified."]);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Invalid or expired verification token."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Token is required."]);
        }
    }

    public function getProfile() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            return;
        }

        $decodedUser = AuthController::verifyToken();
        $user = new User();
        $user->id = $decodedUser->id;
        
        $profile = $user->getProfile();
        
        if ($profile) {
            // Don't send password hash back
            unset($profile['password']);
            http_response_code(200);
            echo json_encode($profile);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Profile not found."]);
        }
    }

    public function completeSetup() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            return;
        }

        $decodedUser = AuthController::verifyToken();
        
        // Use $_POST for form data since there might be file uploads (photo)
        $user = new User();
        $user->id = $decodedUser->id;
        
        // Fetch existing profile to preserve unchanged fields if needed
        $existingProfile = $user->getProfile();
        
        if (!$existingProfile) {
            http_response_code(404);
            echo json_encode(["message" => "User not found."]);
            return;
        }
        
        if ($existingProfile['setup_completed']) {
            http_response_code(400);
            echo json_encode(["message" => "Setup is already completed for this user."]);
            return;
        }

        $user->name = isset($_POST['name']) && !empty($_POST['name']) ? $_POST['name'] : $existingProfile['name'];
        $user->role = $existingProfile['role']; // Don't let users change their own role here
        $user->phone = isset($_POST['phone']) ? $_POST['phone'] : null;
        $user->address = isset($_POST['address']) ? $_POST['address'] : null;
        $user->setup_completed = 1;
        
        // Handle optional photo upload
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../frontend/public/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $fileExtension = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
            $fileName = 'staff_' . $user->id . '_' . time() . '.' . $fileExtension;
            $uploadFile = $uploadDir . $fileName;
            
            // Basic validation
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (in_array($_FILES['photo']['type'], $allowedTypes)) {
                if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadFile)) {
                    $user->photo = '/uploads/' . $fileName;
                }
            }
        }

        if ($user->update()) {
            // Get updated profile to fetch generated staff_id
            $updatedProfile = $user->getProfile();
            
            // Send confirmation email to staff
            EmailService::sendSetupConfirmation($updatedProfile['email'], $updatedProfile['name'], $updatedProfile['staff_id']);
            
            // Notify Admin
            EmailService::notifyAdminOfNewStaff('admin@example.com', $updatedProfile['name'], $updatedProfile['staff_id']);
            
            http_response_code(200);
            echo json_encode([
                "message" => "Profile setup completed successfully.",
                "staff_id" => $updatedProfile['staff_id']
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to complete profile setup."]);
        }
    }
    
    public function updateProfile() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            return;
        }

        $decodedUser = AuthController::verifyToken();
        $user = new User();
        $user->id = $decodedUser->id;
        
        $existingProfile = $user->getProfile();
        
        if (!$existingProfile) {
            http_response_code(404);
            echo json_encode(["message" => "User not found."]);
            return;
        }

        // Only update allowed fields
        $user->name = isset($_POST['name']) && !empty($_POST['name']) ? $_POST['name'] : $existingProfile['name'];
        $user->role = $existingProfile['role'];
        $user->phone = isset($_POST['phone']) ? $_POST['phone'] : $existingProfile['phone'];
        $user->address = isset($_POST['address']) ? $_POST['address'] : $existingProfile['address'];
        $user->setup_completed = $existingProfile['setup_completed'];
        
        if (isset($_POST['password']) && !empty($_POST['password'])) {
            $user->password = password_hash($_POST['password'], PASSWORD_BCRYPT);
        }
        
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../frontend/public/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $fileExtension = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
            $fileName = 'staff_' . $user->id . '_' . time() . '.' . $fileExtension;
            $uploadFile = $uploadDir . $fileName;
            
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (in_array($_FILES['photo']['type'], $allowedTypes)) {
                if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadFile)) {
                    $user->photo = '/uploads/' . $fileName;
                }
            }
        } else {
            // Keep existing photo if a new one is not uploaded
            $user->photo = $existingProfile['photo'];
        }

        if ($user->update()) {
            http_response_code(200);
            echo json_encode(["message" => "Profile updated successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update profile."]);
        }
    }
}
?>
