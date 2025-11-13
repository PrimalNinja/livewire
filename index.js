function indexForm(objOS_a, strFormID_a, objParameters_a)
{
    var m_objThis = this;
    var m_strFormID = strFormID_a;
    var os = objOS_a;
    var m_objParameters = objParameters_a;

    function populateForm()
    {
        var strDatabaseName = '';

        os.element('head', 'geAppTitle').text(APPTITLE);
        os.element(m_strFormID, 'geAppTitle').text(APPTITLE);

        var objRequest = os.createJSONRequest('system.getDatabaseName', []);
        os.callServer(objRequest, function(objResponse_a)
        {
            strDatabaseName = objResponse_a.value;
            os.element(m_strFormID, 'geDatabaseName').text(strDatabaseName);
        });
    }

    populateForm();
}

var g_objOS = new qriOS({ listeners: ['pingpong', 'livewire'], assets:'geAssets' });
var g_frmIndex = new indexForm(g_objOS, 'body', {});
