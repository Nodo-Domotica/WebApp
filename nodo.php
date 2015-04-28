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
$key_match=0;
$compare_result=0;
$i=0;

/**
 * Evaluates a math equation and returns the result, sanitizing
 * input for security purposes.  Note, this function does not
 * support math functions (sin, cos, etc)
 *
 * @param string the math equation to evaluate (ex:  100 * 24)
 * @return number
 */
function evalmath($equation)
{
    $result = 0;
    
    // sanitize input
    $equation = preg_replace("/[^0-9+\-.*\/()%]/", "", $equation);
    
    // convert percentages to decimal
    $equation = preg_replace("/([+-])([0-9]{1})(%)/", "*(1\$1.0\$2)", $equation);
    $equation = preg_replace("/([+-])([0-9]+)(%)/", "*(1\$1.\$2)", $equation);
    $equation = preg_replace("/([0-9]+)(%)/", ".\$1", $equation);
    
    if ($equation != "") {
        $result = @eval("return " . $equation . ";");
    }
    
    if ($result === false) {
        return "Error in formula!"; //Unable to calculate equation
    }
    
    return $result;
}

function num_cond ($var1, $op, $var2) {

    switch ($op) {
        case "=":  return floatval($var1) == floatval($var2);
        case "!=": return floatval($var1) != floatval($var2);
        case ">=": return floatval($var1) >= floatval($var2);
        case "<=": return floatval($var1) <= floatval($var2);
        case ">":  return floatval($var1) >  floatval($var2);
        case "<":  return floatval($var1) <  floatval($var2);
    default:       return false;
    }   
}


//Zomer winter tijd check
if (date('I') == 0) {
    $DLS = 'No';
} else {
    $DLS = 'Yes';
}
$date = date("d-m-Y");
$time = date("H:i");
$dow  = date("w") + 1; // php zondag = 0 Nodo gaat uit van 1


require_once('settings.php');
require_once('api/pdo_db_connection.php');


//Stuur event via HTTP naar Nodo
function send_event($event)
{
    
    global $nodo_ip, $nodo_port, $key;
    
    $url = "http://$nodo_ip:$nodo_port/?event=$event&key=$key";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}


function closeOutput($stringToOutput)
{
    
    global $time;
    global $date;
    global $dow;
    global $DLS;
    
    
    set_time_limit(0);
    ignore_user_abort(true);
    header("Connection: close\r\n");
    header("Content-Encoding: none\r\n");
	header("Webserver-IP: ".$_SERVER['SERVER_ADDR']."\r\n");
    header("Nodo-Date: Day=" . $dow . "; Date=" . $date . "; Time=" . $time . "; DLS=" . $DLS);
    ob_start();
    echo $stringToOutput;
    $size = ob_get_length();
    header("Content-Length: $size", TRUE);
    ob_end_flush();
    ob_flush();
    flush();
}



/*
Login gegevens controleren
Checken of id=[nodoID] als url parameter is meegegeven.
*/
if (isset($_GET['id'])) {
    
    $id = $_GET['id'];
    
    //User id uit de database halen doormede van NodoId	
    $stmt = db()->prepare("SELECT id,nodo_id,nodo_ip,nodo_port,nodo_password,cookie,cookie_count FROM nodo_tbl_users WHERE nodo_id=:nodo_id");
    $stmt->bindValue(':nodo_id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $userId = $row['id'];
    
    $nodo_ip        = $row['nodo_ip'];
    $nodo_port      = $row['nodo_port'];
    $cookie_counter = $row['cookie_count'] + 1;
    $cookie_webapp  = $row['cookie'];
    $nodo_password  = $row['nodo_password'];
    
    $key_webapp = md5($cookie_webapp . ":" . $nodo_password);
    $key_nodo   = $_GET['key'];
    
    if ($key_webapp == $key_nodo) {
        $key_match = 1;
    }
   
    
    //Nieuwe cookie en header informatie in de database opslaan
    if (isset($_GET['cookie'])) {
        
        $cookie = $_GET['cookie'];
        $build  = $_SERVER['HTTP_USER_AGENT'];
        
        $stmt = db()->prepare("UPDATE nodo_tbl_users SET cookie=:cookie, cookie_update=NOW(), cookie_count=:cookie_count, nodo_build=:nodo_build,webapp_version='15' WHERE id=:userId");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':cookie', $cookie);
        $stmt->bindParam(':cookie_count', $cookie_counter);
        $stmt->bindParam(':nodo_build', $build);
        $stmt->bindParam(':cookie', $cookie);
        $stmt->execute();
        
        
        
        header('Cookie: $cookie');
    }
}

