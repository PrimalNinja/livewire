<?php

function securityLogin($objDB_a, $strDataID_a, $arrParameters_a)
{
    global $objSession;
    
    $strUsername = getParameter($arrParameters_a, 'username', true);
    $strPassword = getParameter($arrParameters_a, 'password', true);
    $blnSuccess = false;
    $strMessage = '';
    
    if ($strUsername === 'admin' && $strPassword === 'password')
    {
        $objSession->states(['*'], ['loggedIn']);
        $blnSuccess = true;
    }
    else
    {
        $blnSuccess = false;
        $strMessage = 'Invalid credentials';
    }
    
    $arrResponse = [
        'success' => $blnSuccess
    ];
    
    createJSONResponse($strDataID_a, RESPONSE_NOERROR, $strMessage, $arrResponse);
}