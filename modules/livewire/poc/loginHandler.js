/* loginHandler.js */
function loginHandler(objOS_a, strHandlerID_a, objParameters_a)
{
    var m_objThis = this;
    var m_strHandlerID = strHandlerID_a;
    var os = objOS_a;
    var m_objParameters = objParameters_a;

    function initialise()
    {
        os.element(m_strHandlerID, 'geLoginButton').bind('click', loginButton_onClick);
    }

    function loginButton_onClick()
    {
        var objRequest = null;

        var strUsername = os.element(m_strHandlerID, 'geUsername').val();
        var strPassword = os.element(m_strHandlerID, 'gePassword').val();

        objRequest = os.createJSONRequest('security.login', [
            {name: 'username', value: strUsername},
            {name: 'password', value: strPassword}
        ]);

        os.callServer(objRequest, function(objResponse_a)
        {
            if (objResponse_a.success)
            {
                os.element(m_strHandlerID, 'geLoginMessage').text('Login successful!');
                os.element(m_strHandlerID, 'geLoginMessage').css('color', 'green');
            }
            else
            {
                os.element(m_strHandlerID, 'geLoginMessage').text('Login failed: ' + objResponse_a.message);
                os.element(m_strHandlerID, 'geLoginMessage').css('color', 'red');
            }
        },
        function(strError_a)
        {
            os.element(m_strHandlerID, 'geLoginMessage').text('Error: ' + strError_a);
        });
    }

    initialise();
}