function chart1Handler(objOS_a, strHandlerID_a, objParameters_a)
{
    var m_objThis = this;
    var m_strHandlerID = strHandlerID_a;
    var os = objOS_a;
    var m_objParameters = objParameters_a || {};
    var m_arrData = m_objParameters.data || [65, 45, 78, 52, 88, 42, 95, 38];
    var m_arrLabels = m_objParameters.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    var m_strTitle = m_objParameters.title || 'Monthly Performance';
    var m_objCanvas = null;
    var m_objContext = null;

    function initialise()
    {
        var arrCanvases = os.element(m_strHandlerID, 'chart1Canvas');
        
        if (arrCanvases.length > 0)
        {
            m_objCanvas = arrCanvases[0];
            m_objCanvas.width = 600;
            m_objCanvas.height = 400;
            m_objContext = m_objCanvas.getContext('2d');
            populateHandler();
        }
    }

    function populateHandler()
    {
        var intI = 0;
        var intValue = 0;
        var intMaxValue = 0;
        var intPadding = 60;
        var intChartWidth = m_objCanvas.width - intPadding * 2;
        var intChartHeight = m_objCanvas.height - intPadding * 2 - 40;
        var intBarWidth = 0;
        var intBarSpacing = 10;
        var intBarHeight = 0;
        var intX = 0;
        var intY = 0;
        var strLabel = '';
        var intGridLines = 5;
        var intGridStep = 0;
        var intGridValue = 0;
        
        if (!m_objContext)
        {
            return;
        }
        
        // Clear canvas
        m_objContext.clearRect(0, 0, m_objCanvas.width, m_objCanvas.height);
        
        // Find max value for scaling
        for (intI = 0; intI < m_arrData.length; intI++)
        {
            if (m_arrData[intI] > intMaxValue)
            {
                intMaxValue = m_arrData[intI];
            }
        }
        intMaxValue = Math.ceil(intMaxValue / 10) * 10;
        
        // Draw title
        m_objContext.font = 'bold 16px Arial';
        m_objContext.fillStyle = '#333';
        m_objContext.textAlign = 'center';
        m_objContext.fillText(m_strTitle, m_objCanvas.width / 2, 25);
        
        // Draw Y-axis grid lines and labels
        m_objContext.strokeStyle = '#e0e0e0';
        m_objContext.fillStyle = '#666';
        m_objContext.font = '12px Arial';
        m_objContext.textAlign = 'right';
        m_objContext.lineWidth = 1;
        
        intGridStep = intMaxValue / intGridLines;
        for (intI = 0; intI <= intGridLines; intI++)
        {
            intGridValue = Math.round(intI * intGridStep);
            intY = intPadding + 40 + intChartHeight - (intI * intChartHeight / intGridLines);
            
            // Grid line
            m_objContext.beginPath();
            m_objContext.moveTo(intPadding, intY);
            m_objContext.lineTo(m_objCanvas.width - intPadding, intY);
            m_objContext.stroke();
            
            // Y-axis label
            m_objContext.fillText(intGridValue.toString(), intPadding - 10, intY + 4);
        }
        
        // Draw axes
        m_objContext.strokeStyle = '#333';
        m_objContext.lineWidth = 2;
        m_objContext.beginPath();
        m_objContext.moveTo(intPadding, intPadding + 40);
        m_objContext.lineTo(intPadding, intPadding + 40 + intChartHeight);
        m_objContext.lineTo(m_objCanvas.width - intPadding, intPadding + 40 + intChartHeight);
        m_objContext.stroke();
        
        // Calculate bar width
        intBarWidth = (intChartWidth - (m_arrData.length - 1) * intBarSpacing) / m_arrData.length;
        
        // Draw bars
        m_objContext.textAlign = 'center';
        m_objContext.font = '11px Arial';
        
        for (intI = 0; intI < m_arrData.length; intI++)
        {
            intValue = m_arrData[intI];
            intBarHeight = (intValue / intMaxValue) * intChartHeight;
            intX = intPadding + intI * (intBarWidth + intBarSpacing);
            intY = intPadding + 40 + intChartHeight - intBarHeight;
            
            // Create gradient for bar
            var objGradient = m_objContext.createLinearGradient(intX, intY, intX, intY + intBarHeight);
            objGradient.addColorStop(0, '#4CAF50');
            objGradient.addColorStop(1, '#2E7D32');
            
            // Draw bar
            m_objContext.fillStyle = objGradient;
            m_objContext.fillRect(intX, intY, intBarWidth, intBarHeight);
            
            // Draw bar border
            m_objContext.strokeStyle = '#1B5E20';
            m_objContext.lineWidth = 1;
            m_objContext.strokeRect(intX, intY, intBarWidth, intBarHeight);
            
            // Draw value on top of bar
            m_objContext.fillStyle = '#333';
            m_objContext.font = 'bold 11px Arial';
            m_objContext.fillText(intValue.toString(), intX + intBarWidth / 2, intY - 5);
            
            // Draw label
            strLabel = m_arrLabels[intI] || '';
            m_objContext.fillStyle = '#666';
            m_objContext.font = '12px Arial';
            m_objContext.fillText(strLabel, intX + intBarWidth / 2, intPadding + 40 + intChartHeight + 20);
        }
    }

    initialise();
}