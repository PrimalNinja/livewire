<?php

function systemPing($objDB_a, $strDataID_a, $arrParameters_a)
{
    $arrResponse = [
        'value' => 'pong'
    ];

    createJSONResponse($strDataID_a, RESPONSE_NOERROR, '', $arrResponse);
}