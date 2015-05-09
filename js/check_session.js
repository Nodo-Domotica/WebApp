//Deze functie controleerd of er een login sessie bestaat

function checkSession() {



$.ajax({cache: false, 
         async: false, 
         url: '/webservice/json_check_session.php', 
         dataType: "json", 
         success: function(data) {
 			if (data.authorized != 1) {
			
				jQuery(document).empty();
   				window.location = '/index.html';
				
			}
			
			
			
										
						
					}
			
			});
		
		}



