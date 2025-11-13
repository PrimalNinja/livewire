<?php

function livewireListen($objDB_a, $strDataID_a, $arrParameters_a)
{
    global $objSession;

    $strEvents = getParameter($arrParameters_a, 'events', false);
    $arrEvents = [];
    $arrResponse = [];

    if (dependencies(['livewire/livewireServe']))
    {
        if (strlen($strEvents) > 0)
        {
            $arrEvents = explode(',', $strEvents);
        }

        if (!$objSession->hasStates(['loggedIn']) && !$objSession->hasStates(['LoginFormRendered']))
        {
            // First visit — serve login form
            $strHandlerID = getGUID();
            $arrResponse[] = livewireServe('poc', 'login', $strHandlerID, '', 'geLivewireHTML');
            $objSession->states([], ['LoginFormRendered']);
        }
        else if ($objSession->hasStates(['loggedIn']) && !$objSession->hasStates(['frameFormRendered']))
        {
            // Logged in and login form served — main app
            $strHandlerID = getGUID();
            $arrResponse[] = livewireServe('poc', 'frame', $strHandlerID, '', 'geLivewireHTML');
            $arrResponse[] = livewireServe('poc', 'chart1', getGUID(), $strHandlerID, 'geChart1Target');
            $arrResponse[] = livewireServe('poc', 'chart2', getGUID(), $strHandlerID, 'geChart2Target');
            $objSession->states([], ['frameFormRendered']);
        }
    }

    if (in_array('pingpong', $arrEvents))
    {
        $arrResponse[] = [
            'event' => 'pingpong',
            'data' => 'alive'
        ];
    }

    createJSONResponse($strDataID_a, RESPONSE_NOERROR, '', $arrResponse);
}