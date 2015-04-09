<?php

function db() {
	
  global $MYSQLHOST, $DBNAME, $MYSQLUSER, $MYSQLPWD; 
	
  static $db = null;
  if (null === $db)
    $db = new PDO("mysql:host=$MYSQLHOST;dbname=$DBNAME;charset=utf8", $MYSQLUSER, $MYSQLPWD);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $db;
}
?>