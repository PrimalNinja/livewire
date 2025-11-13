// CyborgWiki v20251112
// (c) 2025 Cyborg Unicorn Pty Ltd.
// This software is released under MIT License.

function qriOS(objOptions_a) 
{
    var LIVEWIRETICKFAST = 200;   // in milliseconds
    var LIVEWIRETICKSLOW = 2000;   // in milliseconds

    var m_objThis = this;
    var m_arrHandlers = [];
    var m_arrListeners = [];
    var m_arrTickers = [];
    var m_fltLivewireTime = LIVEWIRETICKFAST;
    var m_intDataID = 0;
    var m_objOptions = objOptions_a;
    var m_strSessionCookie = '';

    // constructor
    function initialise()
    {
        m_intDataID = 0;
        m_strSessionCookie = m_objThis.getGUID();

        if (m_objOptions.listeners)
        {
            m_arrListeners = m_objOptions.listeners;
            listenInternal();
        }
    }

    // helpers
    function getGUIDS4() 
    {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    function listenInternal()
    {
        if (m_arrListeners.length > 0)
        {
            function tick()
            {
                var objRequest = m_objThis.createJSONRequest('livewire.listen', [
                    {name: 'events', value: m_arrListeners.join(',')}
                ]);
                
                m_objThis.callServer(objRequest, function(objResponse_a)
                {
                    var blnIsArray = false;
                    var arrResponse = null;

                    try
                    {
                        blnIsArray = Array.isArray(objResponse_a);
                    }
                    catch (objError_a)
                    {
                        blnIsArray = false;
                    }

                    m_objThis.updateTicker('livewire', LIVEWIRETICKSLOW);
                    if (!blnIsArray)
                    {
                        console.log(objResponse_a);
                    }
                    else
                    {
                        processLivewire(objResponse_a);
                    }                    

                    m_objThis.after(m_fltLivewireTime, function()
                    {
                        tick();
                    });
                });
            }

            var intRandomDelay = Math.floor(Math.random() * m_fltLivewireTime);
     
            m_objThis.after(intRandomDelay, function()
            {
                tick();
            });
        }
    }

    // utils
    this.base64decode = function(strEncoded_a)
    {
        var strResult = '';
        var strPadded = '';
        var intPadCount = 0;
    
        // Restore URL-safe format
        strPadded = strEncoded_a.replace(/-/g, '+').replace(/_/g, '/');
    
        // Add padding
        intPadCount = (4 - (strPadded.length % 4)) % 4;
        while (intPadCount > 0)
        {
            strPadded += '=';
            intPadCount--;
        }
    
        // Decode
        try
        {
            strResult = atob(strPadded);
        }
        catch (objError_a)
        {
            strResult = '';
        }
    
        return strResult;
    };

    this.states = function(arrStates_a, arrRemove_a, arrAdd_a)
    {
        var intI = 0;
        var intJ = 0;
        var strState = '';
        var blnFound = false;
    
        // Remove states
        if (arrRemove_a && arrRemove_a.length > 0)
        {
            for (intI = 0; intI < arrRemove_a.length; intI++)
            {
                strState = arrRemove_a[intI];
                
                for (intJ = arrStates_a.length - 1; intJ >= 0; intJ--)
                {
                    if (arrStates_a[intJ] === strState)
                    {
                        arrStates_a.splice(intJ, 1);
                    }
                }
            }
        }
    
        // Add states (check for uniqueness)
        if (arrAdd_a && arrAdd_a.length > 0)
        {
            for (intI = 0; intI < arrAdd_a.length; intI++)
            {
                strState = arrAdd_a[intI];
                blnFound = false;
                
                for (intJ = 0; intJ < arrStates_a.length; intJ++)
                {
                    if (arrStates_a[intJ] === strState)
                    {
                        blnFound = true;
                        break;
                    }
                }
                
                if (!blnFound)
                {
                    arrStates_a.push(strState);
                }
            }
        }
    
        return arrStates_a;
    };
    
    // tickers
    this.after = function(intMilliSeconds_a, cbTimeout_a)
    {
        setTimeout(function()
        {
            if (m_objThis.isFunction(cbTimeout_a))
            {
                cbTimeout_a();
            }
        }, intMilliSeconds_a);
    };
    
    this.doNothing = function()
    {
        // do nothing
    };

    this.every = function(strTickerName_a, intMilliSeconds_a, cbTick_a)
    {
        var objTicker = 
        {
            name: strTickerName_a,
            interval: intMilliSeconds_a,
            callback: cbTick_a,
            handle: null
        };
    
        objTicker.handle = setInterval(function()
        {
            if (m_objThis.isFunction(cbTick_a))
            {
                cbTick_a();
            }
        }, objTicker.interval);
    
        m_arrTickers.push(objTicker);
    };
    
    this.stopTicker = function(strTickerName_a)
    {
        var intI = 0;
        var blnFound = false;
        
        for (intI = 0; intI < m_arrTickers.length && !blnFound; intI++)
        {
            if (m_arrTickers[intI].name === strTickerName_a)
            {
                clearInterval(m_arrTickers[intI].handle);
                m_arrTickers.splice(intI, 1);
                blnFound = true;
            }
        }
    };

    this.updateTicker = function(strTickerName_a, intMilliSeconds_a)
    {
        // update global livewire time if this is the livewire ticker
        if (strTickerName_a === 'livewire')
        {
            m_fltLivewireTime = intMilliSeconds_a;
        }
        else
        {
            for (var intI = 0; intI < m_arrTickers.length; intI++)
            {
                if (m_arrTickers[intI].name === strTickerName_a)
                {
                    var objTicker = m_arrTickers[intI];
        
                    // update stored interval
                    objTicker.interval = intMilliSeconds_a;
                    break;
                }
            }
        }
    };
    
    
    // livewire
    function debugHandlers(strFrom_a)
    {
        console.log("===== start handlers:" + strFrom_a + " =====");
        for (var intI = 0; intI < m_arrHandlers.length; intI++)
        {
            console.log(m_arrHandlers[intI].handlerID + ":" + m_arrHandlers[intI].handler + ":" + m_arrHandlers[intI].target);
        }
        console.log("===== end handlers =====");
    }

    function processLivewire(arrEvents_a)
    {
        var intI = 0;
        var intJ = 0;
        var objEvent = null;
        var strTarget = '';
        var strHandler = '';
        var strHTML = '';
        var strCSS = '';
        var strJS = '';
        var strHandlerID = '';
        var strParentHandlerID = '';
        var objContainer = null;
        var objWrapper = null;
        var objScript = null;
        var objStyle = null;
        var arrCSS = null;
        var arrJS = null;
        var objParent = null;
    
        for (intI = 0; intI < arrEvents_a.length; intI++)
        {
            objEvent = arrEvents_a[intI];
    
            if (objEvent.event === 'livewire' && objEvent.data)
            {
                strTarget = objEvent.data.target;
                strHandler = objEvent.data.handler;
                strHandlerID = objEvent.data.handlerID;
                strParentHandlerID = objEvent.data.parentHandlerID;
                strHTML = m_objThis.base64decode(objEvent.data.html || '');
                strCSS = m_objThis.base64decode(objEvent.data.css || '');
                strJS = m_objThis.base64decode(objEvent.data.js || '');
    
                if (strHTML)
                {
                    if (strParentHandlerID.length > 0)
                    {
                        console.log("adding: " + strParentHandlerID + ":" + strTarget);
                        objContainer = m_objThis.element(strParentHandlerID, strTarget);
                    }
                    else
                    {
                        console.log("adding: body:" + strTarget);
                        objContainer = m_objThis.element('body', strTarget);
                    }
                    if (objContainer.length > 0)
                    {
                        // Unregister old handler before cleanup
                        m_objThis.unregisterHandler(strTarget);
                        
                        // Cleanup old CSS for this specific target
                        arrCSS = m_objThis.element('head', 'geLivewireCSS[data-target="' + strTarget + '"]');
                        for (intJ = arrCSS.length - 1; intJ >= 0; intJ--)
                        {
                            objParent = arrCSS[intJ].parentNode;
                            if (objParent)
                            {
                                objParent.removeChild(arrCSS[intJ]);
                            }
                        }
                        
                        // Cleanup old JS for this specific handler
                        arrJS = m_objThis.element('body', 'geLivewireJS[data-handler="' + strHandler + '"]');
                        for (intJ = arrJS.length - 1; intJ >= 0; intJ--)
                        {
                            objParent = arrJS[intJ].parentNode;
                            if (objParent)
                            {
                                objParent.removeChild(arrJS[intJ]);
                            }
                        }
                        
                        objWrapper = document.createElement('div');
                        objWrapper.id = strHandlerID;
                        objWrapper.innerHTML = strHTML;
                        objContainer[0].innerHTML = '';
                        objContainer[0].appendChild(objWrapper);
                        
                        if (strCSS)
                        {
                            objStyle = document.createElement('style');
                            objStyle.className = 'geLivewireCSS';
                            objStyle.setAttribute('data-target', strTarget);
                            objStyle.appendChild(document.createTextNode(strCSS));
                            document.getElementById('head').appendChild(objStyle);
                        }
                        
                        if (strJS)
                        {
                            objScript = document.createElement('script');
                            objScript.className = 'geLivewireJS';
                            objScript.setAttribute('data-handler', strHandler);
                            objScript.type = 'text/javascript';
                            objScript.appendChild(document.createTextNode(strJS));
                            document.getElementById('body').appendChild(objScript);
                            
                            // Register handler after JS is in DOM
                            m_objThis.registerHandler(strHandler, strHandlerID, strParentHandlerID, strTarget, strJS);
                        }
                    }
                    
                    m_objThis.updateTicker('livewire', LIVEWIRETICKFAST);
                }
            }
            else
            {
                console.log(objEvent);
            }
        }
    }

    this.listen = function(arrEvents_a)
    {
        m_arrListeners = arrEvents_a;
        listenInternal();
    };
    
    this.registerHandler = function(strHandler_a, strHandlerID_a, strParentHandlerID_a, strTarget_a, strJS_a)
    {
        var objInstance = null;
        var objConstructor = null;
        var blnHandlerExists = false;
        var intI = 0;
        var arrJS = null;
        var objParent = null;
        var objScript = null;
        var strFunctionName = strHandler_a + 'Handler';
        
        // Check if handler already exists
        for (intI = 0; intI < m_arrHandlers.length; intI++)
        {
            if (m_arrHandlers[intI].handler === strHandler_a)
            {
                blnHandlerExists = true;
                break;
            }
        }
        
        // If handler doesn't exist and we have JS, add it to DOM
        if (!blnHandlerExists && strJS_a)
        {
            // Remove any existing handler script
            arrJS = m_objThis.element('body', 'geLivewireJS[data-handler="' + strHandler_a + '"]');
            for (intI = arrJS.length - 1; intI >= 0; intI--)
            {
                objParent = arrJS[intI].parentNode;
                if (objParent)
                {
                    objParent.removeChild(arrJS[intI]);
                }
            }
            
            // Add new handler script
            objScript = document.createElement('script');
            objScript.className = 'geLivewireJS';
            objScript.setAttribute('data-handler', strHandler_a);
            objScript.type = 'text/javascript';
            objScript.appendChild(document.createTextNode(strJS_a));
            document.getElementById('body').appendChild(objScript);
        }
        
        if (window[strFunctionName])
        {
            objConstructor = window[strFunctionName];
            objInstance = new objConstructor(m_objThis, strHandlerID_a, {'parentHandlerID':strParentHandlerID_a});
            m_arrHandlers.push({
                handlerID: strHandlerID_a,
                parenthandlerID: strParentHandlerID_a,
                handler: strHandler_a,
                target: strTarget_a,
                instance: objInstance
            });
        }
    
        debugHandlers('registerHandler');
    };

    this.unregisterHandler = function(strTarget_a)
    {
        var intI = 0;
        var intJ = 0;
        var objHandler = null;
        var strHandler = '';
        var blnHandlerStillUsed = false;
        var arrJS = null;
        var objParent = null;
        
        for (intI = m_arrHandlers.length - 1; intI >= 0; intI--)
        {
            objHandler = m_arrHandlers[intI];
            if (objHandler.target === strTarget_a)
            {
                strHandler = objHandler.handler;
                
                if (objHandler.instance && objHandler.instance.destroy)
                {
                    objHandler.instance.destroy();
                }
                m_arrHandlers.splice(intI, 1);
                
                // Check if handler is still used by other targets
                blnHandlerStillUsed = false;
                for (intJ = 0; intJ < m_arrHandlers.length; intJ++)
                {
                    if (m_arrHandlers[intJ].handler === strHandler)
                    {
                        blnHandlerStillUsed = true;
                        break;
                    }
                }
                
                // Remove handler script if no longer used
                if (!blnHandlerStillUsed && strHandler)
                {
                    arrJS = m_objThis.element('body', 'geLivewireJS[data-handler="' + strHandler + '"]');
                    for (intJ = arrJS.length - 1; intJ >= 0; intJ--)
                    {
                        objParent = arrJS[intJ].parentNode;
                        if (objParent)
                        {
                            objParent.removeChild(arrJS[intJ]);
                        }
                    }
                }
            }
        }

        debugHandlers('unregisterHandler');
    };

    // ajax
    this.callServer = function(objRequest_a, cbSuccess_a, cbError_a) 
    {
        $.ajax(
        {
            url: 'server.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(objRequest_a),
            success: function(objResponse_a) 
            {
                if (objResponse_a.message && objResponse_a.message.length > 0)
                {
                    alert(objResponse_a.message);
                }

                if (m_objThis.isFunction(cbSuccess_a)) 
                {
                    cbSuccess_a(objResponse_a.response);
                }
            },
            error: function(objXhr_a) 
            {
                if (objXhr_a.status && objXhr_a.status.length > 0)
                {
                    alert(objXhr_a.status);
                }

                if (m_objThis.isFunction(cbError_a)) 
                {
                    cbError_a('HTTP Error: ' + objXhr_a.status);
                }
            }
        });
    };

    this.clearSession = function() 
    {
        m_intDataID = 0;
        m_strSessionCookie = m_objThis.getGUID();
    };

    this.createJSONRequest = function(strFunction_a, arrParameters_a) 
    {
        var objRequest = 
        {
            "sessioncookie": m_strSessionCookie,
            "dataid": m_intDataID,
            "function": strFunction_a,
            "parameters": arrParameters_a || []
        };
        m_intDataID++;

        return objRequest;
    };

    this.element = function(strScope_a, strClass_a)
    {
        return $('.' + strClass_a, '#' + strScope_a);
    };

    this.getGUID = function()
    {
        return getGUIDS4() + getGUIDS4() + '-' + getGUIDS4() + '-' + getGUIDS4() + '-' +
        getGUIDS4() + '-' + getGUIDS4() + getGUIDS4() + getGUIDS4();
    };

    this.isFunction = function(obj_a) 
    {
        return $.isFunction(obj_a);
    };

    initialise();
}
