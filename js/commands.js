
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
$(document).ready(function() {
     $('#command_form').submit(function() {
      			
	var command = $('#command').val();
		
	Get_Command_Result(command);
		  
    return false;
	});
});	

$('#command_page').on('pageinit', function(event) {
	
	
});
 

$('#command_page').on('pageshow', function(event) {
	pagetitle = 'Commands';
	$('#header_command').append('<div id="nodostate">'+pagetitle+'</div>');
	Nodo_State();
	
	
	
});

$('#command_page').on('pagehide', function(event) {
	$('#header_command').empty();
});


function Get_Command_Result(command)
 {  
   
			
				var
					$http,
					$self = arguments.callee,
					element = document.getElementById('result_div');
			
if (command != '') {			
				
		//element.innerHTML = '<img src="media/loading.gif"/> Please wait, loading results...</h4>'; 
			 $.mobile.loading( "show", {
				  text: "Executing command(s)",
				  textVisible: true
				});
				
				$.ajax({ 
				type: 'POST',
                contentType: 'text/plain',
				 url: 'api/cmdsend/' + command, 
				 dataType: 'text',
				 beforeSend : function(xhr) {
			 
				var user = decodeURIComponent(getCookie("USERID"));
				var password = decodeURIComponent(getCookie("TOKEN"));
			 	var words  = CryptoJS.enc.Utf8.parse(user + ":" + password);
				var base64 = CryptoJS.enc.Base64.stringify(words);
                
				xhr.setRequestHeader("Authorization", "Basic " + base64);
	            },
				error : function(xhr, ajaxOptions, thrownError) {
				if (xhr.status==403) { 
					$.mobile.changePage( "#login_page", { transition: "none"} );
					
				}
				},
         success: function(data) {
 			
		 $.mobile.loading( "hide");	
					element.innerHTML = data;  
		
	
			
			
			
	}	
});
			
		

	}

}


 


 
