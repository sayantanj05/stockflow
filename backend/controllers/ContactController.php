<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/ContactMessage.php';
require_once 'AuthController.php';

class ContactController {
    
    public function handleRequest($method, $id = null) {
        switch ($method) {
            case 'GET':
                // Only admin/staff should read messages
                AuthController::verifyToken();
                $this->getMessages();
                break;
            case 'POST':
                if ($id === 'read') {
                    AuthController::verifyToken();
                    $this->markAsRead();
                } else {
                    // Public endpoint for landing page
                    $this->submitMessage();
                }
                break;
            case 'DELETE':
                AuthController::verifyToken();
                if ($id) {
                    $this->deleteMessage($id);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
    }

    private function getMessages() {
        $message = new ContactMessage();
        $stmt = $message->readAll();
        $messages_arr = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($messages_arr, $row);
        }

        http_response_code(200);
        echo json_encode($messages_arr);
    }

    private function submitMessage() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->first_name) && !empty($data->last_name) && !empty($data->email) && !empty($data->message)) {
            $message = new ContactMessage();
            $message->first_name = $data->first_name;
            $message->last_name = $data->last_name;
            $message->email = $data->email;
            $message->message = $data->message;

            if ($message->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Message sent successfully."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to send message."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data. Provide all fields."]);
        }
    }

    private function markAsRead() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id)) {
            $message = new ContactMessage();
            $message->id = $data->id;
            
            if ($message->markAsRead()) {
                http_response_code(200);
                echo json_encode(["message" => "Message marked as read."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to mark message."]);
            }
        }
    }
    
    private function deleteMessage($id) {
        $message = new ContactMessage();
        $message->id = $id;
        
        if ($message->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "Message deleted."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete message."]);
        }
    }
}
?>
