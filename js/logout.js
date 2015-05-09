
$.ajax({cache: false,
        type: 'DELETE',
        url: '../api/logout/' + getCookie("TOKEN"),
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
					$('#popupLogin').popup("open");
					
				}
				},
        success: function(data, textStatus, jqXHR){
         
			document.cookie='USERID=0;path=/';
			document.cookie='USERNAME=0;path=/';
			document.cookie='TOKEN=0;path=/';
		
        }
    });


