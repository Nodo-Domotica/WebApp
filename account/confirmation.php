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
require_once('../settings.php');
require_once('../api/pdo_db_connection.php');

$message = "";


if (isset($_GET['passkey']) && $_GET['passkey'] != null ) {

	$confirm_code = $_GET['passkey'];
	
	$stmt = db()->prepare("SELECT id,confirm_code FROM nodo_tbl_users WHERE confirm_code=:confirm_code");
	$stmt->bindParam(":confirm_code", $confirm_code);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	$id = $row['id'];

		if($id > 0) {
		
			//Gegevens in de database opslaan
			 $stmt = db()->prepare("UPDATE nodo_tbl_users SET active='1',confirm_code='' WHERE id=:id");
             $stmt->bindValue(':id', $id, PDO::PARAM_INT);
             $stmt->execute();
			 $message = "You account is confirmed<br \>";
			 $message.= "Click <a href=\"../index.html#login_page\" data-ajax=\"false\">here</a> to login";
		}
		else {
			
			$message = "Confirmation ID ". $confirm_code . " not found";
		}
	
}
else {
	
	$message = "Confirmation ID ". $confirm_code . " not correct";
}

?>






<!DOCTYPE html> 
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
	<title>Nodo Web App confirmation</title> 
	<link rel="stylesheet" href="../themes/webapp.min.css" />
	<link rel="stylesheet" href="../themes/jquery.mobile.icons.min.css" />
	<link rel="stylesheet" href="../js/jqm/jquery.mobile.structure-1.4.5.min.css" />
	<link rel="stylesheet" type="text/css" href="../css/custom.css" />
	<script src="../js/jq/jquery-1.11.1.min.js"></script>
	<script src="../js/jqm/jquery.mobile-1.4.5.min.js"></script>
	<link rel="icon" type="image/vnd.microsoft.icon" href="../media/logo.ico" />
	<link rel="shortcut icon" href="../media/logo.ico" />
</head> 

<body> 

<div data-role="page">

	<div data-role="header">
		<h1>Nodo Web App</h1>
	</div><!-- /header -->

	<div data-role="content">	
		<?php echo $message; ?>
				
		
	</div><!-- /content -->
	
<div data-role="footer">
		<h4></h4>
	</div><!-- /footer -->	
	
</div><!-- /page -->



</body>
</html>