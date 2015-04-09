<?php
$db_hostname = $MYSQLHOST;
$database = $DBNAME;
$db_username = $MYSQLUSER;
$db_password = $MYSQLPWD;
$db = mysql_pconnect($db_hostname, $db_username, $db_password) or trigger_error(mysql_error(),E_USER_ERROR); 
?>