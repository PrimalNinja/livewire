<?php

$arrFunctions = array(
    'livewire.listen' => array('file' => 'livewireListen', 'function' => 'livewireListen')
);

dispatchFunction(__DIR__, $arrFunctions, $objDB, $strDataID, $strFunction, $arrParameters);
