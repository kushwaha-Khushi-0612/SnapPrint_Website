<?php
/**
 * SnapPrint Analytics Sync API
 * Syncs client-side analytics (interests/history) to server-side profile files.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

// Get data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['userId']) || !isset($data['analytics'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data. userId and analytics required.']);
    exit;
}

$userId = preg_replace('/[^a-zA-Z0-9_-]/', '', $data['userId']);
$analytics = $data['analytics'];
$profilesDir = __DIR__ . '/../data/profiles';
$profileFile = $profilesDir . '/' . $userId . '.json';

if (!is_dir($profilesDir)) {
    mkdir($profilesDir, 0777, true);
}

// Load existing profile or create new
$profile = [];
if (file_exists($profileFile)) {
    $profile = json_decode(file_get_contents($profileFile), true);
}

// Merge analytics data into the profile
// We'll keep a dedicated 'analytics' key in the profile record
$profile['analytics'] = $analytics;
$profile['lastSync'] = date('Y-m-d H:i:s');

// Save back to file
$result = file_put_contents($profileFile, json_encode($profile, JSON_PRETTY_PRINT));

if ($result !== false) {
    echo json_encode(['success' => true, 'profile' => $profile]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save data.']);
}
