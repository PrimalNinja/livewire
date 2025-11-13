<?php

function systemGetDatabaseName($objDB_a, $strDataID_a, $arrParameters_a)
{
    $strDatabaseName = 'Unknown';

    if ($objDB_a)
    {
        $strSQL = "select value as retvalue from d_system where code = 'DATABASENAME'";
        $strDatabaseName = dbFetchValue($objDB_a, $strSQL);
    }

    $arrResponse = [
        'value' => $strDatabaseName
    ];

    createJSONResponse($strDataID_a, RESPONSE_NOERROR, '', $arrResponse);
}