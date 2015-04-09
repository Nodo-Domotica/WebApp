

function help_text(key,div) {

	$.getJSON('../api/helptext/'+key, function(data) {
												
						
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
			
	});				
			

	
	
	
	

}