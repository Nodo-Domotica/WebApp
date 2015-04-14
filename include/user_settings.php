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

$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
$stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
$stmt->execute();
$row_RSsetup = $stmt->fetch(PDO::FETCH_ASSOC);


if($row_RSsetup['webapp_theme'] == "") {$theme = "a";} else {$theme = $row_RSsetup['webapp_theme'];}
if($row_RSsetup['webapp_theme_header'] == "") {$theme_header = "a";} else {$theme_header = $row_RSsetup['webapp_theme_header'];}

if($row_RSsetup['webapp_title'] == "") {$title = "Nodo Web App";} else {$title = $row_RSsetup['webapp_title'];}

$send_method = $row_RSsetup['send_method'];
$nodo_ip = $row_RSsetup['nodo_ip'];
$nodo_port = $row_RSsetup['nodo_port'];
$nodo_password = $row_RSsetup['nodo_password'];
$nodo_id = $row_RSsetup['nodo_id'];
$cookie = $row_RSsetup['cookie'];
$cookie_update = $row_RSsetup['cookie_update'];
$user_group = $row_RSsetup['user_group'];

$build=trim(substr(strrchr($row_RSsetup['nodo_build'], "="), 1));
$build=(int)$build;

$key = md5($cookie.":".$nodo_password);

//Controleren of de Nodo maximaal 3 minuten geleden een connectie met de Web App heeft gehad.
if (strtotime($cookie_update) >  (strtotime("now")-180)) {$heartbeat = "ok";} else {$heartbeat = "lost";}

date_default_timezone_set('Europe/Amsterdam');

?>