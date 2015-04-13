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

function Get_Nodo_Status()
 {  
 
 var	element = document.getElementById('status_div');
 
 $.ajax({
                type: 'GET',
                contentType: 'text/plain',
                url: '../api/nodostatus',
                dataType: "text",
               	beforeSend : function(xhr) {
					
				
					
				element.innerHTML = '<h4><img src="media/loading.gif"/> Please wait, loading status...</h4>'; 
			 
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
                  element.innerHTML = data;  
                }
        });
   
			
				

}