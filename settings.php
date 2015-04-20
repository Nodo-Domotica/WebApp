<?php
/***********************************************************************************************************************
"Nodo Web App" Copyright � 2015 Martin de Graaf

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


//MYSQL
//-------------------------------------
$MYSQLHOST = 'localhost';
$DBNAME = 'nododom_webappdb';
$MYSQLUSER = 'User';
$MYSQLPWD = 'Password';
//-------------------------------------

//Web App
//-------------------------------------
$NODO_URL = "webapp.nodo-domotica.nl/nodo.php"; //Deze waarde zal in de Nodo onder HTTPhost worden gezet bij een auto config. Http:// zal door de Nodo worden toegevoegd. Https:// wordt NIET door de Nodo ondersteund!
$WEBAPP_URL = "https://webapp.nodo-domotica.nl"; //URL van de Web App
$SALT = "3OvxO0Qi594v10bhu6DC3g2XG3ZozJsH"; //$SALT word gebruikt om er voor te zorgen dat ook slecht gekozen wachtwoorden zoals 1234, abc sterk worden gehashed. Let op indien je deze waarde aanpast werkt het standaard wachtwoord niet meer!
//-------------------------------------


?>