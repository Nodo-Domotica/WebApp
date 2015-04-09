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
require_once('../connections/db_connection.php'); 
require_once('../include/auth_temp.php');
require_once('../include/user_settings.php');



$http_status; //Variable voor de HTTP status code
$build;


//Functie om het ip-adres van de client te achterhalen
function get_ip_address() {
    foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                    return $ip;
                }
            }
        }
    }
}

//HTTPRequest function output http headers
function HTTPRequest($Url){

	global $http_status;
    
    if (!function_exists('curl_init')){
        die('Sorry cURL is not installed!');
    }
 
    global $nodo_port;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $Url);
    curl_setopt($ch, CURLOPT_USERAGENT, "Nodo WebApp");
    curl_setopt($ch, CURLOPT_HEADER, 1);
	curl_setopt($ch, CURLOPT_PORT, $nodo_port);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT,5);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $output = curl_exec($ch);
	$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	
	return $output;
	
}

//Functie welke de HTTP headers in een array plaats. Een bepaalde header is op te vragen via bijvoorbeeld $headers=http_parse_headers(HTTPRequest("http://$nodo_ip/?event=status%20NodoIp")); $headers['Server'];
if (!function_exists('http_parse_headers')) {
	function http_parse_headers($header) {
		$retVal = array();
		$fields = explode("\r\n", preg_replace('/\x0D\x0A[\x09\x20]+/', ' ', $header));
		foreach ($fields as $field) {
			if (preg_match('/([^:]+): (.+)/m', $field, $match)) {
				$match[1] = preg_replace('/(?<=^|[\x09\x20\x2D])./e', 'strtoupper("\0")', strtolower(trim($match[1])));
				if (isset($retVal[$match[1]])) {
					$retVal[$match[1]] = array($retVal[$match[1]], $match[2]);
				} else {
					$retVal[$match[1]] = trim($match[2]);
				}
			}
		}
		return $retVal;
	}
}

function trim_br($string){
//Deletes empty spaces and br tags on start and end of a string

	 $string = preg_replace('/^\s*(?:<br\s*\/?>\s*)*/i', '', $string);
	 $string = preg_replace('/\s*(?:<br\s*\/?>\s*)*$/i', '', $string);
	 return	$string;

}



	
function get_phrase_after_string($haystack,$needle)
//  voorbeelden:
//	$Build=get_phrase_after_string($script,'Build ');
//	$OutputHTTP=get_phrase_after_string($script,'Output HTTP,');
//	$HTTPHost=get_phrase_after_string($script,'HTTPHost ');

        {
                //length of needle
                $len = strlen($needle);
                
                //matches $needle until hits a \n or \r
                if(preg_match("#$needle([^\r\n]+)#i", $haystack, $match))
                {
                        //length of matched text
                        $rsp = strlen($match[0]);
                        
                        //determine what to remove
                        $back = $rsp - $len;
                        
                        return trim(substr($match[0],- $back));
                }
        }



