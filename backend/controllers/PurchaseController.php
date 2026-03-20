<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/Purchase.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class PurchaseController {
    public function handleRequest($method, $id) {
        AuthController::verifyToken();

        switch($method) {
            case 'GET':
                $this->getPurchases();
                break;
            case 'POST':
                $this->createPurchase();
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
    }

    private function getPurchases() {
        $purchase = new Purchase();
        $stmt = $purchase->readAll();
        $num = $stmt->rowCount();

        $purchases_arr = array();
        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($purchases_arr, [
                    "id" => $row['id'],
                    "supplier_name" => $row['supplier_name'],
                    "total_amount" => $row['total_amount'],
                    "date" => $row['date']
                ]);
            }
        }
        http_response_code(200);
        echo json_encode($purchases_arr);
    }

    private function createPurchase() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->supplier_id) && !empty($data->items)) {
            $purchase = new Purchase();
            $purchase->supplier_id = $data->supplier_id;
            
            $total_amount = 0;
            foreach($data->items as $item) {
                // Calculate total
                $total_amount += ($item->price * $item->quantity);
            }
            $purchase->total_amount = $total_amount;
            $purchase->items = $data->items;

            if($purchase->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Purchase recorded and stock updated."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to record purchase."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data. Supplier and items required."]);
        }
    }
}
?>
