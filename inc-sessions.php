<?php

class SessionClass 
{
    private $m_objDB;
    private $m_strSessionID;
    private $m_arrStates;
    
    private function createSession() 
    {
        if (DB_SESSIONS && $this->m_objDB)
        {
            $strSQL = "insert into d_sessions (session_id, session_data) values ('~SESSIONID~', '')";
            $strSQL = str_replace('~SESSIONID~', ff($this->m_strSessionID), $strSQL);
            dbExecute($this->m_objDB, $strSQL);
        }
        else
        {
            $strFile = DIR_SESSIONS . $this->m_strSessionID . '.json';
            file_put_contents($strFile, '{}');
        }
    }
    
    private function validateSession() 
    {
        $blnValid = false;
        
        if (DB_SESSIONS && $this->m_objDB)
        {
            $strSQL = "select count(*) as retvalue from d_sessions where session_id = '~SESSIONID~'";
            $strSQL = str_replace('~SESSIONID~', ff($this->m_strSessionID), $strSQL);
            $strCount = dbFetchValue($this->m_objDB, $strSQL);
            $blnValid = $strCount > 0;
        }
        else
        {
            $strFile = DIR_SESSIONS . $this->m_strSessionID . '.json';
            $blnValid = file_exists($strFile);
        }
        
        return $blnValid;
    }
    
    public function __construct($objDB_a) 
    {
        $this->m_objDB = $objDB_a;
        $this->m_strSessionID = null;
        $this->m_arrStates = [];
    }
    
    public function getData($strKey_a) 
    {
        $strSessionData = '';
        
        if (DB_SESSIONS && $this->m_objDB)
        {
            $strSQL = "select session_data as retvalue from d_sessions where session_id = '~SESSIONID~'";
            $strSQL = str_replace('~SESSIONID~', ff($this->m_strSessionID), $strSQL);
            $strSessionData = dbFetchValue($this->m_objDB, $strSQL);
        }
        else
        {
            $strFile = DIR_SESSIONS . $this->m_strSessionID . '.json';
            if (file_exists($strFile))
            {
                $strSessionData = file_get_contents($strFile);
            }
        }
        
        if (!empty($strSessionData)) 
        {
            $objData = json_decode($strSessionData, true);
            return isset($objData[$strKey_a]) ? $objData[$strKey_a] : null;
        }
        return null;
    }
    
    public function hasStates($arrNeedles_a)
    {
        return hasStates($this->m_arrStates, $arrNeedles_a);
    }
    
    public function startSession($strSessionID_a) 
    {
        $this->m_strSessionID = preg_replace('/[^a-f0-9]/i', '', $strSessionID_a);
    
        if (empty($this->m_strSessionID) || !$this->validateSession()) 
        {
            $this->createSession();
        }
        
        // Load states from session
        $arrSavedStates = $this->getData('states');
        if (is_array($arrSavedStates))
        {
            $this->m_arrStates = $arrSavedStates;
        }
        else
        {
            $this->m_arrStates = [];
        }
    
        return $this->m_strSessionID;
    }
    
    public function setData($strKey_a, $varValue_a) 
    {
        $strSessionData = '';
        
        if (DB_SESSIONS && $this->m_objDB)
        {
            $strSQL = "select session_data as retvalue from d_sessions where session_id = '~SESSIONID~'";
            $strSQL = str_replace('~SESSIONID~', ff($this->m_strSessionID), $strSQL);
            $strSessionData = dbFetchValue($this->m_objDB, $strSQL);
        }
        else
        {
            $strFile = DIR_SESSIONS . $this->m_strSessionID . '.json';
            if (file_exists($strFile))
            {
                $strSessionData = file_get_contents($strFile);
            }
        }
        
        $objData = [];
        if (!empty($strSessionData)) 
        {
            $objData = json_decode($strSessionData, true);
        }
        
        $objData[$strKey_a] = $varValue_a;
        $strJSONData = json_encode($objData);
        
        if (DB_SESSIONS && $this->m_objDB)
        {
            $strSQL = "update d_sessions set session_data = '~SESSIONDATA~' where session_id = '~SESSIONID~'";
            $strSQL = str_replace('~SESSIONID~', ff($this->m_strSessionID), $strSQL);
            $strSQL = str_replace('~SESSIONDATA~', ff($strJSONData), $strSQL);
            dbExecute($this->m_objDB, $strSQL);
        }
        else
        {
            $strFile = DIR_SESSIONS . $this->m_strSessionID . '.json';
            file_put_contents($strFile, $strJSONData);
        }
    }

    public function states($arrRemove_a, $arrAdd_a)
    {
        states($this->m_arrStates, $arrRemove_a, $arrAdd_a);
        $this->setData('states', $this->m_arrStates);
    }
}