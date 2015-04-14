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

    
	if (isset($_COOKIE['TOKEN']) && isset($_COOKIE['USERID'])) {

	$token = $_COOKIE['TOKEN'];
	$userid = $_COOKIE['USERID'];
	
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_tokens WHERE user_id=:userId AND token=:token");
	$stmt->bindValue(':userId', $userid, PDO::PARAM_INT);
	$stmt->bindParam(':token', $token);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
	$id = $row['user_id'];
	//$active = $row['active'];
	//$default_page = $row['default_page'];

	if($id > 0) {
		
		//De gebruiker inloggen
		//$_SESSION['userId'] = $id;
		$userId=$id;
		//session_write_close();
		
		
	}
	else {	
	die();
	//header("Location: ../");
	}
}
	else {	
	die();
	//header("Location: ../");
	}

?>