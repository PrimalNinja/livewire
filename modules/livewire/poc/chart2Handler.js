function chart2Handler(objOS_a, strHandlerID_a, objParameters_a)
{
    var m_objThis = this;
    var m_strHandlerID = strHandlerID_a;
    var os = objOS_a;
    var m_objParameters = objParameters_a || {};
    var m_arrData = m_objParameters.data || [25, 42, 38, 55, 48, 62, 58, 71];
    var m_arrLabels = m_objParameters.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
    var m_strTitle = m_objParameters.title || 'Weekly Trend Analysis';
    var m_objCanvas = null;
    var m_objContext = null;

    function initialise()
    {
        var arrCanvases = os.element(m_strHandlerID, 'chart2Canvas');
        
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
        var intStepX = 0;
        var intX = 0;
        var intY = 0;
        var strLabel = '';
        var intGridLines = 5;
        var intGridStep = 0;
        var intGridValue = 0;
        var intPointRadius = 5;
        
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
        
        // Calculate step
        intStepX = intChartWidth / (m_arrData.length - 1);
        
        // Draw area fill first
        m_objContext.beginPath();
        m_objContext.moveTo(intPadding, intPadding + 40 + intChartHeight);
        
        for (intI = 0; intI < m_arrData.length; intI++)
        {
            intValue = m_arrData[intI];
            intX = intPadding + intI * intStepX;
            intY = intPadding + 40 + intChartHeight - ((intValue / intMaxValue) * intChartHeight);
            
            m_objContext.lineTo(intX, intY);
        }
        
        m_objContext.lineTo(intPadding + (m_arrData.length - 1) * intStepX, intPadding + 40 + intChartHeight);
        m_objContext.closePath();
        
        // Fill with gradient
        var objGradient = m_objContext.createLinearGradient(0, intPadding + 40, 0, intPadding + 40 + intChartHeight);
        objGradient.addColorStop(0, 'rgba(255, 152, 0, 0.5)');
        objGradient.addColorStop(1, 'rgba(255, 152, 0, 0.1)');
        m_objContext.fillStyle = objGradient;
        m_objContext.fill();
        
        // Draw line
        m_objContext.beginPath();
        m_objContext.strokeStyle = '#FF9800';
        m_objContext.lineWidth = 3;
        m_objContext.lineJoin = 'round';
        
        for (intI = 0; intI < m_arrData.length; intI++)
        {
            intValue = m_arrData[intI];
            intX = intPadding + intI * intStepX;
            intY = intPadding + 40 + intChartHeight - ((intValue / intMaxValue) * intChartHeight);
            
            if (intI === 0)
            {
                m_objContext.moveTo(intX, intY);
            }
            else
            {
                m_objContext.lineTo(intX, intY);
            }
        }
        m_objContext.stroke();
        
        // Draw points and labels
        m_objContext.textAlign = 'center';
        m_objContext.font = '11px Arial';
        
        for (intI = 0; intI < m_arrData.length; intI++)
        {
            intValue = m_arrData[intI];
            intX = intPadding + intI * intStepX;
            intY = intPadding + 40 + intChartHeight - ((intValue / intMaxValue) * intChartHeight);
            
            // Draw point
            m_objContext.beginPath();
            m_objContext.arc(intX, intY, intPointRadius, 0, Math.PI * 2);
            m_objContext.fillStyle = '#FF9800';
            m_objContext.fill();
            m_objContext.strokeStyle = '#E65100';
            m_objContext.lineWidth = 2;
            m_objContext.stroke();
            
            // Draw value above point
            m_objContext.fillStyle = '#333';
            m_objContext.font = 'bold 11px Arial';
            m_objContext.fillText(intValue.toString(), intX, intY - 12);
            
            // Draw X-axis label
            strLabel = m_arrLabels[intI] || '';
            m_objContext.fillStyle = '#666';
            m_objContext.font = '11px Arial';
            m_objContext.save();
            m_objContext.translate(intX, intPadding + 40 + intChartHeight + 15);
            m_objContext.rotate(-Math.PI / 6);
            m_objContext.fillText(strLabel, 0, 0);
            m_objContext.restore();
        }
    }

    initialise();
}