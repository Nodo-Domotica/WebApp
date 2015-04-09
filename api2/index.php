<?php

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  // return only the headers and not the content
  // only allow CORS if we're doing a GET - i.e. no saving for now.
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: origin, x-requested-with, content-type, authorization');
  }
  exit;
}


date_default_timezone_set('Etc/GMT');

require_once('../settings.php'); 
require_once('pdo_db_connection.php');
require 'Slim/Slim.php';
require 'Slim/Middleware.php';
require 'Slim/Middleware/HttpBasicAuth.php';

require_once('functions.php');



\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();
$app->add(new \HttpBasicAuth());

use Slim\Slim;



//Welcome
$app->get('/', function () use ($app) {
	echo ("<h1>Welcome to the Nodo Webapp API</h1>");
	echo ("<b>API Commands:</b><br>");
	echo ("POST:	api/login - login<br>");
	echo ("GET:		api/devices - list devices<br>");
	echo ("GET:		api/devices/[id] - list device<br>");
	echo ("POST:	api/devices - Add device<br>");
	echo ("PUT: 	api/devices/[id] - Edit device<br>");
	echo ("DELETE: 	api/devices/[id] - Delete device<br>");
	echo ("PUT:		api/sortdevice/[id]/[up/down] - Sort device<br>");
	echo ("GET:  	api/devicecmds/[id] - List device commands<br>");
	echo ("GET:  	api/devicecmd/[id] - List device command<br>");
	echo ("POST:  	api/devicecmd - Add device command<br>");
	echo ("PUT:  	api/devicecmd/[id] - Edit device command<br>");
	echo ("PUT:  	api/devicecmdstate/[id] - Edit command state<br>");
	echo ("GET:  	api/devicestate - List device state<br>");
	echo ("GET:  	api/alarms - list alarm<br>");
	echo ("GET:  	api/alarms/[alarmnr] - List specific alarm<br>");
	echo ("GET:  	api/nodostatus - Read nodostatus<br>");
	echo ("GET:		api/notifications - List notifications<br>");
	echo ("POST:	api/notifications - Add notification<br>");
	echo ("PUT:		api/notifications/[id] - Edit notification<br>");
	echo ("DELETE: 	api/notifications/[id] - Delete notification<br>");
	echo ("GET:		api/events/[nr of events] - List events<br>");
	echo ("GET:		api/groups - List groups<br>");
	echo ("POST:	api/groups - Add group<br>");
	echo ("PUT:		api/groups/[id] - Edit group<br>");
	echo ("DELETE: 	api/groups/[id] - Delete group<br>");
	echo ("GET:		api/messages/[nr of messages] - List messages<br>");
	echo ("GET:		api/nodostrustingyou - List nodo id's who trust you<br>");
	echo ("GET:		api/nodosyoutrust - List nodo id's you trust<br>");
	echo ("GET:		api/nodosyoutrust/[id] - List nodo id you trust<br>");
	echo ("POST:	api/nodosyoutrust - Add nodo id's you trust<br>");
	echo ("PUT:		api/nodosyoutrust - Edit nodo id's you trust<br>");
	echo ("DELETE:	api/nodosyoutrust/[id] - Delete nodo id's you trust<br>");
	echo ("GET:		api/cmdsyoutrust/[id] - List cmd's you trust<br>");
	echo ("GET:		api/cmdyoutrust/[id] - List cmd you trust<br>");
	echo ("PUT:		api/cmdyoutrust/[id] - Edit cmd you trust<br>");
	echo ("DELETE:	api/cmdyoutrust/[id] - Delete cmd you trust<br>"); 
	echo ("POST:	api/cmdsend/[cmd] - Send command to Nodo<br>");
	echo ("GET:	    api/graphdata/[id]/[interval]/[type] - Get graph data<br>");
	echo ("GET:	    api/graphs - List graphs<br>");
	echo ("GET:		api/helptext/[key] - Show helptext<br>");
	
	
	

});
// LOGIN route
$app->post('/login', function () use ($app) {
   
   global $salt;
    $request = (array) json_decode($app->request()->getBody());
    $username = $request['username'];
    $password = $request['password'];
	             
        if(isset($username) && isset($password)) {
           
			$password = md5($salt.$password);
			
			try {		
				$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE user_login_name=:username AND user_password=:password ");
				$stmt->bindValue(':username', $username);
				$stmt->bindValue(':password', $password);
				
				$stmt->execute();

				$results = $stmt->fetchObject();
					if ($results != null) {
					
						$random_token = md5($_SERVER['HTTP_USER_AGENT'] . time());
						
						try {       
							$stmt2 = db()->prepare("INSERT INTO nodo_tbl_tokens(user_id,token,ip)
												   VALUES
												   (:userId,:token,:ip)");
												   
							$stmt2->bindValue(':userId', $results->id, PDO::PARAM_INT);
							$stmt2->bindParam(":token", $random_token);
							$stmt2->bindParam(":ip",$_SERVER['REMOTE_ADDR']);
									
							$stmt2->execute();
							
						
						} 
						catch(PDOException $e) {
							echo '{"error":{"text":'. $e->getMessage() .'}}';
						}
										
						
						
						
						$userArray = array(
							'id' => $results->id,
							'username' => $username,
							'token' => $random_token
							//'savecred' => $savecred
						); 	
						echo json_encode($userArray);
					}
					else{
					
						$app->response()->status(401);
					}
				}
				catch(PDOException $e) {
					echo '{"error":{"text":'. $e->getMessage() .'}}';
					 return false;
				}
				}
    
});




//List all groups
$app->get('/groups', function () use($app) {

 try {
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_groups WHERE user_id=:userid ORDER BY name" );
	$stmt->bindValue(':userid', $app->userId, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_OBJ);
	$json = json_encode($results);
	echo '{"groups":'. $json .'}';
} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }		

});