//$key_match = 1; //LET OP!!!! alleen voor debug doeleingen


//Als de key correct is dan event= behandelen
if ($userId > 0 && $key_match == 1) {
    
    //Als de Nodo een file opvraagt dan zal onderstaande routine de file weergeven zodat de Nodo deze kan parsen
    if (isset($_GET['file'])) {
        
        $outputContent = '';
        
        $file = $_GET['file'];
        
        $stmt = db()->prepare("SELECT script FROM nodo_tbl_scripts WHERE file=:file AND user_id=:userId ORDER BY id DESC");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':file', $file);
        $stmt->execute();
        $row           = $stmt->fetch(PDO::FETCH_ASSOC);
       
        //	echo $row['script'];
        //	echo "\n";
        $outputContent = $row['script'] . "\n";
    } else {
        $outputContent = '';
    }
    
    
    
    //Vanaf hier wordt de verbinding verbroken. Output na deze regel komt nooit bij de client aan.
    
    
closeOutput( $outputContent );
    
    
    
    
    //sleep(30);
    
    //Ontvangen event verwerken
    if (isset($_GET['event'])) {
        
        //Url parameters in variablen plaatsen
        $eventraw = $_GET['event'];
        $unit     = $_GET['unit'];
        
        //Spaties vervangen door , om makkelijk een array te kunnen maken
        $event = str_replace(" ", ",", $eventraw);
        
        //Commando en parameters uit event distileren	
        $cmd_array = explode(',', $event);
        $cmd       = trim(strtolower($cmd_array[0]));
        for ($x = 1; $x <= 5; $x++) {
            $par[$x] = trim(strtolower($cmd_array[$x]));
        }
        
        $placeholders = array(
            '[TIME]',
            '[DATE]',
            '[UNIT]',
            '[CMD]',
            '[PAR1]',
            '[PAR2]',
            '[PAR3]',
            '[PAR4]',
            '[PAR5]'
        );
        $params       = array(
            $time,
            $date,
            $unit,
            $cmd,
            $par[1],
            $par[2],
            $par[3],
            $par[4],
            $par[5]
        );
        
        //Event in nodo_tbl_event_log opslaan
        
        $stmt = db()->prepare("INSERT INTO nodo_tbl_event_log (user_id, nodo_unit_nr, event) VALUES (:userId,:unit,:eventraw)");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':unit', $unit);
        $stmt->bindParam(':eventraw', $eventraw);
        $stmt->execute();
        //$row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        
        
        //Controleren of we een notificatie moeten sturen
        
        $stmt = db()->prepare("SELECT * FROM nodo_tbl_notifications_new WHERE user_id=:userId 
		AND (unit=:unit OR unit='*') AND (:cmd LIKE (REPLACE(event,'*','%')))  
		AND (:par1 LIKE (REPLACE(par1,'*','%'))) 
		AND (:par2 LIKE (REPLACE(par2,'*','%'))) 
		AND (:par3 LIKE (REPLACE(par3,'*','%'))) 
		AND (:par4 LIKE (REPLACE(par4,'*','%'))) 
		AND (:par5 LIKE (REPLACE(par5,'*','%'))) ");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':unit', $unit);
        $stmt->bindParam(':cmd', $cmd);
		$stmt->bindParam(':par1', $par[1]);
		$stmt->bindParam(':par2', $par[2]);
		$stmt->bindParam(':par3', $par[3]);
		$stmt->bindParam(':par4', $par[4]);
		$stmt->bindParam(':par5', $par[5]);
        $stmt->execute();
        
        $rows = $stmt->fetchall(PDO::FETCH_ASSOC);
        
        if ($stmt->rowCount() > 0) {
            
            
            while ($row_RSnotify = array_shift($rows)) {
                
                
                $type    = $row_RSnotify['type'];
                $to      = $row_RSnotify['recipient'];
                $subject = str_ireplace($placeholders, $params, $row_RSnotify['subject']);
                $message = str_ireplace($placeholders, $params, $row_RSnotify['body']);
                $from    = "webapp@nodo-domotica.nl";
                $headers = "From:" . $from;
                
                
                if ($type == '1') {
                    
                    mail($to, $subject, $message, $headers);
                    
                }
                
                elseif ($type == '2') {
                    
                    $subject = urlencode($subject);
                    $message = urlencode($message);
                    $ch      = curl_init("http://api.pushingbox.com/pushingbox?devid=$to&subject=$subject&message=$message");
                    curl_exec($ch);
                    curl_close($ch);
                    
                } elseif ($type == '3') {
                    
                    $stmt = db()->prepare("SELECT * FROM nodo_tbl_users 
					JOIN nodo_tbl_trusted_nodo_id ON nodo_tbl_users.id = nodo_tbl_trusted_nodo_id.user_id 
					JOIN nodo_tbl_trusted_nodo_cmd ON  nodo_tbl_trusted_nodo_cmd.trusted_id = nodo_tbl_trusted_nodo_id.id 
					WHERE nodo_tbl_users.nodo_id = :to AND nodo_tbl_trusted_nodo_id.nodo_id = :id 
					AND nodo_tbl_trusted_nodo_cmd.r_cmd = :cmd 
					AND (nodo_tbl_trusted_nodo_cmd.r_par1 = :par1 OR nodo_tbl_trusted_nodo_cmd.r_par1 = '*') 
					AND (nodo_tbl_trusted_nodo_cmd.r_par2 = :par2 OR nodo_tbl_trusted_nodo_cmd.r_par2 = '*') 
					AND (nodo_tbl_trusted_nodo_cmd.r_par3 = :par3 OR nodo_tbl_trusted_nodo_cmd.r_par3 = '*') 
					AND (nodo_tbl_trusted_nodo_cmd.r_par4 = :par4 OR nodo_tbl_trusted_nodo_cmd.r_par4 = '*') 
					AND (nodo_tbl_trusted_nodo_cmd.r_par5 = :par5 OR nodo_tbl_trusted_nodo_cmd.r_par5 = '*')");
                    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
                    $stmt->bindParam(':to', $to);
                    $stmt->bindParam(':cmd', $cmd);
                    $stmt->bindParam(':par1', $par[1]);
                    $stmt->bindParam(':par2', $par[2]);
                    $stmt->bindParam(':par3', $par[3]);
                    $stmt->bindParam(':par4', $par[4]);
                    $stmt->bindParam(':par5', $par[5]);
                    $stmt->execute();
                    $row_RSsetup = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    
                    $nodo_ip       = $row_RSsetup['nodo_ip'];
                    $nodo_port     = $row_RSsetup['nodo_port'];
                    $nodo_password = $row_RSsetup['nodo_password'];
                    $cookie        = $row_RSsetup['cookie'];
                    
                    $cmd_to_nodo = str_ireplace($placeholders, $params, $row_RSsetup['s_cmd']);
                    
                    $key = md5($cookie . ":" . $nodo_password);
                    
                    $event = str_replace(" ", "%20", $cmd_to_nodo);
                    
                    send_event($event);
                    
                }
                
                
            }
        }
        
        
        
        
        $stmt = db()->prepare("SELECT * FROM nodo_tbl_objects_cmd WHERE (:cmd LIKE (REPLACE(cmd_event,'*','%'))) 
								AND (unit_event=:unit OR unit_event='*')
								AND (:par1 LIKE (REPLACE(par1_event,'*','%'))) 
								AND (:par2 LIKE (REPLACE(par2_event,'*','%'))) 
								AND (:par3 LIKE (REPLACE(par3_event,'*','%'))) 
								AND (:par4 LIKE (REPLACE(par4_event,'*','%'))) 
								AND (:par5 LIKE (REPLACE(par5_event,'*','%'))) 
								AND user_id=:userId 
								ORDER BY sort_order");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':cmd', $cmd);
        $stmt->bindParam(':unit', $unit);
        $stmt->bindParam(':par1', $par[1]);
        $stmt->bindParam(':par2', $par[2]);
        $stmt->bindParam(':par3', $par[3]);
        $stmt->bindParam(':par4', $par[4]);
        $stmt->bindParam(':par5', $par[5]);
        $stmt->execute();
        
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        
        if ($stmt->rowCount() > 0) {
            while ($row_rsDeviceCmd = array_shift($rows)) {
				
				
                                
                $indicator_icon = $row_rsDeviceCmd['indicator_icon'];
                
                
                
                
                $indicator_text = str_ireplace($placeholders, $params, $row_rsDeviceCmd['indicator_text']);
                $value          = str_ireplace($placeholders, $params, $row_rsDeviceCmd['value']);
                
                if ($row_rsDeviceCmd['formula'] != '') {
                    $formula        = str_ireplace($placeholders, $params, $row_rsDeviceCmd['formula']);
                    $formula        = round(evalmath($formula), $row_rsDeviceCmd['round']);
                    $indicator_text = str_ireplace('[FORMULA]', $formula, $indicator_text);
                } else {
                    $indicator_text = str_ireplace('[FORMULA]', '', $indicator_text);
                }
                
                
                
                
                
                if ($row_rsDeviceCmd['type'] == 5) {
					
					
					
					if ($row_rsDeviceCmd['compare'] !='') {
						
											
						$split_comparison_raw = explode(";",$row_rsDeviceCmd['compare']);
						
						
						$x=0;
						$y=0;
						foreach ($split_comparison_raw as $split_comparison_raw_a=>$split_comparison_raw_b){ 
							$i=0;
							
							
							
							if ( trim($split_comparison_raw_b," ") ) {
								$x++;
								
								$split_comparison = str_ireplace($placeholders, $params, $split_comparison_raw_b);
								$split_comparison = explode(" ",$split_comparison);
								foreach ($split_comparison as $split_comparison_a=>$split_comparison_b){ 
									
									if ( trim($split_comparison_b," "  ) || $split_comparison_b === '0') {
										
										$i++;
										$var[$i]=$split_comparison_b;
										}
							
								}
										
								$compare_result = num_cond ($var[1], $var[2], $var[3]);
								if($compare_result) {$y++;}
								
															
								 
								
							}
							
						}
						
						
					
					}
					
										
					if ($x==$y || $row_rsDeviceCmd['compare'] =='' ) {
						
					                    
                    $object_id                = $row_rsDeviceCmd['object_id'];
                    $indicator_placeholder_id = $row_rsDeviceCmd['indicator_placeholder_id'];
                    
                    if ($row_rsDeviceCmd['indicator_placeholder_id'] > 0) {
                        
                        $stmt = db()->prepare("UPDATE nodo_tbl_objects_cmd SET indicator_icon = :indicator_icon, indicator_text = :indicator_text WHERE id = :indicator_placeholder_id AND type = '6' AND user_id=:userId");
                        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
                        $stmt->bindParam(':indicator_icon', $indicator_icon);
                        $stmt->bindParam(':indicator_text', $indicator_text);
                        $stmt->bindParam(':indicator_placeholder_id', $indicator_placeholder_id);
                        $stmt->execute();
                        
                        
                        
                    } else {
                        
                        $stmt = db()->prepare("UPDATE nodo_tbl_objects SET indicator_icon = :indicator_icon, indicator_text = :indicator_text WHERE id = :object_id AND user_id=:userId");
                        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
                        $stmt->bindParam(':indicator_icon', $indicator_icon);
                        $stmt->bindParam(':indicator_text', $indicator_text);
                        $stmt->bindParam(':object_id', $object_id);
                        $stmt->execute();
						
						//echo ("set icon to: " . $indicator_icon . "<br>");
						
                    }
                    
                }
			}
                
                if ($row_rsDeviceCmd['type'] == 20 || $row_rsDeviceCmd['type'] == 21 || $row_rsDeviceCmd['type'] == 30 || $row_rsDeviceCmd['type'] == 31 || $row_rsDeviceCmd['type'] == 32) {
                    $object_id = $row_rsDeviceCmd['id'];
                    
                    $stmt = db()->prepare("INSERT INTO nodo_tbl_objects_data (user_id,object_id,data) VALUES (:userId, :object_id, :value)");
                    $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
                    $stmt->bindParam(':object_id', $object_id);
                    $stmt->bindParam(':value', $value);
                    $stmt->execute();
                    
                }
                
                
                //Update STATE
                $state     = str_ireplace($placeholders, $params, $row_rsDeviceCmd['state_template']);
                $object_id = $row_rsDeviceCmd['id'];
                
                
                
                if ($row_rsDeviceCmd['type'] == 2 || $row_rsDeviceCmd['type'] == 4) { //slider en spinbox moeten numeriek zijn
                    if (is_numeric($state)) {
                        
                        $stmt = db()->prepare("UPDATE nodo_tbl_objects_cmd SET state=:state WHERE id=:object_id AND user_id=:userId");
                        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
                        $stmt->bindParam(':object_id', $object_id);
                        $stmt->bindParam(':state', $state);
                        $stmt->execute();
                        
                    }
                } else {
                    
                    $stmt = db()->prepare("UPDATE nodo_tbl_objects_cmd SET state=:state WHERE id=:object_id AND user_id=:userId");
                    $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
                    $stmt->bindParam(':object_id', $object_id);
                    $stmt->bindParam(':state', $state);
                    $stmt->execute();
                }
                
            }
        }
    }
}




?>