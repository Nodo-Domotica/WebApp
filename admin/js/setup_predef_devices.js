
$('#device1_page').on('pageinit', function(event) {
		
	
	Nodo_State();
	getGroups('device1_group');
	
		
});

$('#device1_page').on('pageshow', function(event) {
	
	pagetitle = 'Setup: Add KAKU';
	$('#header_setup_device1').append('<div id="nodostate">'+pagetitle+'</div>');
	

});



$('#device1_page').on('pagehide', function(event) {
	
	$('#header_setup_device1').empty();
});

$('#device1_btnSave').click(function() {
        
		addPredefinedObject($('#device1_description').val(),groupSelection('device1_group'),'16','1','1',$('#device1_kaku').val());
		
		return false;
});

$('#device2_page').on('pageinit', function(event) {
		
	
	Nodo_State();
	getGroups('device2_group');
	
		
});

$('#device2_page').on('pageshow', function(event) {
	
	pagetitle = 'Setup: Add NewKAKU';
	$('#header_setup_device2').append('<div id="nodostate">'+pagetitle+'</div>');
	
});



$('#device2_page').on('pagehide', function(event) {
	
	$('#header_setup_device2').empty();
});

$('#device2_btnSave').click(function() {
        
		addPredefinedObject($('#device2_description').val(),groupSelection('device2_group'),'16','1','2',$('#device2_kaku').val(),$('#device2_dim').val());
		
		return false;
});

$('#device3_page').on('pageinit', function(event) {
		
	
	Nodo_State();
	getGroups('device3_group');
	
		
});

$('#device3_page').on('pageshow', function(event) {
	
	pagetitle = 'Setup: Add Sensor';
	$('#header_setup_device3').append('<div id="nodostate">'+pagetitle+'</div>');
	
});

$('#device3_page').on('pagehide', function(event) {
	
	$('#header_setup_device3').empty();
});

function addPredefinedObject(description,group,icon,type,cmdtype,cmdvar1,cmdvar2,cmdvar3,cmdvar4,cmdvar5) {
		
		var object = JSON.stringify({
        "device_description": description,
        "device_group": group,
		"device_icon": icon,
		"device_type": type
    });
        
		
		$.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: '../api/devices',
				dataType: "json",
				
                data: object,
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
                
				//objectId=data.id;
				//alert(JSON.stringify(data.id));
				NewCommand(data.id,cmdtype,cmdvar1,cmdvar2,cmdvar3,cmdvar4,cmdvar5);
				
				 getDevices();
				 $.mobile.changePage( "#devices_page", { transition: "none"} );
			
					
					
                }
        });
		
		
}


function addPredefinedCmd(Cmd) {
		
		
		$.mobile.loading( "show");
        
		
		$.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: '../api/devicecmd',
				async: false,
                dataType: "json",
                data: Cmd,
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
					 
					
                }
        });
		
		
}



