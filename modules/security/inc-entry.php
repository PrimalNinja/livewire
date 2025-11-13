<?php

$arrFunctions = array(
    'security.login' => array('file' => 'securityLogin', 'function' => 'securityLogin'),
    'security.logout' => array('file' => 'securityLogout', 'function' => 'securityLogout')
);

dispatchFunction(__DIR__, $arrFunctions, $objDB, $strDataID, $strFunction, $arrParameters);