if (isset($_POST['nodo_id'])) {  
 
 
 $nodo_ip = mysql_real_escape_string(htmlspecialchars($_POST['nodo_ip'])); 
 $nodo_port = mysql_real_escape_string(htmlspecialchars($_POST['nodo_port']));  
 $send_method = mysql_real_escape_string(htmlspecialchars($_POST['send_method']));
 $nodo_password = mysql_real_escape_string(htmlspecialchars($_POST['nodo_password']));
 

	//Connectie controleren.. optie om de Nodo automatisch te configureren
	if (isset($_POST['auto_config'])){
		 
		 global $build;
		 
		 //Connectie controleren van een standaard Nodo
		 $httpresponse=HTTPRequest("http://$nodo_ip/?event=status%20NodoIp");
		 $headers=http_parse_headers($httpresponse);
		 
		 $build=trim(substr(strrchr($headers['Server'], "="), 1));
		 $build=(int)$build;
			 
	}

	else {
		 //Connectie controleren
		 global $build;
		 
		 //Connectie controleren van een standaard Nodo
		 $httpresponse=HTTPRequest("http://$nodo_ip/?event=status%20NodoIp");
		 $headers=http_parse_headers($httpresponse);
		 
		 $build=trim(substr(strrchr($headers['Server'], "="), 1));
		 $build=(int)$build;
		
		 $key = md5($cookie.":".$nodo_password); //key opnieuw genereren omdat we het wachtwoord nog niet in de DB hebben opgeslagen
		 
		 
			  
			 $HTTPHost=get_phrase_after_string(trim_br(HTTPRequest("http://$nodo_ip/?event=status%20HTTPHost&key=$key")),'HTTPHost ');
			 $OutputHTTP=get_phrase_after_string(trim_br(HTTPRequest("http://$nodo_ip/?event=status%20Output%20HTTP&key=$key")),'Output HTTP,');
			 $headers=http_parse_headers(HTTPRequest("http://$nodo_ip/?event=status%20NodoIp&key=$key"));
		 
		 
		
		 
	}   
     
	//Controle of een verbinding met een Nodo hebben
	if ($http_status == '200' && strpos($headers['Server'], 'Nodo/') !== false) {
		
		//Controle of de configuratie van de Nodo correct is
		if ($HTTPHost == "$NODO_URL" && $OutputHTTP== "On" ) { $response = "1"; } else { $response = "2"; }
		
		
		if (isset($_POST['auto_config'])){
		
			global $build;
			
		
			//Configureer de Nodo
			HTTPRequest("http://$nodo_ip/?event=eventlistwrite;WildCard%20RF,All;EventSend%20HTTP");
			HTTPRequest("http://$nodo_ip/?event=eventlistwrite;WildCard%20IR,All;EventSend%20HTTP");
			HTTPRequest("http://$nodo_ip/?event=eventlistwrite;WildCard%20System,Variable;EventSend%20HTTP");
			HTTPRequest("http://$nodo_ip/?event=eventlistwrite;WildCard%20Wired,All;EventSend%20HTTP");
			HTTPRequest("http://$nodo_ip/?event=eventlistwrite;EventListWrite;Wildcard%20HTTP,UserEvent;EventSend%20HTTP");
			HTTPRequest("http://$nodo_ip/?event=HTTPHost%20$NODO_URL");
			
			
			
			HTTPRequest("http://$nodo_ip/?event=output%20http,on");
			$HTTPHost=get_phrase_after_string(trim_br(HTTPRequest("http://$nodo_ip/?event=status%20HTTPHost&key=$key")),'HTTPHost ');
			$OutputHTTP=get_phrase_after_string(trim_br(HTTPRequest("http://$nodo_ip/?event=status%20Output%20HTTP&key=$key")),'Output HTTP,');
				
			//Controle of de configuratie van de Nodo correct is
			if ($HTTPHost == "$NODO_URL" && $OutputHTTP== "On" ) { 
				$response = "6";
				HTTPRequest("http://$nodo_ip/?event=id%20$nodo_id;password%20$nodo_password;SettingsSave;reboot");
			}
			else 
			{					
				$response = "7"; 
			}
		}
			
						
		
	}

else {
	 
	$response = "3";
}
	
if ($http_status == '403' && strpos($headers['Server'], 'Nodo/') !== false) {
		
		if (isset($_POST['auto_config'])){
		
			$response = "5";
		}
		else{
			$response = "4";
		}
		
}
  
	 //Gegevens opslaan in de database
	 mysql_select_db($database, $db);
	 mysql_query("UPDATE nodo_tbl_users SET nodo_ip='$nodo_ip', nodo_port='$nodo_port', send_method='$send_method', nodo_password='$nodo_password' WHERE id='$userId'") or die(mysql_error());   
	 
	 
		$rowsarray[] = array(
		
		"response"		=> $response);
		 
		 
		$json = json_encode($rowsarray);

		echo '{"connection":'. $json .'}'; 

 
}
else {

	mysql_select_db($database, $db);
	$result = mysql_query("SELECT * FROM nodo_tbl_users WHERE id='$userId'") or die(mysql_error());  
	$row = mysql_fetch_array($result);


	//Indien er al een IP-adres in de database bekend is gebruiken we deze.
	if ($row['nodo_ip'] != "") { 
		$nodo_ip = $row['nodo_ip'];
		$nodo_ip_message = "";
	}
	else 
	//Indien er geen IP-adres of hostname is ingevoerd dan vullen we het IP-adres van de client in
	{
		$nodo_ip = get_ip_address();
		$nodo_ip_message = "Your IP-address is automatically filled. <br \>Make sure that your Nodo can be reached on this IP-address.<br \><br \>";
	}

	$rowsarray[] = array(
	"nodoid" 		=> $row['nodo_id'],
	"nodoip" 		=> $nodo_ip,
	"nodoipmsg" 	=> $nodo_ip_message,
	"nodoport" 		=> $row['nodo_port'],
	"nodopassword"	=> $row['nodo_password']);
	 
	 
	$json = json_encode($rowsarray);

	echo '{"connection":'. $json .'}'; 

}

?>
