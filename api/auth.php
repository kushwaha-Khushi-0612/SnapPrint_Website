<?php
/**
 * SnapPrint Auth API Microservice
 * Handles OTP sending and verification. Maintains an index of users.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Master users index
$usersFile = __DIR__ . '/../data/users_index.json';
$profilesDir = __DIR__ . '/../data/profiles';

// Ensure data existence
if (!file_exists($usersFile)) {
    if (!is_dir(dirname($usersFile))) {
        mkdir(dirname($usersFile), 0777, true);
    }
    file_put_contents($usersFile, json_encode(['users' => []]));
}
if (!is_dir($profilesDir)) {
    mkdir($profilesDir, 0777, true);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($action === 'sendOTP') {
    $phone = isset($data['phone']) ? preg_replace('/[^0-9]/', '', $data['phone']) : '';
    
    if (strlen($phone) < 10) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid phone number.']);
        exit;
    }
    
    // Simulate OTP sent
    sleep(1); 
    
    echo json_encode(['success' => true, 'message' => 'OTP Sent']);
    
} elseif ($action === 'verifyOTP') {
    $phone = isset($data['phone']) ? preg_replace('/[^0-9]/', '', $data['phone']) : '';
    $otp = isset($data['otp']) ? $data['otp'] : '';
    
    if ($otp !== '123456') { // Mock OTP constraint
        http_response_code(400);
        echo json_encode(['error' => 'Incorrect OTP.']);
        exit;
    }
    
    // Load users index
    $usersData = json_decode(file_get_contents($usersFile), true);
    $users = $usersData['users'];
    
    $foundUser = null;
    foreach ($users as $u) {
        if ($u['phone'] === $phone) {
            $foundUser = $u;
            break;
        }
    }
    
        // Create new user index
        $userId = 'usr_' . substr(md5(uniqid(mt_rand(), true)), 0, 9);
        $userHash = substr(str_shuffle("0123456789"), 0, 16); // Simple 16-digit hash mock
        
        $foundUser = [
            'id' => $userId,
            'hash' => $userHash,
            'phone' => $phone,
            'joinDate' => date('Y-m-d\TH:i:s\Z')
        ];
        
        $usersData['users'][] = $foundUser;
        file_put_contents($usersFile, json_encode($usersData, JSON_PRETTY_PRINT));
        
        // Also create initial profile file with PDF fields
        $profile = array_merge($foundUser, [
            'name' => '',
            'email' => '',
            'addresses' => [
                'home' => ['address' => '', 'pincode' => ''],
                'office' => ['address' => '', 'pincode' => ''],
                'friends' => ['address' => '', 'pincode' => '']
            ],
            'preference_category' => '',
            'avg_time_on_site' => 0,
            'avg_order_qty' => 0,
            'last_chosen_address' => 1
        ]);
        file_put_contents($profilesDir . '/' . $userId . '.json', json_encode($profile, JSON_PRETTY_PRINT));
    
    // Load full profile
    $profileFile = $profilesDir . '/' . $foundUser['id'] . '.json';
    $profile = [];
    if (file_exists($profileFile)) {
        $profile = json_decode(file_get_contents($profileFile), true);
    } else {
        $profile = $foundUser; // fallback
    }
    
    echo json_encode(['success' => true, 'user' => $profile]);
    
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
}
