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
$('#trusted_nodo_page').on('pageinit', function(event) {
		
	Nodo_State();
	gettrusted_nodo();
		
});


$('#trusted_nodo_page').on('pageshow', function(event) {
	
	pagetitle = 'Setup: Trusted Nodo\'s';
	$('#header_setup_trusted_nodo').append('<div id="nodostate">'+pagetitle+'</div>');
	
	

});


$('#trusted_nodo_page').on('pagehide', function(event) {
	
	$('#header_setup_trusted_nodo').empty();

});


$('#trusted_nodo_form_page').on('pageshow', function(event) {
		

	
	//als de pagina word vernieuwd gaan we terug naar de hoofdpagina.
	if ($('#trusted_nodo_form_refreshed').val() == '') {
	
		$.mobile.changePage( "#trusted_nodo_page", { transition: "none"} );
             
	}
	

});

$('#trusted_cmd_form_page').on('pageshow', function(event) {
		
	
	//als de pagina word vernieuwd gaan we terug naar de hoofdpagina.
	if ($('#trusted_cmd_page_refreshed').val() == '') {
	
		$.mobile.changePage( "#trusted_nodo_page", { transition: "none"} );
             
	}
	

});


$('#trusted_cmd_page').on('pageshow', function(event) {

	pagetitle = 'Setup: Trusted event\'s';
	$('#header_setup_trusted_cmd').append('<div id="nodostate">'+pagetitle+'</div>');
		
	
	
	//als de pagina word vernieuwd gaan we terug naar de hoofdpagina.
	if ($('#trusted_cmd_page_refreshed').val() == '') {
	
		$.mobile.changePage( "#trusted_nodo_page", { transition: "none"} );
             
	}
	
});


$('#trusted_cmd_page').on('pagehide', function(event) {
	
	$('#header_setup_trusted_cmd').empty();

});


$('#btnAddTrustedNodo').click(function() {
       	newTrustedNodo()
		return false;
});

$('#btnAddTrustedCmd').click(function() {
       	newTrustedCmd()
		return false;
});


$('#btnSaveTrustedNodo').click(function() {
        
		if ($('#trusted_nodo_id').val() == '') {
              addTrustedNodo()
		}
        else {
               editTrustedNodo($('#trusted_nodo_id').val())
		}
        return false;
});

$('#btnSaveTrustedCmd').click(function() {
        
		if ($('#trusted_cmd_id').val() == '') {
              addTrustedCmd()
		}
        else {
               editTrustedCmd($('#trusted_cmd_id').val())
		}
        return false;
});

function gettrusted_nodo() {
	
	 $.ajax({
                type: 'GET',
                url: '../api/nodosyoutrust',
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
						var html
			
				
		if (data.trustednodoid != null) {
			
			$('#trusted_nodolist').empty();
					
					
			nodos = data.trustednodoid;
			
			$.each(nodos, function(index, nodo) {
					
											
				html=('<div data-role="collapsible" data-collapsed="true" data-inset="false" data-iconpos="right">') 
				
					
				html=html+(	'<h3>'+nodo.description+'</h3>' +				
				'<a href="javascript:findTrustedNodo('+nodo.id+')" data-role="button" data-icon="edit" data-ajax="false">Edit</a>' +
				'<a href="javascript:gettrusted_cmd('+nodo.id+')" data-role="button" data-icon="edit" data-ajax="false">Allowed Events</a>' +
				'<a href="javascript:confirmDeleteTrustedNodo('+nodo.id+')" data-role="button"  data-icon="delete" data-rel="dialog">Delete</a>');
				
				

				html=html+('</div>');
				
				$('#trusted_nodolist').append(html);
			
										
											
			});
			
			
			$('#trusted_nodolist').trigger('create');
			
			
			
		}
		else {
				
				$('#trusted_nodolist').append('No Trusted Nodo\'s defined...');
				                       
		}
                }
        });

	
}

function gettrusted_cmd(id) {

	$("#trusted_cmd_trusted_id").val(id);
    
	$.mobile.loading( "show");
	
	 $.ajax({
                type: 'GET',
                url: '../api/cmdsyoutrust/'+id,
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
                    var html
			
				
		if (data.trustedcmds != '') {
			
			$('#trusted_cmdlist').empty();
					
					
			trustedcmds = data.trustedcmds;
			
			$.each(trustedcmds, function(index, trustedcmd) {
					
											
				html=('<div data-role="collapsible" data-collapsed="true" data-inset="false" data-iconpos="right">') 
				
					
				html=html+(	'<h3>'+trustedcmd.description+'</h3>' +
				
				
				'<a href="javascript:findTrustedCmd('+trustedcmd.id+')" data-role="button" data-icon="edit" data-ajax="false">Edit</a>' +
				'<a href="javascript:confirmDeleteTrustedCmd('+trustedcmd.id+')" data-role="button"  data-icon="delete" data-rel="dialog">Delete</a>');
				
				

				html=html+('</div>');
				$('#trusted_cmdlist').append(html);
			
										
											
			});
			
			
			$('#trusted_cmd_page_refreshed').val('No');
			
			
			//$('#trusted_cmdlist').append(html);	
					
			$('#trusted_cmdlist').trigger('create');
			$.mobile.changePage( "#trusted_cmd_page", { transition: "none"} );
			$.mobile.loading("hide"); 
			
			
		}
		else {
			$('#trusted_cmdlist').empty();
			$('#trusted_cmd_page_refreshed').val('No');	
			$('#trusted_cmdlist').append('<B>No Trusted Cmd\'s defined...</B>');
			html='<a href="#" id="trusted_cmd_page_back" data-role="button" data-icon="back" data-rel="back" >Back</a>';
			$('#trusted_cmdlist').append(html);	
			$('#trusted_cmdlist').trigger('create');
			$.mobile.loading("hide");
			$.mobile.changePage( "#trusted_cmd_page", { transition: "none"} );			
				                       
		}    
                }
        });

	
}

