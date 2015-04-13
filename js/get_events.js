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

function Get_Nodo_Events()
 {  
 
 
 $.ajax({ 
         url: 'api/events/100', 
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
					$.mobile.changePage( "#login_page", { transition: "none"} );
					//$('#popupLogin').popup();
					//$('#popupLogin').popup("open");
				}
				},
         success: function(data) {
 			
			events = data.events;
		
        $('#events_div').empty();
		
        
		if (data.events != null) {
		
			html = 	('<table>' +
					'<thead>' +
					'<tr>' +      
					'<th scope="col" align="left">Unit</th>' +     
					 '<th scope="col" align="left">Event</th>' +      
					 '<th scope="col" align="left">Timestamp</th>' +
					 '</tr>' +   
					 '</thead>' +   
					 '<tbody>')
		
			$.each(events, function(index, event) {

			
		html = html + ('<tr>' +	
					   '<td width="50">'+event.unit+'</td> <td width="40%">'+event.event+'</td><td <td>'+event.timestamp+'</td>' +		
					   '</tr>')


			   
				});
			html = html + ('<table>' +
						  '</tbody>' +
						  '</table>')	
				
			}
			
			
		
		
		
        $('#events_div').append(html);
		
	
			
			
			
	}	
});
   
		
}

			




 


 
