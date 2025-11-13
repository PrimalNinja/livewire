<?php

function base64encode($strData_a)
{
    $strResult = base64_encode($strData_a);
    $strResult = str_replace(['+', '/'], ['-', '_'], $strResult);
    $strResult = rtrim($strResult, '=');

    return $strResult;
}

function createJSONResponse($strDataID_a, $intResponseCode_a, $strMessage_a, $arrResponse_a)
{
    $arrOutput = [
        'dataid' => $strDataID_a,
        'responsecode' => $intResponseCode_a,
        'message' => $strMessage_a,
        'response' => $arrResponse_a
    ];

    header('Content-Type: application/json');
    echo json_encode($arrOutput);
    exit;
}

function dependencies($arrFiles_a)
{
    $blnResult = true;
    $intI = 0;

    for ($intI = 0; $intI < count($arrFiles_a); $intI++)
    {
        $strFile = DIR_MODULES . $arrFiles_a[$intI] . '.php';

        if (file_exists($strFile))
        {
            require_once($strFile);
        }
        else
        {
            logError('Missing dependency: ' . $strFile);
            $blnResult = false;
        }
    }

    return $blnResult;
}

function dispatchFunction($strDir_a, $arrFunctions_a, $objDB_a, $strDataID_a, $strFunction_a, $arrParameters_a)
{
    if (isset($arrFunctions_a[$strFunction_a])) 
    {
        $objFound = $arrFunctions_a[$strFunction_a];
        $strPath = $strDir_a . '/' . $objFound['file'] . '.php';
        if (!file_exists($strPath)) 
        {
            logError('File not found: ' . $strPath);
        }
        require_once $strPath;
        call_user_func_array($objFound['function'], [$objDB_a, $strDataID_a, $arrParameters_a]);
    }
}

function getGUID()
{
    $strGUID = '';

    if (function_exists('com_create_guid')) 
    {
        $strGUID = trim(com_create_guid(), '{}');
    }
    else 
    {
        $strCharID = strtoupper(md5(uniqid(mt_rand(), true)));
        $strHyphen = '-';
        $strGUID = substr($strCharID, 0, 8) . $strHyphen
                 . substr($strCharID, 8, 4) . $strHyphen
                 . substr($strCharID, 12, 4) . $strHyphen
                 . substr($strCharID, 16, 4) . $strHyphen
                 . substr($strCharID, 20, 12);
    }

    return $strGUID;
}

function getParameter($arrParameters_a, $strParameter_a, $blnRequired_a)
{
    $strResult = '';

    foreach ($arrParameters_a as $objParam)
    {
        if ($objParam['name'] == $strParameter_a)
        {
            $strResult = $objParam['value'];
            break;
        }
    }

    if ($blnRequired_a && strlen($strResult) === 0)
    {
        safeDie();
    }
 
    return $strResult;
}

function logError($strMessage_a)
{
    $strMessage = date('Y-m-d H:i:s') . ' ' . $strMessage_a . PHP_EOL;
    file_put_contents(LOG_ERROR, $strMessage, FILE_APPEND | LOCK_EX);
}

function hasStates($arrHaystack_a, $arrNeedles_a)
{
    $intI = 0;
    $blnResult = true;
    
    for ($intI = 0; $intI < count($arrNeedles_a); $intI++)
    {
        if (!in_array($arrNeedles_a[$intI], $arrHaystack_a))
        {
            $blnResult = false;
            break;
        }
    }
    
    return $blnResult;
}

function safeDie()
{
    die();
}

function states(&$arrHaystack_a, $arrRemove_a, $arrAdd_a)
{
    $intI = 0;
    $intJ = 0;
    $strState = '';
    
    // Remove states
    if (is_array($arrRemove_a) && count($arrRemove_a) > 0)
    {
        for ($intI = 0; $intI < count($arrRemove_a); $intI++)
        {
            $strState = $arrRemove_a[$intI];
            
            for ($intJ = count($arrHaystack_a) - 1; $intJ >= 0; $intJ--)
            {
                if (($arrHaystack_a[$intJ] === $strState) || ($strState === "*"))
                {
                    array_splice($arrHaystack_a, $intJ, 1);
                }
            }
        }
    }
    
    // Add states (check for uniqueness)
    if (is_array($arrAdd_a) && count($arrAdd_a) > 0)
    {
        for ($intI = 0; $intI < count($arrAdd_a); $intI++)
        {
            $strState = $arrAdd_a[$intI];
            
            if (!in_array($strState, $arrHaystack_a))
            {
                $arrHaystack_a[] = $strState;
            }
        }
    }
}
