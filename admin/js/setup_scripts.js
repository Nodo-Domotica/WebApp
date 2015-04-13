
var EventlistButtonPressed = 0; //variable welke bijhoudt of er op de eventlist read button is geklikt  

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

	$.ajax({
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



$('#scripts_page').on('pageshow', function(event) {
	
	pagetitle = 'Setup: Scripts';
		
	$('#header_setup_scripts').append('<div id="nodostate">'+pagetitle+'</div>');
	Nodo_State();
	
	
	getFiles(); //files ophalen vanaf nodo
});

$('#scripts_page').on('pagehide', function(event) {
	
	$('#header_setup_scripts').empty();
});


function getFiles() {
	
	$('#scriptfile').empty();
	$('#scriptfile').append('<option value="list">Please wait, getting scripts...</option>');
	$('#scriptfile').selectmenu("refresh", true);
	$('#delete').button('disable');
	$('#write').button('disable');
	$('#checkbox').checkboxradio('disable');
	$('#scriptcontent').textinput('disable');
			
 $.ajax({
                type: 'GET',
                contentType: 'application/json',
                url: '../api/filelist',
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
                success: function(data, textStatus, jqXHR){
                    files = data.files;
		
		function SortByName(x,y) {
			return ((x.file == y.file) ? 0 : ((x.file > y.file) ? 1 : -1 ));
		}
		
		files = data.files.sort(SortByName);
		
		
		$('#scriptfile').empty();
		$('#scriptfile').append('<option value="choose">Select script...</option>');
		
		$.each(files, function(index, file) {
								
			$('#scriptfile').append('<option value="'+file.file+'">'+file.file+'</option>');
								
		});
		
				
		//Bij een nieuwe file selecteren we deze
		if ($('#scriptfilenew').val().toUpperCase() != '') {
		
			$('#scriptfile').val($('#scriptfilenew').val().toUpperCase());
			$('#scriptfile').change();
		
		}
		
		$('#scriptfile').selectmenu('refresh', true);
                }
        });			
	
}


$('#scriptfile').change( function( e ) { 
        
		EventlistButtonPressed = 0;
				
		e.preventDefault();
		
		$('#scriptcontent').val('').css('height', '50px');
		
					
			if ($('#scriptfile').val() != 'choose') {
				$('#delete').button('enable');
				$('#write').button('enable');
				$('#checkbox').checkboxradio('enable');
				$('#scriptcontent').textinput('enable');
				
				 $.ajax({
                type: 'GET',
                contentType: 'text/plain',
                url: '../api/getfile/' + $('#scriptfile').val(),
                dataType: "text",
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
                     $('#scriptcontent').val(data).keyup();
					$('#scriptcontent').focus();
                }
        });
				
			
				
			}
			else {
				$('#delete').button('disable');
				$('#write').button('disable');
				$('#checkbox').checkboxradio('disable');
				$('#scriptcontent').textinput('disable');
			}
						
});

//Eventlist wijkt af van de andere files
$('#eventlist').click( function( e ) { 
		
		e.preventDefault();
		
		$('#scriptfile').val('choose');
		$('#scriptfile').change();
		
		$('#scriptcontent').val('').css('height', '50px');
		
		 $.ajax({
                type: 'GET',
                contentType: 'text/plain',
                url: '../api/getfile/EVENTLST' ,
                dataType: "text",
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
                   $('#scriptcontent').val(data).keyup();
			$('#scriptcontent').textinput('enable');
			$('#write').button('enable');
		    $('#checkbox').checkboxradio('disable');
			$("#checkbox").attr("checked", true);
			$("#checkbox").checkboxradio('refresh');
			$('#scriptcontent').focus();
                }
        });
		
		
		
		EventlistButtonPressed = 1;
		
       
});


