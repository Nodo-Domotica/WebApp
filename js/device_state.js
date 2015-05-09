var ArrayDeviceDimvalue=new Array();
function Device_State(){





var status;

$.ajax({cache: false, 
         async: false,
		 url: 'api/devicestate', 
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
 			
			if (data != null) {
				$.each(data, function(i,data){
					
									
					indicator_text = data.indicator_text;

					// The array of regex patterns to look for
					$format_search =  [
						/\[small\](.*?)\[\/small\]/ig,
						/\[i\](.*?)\[\/i\]/ig,
						/\[u\](.*?)\[\/u\]/ig,
						/\[sup\](.*?)\[\/sup\]/ig,
						/\[sub\](.*?)\[\/sub\]/ig,
						/\[color=rgb(.*?)\](.*?)\[\/color\]/ig,
						/\[blink\](.*?)\[\/blink\]/ig						
					]; // note: NO comma after the last entry

					// The matching array of strings to replace matches with
					$format_replace = [
						'<font size=-1>$1</font>',
						'<i>$1</i>',
						'<u>$1</u>',
						'<sup>$1</sup>',
						'<sub>$1</sub>',
						'<span style="color:rgb$1">$2</span>',
						'<span class="blink_me">$1</span>'
					];

					// Perform the actual conversion
					for (var i =0;i<$format_search.length;i++) {
					  indicator_text = indicator_text.replace($format_search[i], $format_replace[i]);
					}
					//lert($str)
				 
					
					
					if (data.indicator_text != '') {
					
						document.getElementById('switch_description'+data.id).innerHTML = '<img src="" class="ui-li-icon" id=switch_'+ data.id+' >'+ indicator_text;
						//$('switch_description'+data.id).html('<img src="" class="ui-li-icon" id=switch_'+ data.id+' >'+ data.indicator_text);
					}
					//else {
					
					//document.getElementById('switch_description'+data.id).innerHTML = '<img src="" class="ui-li-icon" id=switch_'+ data.id+' >'+ data.description;
						
					
					//}
					
					if (data.indicator_icon == 0 && data.icon == 0 ) {
						
						
							
							document.getElementById('switch_'+data.id).src = '';
						
					}
					else if  (data.indicator_icon > 0) {
					
							document.getElementById('switch_'+data.id).src = 'media/'+data.indicator_icon+'.png';
					}
					else {
							document.getElementById('switch_'+data.id).src = 'media/'+data.icon+'.png';
					
					}			   
				});
			}
			
			
			
	}	
});

	
	

}