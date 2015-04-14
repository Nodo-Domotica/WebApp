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

require_once('../connections/db_connection.php'); 
require_once('../include/auth.php');
require_once('../include/user_settings.php');

$page_title = "Setup: Clean events";	  


if ($user_group == "admin") {


	mysql_select_db($database, $db);
	$result = mysql_query("SELECT * FROM nodo_tbl_users") or die(mysql_error());  

	while($row = mysql_fetch_array($result)) {
	
		$user_id=$row['id'];
		

		mysql_query("DELETE FROM nodo_tbl_event_log WHERE user_id='$user_id' ORDER BY id DESC LIMIT 10000") or die(mysql_error()); 
	
	}
}

else {

	die('No Access!!!');

}

?>




<!DOCTYPE html> 
<html> 
 
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
	<title><?php echo $title ?></title> 
	<?php require_once('../include/jquery_mobile.php'); ?>
</head> 
 
<body> 

<!-- Start of main page: -->

<div data-role="page" pageid="main" data-theme="<?php echo $theme?>">
 
	<?php require_once('../include/header_admin.php'); ?>
 
	<div data-role="content">	

		
	Eventlogs cleaned...
	
		
	

	
	</div><!-- /content -->
	
	<?php require_once('../include/footer_admin.php'); ?>
	
</div><!-- /main page -->

 
</body>
</html>