$('#write').click( function( e ) { 
		
		e.preventDefault();
		$('#write_message').empty();
		
        if ($('#scriptfile').val() != 'choose' || EventlistButtonPressed == 1) {
			if (EventlistButtonPressed == 1) {
				$('#write_message').append('<img src="../media/loading.gif"/> Please wait, writing eventlist....<br \>');
				$( "#scripts_popup_msg" ).popup("open");
				
				$.ajax({
                type: 'POST',
                contentType: 'text/plain',
                url: '../api/writefile',
                dataType: "text",
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
                     if ($("#checkbox").is(":checked")==true) {
						$('#write_message').empty();
						$('#write_message').append('The eventlist is written to the Nodo<br \><br \>');
						//$('#write_message').append(data);
					}
					
					$( "#scripts_popup_msg" ).popup("open");
                }
        });
								
				
			}
			else {
				
			    $('#write_message').append('<img src="../media/loading.gif"/> Please wait, uploading script....<br \>');
				$( "#scripts_popup_msg" ).popup("open");
				
				$.ajax({
                type: 'POST',
                contentType: 'text/plain',
                url: '../api/writefile',
                dataType: "text",
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
                     if ($("#checkbox").is(":checked")==true) {
							$('#write_message').empty();
							$('#write_message').append('The script is sent to the Nodo<br \> and is executed.<br \><br \>');
							//$('#write_message').append(data);
						}
						else {
							$('#write_message').empty();
							$('#write_message').append('The script is send to the Nodo.<br \><br \>');
							//$('#write_message').append(data);
						}
						$( "#scripts_popup_msg" ).popup("open");
                }
        });
				
				
			}
		}
});


$('#scriptfilenew').keyup(function() {
	if (this.value.match(/[^a-zA-Z0-9 ]/g)) {
		this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '');
	}
});


$('#new').click(function( e ) { 
	
	$('#scriptfilenewdiv').show();
	$('#new2').text("Cancel");
	$('#new3').button('enable');
	$('#new_message').empty();
	$('#scriptfilenew').val('');
	$('#scripts_popup_new').popup("open");
	
	
});


$('#new3').click(function( e ) { 
	
	$('#new2').text("Close");
	$('#new3').button('disable');
	$('#new_message').empty();
	$('#scriptfilenewdiv').hide();
	
	//controleren of het script al bestaat
	var existingfiles = $('#scriptfilenew').val().toUpperCase();
	var fileexists = 0 != $('#scriptfile option[value='+existingfiles+']').length;
	
	
	if ($('#scriptfilenew').val() != '' && fileexists == false ) {
	
		$('#scriptcontent').val('').css('height', '50px');
	
		$('#new_message').append('Creating file: ' + $('#scriptfilenew').val().toUpperCase() +'...');
		
		 $.ajax({
                type: 'POST',
                contentType: 'text/plain',
                url: '../api/newfile/' + $('#scriptfilenew').val(),
                dataType: "text",
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
                     $('#new_message').empty();
		$('#new_message').append('Script '+ $('#scriptfilenew').val().toUpperCase() +' created.');
		
		
		getFiles()
                }
        });
	
		
	}
	else {
	
		if ($('#scriptfilenew').val() == '') {
		
			$('#new_message').append('Please fill in a scriptname!');
			$('#scriptfilenewdiv').show();
			$("#new2").text("Cancel");
			$('#new3').button('enable');
		}
		
		if (fileexists == true) {
		
			$('#new_message').append('Script already exists!');
			$('#scriptfilenewdiv').show();
			$("#new2").text("Cancel");
			$('#new3').button('enable');
		}
		
	}
		
});


$('#delete').click(function( e ) { 
	
	if ($('#scriptfile').val() != 'choose') {
		$('#scripts_popup_delete').popup("open");
		$("#delete2").text("Cancel");
		
		$('#delete3').button('enable');
		$('#delete_message').empty();
		$('#delete_message').append('Delete script: ' + $('#scriptfile').val() + '?');
	}
});


$('#delete3').click(function( e ) { 
	
	$('#delete3').button('disable');
	
	 $.ajax({
                type: 'DELETE',
                contentType: 'text/plain',
                url: '../api/deletefile/' + $('#scriptfile').val(),
                dataType: "text",
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
                  $("#delete2").text("Close");
		
		$('#delete_message').empty();
		$('#delete_message').append($('#scriptfile').val() + ' deleted.');
		$('#scriptcontent').val('').css('height', '50px');
		
		getFiles()
                }
        });
	
	
	
});

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
        return JSON.stringify({
                "file":  $('#scriptfile').val(),
				"script": $('#scriptcontent').val(),
				"execute": $("#checkbox").is(":checked")
				
		});
				
}

$( "#scripts_popup_new" ).bind({
   popupafteropen: function(event, ui) {  $('#scriptfilenew').focus(); }
});

$( "#scripts_popup_new" ).bind({
   popupafterclose: function(event, ui) { $('#scriptcontent').focus(); }
});

	
	