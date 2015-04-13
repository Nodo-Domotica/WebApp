<?php
/***********************************************************************************************************************
"Nodo Web App" Copyright © 2015 Martin de Graaf

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*************************************************************************************************************************/




$DEFAULT_NODO_PWD = "Nodo";
$DEFAULT_NODO_ID = "";
$WEBAPP_HOST = "webapp.nodo-domotica.nl";
$NODO_URL = "www.nodo-domotica.nl/webapp/new/nodo.php"; //waar bevind zich nodo.php
$MYSQLHOST = 'localhost'; 
$DBNAME = 'nododom_webappdb'; //Database naam
$MYSQLUSER = 'XXXX'; //Mysql Gebruiker.
$MYSQLPWD = 'XXXX'; //Mysql Wachtwoord.

//$salt word gebruikt om er voor te zorgen dat ook slecht gekozen wachtwoorden zoals 1234, abc sterk worden gehashed
$salt = "XXXX"; //Random key

//SQL injection prevention
//$_POST = array_map("mysql_real_escape_string", $_POST);
$_GET = array_map("mysql_real_escape_string", $_GET);
$_REQUEST = array_map("mysql_real_escape_string", $_REQUEST);

?>