//List group
$app->get('/groups/:id', function ($id) use($app) {

	try {			
		$stmt = db()->prepare("SELECT * FROM nodo_tbl_groups WHERE user_id=:userId AND id=:group_id");
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->bindValue(':group_id', $id, PDO::PARAM_INT);
		$stmt->execute();

		$results = $stmt->fetchObject();
		if ($results != null) {
			
			echo json_encode($results);
		}
		else{
			echo '{"error":[{"text":"group not found."}]}';
		}
	} 
	catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}	
});

//Delete group
$app->delete('/groups/:id', function ($id) use($app) {

 try {

	$stmt = db()->prepare("DELETE FROM nodo_tbl_groups WHERE user_id=:userId AND id=:group_id");
	$stmt->bindParam(":group_id", $id);
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
   	$stmt->execute();
	
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	
	
	try {

	$stmt = db()->prepare("UPDATE nodo_tbl_devices SET group_id='0' WHERE group_id=:group_id AND user_id=:userId");  //indien deze group aan een device zat gekoppeld zetten we hem om 0
	$stmt->bindParam(":group_id", $id);
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
   	$stmt->execute();
	
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

});

//Add group
$app->post('/groups', function () use($app) {
    
	$request = Slim::getInstance()->request();
    $group = json_decode($request->getBody());
	$name = htmlspecialchars($group->name);
	
	if ($group->devices_default == true ) { 
	
		$default = 1; 
		
		try {
       
        $stmt = db()->prepare("UPDATE nodo_tbl_groups SET devices_default='0' WHERE user_id=:userId");
							   
        $stmt->bindParam(":userId", $app->userId);
       
        $stmt->execute();
       
    
		} 
		catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	}
	
	else { 
	
		$default = 0; 
	}
	
	
			
    try {
       
        $stmt = db()->prepare("INSERT INTO nodo_tbl_groups(user_id,name,devices_default)
							   VALUES
							   (:userId,:name,:group_default)");
							   
       	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
        $stmt->bindParam(":name", $name);
		$stmt->bindParam(":group_default",$default);
		        
        $stmt->execute();
        echo json_encode($group);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Edit Group
$app->put('/groups/:id', function ($id) use($app) {
    
	$request = Slim::getInstance()->request();
    $group = json_decode($request->getBody());
	$name = htmlspecialchars($group->name);
	
	
	if ($group->devices_default == true ) { 
	
		$default = 1; 
		
		try {
       
        $stmt = db()->prepare("UPDATE nodo_tbl_groups SET devices_default='0' WHERE user_id=:userId");
							   
       	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
       
        $stmt->execute();
       
    
		} 
		catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	}
	
	else { 
	
		$default = 0; 
	}
	
	
			
    try {
       
        $stmt = db()->prepare("UPDATE nodo_tbl_groups SET name=:name, devices_default=:group_default WHERE id=:group_id AND user_id=:userId");
							   
      	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->bindParam(":group_id", $id);
        $stmt->bindParam(":name", $name);
		$stmt->bindParam(":group_default",$default);
		        
        $stmt->execute();
        echo json_encode($group);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});

//List all devices
$app->get('/devices', function () use($app) {

	$stmt = db()->prepare("SELECT nodo_tbl_objects.id, 
								  nodo_tbl_objects.user_id,
								  nodo_tbl_objects.description,
								  nodo_tbl_objects.type,
								  nodo_tbl_objects.icon,
								  nodo_tbl_objects.indicator_icon,
								  nodo_tbl_objects.group_id,
								  nodo_tbl_objects.last_update,
								  nodo_tbl_objects.sort_order,
								  nodo_tbl_groups.name AS group_name
							FROM nodo_tbl_objects 
							LEFT JOIN nodo_tbl_groups ON nodo_tbl_objects.group_id=nodo_tbl_groups.id
							WHERE nodo_tbl_objects.user_id=:userId ORDER BY nodo_tbl_objects.sort_order ASC");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$json = json_encode($results);
	echo '{"devices":'. $json .'}'; 

});

//List device
$app->get('/devices/:id', function ($id) use($app) {

	try {		
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_objects WHERE user_id=:userId AND id=:object_id ORDER BY sort_order ASC");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindValue(':object_id', $id, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchObject();
		if ($results != null) {
			
			echo json_encode($results);
		}
		else{
			echo '{"error":[{"text":"device not found."}]}';
		}
	}
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

});



//Add device
$app->post('/devices', function () use($app) {
    
	$request = Slim::getInstance()->request();
    $devices = json_decode($request->getBody());
	$description = htmlspecialchars($devices->device_description);
			
    try {
       
        $stmt = db()->prepare("INSERT INTO nodo_tbl_objects(user_id,description,type,icon,sort_order,group_id)
							   VALUES (:userId, :description, :type, :icon, (SELECT count(*)+1 FROM (SELECT id FROM nodo_tbl_objects WHERE user_id=:userId) AS x),:group_id)");
        $stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->bindParam(":type", $devices->device_type);
		$stmt->bindParam(":icon", $devices->device_icon);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":group_id", $devices->device_group);
        $stmt->execute();
		
		$stmt = db()->prepare("SELECT LAST_INSERT_ID() as id ;");
		$stmt->execute();
		$results = $stmt->fetchObject();
		$json =  json_encode($results);
	    echo ($json);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Edit device
$app->put('/devices/:id', function ($id) use($app) {
    
	$request = Slim::getInstance()->request();
    $devices = json_decode($request->getBody());
	$description = htmlspecialchars($devices->device_description);
			
    try {
       
        $stmt = db()->prepare("UPDATE nodo_tbl_objects SET description=:description,type=:type,icon=:icon,group_id=:group_id WHERE id=:object_id AND user_id=:userId");
        $stmt->bindParam(":object_id", $id);
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":type", $devices->device_type);
		$stmt->bindParam(":icon", $devices->device_icon);
        $stmt->bindParam(":group_id", $devices->device_group);
        $stmt->execute();
        echo json_encode($devices);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Sort device
$app->put('/sortdevice/:id/:direction', function ($id,$direction) use($app) {

		
		$table = 'nodo_tbl_objects';
				
			
		switch ($direction) {
				
			case "up":
				$direction = 'up';
			break;
			case "down":
				$direction = 'down';
			break;
			default:
				$direction = null;
			break;
		}
		
		
	if ($direction != null) {		
			switch ($direction) {
				case "up":
									
					try {
					
						$sqlup = "UPDATE $table SET sort_order=sort_order +1 WHERE user_id=:userId 
								  AND sort_order=(SELECT * FROM(SELECT IF(sort_order=1,sort_order=null,sort_order-1) 
								  FROM $table WHERE user_id=:userId AND id=:id)AS x);
								  
								  UPDATE $table SET sort_order=sort_order-1 WHERE user_id=:userId 
								  AND sort_order=(SELECT * FROM(SELECT IF(sort_order=1,sort_order=null,sort_order) 
								  FROM $table WHERE user_id=:userId AND id=:id)AS x) AND id=:id";

						$stmt = db()->prepare($sqlup);
						$stmt->bindParam(":id", $id);
						$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
						$stmt->execute();
						
						echo '{"message":[{"text":"Record moved up"}]}';
	
					} 
					catch(PDOException $e) {
						echo '{"error":{"text":'. $e->getMessage() .'}}';
					}
				break;
				case "down":
							
					try {
					
						$sqldown = "UPDATE $table SET sort_order=sort_order -1 WHERE user_id=:userId 
									AND sort_order=(SELECT * FROM(SELECT IF((SELECT COUNT(*) FROM $table)=sort_order,sort_order=null,sort_order+1)  
									FROM $table WHERE user_id=:userId AND id=:id)AS x);
									
									UPDATE $table SET sort_order=sort_order+1 WHERE user_id=:userId 
									AND sort_order=(SELECT * FROM(SELECT IF((SELECT COUNT(*) FROM $table)=sort_order,sort_order=null,sort_order) 
									FROM $table WHERE user_id=:userId AND id=:id)AS x) AND id=:id";

						$stmt = db()->prepare($sqldown);
						$stmt->bindParam(":id", $id);
						$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
						$stmt->execute();
						
						echo '{"message":[{"text":"Record moved down"}]}';
	
					} 
					catch(PDOException $e) {
						echo '{"error":{"text":'. $e->getMessage() .'}}';
					}					
				break;
				default:
				echo '{"error":[{"text":"wrong direction"}]}';
				break;
			}
		
	}
	else {
	
		echo '{"error":[{"text":"Wrong direction"}]}';
	}

});


//Delete device
$app->delete('/devices/:id', function ($id) use($app) {

 try {

	$stmt = db()->prepare("UPDATE nodo_tbl_objects 
						   SET sort_order = sort_order - 1 
						   WHERE user_id=:userId 
						   AND sort_order > (SELECT * FROM(SELECT sort_order FROM nodo_tbl_objects WHERE user_id=:userId AND id=:object_id) AS x);
						   DELETE FROM nodo_tbl_objects 
						   WHERE user_id=:userId 
						   AND id=:object_id;
						   DELETE FROM nodo_tbl_objects_cmd 
						   WHERE user_id=:userId 
						   AND object_id=:object_id");
						   
	$stmt->bindParam(":object_id", $id);
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
   	$stmt->execute();
	
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	

});

//List device command's
$app->get('/devicecmds/:id', function ($id) use($app) {

 try {
			
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_objects_cmd WHERE user_id=:userId AND object_id=:id ORDER BY sort_order ASC");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindValue(':id', $id, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$json =  json_encode($results);
	echo '{"devicecmds":'. $json .'}';
	
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	

});

//List device command
$app->get('/devicecmd/:id', function ($id) use($app) {

 try {
			
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_objects_cmd WHERE user_id=:userId AND id=:id");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindValue(':id', $id, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchObject();
		if ($results != null) {
			
			echo json_encode($results);
		}
		else{
			echo '{"error":[{"text":"device command not found."}]}';
		}
	} 
	catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}	

});

//Add device command
$app->post('/devicecmd', function () use($app) {
    
	$request = Slim::getInstance()->request();
    $devicecmds = json_decode($request->getBody());
	
	$description = htmlspecialchars($devicecmds->device_cmd_description);
	$indicator_text = htmlspecialchars($devicecmds->device_cmd_indicator_text);
	
		
	
    try {
       
        $stmt = db()->prepare("INSERT INTO nodo_tbl_objects_cmd(user_id,object_id,description,type,indicator_icon,indicator_text,indicator_placeholder_id,command,unit_event,cmd_event,par1_event,par2_event,par3_event,par4_event,par5_event,state_template,webapp_par1,webapp_par2,webapp_par3,webapp_par4,value,formula,round,sort_order)VALUES (:userId, :object_id, :description, :type, :indicator_icon, :indicator_text, :indicator_placeholder_id, :command, :unit_event, :cmd_event, :par1_event, :par2_event, :par3_event, :par4_event, :par5_event, :state_template, :webapp_par1, :webapp_par2, :webapp_par3, :webapp_par4, :value, :formula, :round, (SELECT count(*)+1 FROM (SELECT id FROM nodo_tbl_objects_cmd WHERE user_id=:userId AND object_id=:object_id) AS x))");
        $stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->bindParam(":object_id", $devicecmds->device_cmd_object_id);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":type", $devicecmds->device_cmd_type);
		$stmt->bindParam(":indicator_icon", $devicecmds->device_cmd_indicator);
		$stmt->bindParam(":indicator_text", $indicator_text);
		$stmt->bindParam(":indicator_placeholder_id", $devicecmds->device_cmd_indicator_placeholder_id);
		$stmt->bindParam(":command", $devicecmds->device_cmd_cmd);	
		$stmt->bindParam(":unit_event", $devicecmds->device_cmd_unit_event);	
		$stmt->bindParam(":cmd_event", $devicecmds->device_cmd_cmd_event);	
		$stmt->bindParam(":par1_event", $devicecmds->device_cmd_par1_event);
		$stmt->bindParam(":par2_event", $devicecmds->device_cmd_par2_event);
		$stmt->bindParam(":par3_event", $devicecmds->device_cmd_par3_event);
		$stmt->bindParam(":par4_event", $devicecmds->device_cmd_par4_event);
		$stmt->bindParam(":par5_event", $devicecmds->device_cmd_par5_event);
		$stmt->bindParam(":state_template", $devicecmds->device_cmd_state_template);
		$stmt->bindParam(":webapp_par1", $devicecmds->device_cmd_webapp_par1);
		$stmt->bindParam(":webapp_par2", $devicecmds->device_cmd_webapp_par2);
		$stmt->bindParam(":webapp_par3", $devicecmds->device_cmd_webapp_par3);
		$stmt->bindParam(":webapp_par4", $devicecmds->device_cmd_webapp_par4);
		$stmt->bindParam(":value", $devicecmds->device_cmd_value);
		$stmt->bindParam(":formula", $devicecmds->device_cmd_formula);
		$stmt->bindParam(":round", $devicecmds->device_cmd_round);
		
        $stmt->execute();
        echo json_encode($devicecmds);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Update device command
$app->put('/devicecmd/:id', function ($id) use($app) {
    
	$request = Slim::getInstance()->request();
    $devicecmds = json_decode($request->getBody());
	
	$description = htmlspecialchars($devicecmds->device_cmd_description);
	$indicator_text = htmlspecialchars($devicecmds->device_cmd_indicator_text);
	
	
    try {
      
        $stmt = db()->prepare("UPDATE nodo_tbl_objects_cmd SET description=:description, type=:type, indicator_icon=:indicator_icon, indicator_placeholder_id=:indicator_placeholder_id, indicator_text=:indicator_text, command=:command, unit_event=:unit_event, cmd_event=:cmd_event, par1_event=:par1_event, par2_event=:par2_event, par3_event=:par3_event, par4_event=:par4_event, par5_event=:par5_event, state_template=:state_template, webapp_par1=:webapp_par1, webapp_par2=:webapp_par2, webapp_par3=:webapp_par3, webapp_par4=:webapp_par4, value=:value, formula=:formula, round=:round WHERE user_id=:userId AND id=:id");
        $stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->bindParam(":id", $id);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":type", $devicecmds->device_cmd_type);
		$stmt->bindParam(":indicator_icon", $devicecmds->device_cmd_indicator);
		$stmt->bindParam(":indicator_text",$indicator_text);
		$stmt->bindParam(":indicator_placeholder_id", $devicecmds->device_cmd_indicator_placeholder_id);
		$stmt->bindParam(":command", $devicecmds->device_cmd_cmd);	
		$stmt->bindParam(":unit_event", $devicecmds->device_cmd_unit_event);	
		$stmt->bindParam(":cmd_event", $devicecmds->device_cmd_cmd_event);	
		$stmt->bindParam(":par1_event", $devicecmds->device_cmd_par1_event);
		$stmt->bindParam(":par2_event", $devicecmds->device_cmd_par2_event);
		$stmt->bindParam(":par3_event", $devicecmds->device_cmd_par3_event);
		$stmt->bindParam(":par4_event", $devicecmds->device_cmd_par4_event);
		$stmt->bindParam(":par5_event", $devicecmds->device_cmd_par5_event);
		$stmt->bindParam(":state_template", $devicecmds->device_cmd_state_template);
		$stmt->bindParam(":webapp_par1", $devicecmds->device_cmd_webapp_par1);
		$stmt->bindParam(":webapp_par2", $devicecmds->device_cmd_webapp_par2);
		$stmt->bindParam(":webapp_par3", $devicecmds->device_cmd_webapp_par3);
		$stmt->bindParam(":webapp_par4", $devicecmds->device_cmd_webapp_par4);
		$stmt->bindParam(":value", $devicecmds->device_cmd_value);
		$stmt->bindParam(":formula", $devicecmds->device_cmd_formula);
		$stmt->bindParam(":round", $devicecmds->device_cmd_round);
		
        $stmt->execute();
        echo json_encode($devicecmds);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Sort device command
$app->put('/sortdevicecmd/:id/:direction', function ($id,$direction) use($app) {

		
		$table = 'nodo_tbl_objects_cmd';
				
			
		switch ($direction) {
				
			case "up":
				$direction = 'up';
			break;
			case "down":
				$direction = 'down';
			break;
			default:
				$direction = null;
			break;
		}
		
		
	if ($direction != null) {		
			switch ($direction) {
				case "up":
									
					try {
					
						$sqlup = "UPDATE $table SET sort_order=sort_order +1 WHERE user_id=:userId AND object_id = (SELECT * FROM(SELECT object_id FROM $table WHERE id=:id AND user_id=:userId LIMIT 1)AS X)
								  AND sort_order=(SELECT * FROM(SELECT IF(sort_order=1,sort_order=null,sort_order-1) 
								  FROM $table WHERE user_id=:userId AND id=:id)AS x);
								  
								  UPDATE $table SET sort_order=sort_order-1 WHERE user_id=:userId 
								  AND sort_order=(SELECT * FROM(SELECT IF(sort_order=1,sort_order=null,sort_order) 
								  FROM $table WHERE user_id=:userId AND id=:id)AS x) AND id=:id";

						$stmt = db()->prepare($sqlup);
						$stmt->bindParam(":id", $id);
						$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
						$stmt->execute();
						
						echo '{"message":[{"text":"Record moved up"}]}';
	
					} 
					catch(PDOException $e) {
						echo '{"error":{"text":'. $e->getMessage() .'}}';
					}
				break;
				case "down":
							
					try {
					
						$sqldown = "UPDATE $table SET sort_order=sort_order -1 WHERE user_id=:userId AND object_id = (SELECT * FROM(SELECT object_id FROM $table WHERE id=:id AND user_id=:userId LIMIT 1)AS X)
									AND sort_order=(SELECT * FROM(SELECT IF((SELECT COUNT(*) FROM $table)=sort_order,sort_order=null,sort_order+1)  
									FROM $table WHERE user_id=:userId AND id=:id)AS Y);
									
									UPDATE $table SET sort_order=sort_order+1 WHERE user_id=:userId 
									AND sort_order=(SELECT * FROM(SELECT IF((SELECT COUNT(*) FROM $table)=sort_order,sort_order=null,sort_order) 
									FROM $table WHERE user_id=:userId AND id=:id)AS x) AND id=:id";

						$stmt = db()->prepare($sqldown);
						$stmt->bindParam(":id", $id);
						$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
						$stmt->execute();
						
						echo '{"message":[{"text":"Record moved down"}]}';
	
					} 
					catch(PDOException $e) {
						echo '{"error":{"text":'. $e->getMessage() .'}}';
					}					
				break;
				default:
				echo '{"error":[{"text":"wrong direction"}]}';
				break;
			}
		
	}
	else {
	
		echo '{"error":[{"text":"Wrong direction"}]}';
	}

});

//Delete device command
$app->delete('/devicecmd/:id', function ($id) use($app) {

try {
			
	$stmt = db()->prepare("UPDATE nodo_tbl_objects_cmd SET sort_order=sort_order - 1 WHERE user_id=:userId AND object_id=(SELECT * FROM(SELECT object_id FROM nodo_tbl_objects_cmd WHERE id=:id)AS object_temp) AND sort_order > (SELECT * FROM (SELECT sort_order FROM nodo_tbl_objects_cmd WHERE user_id=:userId AND id=:id)AS sort_order_temp);DELETE FROM nodo_tbl_objects_cmd WHERE user_id=:userId AND id=:id");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindValue(':id', $id, PDO::PARAM_INT);
	$stmt->execute();
	

	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }


	
});

//List all notifications
$app->get('/notifications', function () use($app) {

 try {
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_notifications_new WHERE user_id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_OBJ);
	$json = json_encode($results);
	echo '{"notifications":'. $json .'}';
} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }		

});

//List notification
$app->get('/notifications/:id', function ($id) use($app) {

	try {			
		$stmt = db()->prepare("SELECT * FROM nodo_tbl_notifications_new WHERE user_id=:userId AND id=:notification_id");
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->bindValue(':notification_id', $id, PDO::PARAM_INT);
		$stmt->execute();

		$results = $stmt->fetchObject();
		if ($results != null) {
			
			echo json_encode($results);
		}
		else{
			echo '{"error":[{"text":"notification not found."}]}';
		}
	} 
	catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}	
});

//Delete notifications
$app->delete('/notifications/:id', function ($id) use($app) {

 try {

	$stmt = db()->prepare("DELETE FROM nodo_tbl_notifications_new WHERE user_id=:userId AND id=:notification_id");
	$stmt->bindParam(":notification_id", $id);
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
   	$stmt->execute();
	
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	

});

//Add notification
$app->post('/notifications', function () use($app) {
    
	$request = Slim::getInstance()->request();
    $notification = json_decode($request->getBody());
	$description = htmlspecialchars($notification->description);
	$subject = htmlspecialchars($notification->subject);
	$body = htmlspecialchars($notification->body);
	
			
    try {
       
        $stmt = db()->prepare("INSERT INTO nodo_tbl_notifications_new(user_id, description, type, event, unit, par1, par2, par3, par4, par5, recipient, subject, body)
							   VALUES (:userId, :description, :type, :event, :unit, :par1, :par2, :par3, :par4, :par5, :recipient, :subject, :body)");
							   
        $stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":type", $notification->type);
		$stmt->bindParam(":unit", $notification->unit);
		$stmt->bindParam(":event", $notification->event);
		$stmt->bindParam(":par1", $notification->par1);
		$stmt->bindParam(":par2", $notification->par2);
		$stmt->bindParam(":par3", $notification->par3);
		$stmt->bindParam(":par4", $notification->par4);
		$stmt->bindParam(":par5", $notification->par5);
		$stmt->bindParam(":recipient", $notification->recipient);
		$stmt->bindParam(":subject", $subject);
		$stmt->bindParam(":body", $body);
        
        $stmt->execute();
        echo json_encode($notification);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Edit notification
$app->put('/notifications/:id', function ($id) use($app) {
    
	$request = Slim::getInstance()->request();
    $notification = json_decode($request->getBody());
	$description = htmlspecialchars($notification->description);
	$subject = htmlspecialchars($notification->subject);
	$body = htmlspecialchars($notification->body);
	
			
    try {
       
        $stmt = db()->prepare("UPDATE nodo_tbl_notifications_new SET 
							  description=:description, 
							  type=:type, event=:event, 
							  unit=:unit, par1=:par1, 
							  par2=:par2, par3=:par3, 
							  par4=:par4, par5=:par5, 
							  recipient=:recipient, 
							  subject=:subject, 
							  body=:body 
							  WHERE id=:id AND user_id=:userId");
        
		$stmt->bindParam(":id", $id);
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":type", $notification->type);
		$stmt->bindParam(":event", $notification->event);
		$stmt->bindParam(":unit", $notification->unit);
		$stmt->bindParam(":par1", $notification->par1);
		$stmt->bindParam(":par2", $notification->par2);
		$stmt->bindParam(":par3", $notification->par3);
		$stmt->bindParam(":par4", $notification->par4);
		$stmt->bindParam(":par5", $notification->par5);
		$stmt->bindParam(":recipient", $notification->recipient);
		$stmt->bindParam(":subject", $subject);
		$stmt->bindParam(":body", $body);
        
        $stmt->execute();
        echo json_encode($notification);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	
	

});

//List nodo's who are trusting you
$app->get('/nodostrustingyou', function () use($app) {

 try {
	$stmt = db()->prepare("SELECT nodo_tbl_users.nodo_id FROM nodo_tbl_users 
						   JOIN nodo_tbl_trusted_nodo_id 
						   ON nodo_tbl_users.id = nodo_tbl_trusted_nodo_id.user_id 
						   WHERE nodo_tbl_trusted_nodo_id.nodo_id 
						   IN (SELECT nodo_tbl_users.nodo_id FROM nodo_tbl_users WHERE id=:userId)");
						   
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_OBJ);
	$json = json_encode($results);
	echo '{"trustednodoid":'. $json .'}';
} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }		

});


//List user settings
$app->get('/usersettings', function () use($app) {

	try {			
		$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->execute();

		$results = $stmt->fetchObject();
		if ($results != null) {
			
			echo json_encode($results);
		}
		else{
			echo '{"error":[{"text":"group not found."}]}';
		}
	} 
	catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}	
});

//List graphs
$app->get('/graphs', function () use($app) {

	
	$stmt = db()->prepare("SELECT id,description FROM nodo_tbl_objects_cmd WHERE type in (20,21,30,31,32) AND user_id=:userId ORDER BY description");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_OBJ);
	if ($results != null) {
		
		echo json_encode($results);
	}
	else{
		echo '{"error":[{"text":"Graph not found."}]}';
	}

});	

//List indicator placeholders
$app->get('/indicatorplaceholders/:id', function ($id) use($app) {

	
				
		$stmt = db()->prepare("SELECT * FROM nodo_tbl_objects_cmd WHERE user_id=:userId AND object_id=:id AND type='6' ORDER BY sort_order");
		$stmt->bindValue(':id', $id, PDO::PARAM_INT);
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->execute();

		
		$results = $stmt->fetchAll(PDO::FETCH_OBJ);
			if ($results != null) {
				
				echo json_encode($results);
			}
			
		
		else{
			echo '{"error":[{"text":"Placeholder not found."}]}';
		}
	

});

//List nodo's you trust
$app->get('/nodosyoutrust', function () use($app) {

 try {
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_trusted_nodo_id WHERE user_id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_OBJ);
	$json = json_encode($results);
	echo '{"trustednodoid":'. $json .'}';
} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }		

});

//List nodo you trust
$app->get('/nodosyoutrust/:id', function ($id) use($app) {

	
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_trusted_nodo_id WHERE user_id=:userId and id=:id");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindValue(':id', $id, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchObject();
	if ($results != null) {
		
		echo json_encode($results);
	}
	else{
		echo '{"error":[{"text":"activity not found."}]}';
	}

});

//Add nodo's you trust
$app->post('/nodosyoutrust', function () use($app) {
    
	$request = Slim::getInstance()->request();
    $nodosyoutrust = json_decode($request->getBody());
	$description = htmlspecialchars($nodosyoutrust->description);
	$nodo_id = strtoupper($nodosyoutrust->nodo_id);
	
    try {
       
        $stmt = db()->prepare("INSERT INTO nodo_tbl_trusted_nodo_id(user_id,description,nodo_id)VALUES (:userId, :description, :nodo_id)");
        $stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":nodo_id", $nodo_id);
        $stmt->execute();
        echo json_encode($nodosyoutrust);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Edit nodo's you trust
$app->put('/nodosyoutrust/:id', function ($id) use($app) {
    
	$request = Slim::getInstance()->request();
    $nodosyoutrust = json_decode($request->getBody());
	$description = htmlspecialchars($nodosyoutrust->description);
	$nodo_id = strtoupper($nodosyoutrust->nodo_id);
			
    try {
       
        $stmt = db()->prepare("UPDATE nodo_tbl_trusted_nodo_id SET description=:description,nodo_id=:nodo_id WHERE id=:id AND user_id=:userId");
        $stmt->bindParam(":id", $id);
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":nodo_id", $nodo_id);
        $stmt->execute();
        echo json_encode($nodosyoutrust);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Delete nodo's you trust
$app->delete('/nodosyoutrust/:id', function ($id) use($app) {

 try {

	$stmt = db()->prepare("DELETE FROM nodo_tbl_trusted_nodo_id WHERE user_id=:userId AND id=:id;DELETE FROM nodo_tbl_trusted_nodo_cmd WHERE trusted_id=:id");
	$stmt->bindParam(":id", $id);
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);;
   	$stmt->execute();
	
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	

});

//List cmd's you trust
$app->get('/cmdsyoutrust/:id', function ($id) use($app) {

 try {
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_trusted_nodo_cmd WHERE user_id=:userId AND trusted_id=:trusted_id");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindParam(":trusted_id", $id);
	$stmt->execute();

	$results = $stmt->fetchAll(PDO::FETCH_OBJ);
	$json = json_encode($results);
	echo '{"trustedcmds":'. $json .'}';
} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }		

});

//List cmd you trust
$app->get('/cmdyoutrust/:id', function ($id) use($app) {

	
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_trusted_nodo_cmd WHERE user_id=:userId and id=:id");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindValue(':id', $id, PDO::PARAM_INT);
	$stmt->execute();

	$results = $stmt->fetchObject();
	if ($results != null) {
		
		echo json_encode($results);
	}
	else{
		echo '{"error":[{"text":"Trusted cmd not found."}]}';
	}

});

//Add cmd you trust
$app->post('/cmdyoutrust', function () use($app) {
    
	$request = Slim::getInstance()->request();
    $cmdyoutrust = json_decode($request->getBody());
	$description = htmlspecialchars($cmdyoutrust->description);
		
    try {
       
        $stmt = db()->prepare("INSERT INTO nodo_tbl_trusted_nodo_cmd 
							  (user_id,trusted_id,description,r_cmd,r_par1,r_par2,r_par3,r_par4,r_par5,s_cmd)
							   VALUES (:userId, :trusted_id, :description, :r_cmd, :r_par1,:r_par2,:r_par3,:r_par4,:r_par5,:s_cmd)");
        
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
		$stmt->bindParam(":trusted_id", $cmdyoutrust->trusted_id);
        $stmt->bindParam(":description", $description);
		$stmt->bindParam(":r_cmd", $cmdyoutrust->r_cmd);
		$stmt->bindParam(":r_par1", $cmdyoutrust->r_par1);
		$stmt->bindParam(":r_par2", $cmdyoutrust->r_par2);
		$stmt->bindParam(":r_par3", $cmdyoutrust->r_par3);
		$stmt->bindParam(":r_par4", $cmdyoutrust->r_par4);
		$stmt->bindParam(":r_par5", $cmdyoutrust->r_par5);
		$stmt->bindParam(":s_cmd", $cmdyoutrust->s_cmd);
        $stmt->execute();
        echo json_encode($cmdyoutrust);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});

//Edit cmd you trust
$app->put('/cmdyoutrust/:id', function ($id) use($app) {
    
	$request = Slim::getInstance()->request();
    $cmdyoutrust = json_decode($request->getBody());
	$description = htmlspecialchars($cmdyoutrust->description);
				
    try {
       
        $stmt = db()->prepare("UPDATE nodo_tbl_trusted_nodo_cmd SET 
							   description=:description, 
							   r_cmd=:r_cmd, 
							   r_par1=:r_par1, 
							   r_par2=:r_par2, 
							   r_par3=:r_par3, 
							   r_par4=:r_par4, 
							   r_par5=:r_par5, 
							   s_cmd=:s_cmd 
							   WHERE id=:id AND user_id=:userId");
							   
							   
        $stmt->bindParam(":id", $id);
		$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
        $stmt->bindParam(":description", $description);
		//$stmt->bindParam(":trusted_id", $cmdyoutrust->trusted_id);
		$stmt->bindParam(":r_cmd", $cmdyoutrust->r_cmd);
		$stmt->bindParam(":r_par1", $cmdyoutrust->r_par1);
		$stmt->bindParam(":r_par2", $cmdyoutrust->r_par2);
		$stmt->bindParam(":r_par3", $cmdyoutrust->r_par3);
		$stmt->bindParam(":r_par4", $cmdyoutrust->r_par4);
		$stmt->bindParam(":r_par5", $cmdyoutrust->r_par5);
		$stmt->bindParam(":s_cmd", $cmdyoutrust->s_cmd);
        $stmt->execute();
        echo json_encode($cmdyoutrust);
    
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	

});



//Delete cmd you trust
$app->delete('/cmdyoutrust/:id', function ($id) use($app) {

 try {

	$stmt = db()->prepare("DELETE FROM nodo_tbl_trusted_nodo_cmd WHERE user_id=:userId AND id=:id");
	$stmt->bindParam(":id", $id);
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
   	$stmt->execute();
	
	} 
	catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	

});

//Filelist															
$app->get('/filelist', function () use($app) {

	$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
	$cookie = $row['cookie'];
	$nodo_ip = $row['nodo_ip'];
	$nodo_port = $row['nodo_port'];
	$nodo_password = $row['nodo_password'];
	$key = md5($cookie.":".$nodo_password);
	$build=trim(substr(strrchr($row['nodo_build'], "="), 1));
	$build=(int)$build;
	
	
		if ($build >= 517) {
			
			$files = explode("<br>", trim(HTTPRequest("http://$nodo_ip:$nodo_port/?event=filelist&key=$key",0)));
		
		}
		else {		
		
			HTTPRequest("http://$nodo_ip:$nodo_port/?event=fileerase%20Filelst;Filelog%20Filelst;filelist;filelog&key=$key",0);
			$files = explode("\n", trim(HTTPRequest("http://$nodo_ip:$nodo_port/?file=filelst&key=$key",0)));
			
		}
		
			$total_files = count($files);
			
			
		if (isset($files)){  

			for($i=0;$i<$total_files;$i++){
		
			$files[$i] = trim($files[$i]);
					
			//Remove !********************************** lines 
			$pos = strpos($files[$i],"!*");
			
				if($pos === false || $pos > 0) {
					
					if ($files[$i] != "" && $files[$i] != "FILELST" && $files[$i] != "EVENTLST" && $files[$i]!= "STATUS" && $files[$i]!= "LOG" && $files[$i]!= "TRACE"){
					
						$rowsarray[] = array(
						"file" 		=> $files[$i]);
					
					}

				}
			}
		}

	$json = json_encode($rowsarray);
	
	

	echo '{"files":'. $json .'}'; 
	
	
});

//Get file / Eventlist															
$app->get('/getfile/:file', function ($file) use($app) {

	$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
	$cookie = $row['cookie'];
	$nodo_ip = $row['nodo_ip'];
	$nodo_port = $row['nodo_port'];
	$nodo_password = $row['nodo_password'];
	$key = md5($cookie.":".$nodo_password);
	$build=trim(substr(strrchr($row['nodo_build'], "="), 1));
	$build=(int)$build;
	
	
		if ($file == "EVENTLST") {
		
				$file = "EVENTLST"; 

				//Read eventlist on nodo
				if ($build >= 517) {
					
				$script=str_replace("<br>","",(HTTPRequest("http://$nodo_ip:$nodo_port/?event=EventListfile%20$file;Fileshow%20$file&key=$key",0)));
				$script=trim(str_replace("!******************************************************************************!","",$script));
				echo $script;
				}
				else {
				HTTPRequest("http://$nodo_ip:$nodo_port/?event=EventListfile%20$file&key=$key",0);
				//Read file from Nodo to array
				$script =  trim(HTTPRequest("http://$nodo_ip:$nodo_port/?file=$file&key=$key",0));
				echo $script;
				}
			}
			
			else {
			
							
								
				if ($build >= 517) {
				$script=str_replace("<br>","",(HTTPRequest("http://$nodo_ip:$nodo_port/?event=Fileshow%20$file&key=$key",0)));
				$script=trim(str_replace("!******************************************************************************!","",$script));
				echo $script;
				
				}
				else {
					
					//Read file from Nodo to array
					$script =  trim(HTTPRequest("http://$nodo_ip:$nodo_port/?file=$file&key=$key",0));
					echo $script;
				
				}
				
			}
});
			
//New file														
$app->post('/newfile/:file', function ($file) use($app) {

	$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
	$cookie = $row['cookie'];
	$nodo_ip = $row['nodo_ip'];
	$nodo_port = $row['nodo_port'];
	$nodo_password = $row['nodo_password'];
	$key = md5($cookie.":".$nodo_password);
	$build=trim(substr(strrchr($row['nodo_build'], "="), 1));
	$build=(int)$build;
	
	
	HTTPRequest("http://$nodo_ip:$nodo_port/?event=FileWrite%20$file&key=$key",0);
	HTTPRequest("http://$nodo_ip:$nodo_port/?event=%20&key=$key",0);
	HTTPRequest("http://$nodo_ip:$nodo_port/?event=FileWrite&key=$key",0);
	
	echo '{"file":'. $file .'}'; 
});

//Delete file														
$app->delete('/deletefile/:file', function ($file) use($app) {

	$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
	$cookie = $row['cookie'];
	$nodo_ip = $row['nodo_ip'];
	$nodo_port = $row['nodo_port'];
	$nodo_password = $row['nodo_password'];
	$key = md5($cookie.":".$nodo_password);
	$build=trim(substr(strrchr($row['nodo_build'], "="), 1));
	$build=(int)$build;
	
	
	HTTPRequest("http://$nodo_ip:$nodo_port/?event=FileErase%20$file&key=$key",0);
	
	echo '{"file":'. $file .'}'; 
});

//Write file														
$app->POST('/writefile', function () use($app) {
	
	$request = Slim::getInstance()->request();
	$writefile= json_decode($request->getBody());
	$file = $writefile->file;
	$script = $writefile->script;
	$execute = $writefile->execute;
	 
	
	$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
	$cookie = $row['cookie'];
	$nodo_ip = $row['nodo_ip'];
	$nodo_port = $row['nodo_port'];
	$nodo_password = $row['nodo_password'];
	$key = md5($cookie.":".$nodo_password);
	$build=trim(substr(strrchr($row['nodo_build'], "="), 1));
	$build=(int)$build;

	$stmt = db()->prepare("INSERT INTO nodo_tbl_scripts (script, file, user_id) 
		 VALUES 
		 (:script,:file,:userId)");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->bindParam(":file", $file);
	$stmt->bindParam(":script", $script);
	$stmt->execute();
 		
		
	
	


		
		if ($execute=='true'){
		
			
			//Execute script on Nodo
			$scriptres=HTTPRequest("http://$nodo_ip:$nodo_port/?event=FileGetHTTP%20$file;FileExecute%20$file&key=$key",0);
			
		}
		
		else {
		
		//Save script on Nodo 
		$scriptres=HTTPRequest("http://$nodo_ip:$nodo_port/?event=FileGetHTTP%20$file&key=$key",0);
		
		}
	
		
	
	
	
	echo '{"scriptres":'. $scriptres .'}'; 

});

//Send command to nodo
$app->post('/cmdsend/:cmd', function ($cmd) use($app){

	$stmt = db()->prepare("SELECT * FROM nodo_tbl_users WHERE id=:userId");
	$stmt->bindValue(':userId', $app->userId, PDO::PARAM_INT);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
	$cookie = $row['cookie'];
	$nodo_ip = $row['nodo_ip'];
	$nodo_port = $row['nodo_port'];
	$nodo_password = $row['nodo_password'];
	$cookie_update = $row['cookie_update'];
	$key = md5($cookie.":".$nodo_password);
	$cmd = str_replace ( ' ', '%20',$cmd);
	
	//Controleren of de Nodo maximaal 3 minuten geleden een connectie met de Web App heeft gehad.
    if (strtotime($cookie_update) >  (strtotime("now")-180)) {$response = HTTPRequest("http://$nodo_ip:$nodo_port/?event=$cmd&key=$key",0);}
	
	
	echo $response;
	
});





$app->run();
