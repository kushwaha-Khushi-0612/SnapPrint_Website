<?php
/**
 * SnapPrint Wishlist API
 * GET  /api/wishlist.php?userId=123  → returns user's wishlist
 * POST /api/wishlist.php             → { userId, items[] } → saves user's wishlist
 *
 * Data stored at: data/wishlists.json
 * Format: { "userId": [ ...productObjects ] }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$dataDir  = __DIR__ . '/../data';
$dataFile = $dataDir . '/wishlists.json';

// Ensure data directory exists
if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);

// Load current data
$allData = [];
if (file_exists($dataFile)) {
    $raw = file_get_contents($dataFile);
    $allData = json_decode($raw, true) ?: [];
}

// GET — return wishlist for user
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = trim($_GET['userId'] ?? '');
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'userId required']);
        exit;
    }
    echo json_encode(['userId' => $userId, 'items' => $allData[$userId] ?? []]);
    exit;
}

// POST — save/overwrite wishlist for user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true);
    $userId = trim($body['userId'] ?? '');
    $items  = $body['items'] ?? [];

    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'userId required']);
        exit;
    }

    if (!is_array($items)) {
        http_response_code(400);
        echo json_encode(['error' => 'items must be an array']);
        exit;
    }

    // Sanitize — keep only safe product fields, no executable data
    $clean = array_map(function($p) {
        return [
            'productId' => strval($p['productId'] ?? ''),
            'itemType'  => strval($p['itemType']  ?? 'product'),
            'savedAt'   => intval($p['savedAt']   ?? time() * 1000),
        ];
    }, $items);

    $allData[$userId] = $clean;

    $written = file_put_contents($dataFile, json_encode($allData, JSON_PRETTY_PRINT));
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not write wishlist data']);
        exit;
    }

    echo json_encode(['success' => true, 'count' => count($clean)]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
