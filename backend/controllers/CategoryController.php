<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class CategoryController {
    public function handleRequest($method, $id) {
        AuthController::verifyToken();

        switch($method) {
            case 'GET':
                $this->getCategories();
                break;
            case 'POST':
                $this->createCategory();
                break;
            case 'PUT':
                if($id) $this->updateCategory($id);
                break;
            case 'DELETE':
                if($id) $this->deleteCategory($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
    }

    private function getCategories() {
        $category = new Category();
        $stmt = $category->readAll();
        $num = $stmt->rowCount();

        $categories_arr = array();
        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($categories_arr, [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "description" => $row['description']
                ]);
            }
        }
        http_response_code(200);
        echo json_encode($categories_arr);
    }

    private function createCategory() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name)) {
            $category = new Category();
            $category->name = $data->name;
            $category->description = $data->description ?? '';

            if($category->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Category created."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create category."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data. Name is required."]);
        }
    }

    private function updateCategory($id) {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name)) {
            $category = new Category();
            $category->id = $id;
            $category->name = $data->name;
            $category->description = $data->description ?? '';

            if($category->update()) {
                http_response_code(200);
                echo json_encode(["message" => "Category updated."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update category."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }

    private function deleteCategory($id) {
        $category = new Category();
        $category->id = $id;
        if($category->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "Category deleted."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete category."]);
        }
    }
}
?>
