<?php

 
class HttpBasicAuth extends \Slim\Middleware
{
     /**
     * @var array
     * 
     * Route string set to tell middleware to ignore authentication
     */    
    protected $allowedRoutes;
    
   
	
	
	/**
     * @var string
     */
    protected $realm;
 
    /**
     * Constructor
     *
     * @param   string  $realm      The HTTP Authentication realm
     */
    public function __construct($realm = 'Protected Area')
    {
        $this->realm = $realm;
		
		$this->allowedRoutes = array(
	    '/',
		'POST/user',
	    '/login',
	    '/logout'
	);  
    }
 
    /**
     * Deny Access
     *
     */   
    public function deny_access() {
        $res = $this->app->response();
        $res->status(403);
        //$res->header('WWW-Authenticate', sprintf('Basic realm="%s"', $this->realm));        
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
     * Authenticate 
     *
     * @param   string  $username   The HTTP Authentication username
     * @param   string  $password   The HTTP Authentication password     
     *
     */
    public function authenticate($username, $password) {
     
		
         
        if(isset($username) && isset($password)) {
           
						
			try {		
				$stmt = db()->prepare("SELECT * FROM nodo_tbl_tokens WHERE user_id=:username AND token=:password ");
				$stmt->bindValue(':username', $username);
				$stmt->bindValue(':password', $password);
				
				$stmt->execute();

				$results = $stmt->fetchObject();
					if ($results != null) {
						
						try {

							$stmt2 = db()->prepare("UPDATE nodo_tbl_tokens SET timestamp=now() WHERE user_id=:username AND token=:password");  
							$stmt2->bindValue(':username', $username);
				            $stmt2->bindValue(':password', $password);
							$stmt2->execute();
							
							} 
						catch(PDOException $e) {
								echo '{"error":{"text":'. $e->getMessage() .'}}';
							}
					
						$this->app->userId = $results->user_id;
				
						return true;
					}
					else{
					
						 return false;
					}
				}
				catch(PDOException $e) {
					echo '{"error":{"text":'. $e->getMessage() .'}}';
					 return false;
				}
        }
        else
            return false;
    }
 
    /**
     * Call
     *
     * This method will check the HTTP request headers for previous authentication. If
     * the request has already authenticated, the next middleware is called. Otherwise,
     * a 403 forbidden is returned to the client.
     */
    public function call()
    {
        $req = $this->app->request();
        $res = $this->app->response();
        $authUser = $req->headers('PHP_AUTH_USER');
        $authPass = $req->headers('PHP_AUTH_PW');
		
		
        if ($this->authenticate($authUser, $authPass)) {
            $this->next->call();
        }
		else if($this->check_allowed_routes($req->headers('REQUEST_METHOD').$req->getResourceUri())) {
            $this->next->call();
        }
		else {
            $this->deny_access();
        }
    }
}