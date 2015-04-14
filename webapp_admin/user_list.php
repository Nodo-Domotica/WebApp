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

$page_title = "Setup: Userlist";	  


if ($user_group == "admin") {


mysql_select_db($database, $db);
$result = mysql_query("SELECT * FROM nodo_tbl_users") or die(mysql_error());  

}
else
{

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

		
		
			<?php
			 
								   
			
	  
			//echo '<br \>';   
			// loop through results of database query, displaying them in the table        
			while($row = mysql_fetch_array($result)) 
			{ 
			if (strtotime($row['cookie_update']) >  (strtotime("now")-300)) {$heartbeat = "<IMG SRC=\"../media/on.png\" ALIGN=right alt=\"On\">";} else {$heartbeat = "<IMG SRC=\"../media/off.png\" ALIGN=right alt=\"Off\">";}
			?>
					   
			<div data-role="collapsible" data-collapsed="true" data-content-theme="<?php echo $theme?>">
			<h3><span><?php echo $heartbeat;?></span><?php echo $row['user_login_name'];?></h3>
			<b>Account created: </b> <?php echo $row['create_date'];?> </br>
			<b>Firstname: </b> <?php echo $row['first_name'];?></br>
			<b>Lastname: </b> <?php echo $row['last_name'];?> </br>
			<b>Nodo IP: </b> <?php echo $row['nodo_ip'];?> </br>
			<b>Nodo Port: </b> <?php echo $row['nodo_port'];?> </br>
			<b>Nodo ID: </b> <?php echo $row['nodo_id'];?> </br>
			<b>Build: </b> <?php echo $row['nodo_build'];?> </br>
			<b>Cookie counter: </b> <?php echo $row['cookie_count'];?> </br>
			<b>Cookie timestamp: </b> <?php echo $row['cookie_update'];?> </br>
				
			
			</div>
			<?php
			}         
			?>
		
	

	
	</div><!-- /content -->
	
	<?php require_once('../include/footer_admin.php'); ?>
	
</div><!-- /main page -->

<!-- Start of saved page: -->
<div data-role="dialog" id="saved" data-theme="<?php echo $theme?>">

	<div data-role="header" data-theme="<?php echo $theme_header?>">
		<h1><?php echo $page_title?></h1>
	</div><!-- /header -->

	<div data-role="content">	
		<h2>Settings saved.</h2>
				
		<p><a href="notifications.php" data-role="button" data-inline="true" data-icon="back">Ok</a></p>	
	
	
	</div><!-- /content -->
	
	
</div><!-- /page saved -->
 
</body>
</html>

