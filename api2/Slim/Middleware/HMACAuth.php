<?php
/**
 * HMAC Authentication
 *
 * Use this middleware with your Slim Framework application
 * in combination with your 
 *
 * @author 9bit Studios <http://www.9bitStudios.com>
 * @version 1.0
 *
 * MIT LICENSE
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class HMACAuth extends \Slim\Middleware
{   

    /**
     * @var array
     * 
     * Route string set to tell middleware to ignore authentication
     */    
    protected $allowedRoutes;
    
    /**
     * Constructor
     *
     * @param string  $realm The HTTP Authentication realm
     */
    public function __construct()
    {
	$this->allowedRoutes = array(
	    '/',
		'/devices',
		'POST/user',
	    'POST/login',
	    'POST/logout'
	);  
    }
	
    /**
     * Deny Access
     *
    */	
    public function deny_access() {
        $this->app->response()->status(401);   
    }
    
    /**
     * Check Allowed Routes
     *
    */	
    public function check_allowed_routes($routeCheck) {
       
	foreach ($this->allowedRoutes as $routeString) {
	   		
		if($routeCheck == $routeString)
		
		return true;
	}
	
	//if we've gotten this far, route not found
	return false;
    }    
 
 
    /**
     * Check Timestamp
     *  
     * Uses the header value timestamp to check against the current timestamp
     * If the request was made within a reasonable amount of time (10 sec), 
     */
    public function check_timestamp() {
        $req = $this->app->request();   
	$clientMicrotime = $req->headers('X-MICROTIME');
	$serverMicrotime = microtime(true);
	$timeDiff = $serverMicrotime - $clientMicrotime;
	
	if($timeDiff <= 10) 
	    return true;
	else
	    return false;
    }    
    
    
    /**
     * Authenticate	 
     *
     * This is the authenticate method where we check the hash from the client against 
     * a hash that we will recreate here on the sevrer. If the 2 match, it's a pass.
     */
    public function authenticate($token) {
	 
	 
	
	$cookies = $this->app->request()->cookies();
	
	if(isset($cookies['PUBLIC-KEY']))
	    $message = $cookies['PUBLIC-KEY'];
	else
	    return false;
	
	$timestamp = $this->app->request()->headers('X-MICROTIME');	
	if($token === $this->create_hash($message, $timestamp)) {
	   
		return true;
	}	

	else {
		
	    return false;
		}
    }	

    
    /**
     * Create Hash
     *
     * This method is where we'll recreate the hash coming from the client using the secret key to authenticate the 
     * request
     */
    public function create_hash($message, $timestamp) {
	$apiSecretKey = 'ABC123';
	return hash_hmac('sha1', $message.$timestamp, $apiSecretKey);
    }	    
    
    /**
     * Call
     *
     * This method will check the HTTP request headers for previous authentication. If
     * the request has already authenticated, the next middleware is called. Otherwise,
     * a 401 Authentication Required response is returned to the client.
     */
    public function call()
    {
        
		//TEST to pass VALUE!!!!!!
	    $this->app->userid = '10';
		
		
		$req = $this->app->request();
		
	
	if($this->check_allowed_routes($req->headers('REQUEST_METHOD').$req->getResourceUri()))	
	    $this->next->call();
	else {

	    if(!$this->check_timestamp()) {
		$this->deny_access();
	    }
	    else {
		
		// get our hash
		$hash = $req->headers('X-HASH');
		if ($this->authenticate($hash)) {	
		    $this->next->call();
		} else {
		    $this->deny_access();
		}

	    }
	}
    }
}