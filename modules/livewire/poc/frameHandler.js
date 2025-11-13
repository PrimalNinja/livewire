function frameHandler(objOS_a, strHandlerID_a)
{
    var m_objThis = this;
    var m_strHandlerID = strHandlerID_a;
    var os = objOS_a;

    function initialise()
    {
        os.element(m_strHandlerID, 'geLogoutButton').bind('click', logoutButton_onClick);
    }

    function logoutButton_onClick()
    {
        var objRequest = null;

        objRequest = os.createJSONRequest('security.logout', []);
        os.callServer(objRequest, doNothing, doNothing);
    }
    
    initialise();
}