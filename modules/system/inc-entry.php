<?php

$arrFunctions = array(
    'system.getDatabaseName' => array('file' => 'systemGetDatabaseName', 'function' => 'systemGetDatabaseName'),
    'system.ping' => array('file' => 'systemPing', 'function' => 'systemPing')
);

dispatchFunction(__DIR__, $arrFunctions, $objDB, $strDataID, $strFunction, $arrParameters);
