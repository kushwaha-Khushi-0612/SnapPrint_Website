<?php
/**
 * SnapPrint Profile API Microservice
 * Handles reading and writing of profile data per user.
 * Stores data as individual JSON files in data/profiles/ directory.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure the profiles directory exists
$profilesDir = __DIR__ . '/../data/profiles';
if (!is_dir($profilesDir)) {
    if (!mkdir($profilesDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create profiles directory.']);
        exit;
    }
}

// Determine action
$action = isset($_GET['action']) ? $_GET['action'] : '';
$userId = isset($_GET['userId']) ? $_GET['userId'] : '';

if (empty($userId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing userId parameter.']);
    exit;
}

// Sanitize user ID to prevent path traversal
$userId = preg_replace('/[^a-zA-Z0-9_-]/', '', $userId);
$profileFile = $profilesDir . '/' . $userId . '.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Read profile
    if (file_exists($profileFile)) {
        $data = file_get_contents($profileFile);
        echo $data;
    } else {
        // Return 404 if profile doesn't exist yet, so client can create it
        http_response_code(404);
        echo json_encode(['error' => 'Profile not found.']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Write profile
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input.']);
        exit;
    }
    
    // Check if we need to merge or overwrite completely
    // For this implementation, we read existing and merge top-level keys
    if (file_exists($profileFile) && (!isset($_GET['overwrite']) || $_GET['overwrite'] !== 'true')) {
        $existing = json_decode(file_get_contents($profileFile), true);
        if (is_array($existing)) {
            $data = array_merge($existing, $data);
        }
    }
    
    // Save to file
    $result = file_put_contents($profileFile, json_encode($data, JSON_PRETTY_PRINT));
    
    if ($result !== false) {
        echo json_encode(['success' => true, 'profile' => $data]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write profile to disk.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
}
