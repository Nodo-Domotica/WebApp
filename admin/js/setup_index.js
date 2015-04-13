$('#setup_page').on('pageinit', function(event) {
	
	
	if (usergroup == 'admin') {
		
		$('#listviewsetup').append('<li data-role="list-divider">WebApp Administrator links</li>' +
		'<li data-icon="star"><a href="../webapp_admin/user_list.php" data-ajax="false">User list</a></li>'+
		'<li data-icon="star"><a href="help.html" data-ajax="false">Edit help text</a></li>');
		
		$('#listviewsetup').listview('refresh');
		
	}
});

$('#setup_page').on('pageshow', function(event) {
	
	pagetitle='Setup';
	
	
    $('#header_setup_index').append('<div id="nodostate">'+pagetitle+'</div>');
	Nodo_State();
	
});