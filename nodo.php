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

/**
* Evaluates a math equation and returns the result, sanitizing
* input for security purposes.  Note, this function does not
* support math functions (sin, cos, etc)
*
* @param string the math equation to evaluate (ex:  100 * 24)
* @return number
*/
function evalmath($equation) {
	$result = 0;
	 
	// sanitize input
	$equation = preg_replace("/[^0-9+\-.*\/()%]/","",$equation);
	 
	// convert percentages to decimal
	$equation = preg_replace("/([+-])([0-9]{1})(%)/","*(1\$1.0\$2)",$equation);
	$equation = preg_replace("/([+-])([0-9]+)(%)/","*(1\$1.\$2)",$equation);
	$equation = preg_replace("/([0-9]+)(%)/",".\$1",$equation);
	 
	if ( $equation != "" ) {
		$result = @eval("return " . $equation . ";" );
	}
	 
	if ($result === false) {
		return "Error in formula!"; //Unable to calculate equation
	}
	 
	return $result;
}


//Zomer winter tijd check
if (date('I') == 0) {$DLS='No';} else {$DLS='Yes';}
$date = date("d-m-Y");
$time = date("H:i");
$dow= date("w")+1; // php zondag = 0 Nodo gaat uit van 1

require_once('../connections/db_connection.php'); 

	//Stuur event via HTTP naar Nodo
    function send_event($event) {
	
		global $nodo_ip, $nodo_port, $key;
				
		$url = "http://$nodo_ip:$nodo_port/?event=$event&key=$key";
				
		$ch = curl_init();
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,0);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,5);
		curl_setopt($ch,CURLOPT_TIMEOUT,2);	
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}


	function closeOutput($stringToOutput){
		
		global $time;
		global $date;
		global $dow;
		global $DLS;
		
			
        set_time_limit(0);
        ignore_user_abort(true);
        header("Connection: close\r\n");
        header("Content-Encoding: none\r\n"); 
		header("Nodo-Date: Day=".$dow."; Date=".$date."; Time=".$time."; DLS=".$DLS);		
        ob_start();          
        echo $stringToOutput;   
        $size = ob_get_length();   
        header("Content-Length: $size",TRUE);  
        ob_end_flush();
        ob_flush();
        flush();   
    }
	


