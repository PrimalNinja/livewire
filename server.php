<?php

require_once 'inc-constants.php';
require_once 'inc-utils.php';

header('Content-Type: application/json');

$objDB = null;

if (DB_ENABLED || DB_SESSIONS)
{
    require_once 'inc-database.php';
    $objDB = dbOpen(DB_HOST, DB_USER, DB_PASS, DB_NAME);
}

require_once 'inc-sessions.php';
$objSession = new SessionClass($objDB);

$strMethod = $_SERVER['REQUEST_METHOD'];
$objRequest = null;

if ($strMethod === 'POST') 
{
    $strInput = file_get_contents('php://input');
    $objRequest = json_decode($strInput, true);
    if (!$objRequest)
    {
        logError('POST request contains invalid JSON');
    }
} 
elseif ($strMethod === 'GET' && ALLOW_GET) 
{
    $objRequest = [
        'sessioncookie' => isset($_GET['sessioncookie']) ? $_GET['sessioncookie'] : '',
        'dataid' => isset($_GET['dataid']) ? $_GET['dataid'] : '',
        'function' => isset($_GET['function']) ? $_GET['function'] : '',
        'parameters' => isset($_GET['parameters']) ? json_decode($_GET['parameters'], true) : []
    ];
} 
else 
{
    logError('Invalid request method: ' . $strMethod);
}

if ($objRequest && isset($objRequest['function'])) 
{
    $strSessionID = isset($objRequest['sessioncookie']) ? $objRequest['sessioncookie'] : '';
    $strSessionID = $objSession->startSession($strSessionID);

    $strDataID = $objRequest['dataid'];
    $strFunction = $objRequest['function'];
    $arrParameters = isset($objRequest['parameters']) ? $objRequest['parameters'] : [];

    foreach ($MODULES as $strModule) 
    {
        $strModulePath = __DIR__ . '/modules/' . $strModule . '/inc-entry.php';
        if (file_exists($strModulePath))
        {
            require_once $strModulePath;
        }
        else
        {
            logError('Module entry point not found: ' . $strModulePath);
        }
    }
}
else
{
    logError('Request missing function or invalid format');
}
    
if (DB_ENABLED || DB_SESSIONS)
{
    dbClose($objDB);
}
