<?php
// server.php
// This is a router script for the PHP built-in web server.
// It serves static files directly, but routes everything else (like /api/...) to api/index.php.

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// If the requested file is an actual file or directory, serve it directly
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Check if it's an API request
if (strpos($uri, '/api') === 0) {
    // Include the actual API router
    require_once __DIR__ . '/api/index.php';
    return true; // Stop execution
}

// Set a 404 header for anything else that might have fallen through
http_response_code(404);
echo "Not Found";
?>