function confirmDeleteTrustedNodo(id) {
	
	$('#delete_message_trusted_nodo').empty();
	$('#delete_button_trusted_nodo').empty();
	$('#delete_message_trusted_nodo').append('Delete trusted Nodo?');
	$('#trusted_nodo_popup_delete').popup("open");
	$('#delete_button_trusted_nodo').append('<a href="javascript:DeleteTrustedNodo('+id+')" id="ok_delete" data-role="button" data-inline="true" >Delete</a> ');
    $('#trusted_nodo_popup_delete').trigger("create");
}

function confirmDeleteTrustedCmd(id) {
	
	$('#delete_message_trusted_cmd').empty();
	$('#delete_button_trusted_cmd').empty();
	$('#delete_message_trusted_cmd').append('Delete trusted cmd?');
	$('#trusted_cmd_popup_delete').popup("open");
	$('#delete_button_trusted_cmd').append('<a href="javascript:DeleteTrustedCmd('+id+')" id="ok_delete" data-role="button" data-inline="true" >Delete</a> ');
    $('#trusted_cmd_popup_delete').trigger("create");
}

function DeleteTrustedNodo(id) {

$.ajax({
        type: 'DELETE',
        url: '../api/nodosyoutrust/' + id,
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
          gettrusted_nodo();
		  $('#trusted_nodo_popup_delete').popup("close");
		  
		
        }
    });
}

function DeleteTrustedCmd(id) {

$.ajax({
        type: 'DELETE',
        url: '../api/cmdyoutrust/' + id,
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
          gettrusted_cmd($('#trusted_cmd_trusted_id').val());
		  $('#trusted_cmd_popup_delete').popup("close");
		  
		
        }
    });
}

function newTrustedNodo() {
        
		currentTrustedNodo = {};
        renderTrustedNodoDetails(currentTrustedNodo); // Display empty form
		$.mobile.changePage( "#trusted_nodo_form_page", { transition: "none"} );
		pagetitle = 'Setup: Add Trusted Nodo';
		$('#header_setup_trusted_nodo_form').empty();
		$('#header_setup_trusted_nodo_form').append('<div id="nodostate">'+pagetitle+'</div>');
		
}

function newTrustedCmd() {
        
		currentTrustedCmd = {};
        renderTrustedCmdDetails(currentTrustedCmd); // Display empty form
		$.mobile.changePage( "#trusted_cmd_form_page", { transition: "none"} );
		pagetitle = 'Setup: Add Trusted Event';
		$('#header_setup_trusted_cmd_form').empty();
		$('#header_setup_trusted_cmd_form').append('<div id="nodostate">'+pagetitle+'</div>');
		
}

function findTrustedNodo(id) {
       $.mobile.loading( "show");
        $.ajax({
                type: 'GET',
                url: '../api/nodosyoutrust/' + id,
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
                        currentTrustedNodo = data;
                        renderTrustedNodoDetails(currentTrustedNodo);
						pagetitle = 'Setup: Edit Trusted Nodo';
						$('#header_setup_trusted_nodo_form').empty();
						$('#header_setup_trusted_nodo_form').append('<div id="nodostate">'+pagetitle+'</div>');
						$.mobile.changePage( "#trusted_nodo_form_page", { transition: "none"} );
                }
        });
}

function findTrustedCmd(id) {
       $.mobile.loading( "show");
        $.ajax({
                type: 'GET',
                url: '../api/cmdyoutrust/' + id,
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
                        currentTrustedCmd = data;
                        renderTrustedCmdDetails(currentTrustedCmd);
						pagetitle = 'Setup: Edit Trusted event';
						$('#header_setup_trusted_cmd_form').empty();
						$('#header_setup_trusted_cmd_form').append('<div id="nodostate">'+pagetitle+'</div>');
						$.mobile.changePage( "#trusted_cmd_form_page", { transition: "none"} );
                }
        });
}

