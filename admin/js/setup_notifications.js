

$( function() {
		//$( "#help_popup" ).enhanceWithin().popup();
		$( "#popupLogin" ).enhanceWithin().popup();
	});
	
$('#btnSignin').click(function () {

	var u = $('#un').val();
	var p = $('#pw').val();
	if ($("#checkbox-1").prop('checked') == true) {
		var s = 1;
	} else {
		var s = 0;
	}

	$.ajax({cache: false,
		type : "POST",
		url : "../api/login",
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		data : JSON.stringify({
			username : u,
			password : p,
			savecred : s
		}),
		success : function (data) {
			
			if (s == 0) {
				
				
				document.cookie='USERID='+data.id+';path=/';
				document.cookie='USERNAME='+data.username+';path=/';
				document.cookie='TOKEN='+data.token+';path=/';
			}
			else if (s == 1) {
				
				var d = new Date();
				d.setTime(d.getTime() + (365*24*60*60*1000));
				var expires = "; expires="+d.toUTCString();
				
				document.cookie='USERID='+data.id+expires+';path=/';
				document.cookie='USERNAME='+data.username+expires+';path=/';
				document.cookie='TOKEN='+data.token+expires+';path=/';
			}
			

				
			
			//Thema instellen
			location.reload();
			//$.mobile.changePage( "#groups_page", { transition: "none"} );
			//getGroups();

		},
		error : function (errorMessage) {
			alert('Error logging in');
		}
	});
	return false;
});

$('#notifications_page').on('pageinit', function(event) {
		
	Nodo_State();
	getNotifications();
		
});


$('#notifications_page').on('pageshow', function(event) {
	
	pagetitle = 'Setup: Notifications';
	$('#header_setup_notifications').append('<div id="nodostate">'+pagetitle+'</div>');
	

});

$('#notifications_page').on('pagehide', function(event) {
	
	$('#header_setup_notifications').empty();

});

$('#notification_form_page').on('pageshow', function(event) {
		
	
});

$('#btnAdd').click(function() {
        newNotification();
		return false;
});

$('#btnSave').click(function() {
        
		if ($('#id').val() == '') {
              addNotification()
		}
        else {
               editNotification($('#id').val())
		}
        return false;
});


function getNotifications() {
	
	$.ajax({cache: false,
		type : 'GET',
		contentType : 'application/json',
		url : '../api/notifications',
		dataType : "json",
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
		success : function (data, textStatus, jqXHR) {
		var html
			
				
		if (data.notifications != null) {
			
			$('#notificationlist').empty();
					
			
			
			$.each(data.notifications, function(index, notification) {
					
			
					
					html=('<div data-role="collapsible" data-collapsed="true" data-inset="false" data-iconpos="right" data-content-theme="'+theme+'">') 
					
			
					
					html=html+(	'<h3>'+notification.description+'</h3>' +
							
					 		'<a href="javascript:findNotification('+notification.id+')" data-role="button" data-icon="edit" data-ajax="false">Edit</a>' +
							'<a href="javascript:confirmDeleteNotification('+notification.id+')" data-role="button"  data-icon="delete" data-rel="dialog">Delete</a>');
				
				

				html=html+('</div>');
				$('#notificationlist').append(html);				
										
											
			});
			
			
			$('#notificationlist').trigger('create');
			
			
		}
		else {
				
				$('#notificationlist').append('No notifications defined...');
				                       
		}
		}
	});

	
}

function confirmDeleteNotification(id) {
	
	$('#delete_message').empty();
	$('#delete_button').empty();
	$('#delete_message').append('Delete notification?');
	$('#notification_popup_delete').popup("open");
	$('#delete_button').append('<a href="javascript:DeleteNotification('+id+')" id="ok_delete" data-role="button" data-inline="true" >Delete</a> ');
    $('#notification_popup_delete').trigger("create");
}

function DeleteNotification(id) {

$.ajax({cache: false,
        type: 'DELETE',
        url: '../api/notifications/' + id,
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
          getNotifications();
		  $('#notification_popup_delete').popup("close");
		  
		
        }
    });

	

}

function newNotification() {
        
		currentNotification = {};
        renderDetails(currentNotification); // Display empty form
		$.mobile.changePage( "#notification_form_page", { transition: "none"} );
		pagetitle = 'Setup: Add Notification';
		$('#header_setup_notification_form').empty();
		$('#header_setup_notification_form').append('<div id="nodostate">'+pagetitle+'</div>');
		$('#type').val('1');
		$('#type').change();
		
}

function findNotification(id) {
       $.mobile.loading( "show");
        $.ajax({cache: false,
                type: 'GET',
                url: '../api/notifications/' + id,
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
					$('#popupLogin').popup("open");
					
				}
				},
                success: function(data){
                        $.mobile.loading( "hide");                    
                        currentNotification = data;
                        renderDetails(currentNotification);
						pagetitle = 'Setup: Edit Notification';
						$('#header_setup_notification_form').empty();
						$('#header_setup_notification_form').append('<div id="nodostate">'+pagetitle+'</div>');
						$.mobile.changePage( "#notification_form_page", { transition: "none"} );
                }
        });
}

