<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/../models/Stock.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class StockController {
    public function handleRequest($method, $id) {
        AuthController::verifyToken();

        switch($method) {
            case 'GET':
                $this->getTransactions();
                break;
            case 'POST':
                if($id === 'add') {
                    $this->handleStock('add');
                } else if ($id === 'remove') {
                    $this->handleStock('remove');
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Invalid action."]);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
    }

    private function getTransactions() {
        $stock = new Stock();
        $stmt = $stock->readAll();
        $num = $stmt->rowCount();

        $transactions_arr = array();
        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($transactions_arr, [
                    "id" => $row['id'],
                    "product_id" => $row['product_id'],
                    "product_name" => $row['product_name'],
                    "type" => $row['type'],
                    "quantity" => $row['quantity'],
                    "date" => $row['date']
                ]);
            }
        }
        http_response_code(200);
        echo json_encode($transactions_arr);
    }

    private function handleStock($type) {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->product_id) && !empty($data->quantity)) {
            $stock = new Stock();
            $stock->product_id = $data->product_id;
            $stock->type = $type;
            $stock->quantity = $data->quantity;

            if($stock->addTransaction()) {
                http_response_code(200);
                echo json_encode(["message" => "Stock " . $type . "ed successfully."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to process stock transaction."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data. Provide product_id and quantity."]);
        }
    }
}
?>