function addTrustedNodo() {
		
		$.mobile.loading( "show");
        
        $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: '../api/nodosyoutrust',
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
                data: formToJSONTrustedNodo(),
                success: function(data, textStatus, jqXHR){
                      $.mobile.loading( "hide");
					  gettrusted_nodo()
					  $.mobile.changePage( "#trusted_nodo_page", { transition: "none"} );
                }
        });
}

function addTrustedCmd() {
		
		$.mobile.loading( "show");
        
        $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: '../api/cmdyoutrust',
                dataType: "json",
                data: formToJSONTrustedCmd(),
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
					   gettrusted_cmd($('#trusted_cmd_trusted_id').val());
					  $.mobile.changePage( "#trusted_nodo_page", { transition: "none"} );
                }
        });
}



function editTrustedNodo(id) {
		
		$.mobile.loading( "show");
        
        $.ajax({
                type: 'PUT',
                contentType: 'application/json',
                url: '../api/nodosyoutrust/' + id,
                dataType: "json",
                data: formToJSONTrustedNodo(),
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
					  gettrusted_nodo()
					  $.mobile.changePage( "#trusted_nodo_page", { transition: "none"} );
                }
        });
}

function editTrustedCmd(id) {
		
		$.mobile.loading( "show");
        
        $.ajax({
                type: 'PUT',
                contentType: 'application/json',
                url: '../api/cmdyoutrust/' + id,
                dataType: "json",
                data: formToJSONTrustedCmd(),
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
					  gettrusted_cmd($('#trusted_cmd_trusted_id').val());
					  $.mobile.changePage( "#trusted_cmd_page", { transition: "none"} );
                }
        });
}

function renderTrustedNodoDetails(TrustedNodo) {
        
		$('#trusted_nodo_form_refreshed').val('No');
		$('#trusted_nodo_id').val(TrustedNodo.id);
		$('#trusted_nodo_description').val($("<div>").html(TrustedNodo.description).text());
        $('#trusted_nodo_nodo_id').val($("<div>").html(TrustedNodo.nodo_id).text());
        
		
}

function renderTrustedCmdDetails(TrustedCmd) {
	
	if (TrustedCmd.r_cmd != '' && TrustedCmd.r_cmd != undefined ) {cmd = TrustedCmd.r_cmd+' ';} else {cmd = '';}
	if (TrustedCmd.r_par1 != '' && TrustedCmd.r_par1 != undefined ) {par1 = TrustedCmd.r_par1;} else {par1 = '';}
	if (TrustedCmd.r_par2 != '' && TrustedCmd.r_par2 != undefined) {par2 = ',' + TrustedCmd.r_par2;} else {par2 = '';}
	if (TrustedCmd.r_par3 != '' && TrustedCmd.r_par3 != undefined) {par3 = ',' + TrustedCmd.r_par3;} else {par3 = '';}
	if (TrustedCmd.r_par4 != '' && TrustedCmd.r_par4 != undefined) {par4 = ',' + TrustedCmd.r_par4;} else {par4 = '';}
	if (TrustedCmd.r_par5 != '' && TrustedCmd.r_par5 != undefined) {par5 = ',' + TrustedCmd.r_par5;} else {par5 = '';}


        
	$('#trusted_cmd_form_refreshed').val('No');
	$('#trusted_cmd_id').val(TrustedCmd.id);
	//$('#trusted_cmd_trusted_id').val(TrustedCmd.trusted_id);
	$('#trusted_cmd_description').val($("<div>").html(TrustedCmd.description).text());
	$('#trusted_cmd_trusted_event').val(cmd+par1+par2+par3+par4+par5);
	$('#trusted_cmd_cmd').val(TrustedCmd.s_cmd);
	
		
}

// Helper function to serialize all the form fields into a JSON string
function formToJSONTrustedNodo() {
        return JSON.stringify({
                "id": $('#trusted_nodo_id').val(),
				"description": $('#trusted_nodo_description').val(),
				"nodo_id": $('#trusted_nodo_nodo_id').val()
				
		});
				
}

// Helper function to serialize all the form fields into a JSON string
function formToJSONTrustedCmd() {
        
	var commandraw = $('#trusted_cmd_trusted_event').val();
	var commandarr = commandraw.split(/[ ,]+/);
		
	if (commandarr[0] != undefined) {command = commandarr[0];} else {command='';}
	if (commandarr[1] != undefined) {par1 = commandarr[1];} else {par1='';}
	if (commandarr[2] != undefined) {par2 = commandarr[2];} else {par2='';}
	if (commandarr[3] != undefined) {par3 = commandarr[3];} else {par3='';}
	if (commandarr[4] != undefined) {par4 = commandarr[4];} else {par4='';}
	if (commandarr[5] != undefined) {par5 = commandarr[5];} else {par5='';}
		
	return JSON.stringify({
			"trusted_id": $('#trusted_cmd_trusted_id').val(),
			"description": $('#trusted_cmd_description').val(),
			"r_cmd": command,
			"r_par1": par1,
			"r_par2": par2,
			"r_par3": par3,
			"r_par4": par4,
			"r_par5": par5,
			"s_cmd": $('#trusted_cmd_cmd').val()
			
	});
				
}





