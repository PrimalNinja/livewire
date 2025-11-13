<?php

function livewireServe($strSubModule_a, $strHandler_a, $strHandlerID_a, $strParentHandlerID_a, $strTarget_a)
{
    $strPath = DIR_MODULES . 'livewire/' . $strSubModule_a . '/';
    $strHTML = '';
    $strCSS = '';
    $strJS = '';
    $arrResult = [];

    $strHTML = @file_get_contents($strPath . $strHandler_a . 'Handler.html');
    $strCSS  = @file_get_contents($strPath . $strHandler_a . 'Handler.css');
    $strJS   = @file_get_contents($strPath . $strHandler_a . 'Handler.js');

    $arrResult = [
        'event' => 'livewire',
        'data' => [
            'target' => $strTarget_a,
            'handler' => $strHandler_a,
            'handlerID' => $strHandlerID_a,
            'parentHandlerID' => $strParentHandlerID_a,
            'html' => base64encode($strHTML),
            'css'  => base64encode($strCSS),
            'js'   => base64encode($strJS)
        ]
    ];

    return $arrResult;
}