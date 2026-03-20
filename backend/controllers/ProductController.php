<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class ProductController {
    public function handleRequest($method, $id) {
        // We might want to allow GET without auth? Requirements say "Secure Login Page" generally. We will require auth.
        AuthController::verifyToken();

        switch($method) {
            case 'GET':
                $this->getProducts();
                break;
            case 'POST':
                $this->createProduct();
                break;
            case 'PUT':
                if($id) $this->updateProduct($id);
                break;
            case 'DELETE':
                if($id) $this->deleteProduct($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
    }

    private function getProducts() {
        $product = new Product();
        $stmt = $product->readAll();
        $num = $stmt->rowCount();

        $products_arr = array();
        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($products_arr, [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "category_id" => $row['category_id'],
                    "category_name" => $row['category_name'],
                    "supplier_id" => $row['supplier_id'],
                    "supplier_name" => $row['supplier_name'],
                    "price" => $row['price'],
                    "quantity" => $row['quantity'],
                    "created_at" => $row['created_at']
                ]);
            }
        }
        http_response_code(200);
        echo json_encode($products_arr);
    }

    private function createProduct() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name) && isset($data->price)) {
            $product = new Product();
            $product->name = $data->name;
            $product->category_id = isset($data->category_id) && $data->category_id !== '' ? $data->category_id : 'NULL';
            $product->supplier_id = isset($data->supplier_id) && $data->supplier_id !== '' ? $data->supplier_id : 'NULL';
            $product->price = $data->price;
            $product->quantity = $data->quantity ?? 0;

            if($product->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Product created."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create product."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data. Name and price are required."]);
        }
    }

    private function updateProduct($id) {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name) && isset($data->price)) {
            $product = new Product();
            $product->id = $id;
            $product->name = $data->name;
            $product->category_id = isset($data->category_id) && $data->category_id !== '' ? $data->category_id : 'NULL';
            $product->supplier_id = isset($data->supplier_id) && $data->supplier_id !== '' ? $data->supplier_id : 'NULL';
            $product->price = $data->price;
            $product->quantity = $data->quantity ?? 0;

            if($product->update()) {
                http_response_code(200);
                echo json_encode(["message" => "Product updated."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update product."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }

    private function deleteProduct($id) {
        $product = new Product();
        $product->id = $id;
        if($product->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "Product deleted."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete product."]);
        }
    }
}
?>
