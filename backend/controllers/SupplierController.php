<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/Supplier.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class SupplierController {
    public function handleRequest($method, $id) {
        AuthController::verifyToken();

        switch($method) {
            case 'GET':
                $this->getSuppliers();
                break;
            case 'POST':
                $this->createSupplier();
                break;
            case 'PUT':
                if($id) $this->updateSupplier($id);
                break;
            case 'DELETE':
                if($id) $this->deleteSupplier($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
    }

    private function getSuppliers() {
        $supplier = new Supplier();
        $stmt = $supplier->readAll();
        $num = $stmt->rowCount();

        $suppliers_arr = array();
        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($suppliers_arr, [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "phone" => $row['phone'],
                    "email" => $row['email'],
                    "address" => $row['address']
                ]);
            }
        }
        http_response_code(200);
        echo json_encode($suppliers_arr);
    }

    private function createSupplier() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name)) {
            $supplier = new Supplier();
            $supplier->name = $data->name;
            $supplier->phone = $data->phone ?? '';
            $supplier->email = $data->email ?? '';
            $supplier->address = $data->address ?? '';

            if($supplier->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Supplier created."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create supplier."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data. Name is required."]);
        }
    }

    private function updateSupplier($id) {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name)) {
            $supplier = new Supplier();
            $supplier->id = $id;
            $supplier->name = $data->name;
            $supplier->phone = $data->phone ?? '';
            $supplier->email = $data->email ?? '';
            $supplier->address = $data->address ?? '';

            if($supplier->update()) {
                http_response_code(200);
                echo json_encode(["message" => "Supplier updated."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update supplier."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }

    private function deleteSupplier($id) {
        $supplier = new Supplier();
        $supplier->id = $id;
        if($supplier->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "Supplier deleted."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete supplier."]);
        }
    }
}
?>
