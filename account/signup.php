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
$error_message = "";
$first_name = "";
$last_name = "";
$email = "";
$password = "";

if (isset($_POST['submit'])) 
{

$first_name = htmlspecialchars($_POST['first_name']);
$last_name = htmlspecialchars($_POST['last_name']); 
$email = htmlspecialchars($_POST['email']); 



$stmt = db()->prepare("SELECT id,user_login_name FROM nodo_tbl_users WHERE user_login_name=:email");
$stmt->bindParam(":email", $email);
	
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);


$id = $row['id'];
	
	//Als we een record terug krijgen dat is er al een account met hetzelfde e-mail adres
	if($id > 0) {
		$error_message = "<h4>Sorry this e-mail address is already in use</h4>";
	}
	
	else
	
	{ 

/************************************************************************************************
Generate NoDo ID													
*************************************************************************************************/ 

   
   
	//ID Lenght
	$unique_ref_length = 8;


	$unique_ref_found = false;

	
	$possible_chars = "1234567890ABCDEFGHIJKLMNPQRSTUVW";

	//Until we find a unique id
	while (!$unique_ref_found) {

	
		$unique_ref = "";

		
		$i = 0;

	
		while ($i < $unique_ref_length) {

			//Get random character from $possible_chars
			$char = substr($possible_chars, mt_rand(0, strlen($possible_chars)-1), 1);

			$unique_ref .= $char;

			$i++;

		}

	
		//ID generated. Check if ID exists in Database
		$stmt = db()->prepare("SELECT nodo_id FROM nodo_tbl_users WHERE nodo_id=:unique_ref");
		$stmt->bindParam(":unique_ref", $unique_ref);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		
				
		if ($stmt->rowCount() == 0) {

			//We have a unique ID
			$unique_ref_found = true;

		}
	
	
	}

$nodo_id = $unique_ref;

/************************************************************************************************
END Generate NoDo ID													
*************************************************************************************************/ 
	
	
	
		
	//Unieke verificatie code genereren
	$confirm_code=md5(uniqid(rand()));
	
	//Tijdelijk wachtwoord genereren
	$password_length = 12;
    $possible_chars = "#%*!@&=+1234567890ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";

	
	$i = 0;
	
		while ($i < $password_length) {

			//Get random character from $possible_chars
			$char = substr($possible_chars, mt_rand(0, strlen($possible_chars)-1), 1);

			$password .= $char;

			$i++;

		}
		
		$password_encoded = md5($SALT.$password);
	
	
	//Gegevens in de database opslaan
	 $stmt = db()->prepare("INSERT INTO nodo_tbl_users (user_login_name, first_name, last_name, confirm_code, user_password, nodo_id) VALUES (:email,:first_name,:last_name,:confirm_code,:password_encoded,:nodo_id)");
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':first_name', $first_name);
					$stmt->bindParam(':last_name', $last_name);
					$stmt->bindParam(':confirm_code', $confirm_code);
					$stmt->bindParam(':password_encoded', $password_encoded);
					$stmt->bindParam(':nodo_id', $nodo_id);
                    $stmt->execute();
	
	
	
	
	//Verificatie e-mail sturen.
	 $to = $email;
	 $subject = "Confirm your Nodo Web App account";
	 $message="Dear $first_name $last_name, \r\n\r\n";
	 $message.="Before you can use Nodo software and the Nodo Web App, you must accept the licence agreement and activate your account by clicking the following link:\r\n";
     $message.="https://webapp.nodo-domotica/account/confirmation.php?passkey=$confirm_code\r\n";
	 $message.="\r\n";
	 $message.="After confirmation you can login at https://webapp.nodo-domotica.nl with these login data:\r\n\r\n";
	 $message.="Username: $email\r\n";
	 $message.="Password: $password\r\n";
	 $message.="\r\n"; 
	 $message.="Your Nodo ID: $nodo_id\r\n\r\n";
	 $message.="DISCLAIMER\r\n
				(C) Copyright 2015 by Martin de Graaf & Paul Tonkes, http://www.nodo-domotica.nl\r\n
				Nodo-Domotica provides the  https://webapp.nodo-domotica.nl Website as a service to the public and Web siteowners.\r\n
				Nodo-Domotica is not responsible for, and expressly disclaims all liability for, damages of any kind arising out of use, reference to, or reliance on any information contained within the site. While the information contained within the site is periodically updated, no guarantee is given that the information provided in this Web site is correct, complete, and up-to-date.\r\n
				Although the Nodo-Domotica Web site may include links providing direct access to other Internet resources, including Web sites, Nodo-Domotica is not responsible for the accuracy or content of information contained in these sites. Links from Nodo-Domotica to third-party sites do not constitute an endorsement by Nodo-Domotica of the parties or their products and services. The appearance on the Web site of advertisements and product or service information does not constitute an endorsement by Nodo-Domotica, and Nodo-Domotica has not investigated the claims made by any advertiser. Product information is based solely on material received from suppliers.\r\n
				The WebApp and Nodo software are part of the 'Nodo Domotica' platform. The WebApp and all other related components are distributed under the terms of the GNU General Public License.  This program and hosting service comes with ABSOLUTELY NO WARRANTY.\r\n
				You should have received a copy of the GNU General Public License
				along with this program.  If not, see <http://www.gnu.org/licenses/>\r\n";
	 
	 $from = "webapp@nodo-domotica.nl";
	 $headers = "From:" . $from;
	 
	 $sentmail = mail($to,$subject,$message,$headers);

	 if($sentmail){
		header("Location: signup_ok.php");  
	}
	
	else {
		die('Sorry an error occured!!!');
	}

	
	
	
	}
 
} 
?> 
  

