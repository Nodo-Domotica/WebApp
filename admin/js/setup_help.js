$('#help_page').on('pageinit', function(event) {
		
	Nodo_State();
	checkSession();
	gethelp();
		
});


$('#help_page').on('pageshow', function(event) {
	
	pagetitle = 'Setup: help';
	$('#header_setup_help').append('<div id="nodostate">'+pagetitle+'</div>');
	

});

$('#help_page').on('pagehide', function(event) {
	
	$('#header_setup_help').empty();

});

$('#help_form_page').on('pageshow', function(event) {
		
	

});

$('#btnAdd').click(function() {
        newhelp();
		return false;
});

$('#btnSave').click(function() {
        
		if ($('#id').val() == '') {
              addhelp()
		}
        else {
               edithelp($('#id').val())
		}
        return false;
});


function gethelp() {

	$.getJSON('../api/helptext', function(data) {
	
	
			
				
		if (data != null) {
		
			$('#helplist').empty();
			
			
			
			$.each(data, function(index, help) {
								
							
					$('#helplist').append('<li><a href="javascript:findhelp('+help.help_key+')">Key: '+help.help_key+'</a></li>') ;
					
											
			});
			
			
			$('#helplist').listview('refresh');
			
			
			
		}
		else {
				
				$('#helplist').append('No help defined...');
				                       
		}
	});
}



function findhelp(id) {
       $.mobile.loading( "show");
        $.ajax({cache: false,
                type: 'GET',
                url: '../api/helptext/' + id,
                dataType: "json",
                success: function(data){
                        $.mobile.loading( "hide");                    
                        currenthelp = data;
                        renderDetails(currenthelp);
						pagetitle = 'Setup: Edit help';
						//$('#header_setup_help_form').empty();
						//$('#header_setup_help_form').append('<div id="nodostate">'+pagetitle+'</div>');
						$.mobile.changePage( "#help_form_page", { transition: "none"} );
                }
        });
}


function edithelp(id) {
		
		$.mobile.loading( "show");
        
        $.ajax({cache: false,
                type: 'PUT',
                contentType: 'application/json',
                url: '../api/helptext/' + id,
                dataType: "json",
                data: formToJSON(),
                success: function(data, textStatus, jqXHR){
                      $.mobile.loading( "hide");
					  gethelp()
					  $.mobile.changePage( "#help_page", { transition: "none"} );
                },
                error: function(jqXHR, textStatus, errorThrown){
                        alert('edithelp error: ' + textStatus);
                }
        });
}

function renderDetails(help) {
		
	

	
			
			$('#id').val(help.help_key);
			$('#help_text').val(help.help_text);
			
			
			
			
				
			
			
			
			
	
       
		
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {

    

        return JSON.stringify({
                "id": $('#id').val(),
				"help_text": $('#help_text').val()
				
		});
				
}




	



