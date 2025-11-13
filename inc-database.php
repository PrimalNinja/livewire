<?php

$g_intTransactionNestCount = 0;
$g_blnDatabaseError = false;
$g_strDatabaseError = '';

function dbBeginTrans($objConn_a) 
{
    global $g_intTransactionNestCount, $g_blnDatabaseError, $g_strDatabaseError;
    
    if ($g_intTransactionNestCount == 0) 
    {
        $g_blnDatabaseError = false;
        $g_strDatabaseError = '';
        $objConn_a->beginTransaction();
    }

    $g_intTransactionNestCount++;
}

function dbClose($objConn_a) 
{
    global $g_intTransactionNestCount;
    
    if ($g_intTransactionNestCount > 0) 
    {
        $objConn_a->rollBack();
        $g_intTransactionNestCount = 0;
    }
    
    $objConn_a = null;
}

function dbCloseRecordset($objRecordset_a) 
{
    $objRecordset_a->closeCursor();
}

function dbExecute($objConn_a, $strSQL_a) 
{
    global $g_blnDatabaseError, $g_strDatabaseError;
    
    $blnResult = $objConn_a->exec($strSQL_a);
    
    if ($blnResult === false) 
    {
        $g_blnDatabaseError = true;
        $arrError = $objConn_a->errorInfo();
        $g_strDatabaseError = $arrError[2];
    }
    
    return $blnResult;
}

function dbEndTrans($objConn_a) 
{
    global $g_intTransactionNestCount, $g_blnDatabaseError;

    $blnResult = false;
    $g_intTransactionNestCount--;
    
    if ($g_intTransactionNestCount == 0) 
    {
        if ($g_blnDatabaseError) 
        {
            $objConn_a->rollBack();
        } 
        else 
        {
            $objConn_a->commit();
            $blnResult = true;
        }
    }

    return $blnResult;
}

function dbFetchNext($objRS_a) 
{
    $objRow = $objRS_a->fetch(PDO::FETCH_ASSOC);
    
    return $objRow;
}

function dbFetchValue($objConn_a, $strSQL_a) 
{
    global $g_blnDatabaseError, $g_strDatabaseError;
    
    $strValue = '';
    $objRecordset = $objConn_a->query($strSQL_a);
    
    if (!$objRecordset) 
    {
        $g_blnDatabaseError = true;
        $arrError = $objConn_a->errorInfo();
        $g_strDatabaseError = $arrError[2];
    }
    else
    {
        $objRow = dbFetchNext($objRecordset);
        if ($objRow)
        {
            $strValue = $objRow['retvalue'];
        }
        dbCloseRecordset($objRecordset);
    }
    
    return $strValue;
}

function dbGetLastError() 
{
    global $g_strDatabaseError;
    
    return $g_strDatabaseError;
}

function dbOpen($strServer_a, $strUsername_a, $strPassword_a, $strDatabaseName_a) 
{
    global $g_blnDatabaseError, $g_strDatabaseError;
    
    $objConn = false;
    
    try 
    {
        $strDSN = 'mysql:host=' . $strServer_a . ';dbname=' . $strDatabaseName_a;
        $objConn = new PDO($strDSN, $strUsername_a, $strPassword_a);
        $objConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
    }
    catch (PDOException $e) 
    {
        $g_blnDatabaseError = true;
        $g_strDatabaseError = 'Connection failed: ' . $e->getMessage();
        $objConn = false;
    }
    
    return $objConn;
}

function dbOpenRecordset($objConn_a, $strSQL_a) 
{
    global $g_blnDatabaseError, $g_strDatabaseError;
    
    $objResult = $objConn_a->query($strSQL_a);
    
    if (!$objResult) 
    {
        $g_blnDatabaseError = true;
        $arrError = $objConn_a->errorInfo();
        $g_strDatabaseError = $arrError[2];
        $objResult = false;
    }
    
    return $objResult;
}

function dbRaiseCustomError($strError_a) 
{
    global $g_blnDatabaseError, $g_strDatabaseError;
    
    $g_blnDatabaseError = true;
    $g_strDatabaseError = $strError_a;
}

function ff($strValue_a)
{
    return str_replace(["'", '"'], ["''", '""'], $strValue_a);
}

function ffn($strValue_a)
{
    $strResult = 'null';

    if (strlen($strValue_a) > 0)
    {
        $strResult = str_replace(["'", '"'], ["''", '""'], $strValue_a);
    }

    return $strResult;
}
