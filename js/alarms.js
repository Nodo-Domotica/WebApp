
function editAlarm(nr) {		
		
		$.getJSON('api/alarms/' + nr, function(data) {
		alarms = data.alarm;
				
			
			$.each(alarms, function(index, alarm) {
				
				$('#alarmnr').val(nr);
				$('#state').val(alarm.state);
				$('#state').change();
				$('#time').val(alarm.hour+':'+alarm.minute);
				$('#day').val(alarm.day);
				$('#day').change();
				$('#day').selectmenu('refresh', true);
							
									
			});
			
			$( "#alarm_setting_panel" ).panel( "open" );		
	    });
	
};

$('#save').click(function( e ) {

	
	var time = $('#time').val().split(":");
	var hour = time[0]; 
	var minute = time[1];

	$response=send_event('alarmset '+$('#alarmnr').val()+','+$('#state').val()+','+hour+minute+','+$('#day').val());

	//alert ('Alarm setting send to Nodo... Nodo response: '+$response);
	
	//alert (hour+minute);
	
    $( "#alarm_setting_panel" ).panel( "close" );	
	

});


$('#hour').keyup(function() {
	if (this.value.match(/[^*0-9 ]/g)) {
		this.value = this.value.replace(/[^*0-9 ]/g, '');
	}
});

$('#minute').keyup(function() {
	if (this.value.match(/[^*0-9 ]/g)) {
		this.value = this.value.replace(/[^*0-9 ]/g, '');
	}
	
	
});