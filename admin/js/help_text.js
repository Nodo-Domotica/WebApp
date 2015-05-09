

function help_text(key,div) {
	
	$.ajax({cache: false, 
         async: false,
		 url: path+'api/helptext/'+key, 
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
					
				}
				},
         success: function(data) {
 			
		$('#'+div + '_content').empty();
			
			if (data.help_text == '') {
				$('#'+div + '_content').append('Help text:  '+key);
			}
			else {
				$('#'+div + '_content').append(data.help_text);
			}
			//$('#'+div).popup();
			$('#'+div).popup( { overlayTheme: "b" } );
			$('#'+div).popup( "open" );
			
			
			
	}	
});
		

	
	

}