<!DOCTYPE html> 
<html> 

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
	<title>Nodo Web App Sign up</title> 
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
		<h1>Nodo Web App Sign up</h1>
		<div data-role="navbar" data-iconpos="top">
		<ul>
			<li><a href="../index.html" data-icon="star"  data-ajax="false">Login</a></li>
			
		</ul>
	</div>
	</div><!-- /header -->

	<div data-role="content">	
		
		<?php echo $error_message; ?>
		
		
		<form action="signup.php" data-ajax="false" method="post">		
			<label for="first_name">First name:</label>
			<input type="text" name="first_name" id="first_name" value="<?php echo $first_name ?>"  />
			
			<label for="last_name">Last name:</label>
			<input type="text" name="last_name" id="last_name" value="<?php echo $last_name ?>"  />
			
			<label for="email">Email address:</label>
			<input type="text" name="email" id="email" value="<?php echo $email ?>"  />
			<br \>
				
			<input type="submit" name="submit" id="submit" value="Signup" >
		</form>
		 
		 
		 
	</div><!-- /content -->
<script>	
$(document).ready(function() {
      $('#submit').click(function() {
		  $(".error").hide();
		  var hasError = false;
		  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		  var emailaddressVal = $("#email").val();
		  if(emailaddressVal == '') {
			  $("#email").before('<span class="error"><b>Please enter your email address.</b></span>');
			  hasError = true;
			  }
		  else if(!emailReg.test(emailaddressVal)) {
			  $("#email").before('<span class="error"><b>Enter a valid email address.</b></span>');
			  hasError = true;
		  }
		  
		 var nameVal = $("#first_name").val();
		 if(nameVal == '') {
		 $("#first_name").before('<span class="error"><b>Please enter your first name.<b></span>');
		 hasError = true;
		 }
		  
		 var nameVal = $("#last_name").val();
		 if(nameVal == '') {
			 $("#last_name").before('<span class="error"><b>Please enter your last name.<b></span>');
			 hasError = true;
		 }
		 
		 
		 if(hasError == true) { return false; }
	 });
	 
	 
		  });
</script>
	
	<div data-role="footer">
		<h4></h4>
	</div><!-- /footer -->
	
</div><!-- /page -->

</body>
</html>