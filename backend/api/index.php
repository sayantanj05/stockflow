<?php
// CORS Headers
$allowed_origins = [
    'https://stockflow-sayantanj05s-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Basic routing setup
$request = $_SERVER['REQUEST_URI'];

// Remove query strings
$path = parse_url($request, PHP_URL_PATH);

// Improved routing: search for 'api' in the path and use everything after it
$api_segment = '/api';
$pos = strpos($path, $api_segment);

if ($pos !== false) {
    // Take everything after '/api'
    $path = substr($path, $pos + strlen($api_segment));
}

$method = $_SERVER['REQUEST_METHOD'];

// Route Example: /products
$route_parts = explode('/', trim($path, '/'));
$resource = $route_parts[0] ?? '';
$id = $route_parts[1] ?? null;

// Routing logic
try {
    switch ($resource) {
        case 'login':
            require_once __DIR__ . '/../controllers/AuthController.php';
            $controller = new AuthController();
            $controller->login();
            break;
            
        case 'register':
            require_once __DIR__ . '/../controllers/AuthController.php';
            $controller = new AuthController();
            $controller->register();
            break;
            
        case 'verify-email':
            require_once __DIR__ . '/../controllers/StaffController.php';
            $controller = new StaffController();
            $controller->verifyEmail();
            break;
            
        case 'staff':
            require_once __DIR__ . '/../controllers/StaffController.php';
            $controller = new StaffController();
            if ($id === 'setup') {
                $controller->completeSetup();
            } else if ($id === 'profile') {
                if ($method === 'GET') {
                    $controller->getProfile();
                } else if ($method === 'POST') {
                    // Using POST instead of PUT because PHP doesn't easily parse multipart/form-data for PUT requests (needed for photos)
                    $controller->updateProfile();
                } else {
                    http_response_code(405);
                    echo json_encode(['message' => 'Method not allowed']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Staff endpoint not found']);
            }
            break;
            
        case 'products':
            require_once __DIR__ . '/../controllers/ProductController.php';
            $controller = new ProductController();
            $controller->handleRequest($method, $id);
            break;
            
        // Additional routes for categories, suppliers, stock, purchase, reports
        case 'categories':
            require_once __DIR__ . '/../controllers/CategoryController.php';
            $controller = new CategoryController();
            $controller->handleRequest($method, $id);
            break;
            
        case 'suppliers':
            require_once __DIR__ . '/../controllers/SupplierController.php';
            $controller = new SupplierController();
            $controller->handleRequest($method, $id);
            break;
            
        case 'users':
            require_once __DIR__ . '/../controllers/UserController.php';
            $controller = new UserController();
            $controller->handleRequest($method, $id);
            break;

        case 'stock':
            require_once __DIR__ . '/../controllers/StockController.php';
            $controller = new StockController();
            $controller->handleRequest($method, $id);
            break;

        case 'purchases':
            require_once __DIR__ . '/../controllers/PurchaseController.php';
            $controller = new PurchaseController();
            $controller->handleRequest($method, $id);
            break;
            
        case 'reports':
            require_once __DIR__ . '/../controllers/ReportController.php';
            $controller = new ReportController();
            $controller->handleRequest($method, $id);
            break;

        case 'contact':
            require_once __DIR__ . '/../controllers/ContactController.php';
            $controller = new ContactController();
            $controller->handleRequest($method, $id);
            break;

        case 'dashboard':
            require_once __DIR__ . '/../controllers/DashboardController.php';
            $controller = new DashboardController();
            $controller->handleRequest($method, $id);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint not found: ' . $path]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server Error: ' . $e->getMessage()]);
}
?>
