var pagetitle;

NodoStateTimer=setInterval(function(){Nodo_State()},30000);

function Nodo_State(){



var status;

$.ajax({ 
         
		 url: path+'api/nodostate', 
         dataType: "json",
		 beforeSend : function(xhr) {
			 
				var user = decodeURIComponent(getCookie("USERID"));
				var password = decodeURIComponent(getCookie("TOKEN"));
			 	var words  = CryptoJS.enc.Utf8.parse(user + ":" + password);
				var base64 = CryptoJS.enc.Base64.stringify(words);
                
				xhr.setRequestHeader("Authorization", "Basic " + base64);
	            },
				error : function(xhr, ajaxOptions, thrownError) {
				if (xhr.status==403) { 
					$.mobile.loading( "hide");
					//$('#popupLogin').popup();
					//$('#popupLogin').popup("open");
				}
				},
         success: function(data) {
 			
			NodoState = data.nodostate;
			$.each(NodoState, function(index,state){
			 
				if (state.busy == 1) {
					
					
						document.getElementById('nodostate').innerHTML = '<FONT COLOR=\"yellow\">Nodo busy!</FONT>';
						
						
						
					}
					
				if (state.online == 0) {
					
					
						document.getElementById('nodostate').innerHTML = '<FONT COLOR=\"red\">No connection to Nodo!</FONT>';
						
					}
					
				if (state.busy != 1 && state.online != 0) {
					
											
						document.getElementById('nodostate').innerHTML = pagetitle;
						
					}
				
				
			      
			});
			
			
			
	}	
});
	
		
}