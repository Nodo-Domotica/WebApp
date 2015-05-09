
function editAlarm(nr) {	

$.ajax({cache: false, 
		 url: 'api/alarms/' + nr,
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
					
				}
				},
         success: function(data) {
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
		
		
	
			
			
			
	}	
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