function addNotification() {
		
		$.mobile.loading( "show");
        
        $.ajax({cache: false,
                type: 'POST',
                contentType: 'application/json',
                url: '../api/notifications',
                dataType: "json",
                data: formToJSON(),
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
                      $.mobile.loading( "hide");
					  getNotifications()
					  $.mobile.changePage( "#notifications_page", { transition: "none"} );
                }
        });
}

function editNotification(id) {
		
		$.mobile.loading( "show");
        
        $.ajax({cache: false,
                type: 'PUT',
                contentType: 'application/json',
                url: '../api/notifications/' + id,
                dataType: "json",
                data: formToJSON(),
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
                      $.mobile.loading( "hide");
					  getNotifications()
					  $.mobile.changePage( "#notifications_page", { transition: "none"} );
                }
        });
}

function renderDetails(notification) {
		
	if (notification.event != '' && notification.event != undefined ) {nodoevent = notification.event+' ';} else {nodoevent = '';}
	if (notification.par1 != '' && notification.par1 != undefined ) {par1 = notification.par1;} else {par1 = '';}
	if (notification.par2 != '' && notification.par2 != undefined) {par2 = ',' + notification.par2;} else {par2 = '';}
	if (notification.par3 != '' && notification.par3 != undefined) {par3 = ',' + notification.par3;} else {par3 = '';}
	if (notification.par4 != '' && notification.par4 != undefined) {par4 = ',' + notification.par4;} else {par4 = '';}
	if (notification.par5 != '' && notification.par5 != undefined) {par5 = ',' + notification.par5;} else {par5 = '';}

	$('#nodo_id').empty();
	$('#nodo_id').append('<option value="0">Select Remote Nodo ID</option>');

	
	$.ajax({cache: false,
		type : 'GET',
		contentType : 'application/json',
		url : '../api/nodostrustingyou',
		dataType : "json",
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
		success : function (data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			nodos = data.trustednodoid;
					
			$.each(nodos, function(index, nodo) {
									
				$('#nodo_id').append('<option value="'+nodo.nodo_id+'">'+nodo.nodo_id+'</option>');
									
			});
			
			$('#id').val(notification.id);
			$('#description').val($("<div>").html(notification.description).text());
			
			if (notification.type != undefined) {
				$('#type').val(notification.type);
				$('#type').change();
			}
			
			$('#unit').val(notification.unit);
			
			$('#event').val(nodoevent+par1+par2+par3+par4+par5);
					
			
			if (notification.recipient != undefined) {
				$('#nodo_id').val(notification.recipient);
				$('#nodo_id').change();
			}
			$('#nodo_id').selectmenu('refresh', true);
			
			$('#recipient').val(notification.recipient);
			
			$('#subject').val($("<div>").html(notification.subject).text());
			$('#body').val(notification.body);
			
			
				
			
			
			
		}
	});
	
       
		
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {

    var eventraw = $('#event').val();
	var eventarr = eventraw.split(/[ ,]+/);
		
	if (eventarr[0] != undefined) {nodoevent = eventarr[0];} else {nodoevent='';}
	if (eventarr[1] != undefined) {par1 = eventarr[1];} else {par1='';}
	if (eventarr[2] != undefined) {par2 = eventarr[2];} else {par2='';}
	if (eventarr[3] != undefined) {par3 = eventarr[3];} else {par3='';}
	if (eventarr[4] != undefined) {par4 = eventarr[4];} else {par4='';}
	if (eventarr[5] != undefined) {par5 = eventarr[5];} else {par5='';}


        return JSON.stringify({
                "id": $('#id').val(),
				"description": $('#description').val(),
				"type": $('#type').val(),
				"event": nodoevent,
				"unit": $.trim($('#unit').val()),
				"par1": par1,
				"par2": par2,
				"par3": par3,
				"par4": par4,
				"par5": par5,
				"recipient": $('#recipient').val(),
				"subject": $('#subject').val(),
				"body": $('#body').val()
		});
				
}

$('#type').change( function( e ) { 


show_hide_items();


});



function show_hide_items() {
	if ($('#type').val() == 1) {
		$('#subject_body').show();
		$('#recipient_label').empty();
		$('#recipient_label').append('E-mail address:');
		$('#event_label').empty();
		$('#event_label').append('Event: <a href="javascript:help_text(3,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#recipient_label').show();
		$('#recipient').show();
		$('#nodo_id_label').hide();
		$('#nodo_id').parent().hide();
		

	}
	else if ($('#type').val() == 2) {
		$('#subject_body').show();
		$('#recipient_label').empty();
		$('#recipient_label').append('Pushingbox device ID: <a href="javascript:help_text(4,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#event_label').empty();
		$('#event_label').append('Event: <a href="javascript:help_text(3,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#recipient_label').show();
		$('#recipient').show();
		$('#nodo_id_label').hide();
		$('#nodo_id').parent().hide();
		

	}
	else if ($('#type').val() == 3){
		$('#subject_body').hide();
		$('#event_label').empty();
		$('#event_label').append('Event from your Nodo: <a href="javascript:help_text(5,\'help_popup\')"><img src="../media/help.png"></a>');
		
		$('#recipient_label').hide();
		$('#recipient').hide();
		$('#nodo_id_label').show();
		$('#nodo_id').parent().show();
		
		
		
		
		
		}	
}

$('#nodo_id').change( function( e ) { 

	$('#recipient').val($('#nodo_id').val());

});


	