function Cmdscript() {


        
var lines = $('#scriptcontent').val().match(/.+/g);
for(var i = 0;i < lines.length;i++){
    //code here using lines[i] which will give you each line
	str = lines[i];
	str = str.replace(/"/gi, "");
	res = str.split(",")
	//alert (lines[i]);
	
		newPredefCmd(res[0],res[1],res[2],res[3],res[4],res[5],res[6],res[7],res[8],res[9],res[10],res[11]);
	
}
        
};

function NewCommand(objectid,device_type,var1,var2,var3,var4,var5) {

	if (device_type == 1) { //kaku

	//var address=prompt("Please enter Kaku address","A1");

	newPredefCmd(objectid,"1","On","KAKUSend "+var1+",On")
	newPredefCmd(objectid,"1","Off","KAKUSend "+var1+",Off")
	newPredefCmd(objectid,"5","On","","KAKU "+var1+",On","*","","17")
	newPredefCmd(objectid,"5","Off","","KAKU "+var1+",Off","*","","16")

	}
	
	if (device_type == 2) { //newkaku
	
		if (var2 == 0) {

		//objectid,type,description,command,event,unit_event,state_template,indicator,indicator_text,webapp_par1,webapp_par2,webapp_par3,webapp_par4
			

			newPredefCmd(objectid,"1","On","NewKAKUSend "+var1+",On")
			newPredefCmd(objectid,"1","Off","NewKAKUSend "+var1+",Off")
			newPredefCmd(objectid,"5","On","","NewKAKU "+var1+",On","*","","17")
			newPredefCmd(objectid,"5","Off","","NewKAKU "+var1+",Off","*","","16")
		}
		else if (var2 == 1) { //dim
			newPredefCmd(objectid,"1","On","NewKAKUSend "+var1+",On")
			newPredefCmd(objectid,"1","Off","NewKAKUSend "+var1+",Off")
			newPredefCmd(objectid,"2","Dim","NewKAKUSend "+var1+",[slider]","NewKAKUSend "+var1+",*","*","[par2]","","","1","16","1")
			newPredefCmd(objectid,"5","Dim","","NewKAKU "+var1+",*","*","","17")
			newPredefCmd(objectid,"5","On","","NewKAKU "+var1+",On","*","","17")
			newPredefCmd(objectid,"5","Off","","NewKAKU "+var1+",Off","*","","16")
			
		}
	
	}
	
	if (device_type == 3) {  //rgbled
			newPredefCmd(objectid,"3","Colorpicker","rgbledsend "+var1+",[R],[G],[B]")
			newPredefCmd(objectid,"5","On","","RGBLed *,*,*","*","","17")
			newPredefCmd(objectid,"5","Off","","RGBLed 0,0,0","*","","16")
	

	}



}



function newPredefCmd(objectid,type,description,command,event,unit_event,state_template,indicator,indicator_text,webapp_par1,webapp_par2,webapp_par3,webapp_par4) {
			
			if (event !=undefined) {
				var eventraw = event;
				var eventarr = eventraw.split(/[ ,]+/);
							
				if (eventarr[0] != undefined) {command_event = eventarr[0];} else {command_event='';}
				if (eventarr[1] != undefined) {par1_event = eventarr[1];} else {par1_event='';}
				if (eventarr[2] != undefined) {par2_event = eventarr[2];} else {par2_event='';}
				if (eventarr[3] != undefined) {par3_event = eventarr[3];} else {par3_event='';}
				if (eventarr[4] != undefined) {par4_event = eventarr[4];} else {par4_event='';}
				if (eventarr[5] != undefined) {par5_event = eventarr[5];} else {par5_event='';}
			
			}
			else {
				command_event='';
				par1_event='';
				par2_event='';
				par3_event='';
				par4_event='';
				par5_event='';
			}
			
			
			
			if (description == null) {description = "";}
			if (command == null) {command = "";}
			if (unit_event == null) {unit_event = "";}
			if (indicator == null) {indicator = "";}
			if (indicator_text == null) {indicator_text = "";}
			if (webapp_par1 == null) {webapp_par1 = "";}
			if (webapp_par2 == null) {webapp_par2 = "";}
			if (webapp_par3 == null) {webapp_par3 = "";}
			if (webapp_par4 == null) {webapp_par4 = "";}
			
		
		Cmd = JSON.stringify({
		
			
	
			//"device_cmd_id": $('#device_cmd_id').val(),
			"device_cmd_object_id": objectid,
			"device_cmd_type": type,
			"device_cmd_description": description,
			"device_cmd_cmd": command,
			"device_cmd_unit_event": unit_event,
			"device_cmd_cmd_event": command_event,
			"device_cmd_par1_event": par1_event,
			"device_cmd_par2_event": par2_event,
			"device_cmd_par3_event": par3_event,
			"device_cmd_par4_event": par4_event,
			"device_cmd_par5_event": par5_event,
			"device_cmd_state_template": state_template,
			"device_cmd_indicator": indicator,
			"device_cmd_indicator_text": indicator_text,
			"device_cmd_formula": "",
			"device_cmd_round": "",
			"device_cmd_value": "",
			"device_cmd_webapp_par1": webapp_par1,
			"device_cmd_webapp_par2": webapp_par2,
			"device_cmd_webapp_par3": webapp_par3,
			"device_cmd_webapp_par4": webapp_par4
		});
       
		addPredefinedCmd(Cmd);
		//alert(Cmd);
		
		
}


	