/*
Login gegevens controleren
Checken of id=[nodoID] als url parameter is meegegeven.
*/
if (isset($_GET['id'])){

	$id = mysql_real_escape_string($_GET['id']);

	//User id uit de database halen doormede van NodoId	
	mysql_select_db($database, $db);
	$result = mysql_query("SELECT id,nodo_id,nodo_ip,nodo_port,nodo_password,cookie,cookie_count FROM nodo_tbl_users WHERE nodo_id='$id'") or die(mysql_error());  
	$row = mysql_fetch_array($result);
	$userId = $row['id']; 
	
	$nodo_ip = $row['nodo_ip'];
	$nodo_port = $row['nodo_port'];
	$cookie_counter = $row['cookie_count'] + 1;
	$cookie_webapp = $row['cookie'];
	$nodo_password = $row['nodo_password']; 

	$key_webapp = md5($cookie_webapp.":".$nodo_password);
	$key_nodo = $_GET['key'];

	if ($key_webapp == $key_nodo) {$key_match = 1;}
	if ($key_nodo == '228cbe2d40c4f4689c329f27e33dc7ff') {$key_match = 1;} //Event vanaf socket server


	//Nieuwe cookie en header informatie in de database opslaan
	if (isset($_GET['cookie'])){
		
		$cookie = mysql_real_escape_string($_GET['cookie']);
		$build = $_SERVER['HTTP_USER_AGENT'];
			
		mysql_query("UPDATE nodo_tbl_users SET cookie='$cookie', cookie_update=NOW(), cookie_count='$cookie_counter', 
					nodo_build='$build' WHERE id='$userId'") or die(mysql_error());
		
		header('Cookie: $cookie');
	}
}

//$key_match = 1; //LET OP!!!! alleen voor debug doeleingen

 
//Als de key correct is dan event= behandelen
if($userId > 0 && $key_match == 1) {

		//Als de Nodo een file opvraagt dan zal onderstaande routine de file weergeven zodat de Nodo deze kan parsen
	if (isset($_GET['file'])){
	
		$outputContent = '';
	
		$file = mysql_real_escape_string($_GET['file']);
		
		$result = mysql_query("SELECT script FROM nodo_tbl_scripts WHERE file='$file' AND user_id='$userId' ORDER BY id DESC") or die(mysql_error());  
		$row = mysql_fetch_array($result);
	//	echo $row['script'];
	//	echo "\n";
	$outputContent = $row['script']."\n";
	}
	else {
	$outputContent = '';
	}
	
	

//Vanaf hier wordt de verbinding verbroken. Output na deze regel komt nooit bij de client aan.
	

    closeOutput( $outputContent );

		 	 	

	
	//sleep(30);
	 
     //Ontvangen event verwerken
	if (isset($_GET['event'])){
					 			 
		//Url parameters in variablen plaatsen
		$eventraw = mysql_real_escape_string($_GET['event']);
		$unit = mysql_real_escape_string($_GET['unit']);
		 
		//Spaties vervangen door , om makkelijk een array te kunnen maken
		$event = str_replace(" ",",",$eventraw); 
			
		//Commando en parameters uit event distileren	
		$cmd_array = explode(',', $event);
		$cmd = trim(strtolower($cmd_array[0]));
		for ($x=1; $x<=5; $x++) {
			$par[$x] =  trim(strtolower($cmd_array[$x]));
		}
		
		$placeholders = array('[TIME]','[DATE]','[UNIT]','[CMD]','[PAR1]', '[PAR2]', '[PAR3]', '[PAR4]','[PAR5]');
		$params = array($time,$date,$unit,$cmd,$par[1],$par[2],$par[3],$par[4],$par[5]);
							 
		//Event in nodo_tbl_event_log opslaan
		mysql_query("INSERT INTO nodo_tbl_event_log (user_id, nodo_unit_nr, event) VALUES ('$userId','$unit','$eventraw')") or die(mysql_error());
					 
		//Controleren of we een notificatie moeten sturen	
		$RSnotify = mysql_query("SELECT * FROM nodo_tbl_notifications_new WHERE user_id='$userId' 
		AND (unit='$unit' OR unit='*') AND ('$cmd' LIKE (REPLACE(event,'*','%')))  
		AND ('$par[1]' LIKE (REPLACE(par1,'*','%'))) 
		AND ('$par[2]' LIKE (REPLACE(par2,'*','%'))) 
		AND ('$par[3]' LIKE (REPLACE(par3,'*','%'))) 
		AND ('$par[4]' LIKE (REPLACE(par4,'*','%'))) 
		AND ('$par[5]' LIKE (REPLACE(par5,'*','%'))) ") or die(mysql_error());  
		
									
		while($row_RSnotify = mysql_fetch_array($RSnotify)) {  

			
			 
			 $type = $row_RSnotify['type'];
			 $to = $row_RSnotify['recipient'];
			 $subject = str_ireplace($placeholders, $params, $row_RSnotify['subject']);
			 $message = str_ireplace($placeholders, $params, $row_RSnotify['body']);
			 $from = "webapp@nodo-domotica.nl";
			 $headers = "From:" . $from;
				
			
			if ($type == '1') {
			
				mail($to,$subject,$message,$headers);
			
			}
			
			elseif ($type == '2') {
			 
			 $subject=urlencode($subject);
			 $message=urlencode($message);
			 $ch = curl_init("http://api.pushingbox.com/pushingbox?devid=$to&subject=$subject&message=$message");
			 curl_exec ($ch);
             curl_close ($ch);
			
			}
			
			elseif ($type == '3') {
			
				$RS_setup = mysql_query("SELECT * FROM nodo_tbl_users 
				JOIN nodo_tbl_trusted_nodo_id ON nodo_tbl_users.id = nodo_tbl_trusted_nodo_id.user_id 
				JOIN nodo_tbl_trusted_nodo_cmd ON  nodo_tbl_trusted_nodo_cmd.trusted_id = nodo_tbl_trusted_nodo_id.id 
				WHERE nodo_tbl_users.nodo_id = '$to' AND nodo_tbl_trusted_nodo_id.nodo_id = '$id' 
				AND nodo_tbl_trusted_nodo_cmd.r_cmd = '$cmd' 
				AND (nodo_tbl_trusted_nodo_cmd.r_par1 = '$par[1]' OR nodo_tbl_trusted_nodo_cmd.r_par1 = '*') 
				AND (nodo_tbl_trusted_nodo_cmd.r_par2 = '$par[2]' OR nodo_tbl_trusted_nodo_cmd.r_par2 = '*') 
				AND (nodo_tbl_trusted_nodo_cmd.r_par3 = '$par[3]' OR nodo_tbl_trusted_nodo_cmd.r_par3 = '*') 
				AND (nodo_tbl_trusted_nodo_cmd.r_par4 = '$par[4]' OR nodo_tbl_trusted_nodo_cmd.r_par4 = '*') 
				AND (nodo_tbl_trusted_nodo_cmd.r_par5 = '$par[5]' OR nodo_tbl_trusted_nodo_cmd.r_par5 = '*')") or die(mysql_error());
				
				$row_RSsetup = mysql_fetch_array($RS_setup);
				$nodo_ip = $row_RSsetup['nodo_ip'];
				$nodo_port = $row_RSsetup['nodo_port'];
				$nodo_password = $row_RSsetup['nodo_password'];
				$cookie = $row_RSsetup['cookie'];
				
				$cmd_to_nodo = str_ireplace($placeholders, $params, $row_RSsetup['s_cmd']);
							
				$key = md5($cookie.":".$nodo_password);
				
				$event = str_replace(" ","%20",$cmd_to_nodo); 
				
				send_event($event);
 
			}
			
			
		}
													
		
			
		

		/* mysql_query("UPDATE nodo_tbl_objects as device
								SET device.state = (SELECT indicator FROM nodo_tbl_objects_cmd WHERE cmd = '$cmd' 
								AND (par1 = '$par[1]' OR par1 = '*') 
								AND (par2 = '$par[2]' OR par2 = '*') 
								AND (par3 = '$par[3]' OR par3 = '*') 
								AND (par4 = '$par[4]' OR par4 = '*') 
								AND (par5 = '$par[5]' OR par5 = '*') 
								AND user_id='$userId' AND type='5' ORDER BY sort_order LIMIT 1) 
								WHERE device.id IN (SELECT object_id FROM nodo_tbl_objects_cmd WHERE cmd = '$cmd' 
								AND (par1 = '$par[1]' OR par1 = '*') 
								AND (par2 = '$par[2]' OR par2 = '*') 
								AND (par3 = '$par[3]' OR par3 = '*') 
								AND (par4 = '$par[4]' OR par4 = '*') 
								AND (par5 = '$par[5]' OR par5 = '*') 
								AND user_id='$userId' AND type='5' ORDER BY sort_order)") or die(mysql_error()); 
								ORDER BY LOCATE('*', cmd) DESC,
										 LOCATE('*', unit) DESC,
										 LOCATE('*', par1) DESC, 
										 LOCATE('*', par2) DESC, 
										 LOCATE('*', par3) DESC, 
										 LOCATE('*', par4) DESC, 
										 LOCATE('*', par5) DESC"
								*/
								
		$rsDeviceCmd = mysql_query("SELECT * FROM nodo_tbl_objects_cmd WHERE ('$cmd' LIKE (REPLACE(cmd_event,'*','%'))) 
								AND (unit_event='$unit' OR unit_event='*')
								AND ('$par[1]' LIKE (REPLACE(par1_event,'*','%'))) 
								AND ('$par[2]' LIKE (REPLACE(par2_event,'*','%'))) 
								AND ('$par[3]' LIKE (REPLACE(par3_event,'*','%'))) 
								AND ('$par[4]' LIKE (REPLACE(par4_event,'*','%'))) 
								AND ('$par[5]' LIKE (REPLACE(par5_event,'*','%'))) 
								AND user_id='$userId'  
								ORDER BY sort_order") or die(mysql_error());
		//AND (type='5' OR type='20' OR type='21' OR type='30' OR type='31' OR type='32')
		
		
		
		while($row_rsDeviceCmd = mysql_fetch_array($rsDeviceCmd)) {
		
			$indicator_icon = $row_rsDeviceCmd['indicator_icon'];
						
			$indicator_text = str_ireplace($placeholders, $params, $row_rsDeviceCmd['indicator_text']);
			$value = str_ireplace($placeholders, $params, $row_rsDeviceCmd['value']);
			
			if ($row_rsDeviceCmd['formula'] != '') {
				$formula = str_ireplace($placeholders, $params, $row_rsDeviceCmd['formula']);
				$formula = round(evalmath($formula),$row_rsDeviceCmd['round']);
				$indicator_text = str_ireplace('[FORMULA]', $formula, $indicator_text);
			}
			else {
				$indicator_text = str_ireplace('[FORMULA]', '', $indicator_text);
			}
			
			
			
			
			
			if ($row_rsDeviceCmd['type'] == 5) {
			
			$object_id = $row_rsDeviceCmd['object_id'];
			$indicator_placeholder_id = $row_rsDeviceCmd['indicator_placeholder_id'];
			
				if($row_rsDeviceCmd['indicator_placeholder_id'] > 0) {
						mysql_query("UPDATE nodo_tbl_objects_cmd SET indicator_icon = '$indicator_icon', indicator_text = '$indicator_text' WHERE id = '$indicator_placeholder_id' AND type = '6' AND user_id='$userId'");
					
				}
				else {
						mysql_query("UPDATE nodo_tbl_objects SET indicator_icon = '$indicator_icon', indicator_text = '$indicator_text' WHERE id = '$object_id' AND user_id='$userId'");
				}
			
			}
			
			if ($row_rsDeviceCmd['type'] == 20 || $row_rsDeviceCmd['type'] == 21 || $row_rsDeviceCmd['type'] == 30 || $row_rsDeviceCmd['type'] == 31 || $row_rsDeviceCmd['type'] == 32) {
				$object_id = $row_rsDeviceCmd['id'];
				mysql_query("INSERT INTO nodo_tbl_objects_data (user_id,object_id,data) VALUES ('$userId', '$object_id', '$value')");
			}
			
			
			//Update STATE
			$state = str_ireplace($placeholders, $params, $row_rsDeviceCmd['state_template']);
			$object_id  = $row_rsDeviceCmd['id'];
			    
				

				if ($row_rsDeviceCmd['type'] == 2 || $row_rsDeviceCmd['type'] == 4 ) { //slider en spinbox moeten numeriek zijn
					if ( is_numeric($state)) {
						mysql_query("UPDATE nodo_tbl_objects_cmd SET state = '$state' WHERE id = '$object_id' AND user_id='$userId'");
					}
				}
				else {
						mysql_query("UPDATE nodo_tbl_objects_cmd SET state = '$state' WHERE id = '$object_id' AND user_id='$userId'");
				}
		
		}
								
		
						
		/* mysql_query("UPDATE nodo_tbl_objects_cmd SET 
								rec_par1 = CASE
									WHEN par1 = '@' AND par2 REGEXP '(^|,)($par2)(,|$)'  THEN '$par1'
									ELSE rec_par1
								END,
								rec_par2 = CASE
									WHEN par1 REGEXP '(^|,)($par1)(,|$)' AND par2 = '@' THEN '$par2'
									ELSE rec_par2
								END,
														
								last_update = CASE
									WHEN par1 REGEXP '(^|,)($par1)(,|$)' AND par2 REGEXP '(^|,)($par2)(,|$)'  THEN now()
									ELSE last_update
								END
								
								
								
								WHERE user_id='$userId'") or die(mysql_error());  */
	}
}


 
?>