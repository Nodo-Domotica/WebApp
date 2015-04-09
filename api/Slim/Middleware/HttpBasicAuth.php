<?php

 
class HttpBasicAuth extends \Slim\Middleware
{
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
    }
 
    /**
     * Deny Access
     *
     */   
    public function deny_access() {
        $res = $this->app->response();
        $res->status(401);
        $res->header('WWW-Authenticate', sprintf('Basic realm="%s"', $this->realm));        
    }
 
    /**
     * Authenticate 
     *
     * @param   string  $username   The HTTP Authentication username
     * @param   string  $password   The HTTP Authentication password     
     *
     */
    public function authenticate($username, $password) {
        
		$salt = "!#**&Gt5$0*";
		
		if(!ctype_alnum($username))
            return false;
         
        if(isset($username) && isset($password)) {
            echo($salt);
			echo ($password);
			$password = md5($salt.$password);
			echo ($password);
			echo ($username);
			try {		
				$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE user_login_name=:username AND user_password=:password ");
				$stmt->bindValue(':username', 'mdegraaf@powerkite.nl');
				$stmt->bindValue(':password', $password);
				
				$stmt->execute();

				$results = $stmt->fetchObject();
					if ($results != null) {
					
						$this->app->userId = $results->id;
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
			
			
			 
            // Check database here with $username and $password
            
        }
        else
            return false;
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
        $req = $this->app->request();
        $res = $this->app->response();
        $authUser = $req->headers('PHP_AUTH_USER');
        $authPass = $req->headers('PHP_AUTH_PW');
         
        if ($this->authenticate($authUser, $authPass)) {
            $this->next->call();
        } else {
            $this->deny_access();
        }
    }
}