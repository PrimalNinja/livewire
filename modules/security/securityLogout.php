<?php

function securityLogout($objDB_a, $strDataID_a, $arrParameters_a)
{
    global $objSession;
    
    $objSession->states(['*'], []);
    
    $arrResponse = [
        'success' => true
    ];
    
    createJSONResponse($strDataID_a, RESPONSE_NOERROR, '', $arrResponse);
}