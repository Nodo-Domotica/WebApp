<?php
//HTTPRequest function output http headers
function HTTPRequest($Url,$Headers){

	global $http_status;
    
    if (!function_exists('curl_init')){
        die('Sorry cURL is not installed!');
    }
 
    global $nodo_port;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $Url);
    curl_setopt($ch, CURLOPT_USERAGENT, "Nodo WebApp");
    curl_setopt($ch, CURLOPT_HEADER, $Headers);
	//curl_setopt($ch, CURLOPT_PORT, $nodo_port);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT,5);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $output = curl_exec($ch);
	$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	
	return $output;
	
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



function trim_br($string){
//Deletes empty spaces and br tags on start and end of a string

	 $string = preg_replace('/^\s*(?:<br\s*\/?>\s*)*/i', '', $string);
	 $string = preg_replace('/\s*(?:<br\s*\/?>\s*)*$/i', '', $string);
	 return	$string;

}
