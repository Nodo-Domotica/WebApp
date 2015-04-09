var alarm_counter = 0;
var page_refresh;

$( function() {
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
		url : "/api2/login",
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



$('#device_btnAdd').click(function () {

	newDevice()
	return false;
});

$('#device_btnSave').click(function () {

	if ($('#object_id').val() == '') {
		addDevice()
	} else {
		editDevice($('#object_id').val())
	}
	return false;
});

$('#device_cmd_btnAdd').click(function () {

	newDeviceCmd($('#hidden_device_type').val())
	return false;
});

$('#device_cmd_btnSave').click(function () {

	if ($('#device_cmd_id').val() == '') {
		addDeviceCmd($('#hidden_device_type').val())
	} else {
		editDeviceCmd($('#device_cmd_id').val(), $('#hidden_device_type').val())
	}
	return false;
});

function groupSelection(div) {

	var groupSelection = '';

	div = '#' + div;

	$(div + ' input[type=checkbox]').each(function () {

		if ($(this).is(':checked')) {

			groupSelection = groupSelection + 'XX' + $(this).val() + 'XX,';

		}
	});
	return groupSelection.replace(/,+$/, ""); //laatste comma verwijderen
}

function formToJSONDevice() {

	return JSON.stringify({
		"device_description" : $('#device_description').val(),
		"device_group" : groupSelection('group_select_div'),
		"device_icon" : $('#device_icon').val(),
		"device_type" : $('#device_type').val()
	});
}

function formToJSONDeviceCmd() {

	var eventraw = $('#device_cmd_event').val();
	var eventarr = eventraw.split(/[ ,]+/);

	if (eventarr[0] != undefined) {
		command_event = eventarr[0];
	} else {
		command_event = '';
	}
	if (eventarr[1] != undefined) {
		par1_event = eventarr[1];
	} else {
		par1_event = '';
	}
	if (eventarr[2] != undefined) {
		par2_event = eventarr[2];
	} else {
		par2_event = '';
	}
	if (eventarr[3] != undefined) {
		par3_event = eventarr[3];
	} else {
		par3_event = '';
	}
	if (eventarr[4] != undefined) {
		par4_event = eventarr[4];
	} else {
		par4_event = '';
	}
	if (eventarr[5] != undefined) {
		par5_event = eventarr[5];
	} else {
		par5_event = '';
	}

	return JSON.stringify({

		"device_cmd_id" : $('#device_cmd_id').val(),
		"device_cmd_object_id" : $('#device_cmd_object_id').val(),
		"device_cmd_description" : $('#device_cmd_description').val(),
		"device_cmd_cmd" : $('#device_cmd_cmd').val(),
		"device_cmd_unit_event" : $('#device_cmd_unit_event').val(),
		"device_cmd_cmd_event" : command_event,
		"device_cmd_par1_event" : par1_event,
		"device_cmd_par2_event" : par2_event,
		"device_cmd_par3_event" : par3_event,
		"device_cmd_par4_event" : par4_event,
		"device_cmd_par5_event" : par5_event,
		"device_cmd_state_template" : $('#device_cmd_state_template').val(),
		"device_cmd_type" : $('#device_cmd_type').val(),
		"device_cmd_indicator" : $('#device_cmd_indicator').val(),
		"device_cmd_indicator_text" : $('#device_cmd_indicator_text').val(),
		"device_cmd_indicator_placeholder_id" : $('#indicator_placeholder_select').val(),

		"device_cmd_webapp_par1" : $('#device_cmd_webapp_par1').val(),
		"device_cmd_webapp_par2" : $('#device_cmd_webapp_par2').val(),
		"device_cmd_webapp_par3" : $('#device_cmd_webapp_par3').val(),
		"device_cmd_webapp_par4" : $('#device_cmd_webapp_par4').val(),
		"device_cmd_value" : $('#device_cmd_value').val(),
		"device_cmd_formula" : $('#device_cmd_formula').val(),
		"device_cmd_round" : $('#device_cmd_round').val()

	});

}

function newDevice() {

	currentDevice = {};
	renderDeviceDetails(currentDevice); // Display empty form
	$.mobile.changePage("#device_form_page", {
		transition : "none"
	});
	pagetitle = 'Setup: Add Object';
	$('#header_setup_device_form').empty();
	$('#header_setup_device_form').append('<div id="nodostate">' + pagetitle + '</div>');

}

function addDevice() {

	$.mobile.loading("show");

	$.ajax({
		type : 'POST',
		contentType : 'application/json',
		url : '../api2/devices',
		dataType : "json",
		data : formToJSONDevice(),
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
			getDevices();
			$.mobile.changePage("#devices_page", {
				transition : "none"
			});
		}
	});
}

function editDevice(id) {

	$.mobile.loading("show");

	$.ajax({
		type : 'PUT',
		contentType : 'application/json',
		url : '../api2/devices/' + id,
		dataType : "json",
		data : formToJSONDevice(),
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
			getDevices()
			$.mobile.changePage("#devices_page", {
				transition : "none"
			});
		}
	});
}

function findDevice(id) {
	$.mobile.loading("show");
	$.ajax({
		type : 'GET',
		url : '../api2/devices/' + id,
		dataType : "json",
		beforeSend : function(xhr) {
			 
				var user = decodeURIComponent(getCookie("USERID"));
				var password = decodeURIComponent(getCookie("TOKEN"));
			 	var words  = CryptoJS.enc.Utf8.parse(user + ":" + password);
				var base64 = CryptoJS.enc.Base64.stringify(words);
                
				xhr.setRequestHeader("Authorization", "Basic " + base64);
	            },
				error : function(xhr, ajaxOptions, thrownError) {
				
				console.log(thrownError);
				if (xhr.status==403) { 
					$.mobile.loading( "hide");
					//$('#popupLogin').popup();
					$('#popupLogin').popup("open");
					
				}
				},
		success : function (data) {
			$.mobile.loading("hide");
			currentDevice = data;
			renderDeviceDetails(currentDevice);
			pagetitle = 'Setup: Edit Object';
			$('#header_setup_device_form').empty();
			$('#header_setup_device_form').append('<div id="nodostate">' + pagetitle + '</div>');
			$.mobile.changePage("#device_form_page", {
				transition : "none"
			});

		}
	});
}

function newDeviceCmd(deviceType) {

	currentDeviceCmd = {};
	renderDeviceCmdDetails(currentDeviceCmd, deviceType); // Display empty form
	$.mobile.changePage("#device_cmd_form_page", {
		transition : "none"
	});
	pagetitle = 'Setup: Add Object item';
	$('#header_setup_device_cmd_form').empty();
	$('#header_setup_device_cmd_form').append('<div id="nodostate">' + pagetitle + '</div>');
	// $('#device_cmd_type').selectmenu("enable");

}

function addDeviceCmd(deviceType) {

	$.mobile.loading("show");

	$.ajax({
		type : 'POST',
		contentType : 'application/json',
		url : '../api2/devicecmd',
		dataType : "json",
		data : formToJSONDeviceCmd(),
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
			getDeviceCmds(0, $('#device_cmd_object_id').val(), deviceType);
			$.mobile.changePage("#device_cmd_page", {
				transition : "none"
			});

		}
	});
}

function editDeviceCmd(id, deviceType) {

	$.mobile.loading("show");

	$.ajax({
		type : 'PUT',
		contentType : 'application/json',
		url : '../api2/devicecmd/' + id,
		dataType : "json",
		data : formToJSONDeviceCmd(),
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
			getDeviceCmds(0, $('#device_cmd_object_id').val(), deviceType);
			$.mobile.changePage("#devices_cmd_page", {
				transition : "none"
			});
		}
	});
}

function findDeviceCmd(id, deviceType) {
	$.mobile.loading("show");
	$.ajax({
		type : 'GET',
		url : '../api2/devicecmd/' + id,
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
		success : function (data) {
			$.mobile.loading("hide");
			currentDeviceCmd = data;
			renderDeviceCmdDetails(currentDeviceCmd, deviceType, true);
			pagetitle = 'Setup: Edit Object item';
			$('#header_setup_device_cmd_form').empty();
			$('#header_setup_device_cmd_form').append('<div id="nodostate">' + pagetitle + '</div>');
			$.mobile.changePage("#device_cmd_form_page", {
				transition : "none"
			});
			//$('#device_cmd_type').selectmenu("disable");


		}
	});
}

function renderDeviceDetails(device) {
	
	$('#device_refreshed').val('No');
	$('#object_id').val(device.id);
	$('#device_description').val($("<div>").html(device.description).text());

	$('#group_select_div input[type=checkbox]').each(function () {

		$(this).prop("checked", false).checkboxradio('refresh'); //alle checkboxen leegmaken

	});

	var group = device.group_id;
	if (group != null) {
		var groupRes = group.split(",");
		for (var i = 0; i < groupRes.length; i++) {

		$('#id' + groupRes[i]).prop("checked", true).checkboxradio('refresh');
	}
	}
	
	//for loop
	

	if (device.type != undefined) {
		$('#device_type').val(device.type);
		$('#device_type').change();
	}
	$('#device_icon').val(device.icon);
	$('#device_icon').change();
}

function renderDeviceCmdDetails(devicecmd, deviceType, typeDisabled) {

	console.log($("#device_cmd_object_id").val());

	if (typeDisabled == true) { //Bij aanpassen type disable. Het heeft geen nut om het type te wijzigen indien het object al bestaat.
		$("#device_cmd_type").selectmenu().selectmenu("disable");
	} else {
		$("#device_cmd_type").selectmenu().selectmenu("enable");
	}

	if (devicecmd.cmd_event != '' && devicecmd.cmd_event != undefined) {
		cmd_event = devicecmd.cmd_event + ' ';
	} else {
		cmd_event = '';
	}
	if (devicecmd.par1_event != '' && devicecmd.par1_event != undefined) {
		par1_event = devicecmd.par1_event;
	} else {
		par1_event = '';
	}
	if (devicecmd.par2_event != '' && devicecmd.par2_event != undefined) {
		par2_event = ',' + devicecmd.par2_event;
	} else {
		par2_event = '';
	}
	if (devicecmd.par3_event != '' && devicecmd.par3_event != undefined) {
		par3_event = ',' + devicecmd.par3_event;
	} else {
		par3_event = '';
	}
	if (devicecmd.par4_event != '' && devicecmd.par4_event != undefined) {
		par4_event = ',' + devicecmd.par4_event;
	} else {
		par4_event = '';
	}
	if (devicecmd.par5_event != '' && devicecmd.par5_event != undefined) {
		par5_event = ',' + devicecmd.par5_event;
	} else {
		par5_event = '';
	}

	$('#device_cmd_id').val(devicecmd.id);
	$('#hidden_device_type').val(deviceType);
	$('#device_cmd_description').val($("<div>").html(devicecmd.description).text());

	if (devicecmd.indicator_icon != undefined) {
		$('#device_cmd_indicator').val(devicecmd.indicator_icon);
		$('#device_cmd_indicator').change();
	} else {
		$('#device_cmd_indicator').val('0');
		$('#device_cmd_indicator').change();
	}

	$('#device_cmd_indicator_text').val($("<div>").html(devicecmd.indicator_text).text());

	$('#device_cmd_unit').val(devicecmd.unit);
	$('#device_cmd_cmd').val(devicecmd.command);
	$('#device_cmd_unit_event').val(devicecmd.unit_event);
	$('#device_cmd_event').val(cmd_event + par1_event + par2_event + par3_event + par4_event + par5_event);
	$('#device_cmd_state_template').val(devicecmd.state_template);
	$('#device_cmd_webapp_par1').val(devicecmd.webapp_par1);
	$('#device_cmd_webapp_par2').val(devicecmd.webapp_par2);
	$('#device_cmd_webapp_par3').val(devicecmd.webapp_par3);
	$('#device_cmd_webapp_par4').val(devicecmd.webapp_par4);
	$('#device_cmd_formula').val(devicecmd.formula);
	$('#device_cmd_round').val(devicecmd.round);
	$('#device_cmd_value').val(devicecmd.value);

	if (deviceType == 1) {

		$('#device_cmd_type').empty();
		$('#device_cmd_type').append('<option value="1">Button</option>');
		$('#device_cmd_type').append('<option value="2">Slider</option>');
		$('#device_cmd_type').append('<option value="4">Spinbox</option>');
		$('#device_cmd_type').append('<option value="3">Color picker</option>');
		$('#device_cmd_type').append('<option value="5">Indicator</option>');
		$('#device_cmd_type').append('<option value="6">Indicator placeholder</option>');
		$('#device_cmd_type').append('<option value="99">Line</option>');
		$('#device_cmd_type').selectmenu("refresh");
		$('#device_cmd_type').val('1');
		$('#device_cmd_type').change();
	}

	if (deviceType == 2) {

		$('#device_cmd_type').empty();
		$('#device_cmd_type').append('<option value="1">Button</option>');
		$('#device_cmd_type').append('<option value="5">Indicator</option>');
		$('#device_cmd_type').append('<option value="99">Empty space</option>');
		$('#device_cmd_type').selectmenu("refresh");
		$('#device_cmd_type').val('1');
		$('#device_cmd_type').change();
	}

	if (deviceType == 3) {

		$('#device_cmd_type').empty();
		$('#device_cmd_type').append('<option value="10">Command</option>');
		$('#device_cmd_type').append('<option value="5">Indicator</option>');
		$('#device_cmd_type').selectmenu("refresh");
		$('#device_cmd_type').val('10');
		$('#device_cmd_type').change();

	}

	if (deviceType == 4) {

		$('#device_cmd_type').empty();
		$('#device_cmd_type').append('<option value="5">Indicator</option>');
		$('#device_cmd_type').selectmenu("refresh");
		$('#device_cmd_type').val('5');
		$('#device_cmd_type').change();

	}

	if (deviceType == 5) {

		$('#device_cmd_type').empty();
		$('#device_cmd_type').append('<option value="5">Indicator</option>');
		$('#device_cmd_type').append('<option value="20">Line graph</option>');
		$('#device_cmd_type').append('<option value="21">Stepped Line graph</option>');
		$('#device_cmd_type').append('<option value="30">Bar graph (day totals)</option>');
		$('#device_cmd_type').append('<option value="31">Bar graph (week totals)</option>');
		$('#device_cmd_type').append('<option value="32">Bar graph (month totals)</option>');
		$('#device_cmd_type').append('<option value="120">Linked Line graph</option>');
		$('#device_cmd_type').append('<option value="121">Linked Stepped Line graph</option>');
		$('#device_cmd_type').append('<option value="130">Linked Bar graph (day totals)</option>');
		$('#device_cmd_type').append('<option value="131">Linked Bar graph (week totals)</option>');
		$('#device_cmd_type').append('<option value="132">Linked Bar graph (month totals)</option>');
		//$('#device_cmd_type').val('20');
		//$('#device_cmd_type').change();
		$('#device_cmd_type').selectmenu("refresh");
	}

	if (deviceType == 6) {

		$('#device_cmd_type').empty();
		if (alarm_counter < 1) {
			$('#device_cmd_type').append('<option value="11">Alarm</option>');
			$('#device_cmd_type').append('<option value="5">Indicator</option>');
			$('#device_cmd_type').selectmenu("refresh");
			$('#device_cmd_type').val('11');
			$('#device_cmd_type').change();
		}

		if (alarm_counter >= 1) {

			$('#device_cmd_type').append('<option value="11">Alarm</option>');
			$("select > option[value='11']").hide()
			$('#device_cmd_type').append('<option value="5">Indicator</option>');
			$('#device_cmd_type').selectmenu("refresh");
			$('#device_cmd_type').val('5');
			$('#device_cmd_type').change();
		}

		if ($('#device_cmd_webapp_par1').val() != '') {
			$('#alarm').val($('#device_cmd_webapp_par1').val());
			$('#alarm').change();
		} else {
			$('#alarm').val('1');
			$('#alarm').change();
		}

		$('#alarm').val($('#device_cmd_webapp_par1').val());
		$('#alarm').change();

	}

	if (devicecmd.type != undefined) {
		$('#device_cmd_type').val(devicecmd.type);
		$('#device_cmd_type').change();
	}

	//
	show_hide_webapp_parameters(deviceType, $("#device_cmd_object_id").val(), devicecmd.indicator_placeholder_id);

}

function getGroups(div) {

	var div2 = '#' + div;

	$.ajax({
		type : 'GET',
		contentType : 'application/json',
		url : '../api2/groups',
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
			groups = data.groups;

		$(div2).empty();

		if (groups != false) {

			$(div2).html('<fieldset id="fieldset_' + div + '" data-role="controlgroup"><legend>Select groups: <a href="javascript:help_text(13,\'help_popup\')"><img src="../media/help.png"></a></legend></fieldset>');
			$.each(groups, function (index, group) {

				$('#fieldset_' + div).append('<input type="checkbox" name="group" value="' + group.id + '" id="idXX' + group.id + 'XX"><label for="idXX' + group.id + 'XX">' + group.name + '</label>');

			});

			$(div2).trigger('create');

		}
		}
	});
	
		
}

function getIndicatorPlaceholders(objectid, placeholderid) {
	
	$.ajax({
		type : 'GET',
		contentType : 'application/json',
		url : '../api2/indicatorplaceholders/' + objectid,
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
			if (data.error == null) {

			$('#indicator_placeholder_select').empty();
			$('#indicator_placeholder_select').append('<option value="0">Main object</option>');

			$.each(data, function (index, data) {

				$('#indicator_placeholder_select').append('<option value="' + data.id + '">' + data.description + '</option>');

			});

			if (placeholderid != undefined) {
				$('#indicator_placeholder_select').val(placeholderid);
				$('#indicator_placeholder_select').change();
				$('#indicator_placeholder_select_div').show();
			} else {
				$('#indicator_placeholder_select').val('0');
				$('#indicator_placeholder_select').change();
				$('#indicator_placeholder_select_div').show();
			}

		} else {

			$('#indicator_placeholder_select').empty();
			$('#indicator_placeholder_select').append('<option value="0">Main object</option>');
			$('#indicator_placeholder_select').val('0');
			$('#indicator_placeholder_select').change();
			//$('#indicator_placeholder_select_div').hide();

		}
		}
	});

	
}

function getGraphs() {
	
	$.ajax({
		type : 'GET',
		contentType : 'application/json',
		url : '../api2/graphs',
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
			$('#linked_graph').empty();
		$('#linked_graph').append('<option value="0">Select graph to link</option>');

		if (data != null) {

			$.each(data, function (index, data) {

				$('#linked_graph').append('<option value="' + data.id + '">' + data.description + '</option>');

			});

			//alert ($('#device_cmd_webapp_par4').val());

			if ($('#device_cmd_webapp_par4').val() != '') {
				$('#linked_graph').val($('#device_cmd_webapp_par4').val());
				$('#linked_graph').change();
			} else {
				$('#linked_graph').val('0');
				$('#linked_graph').change();
			}

		} else {
			$('#linked_graph').append('<option value="0">You have no graphs defined</option>');
			//$('#device_group_div').hide();
		}
		}
	});


}

$('#devices_page').on('pageinit', function (event) {

	//checkSession();
	Nodo_State();
	getDevices();
	getGroups('group_select_div');
	

});

$('#devices_page').on('pageshow', function (event) {
	
	$('#header_setup_devices').empty();
	pagetitle = 'Setup: Objects';
	$('#header_setup_devices').append('<div id="nodostate">' + pagetitle + '</div>');
	
	

});

$('#devices_page').on('pagehide', function (event) {

	$('#header_setup_devices').empty();
});

$('#device_form_page').on('pageinit', function (event) {

	Nodo_State();
	
	//checkSession();

});

$('#device_form_page').on('pageshow', function (event) {

	//als de pagina word vernieuwd gaan we terug naar de hoofdpagina.
	if (page_refresh != 'No') {

	$.mobile.changePage( "#devices_page", { transition: "none"} );
}
else {

		pagetitle = 'Setup: Add Object';
		$('#header_setup_devices').append('<div id="nodostate">' + pagetitle + '</div>');
		
	}
});

$('#device_form_page').on('pagehide', function (event) {

	$('#header_setup_devices').empty();
});

$('#device_cmd_page').on('pageshow', function (event) {


if (page_refresh != 'No') {

	$.mobile.changePage( "#devices_page", { transition: "none"} );
}
else {
	pagetitle = 'Setup: Object items';
	$('#header_setup_device_cmd').append('<div id="nodostate">' + pagetitle + '</div>');

}
});

$('#device_cmd_page').on('pagehide', function (event) {

	$('#header_setup_device_cmd').empty();
});

$('#device_cmd_form_page').on('pageshow', function (event) {

	if (page_refresh != 'No') {

	$.mobile.changePage( "#devices_page", { transition: "none"} );
}

});

$('#device_cmd_page').on('pageinit', function (event) {

	Nodo_State();
	//checkSession();
	

});

$('#device_add_page').on('pageinit', function (event) {

	//checkSession();
	Nodo_State();
	

});

$('#device_add_page').on('pageshow', function (event) {

	pagetitle = 'Setup: Select object';
	$('#header_setup_device_add').append('<div id="nodostate">' + pagetitle + '</div>');
	

});

$('#device_add_page').on('pagehide', function (event) {

	$('#header_setup_device_add').empty();
});

function getDevices(sort_id) {

	page_refresh='No';
	
	$.ajax({
		type : 'GET',
		url : '../api2/devices',
		dataType : "json",
		beforeSend : function (xhr) {

			var user = decodeURIComponent(getCookie("USERID"));
			var password = decodeURIComponent(getCookie("TOKEN"));
			var words = CryptoJS.enc.Utf8.parse(user + ":" + password);
			var base64 = CryptoJS.enc.Base64.stringify(words);

			xhr.setRequestHeader("Authorization", "Basic " + base64);
		},
		error : function (xhr, ajaxOptions, thrownError) {
			if (xhr.status == 403) {
				//$('#popupLogin').popup();
				$('#popupLogin').popup("open");
			}
		},
		success : function (data) {
			var html
		$('#devicelist').empty();

		if (data.devices != '') {

			var nrofdevices = (data.devices.length);

			var counter = 1;
			$.each(data.devices, function (index, device) {
				html = '';

				if (device.type == 1) {
					prefix = '<i>Device:</i> ';
				}
				if (device.type == 2) {
					prefix = '<i>Remote:</i> ';
				}
				if (device.type == 3) {
					prefix = '<i>Activity:</i> ';
				}
				if (device.type == 4) {
					prefix = '<i>State:</i> ';
				}
				if (device.type == 5) {
					prefix = '<i>Value:</i> ';
				}
				if (device.type == 6) {
					prefix = '<i>Alarm:</i> ';
				}

				if (device.id == sort_id) { //check if we need to expand the device when sorting

					html = html + ('<div data-role="collapsible" data-collapsed="false" data-inset="false" data-iconpos="right" data-content-theme="' + theme + '">')
				} else {

					html = html + ('<div data-role="collapsible" data-collapsed="true" data-inset="false" data-iconpos="right" data-content-theme="' + theme + '">')

				}

				html = html + ('<h3>' + prefix + device.description + '</h3>' +
						'<a href="javascript:getDeviceCmds(null,' + device.id + ',' + device.type + ')" data-role="button" data-icon="edit" data-ajax="false">Add/Edit object items</a>' +
						'<a href="javascript:findDevice(' + device.id + ')" data-role="button" data-icon="edit" data-ajax="false">Edit object</a>' +
						'<a href="javascript:confirmDeleteDevice(' + device.id + ')" data-role="button"  data-icon="delete" data-rel="dialog">Delete</a>');

				if (nrofdevices > 1) {
					if (counter == 1) {
						html = html + ('<a href="javascript:sortDevice(' + device.id + ',\'down\')" data-role="button" data-icon="arrow-d" data-ajax="false">Down</a>')
					};
					if (counter == nrofdevices) {
						html = html + ('<a href="javascript:sortDevice(' + device.id + ',\'up\')" data-role="button" data-icon="arrow-u" data-ajax="false">Up</a>')
					};
					if (counter > 1 && counter < nrofdevices) {
						html = html + ('<a href="javascript:sortDevice(' + device.id + ',\'up\')" data-role="button" data-icon="arrow-u" data-ajax="false">Up</a><a href="javascript:sortDevice(' + device.id + ',\'down\')" data-role="button" data-icon="arrow-d" data-ajax="false">Down</a>')
					};
				}
				html = html + ('</div>');
				$('#devicelist').append(html);

				counter++;

			});

			$('#devicelist').trigger('create');

		} else {

			$('#devicelist').append('<b>No objects defined...</br>Use the upper right ADD button to add objects.</br>');
			$('#devicelist').trigger('create');

		}
		}
	});

	
}

function getDeviceCmds(sort_id, id, deviceType) {

	var deviceType = deviceType;
	alarm_counter = 0;

	$('#device_cmd_btnAdd').show();
	
	$.ajax({
		type : 'GET',
		contentType : 'application/json',
		url : '../api2/devicecmds/' + id,
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
			$("#device_cmd_object_id").val(id);
		$("#hidden_device_type").val(deviceType);

		var html

		$('#devicecmdlist').empty();

		if (data.devicecmds != '') {

			var nrofdevices = (data.devicecmds.length);

			var counter = 1;
			$.each(data.devicecmds, function (index, devicecmd) {

				if (devicecmd.type == 1) {
					prefix = '<i>Button:</i> ';
				}
				if (devicecmd.type == 2) {
					prefix = '<i>Slider:</i> ';
				}
				if (devicecmd.type == 3) {
					prefix = '<i>Colorpicker:</i> ';
				}
				if (devicecmd.type == 4) {
					prefix = '<i>Spinbox:</i> ';
				}
				if (devicecmd.type == 5) {
					prefix = '<i>Indicator:</i> ';
				}
				if (devicecmd.type == 6) {
					prefix = '<i>Indicator placeholder:</i> ';
				}
				if (devicecmd.type == 10) {
					prefix = '<i>Command:</i> ';
				}
				if (devicecmd.type == 11) {
					prefix = '<i>Alarm:</i> ';
				}

				if (devicecmd.type == 99) {
					if (deviceType == 2) {
						prefix = '<i>Empty space:</i> ';
					} else {
						if (devicecmd.description != '') {
							prefix = '<i>Line:</i> ';
						} else {
							prefix = '<i>Empty line</i> ';
						}
					}
				}
				if (devicecmd.type == 20) {
					prefix = '<i>Line Graph:</i> ';
				}
				if (devicecmd.type == 21) {
					prefix = '<i>Stepped Line Graph:</i> ';
				}
				if (devicecmd.type == 30) {
					prefix = '<i>Bar Graph <small>(day totals):</small></i> ';
				}
				if (devicecmd.type == 120) {
					prefix = '<i>Linked Line Graph:</i> ';
				}
				if (devicecmd.type == 121) {
					prefix = '<i>Linked Stepped Line Graph:</i> ';
				}
				if (devicecmd.type == 130) {
					prefix = '<i>Linked Bar Graph <small>(day totals):</small></i> ';
				}
				if (devicecmd.type == 131) {
					prefix = '<i>Linked Bar Graph <small>(week totals):</small></i> ';
				}
				if (devicecmd.type == 132) {
					prefix = '<i>Linked Bar Graph <small>(month totals):</small></i> ';
				}

				if (devicecmd.type == 11) {
					alarm_counter++;
				}

				if (devicecmd.id == sort_id) { //check if we need to expand the device when sorting

					html = ('<div data-role="collapsible" data-collapsed="false" data-inset="false" data-iconpos="right" data-content-theme="' + theme + '">')
				} else {

					html = ('<div data-role="collapsible" data-collapsed="true" data-inset="false" data-iconpos="right" data-content-theme="' + theme + '">')

				}

				html = html + ('<h3>' + prefix + devicecmd.description + '</h3>' +
						'<a href="javascript:findDeviceCmd(' + devicecmd.id + ',' + deviceType + ')" data-role="button" data-icon="edit" data-ajax="false">Edit</a>' +
						'<a href="javascript:confirmDeleteDeviceExtra(' + devicecmd.id + ',' + devicecmd.object_id + ',' + deviceType + ')" data-role="button"  data-icon="delete" data-rel="dialog">Delete</a>');

				if (devicecmd.type == 20 || devicecmd.type == 21 || devicecmd.type == 30) {
					html = html + ('<a href="../api/exportdata2csv/'+devicecmd.id+'" class="ui-icon-save ui-btn ui-shadow ui-corner-all ui-btn-icon-left" data-ajax="false">Download CSV</a>')
				}
				
				if (counter == 1) {
					html = html + ('<a href="javascript:sortDeviceExtra(' + devicecmd.id + ',\'down\',' + devicecmd.object_id + ',' + deviceType + ')" data-role="button" data-icon="arrow-d" data-ajax="false">Down</a>')
				};
				if (counter == nrofdevices) {
					html = html + ('<a href="javascript:sortDeviceExtra(' + devicecmd.id + ',\'up\',' + devicecmd.object_id + ',' + deviceType + ')" data-role="button" data-icon="arrow-u" data-ajax="false">Up</a>')
				};
				if (counter > 1 && counter < nrofdevices) {
					html = html + ('<a href="javascript:sortDeviceExtra(' + devicecmd.id + ',\'up\',' + devicecmd.object_id + ',' + deviceType + ')" data-role="button" data-icon="arrow-u" data-ajax="false">Up</a><a href="javascript:sortDeviceExtra(' + devicecmd.id + ',\'down\',' + devicecmd.object_id + ',' + deviceType + ')" data-role="button" data-icon="arrow-d" data-ajax="false">Down</a>')
				};

				html = html + ('</div>');
				$('#devicecmdlist').append(html);

				counter++;
			});
			
			
			$('#devicecmdlist').trigger('create');
			$.mobile.changePage("#device_cmd_page", {
				transition : "none"
			});

		} else {

			if (deviceType == '1') {

				$('#devicecmdlist').append('<b>No object items defined...</br>Use the upper right ADD button to add object items.</br>');

				

			}

			$('#devicecmdlist').append(html);

			$('#devicecmdlist').trigger('create');
			$.mobile.changePage("#device_cmd_page", {
				transition : "none"
			});

		}

		if (deviceType == '3') { //maximaal 5 activity commando's

			if (nrofdevices >= 5) {

				$('#device_cmd_btnAdd').hide();
				$('#devicecmdlist').prepend('You have reached the limit of 5 commands per activity</BR></BR>');

			}

		}

		if (deviceType == '6') { //maximaal 1 alarm

			if (alarm_counter >= 1) {

				$('#devicecmdlist').prepend('You have reached the limit of 1 alarm per alarm object</BR></BR>');
				$('#device_cmd_type').empty();

			}

		}
		}
	});

	

}

function confirmDeleteDevice(id) {
	DeviceID = id;
	$('#delete_message').empty();
	$('#delete_message').append('Delete object?');
	$('#device_popup_delete').popup("open");

}

function confirmDeleteDeviceExtra(id, id2, deviceType) {
	IDExtra = id;
	DeviceIDExtra = id2;
	TempdeviceType = deviceType;

	$('#delete_message_extra').empty();
	$('#delete_message_extra').append('Delete object item?');
	$('#device_popup_delete_extra').popup("open");

}

function deleteDevice() {

	$.mobile.loading("show");

	$.ajax({
		type : 'DELETE',
		url : '../api2/devices/' + DeviceID,
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
			getDevices();
			$('#device_popup_delete').popup("close");
			DeviceID = 0;

		}
	});

}

function deleteDeviceExtra() {

	var DeviceIDExtra2 = DeviceIDExtra;
	var TempdeviceType2 = TempdeviceType;
	
	$.ajax({
		type : 'DELETE',
		url : '../api2/devicecmd/' + IDExtra,
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
			getDeviceCmds(0, DeviceIDExtra2, TempdeviceType)
			$('#device_popup_delete_extra').popup("close");
			IDExtra = 0;
			DeviceIDExtra = 0;

		}
	});
	
	
	

}

function sortDevice(DeviceId, sort_up_down) {

	var sortid = DeviceId;
	$.mobile.loading("show");
	$.ajax({
		type : 'PUT',
		contentType : 'application/json',
		url : '../api2/sortdevice/' + DeviceId + '/' + sort_up_down,
		dataType : "json",
		data : '',
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

			getDevices(sortid)
			$.mobile.loading("hide");
		}
	});

}

function sortDeviceExtra(Id, sort_up_down, object_id, deviceType) {

	var sortid = Id;

	var object_id = object_id;
	$.mobile.loading("show");
	
	$.ajax({
		type : 'PUT',
		url : '../api2/sortdevicecmd/' + Id +'/' + sort_up_down,
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
			getDeviceCmds(sortid, object_id, deviceType);

		}
	});


}

$('#linked_graph').change(function (e) {

	$('#device_cmd_webapp_par4').val($('#linked_graph').val());

});

$('#alarm').change(function (e) {

	$('#device_cmd_webapp_par1').val($('#alarm').val());

});

$('#device_cmd_type').change(function (e) {

	show_hide_webapp_parameters($("#hidden_device_type").val, $("#device_cmd_object_id").val());

});

function show_hide_webapp_parameters(deviceType, objectid, placeholderid) {

	if ($('#device_cmd_type').val() == 1) { //button
		$('#cmd_div').show();
		$('#state_template_div').hide();
		$('#event_div').hide();
		$('#webapp_par1_div').hide();
		$('#webapp_par2_div').hide();
		$('#webapp_par3_div').hide();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		$('#indicator_placeholder_select_div').hide();

		$('#device_cmd_cmd_label').show();
		$('#device_cmd_cmd').show();
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Button text: <a href="javascript:help_text(19,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_cmd_label').empty();
		$('#device_cmd_cmd_label').append('Command to Nodo: <a href="javascript:help_text(20,\'help_popup\')"><img src="../media/help.png"></a>');

	} else if ($('#device_cmd_type').val() == 10) { //command
		$('#cmd_div').show();
		$('#state_template_div').hide();
		$('#event_div').hide();
		$('#webapp_par1_div').hide();
		$('#webapp_par2_div').hide();
		$('#webapp_par3_div').hide();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		$('#device_cmd_cmd_label').show();
		$('#device_cmd_cmd').show();
		$('#device_cmd_cmd_label').empty();
		$('#device_cmd_cmd_label').append('Command: <small><br> Example: NewKAKUSend 1,On</small>');
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Command description:');

	} else if ($('#device_cmd_type').val() == 2) { //slider

		$('#webapp_par1_div').show();
		$('#webapp_par2_div').show();
		$('#webapp_par3_div').show();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		$('#cmd_div').show();
		$('#event_div').show();
		$('#state_template_div').show();
		$('#label_device_cmd_webapp_par1').empty();
		$('#label_device_cmd_webapp_par2').empty();
		$('#label_device_cmd_webapp_par3').empty();
		$('#label_device_cmd_webapp_par1').append('Slider minimum value: <a href="javascript:help_text(24,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#label_device_cmd_webapp_par2').append('Slider maximum value: <a href="javascript:help_text(25,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#label_device_cmd_webapp_par3').append('Slider step: <a href="javascript:help_text(26,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_cmd_label').empty();
		$('#device_cmd_cmd_label').append('Command to Nodo: <a href="javascript:help_text(22,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Slider text: <a href="javascript:help_text(23,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_unit_event_label').empty();
		$('#device_cmd_unit_event_label').append('Event from Unit for slider state: <a href="javascript:help_text(27,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_event_label').empty();
		$('#device_cmd_event_label').append('Event for slider state: <a href="javascript:help_text(29,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_state_template_label').empty();
		$('#device_cmd_state_template_label').append('Value from event for slider state: <a href="javascript:help_text(28,\'help_popup\')"><img src="../media/help.png"></a>');

	} else if ($('#device_cmd_type').val() == 3) { //colorpicker
		$('#unit_div').hide();
		$('#webapp_par1_div').hide();
		$('#webapp_par2_div').hide();
		$('#webapp_par3_div').hide();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		$('#cmd_div').show();
		$('#event_div').show();
		$('#state_template_div').show();
		$('#device_cmd_webapp_par1').val('');
		$('#device_cmd_webapp_par2').val('');
		$('#device_cmd_webapp_par3').val('');
		$('#device_cmd_webapp_par4').val('');
		$('#device_cmd_cmd_label').empty();
		$('#device_cmd_cmd_label').append('Command to Nodo: <a href="javascript:help_text(30,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Colorpicker text: <a href="javascript:help_text(31,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_unit_event_label').empty();
		$('#device_cmd_unit_event_label').append('Event from Unit for colorpicker state: <a href="javascript:help_text(32,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_event_label').empty();
		$('#device_cmd_event_label').append('Event for colorpicker state: <a href="javascript:help_text(33,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_state_template_label').empty();
		$('#device_cmd_state_template_label').append('Value from event for colorpicker state: <a href="javascript:help_text(34,\'help_popup\')"><img src="../media/help.png"></a>');

	} else if ($('#device_cmd_type').val() == 4) { //spinbox

		$('#webapp_par1_div').show();
		$('#webapp_par2_div').show();
		$('#webapp_par3_div').show();
		$('#webapp_par4_div').show();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		$('#cmd_div').show();
		$('#event_div').show();
		$('#state_template_div').show();
		$('#label_device_cmd_webapp_par1').empty();
		$('#label_device_cmd_webapp_par2').empty();
		$('#label_device_cmd_webapp_par3').empty();
		$('#label_device_cmd_webapp_par4').empty();
		$('#label_device_cmd_webapp_par1').append('Spinbox minimum value: <a href="javascript:help_text(43,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#label_device_cmd_webapp_par2').append('Spinbox maximum value: <a href="javascript:help_text(44,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#label_device_cmd_webapp_par3').append('Spinbox step: <a href="javascript:help_text(45,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#label_device_cmd_webapp_par4').append('Spinbox suffix: <a href="javascript:help_text(51,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_cmd_label').empty();
		$('#device_cmd_cmd_label').append('Command to Nodo: <a href="javascript:help_text(46,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Spinbox text: <a href="javascript:help_text(47,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_unit_event_label').empty();
		$('#device_cmd_unit_event_label').append('Event from Unit for spinbox state: <a href="javascript:help_text(48,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_event_label').empty();
		$('#device_cmd_event_label').append('Event for spinbox state: <a href="javascript:help_text(49,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_state_template_label').empty();
		$('#device_cmd_state_template_label').append('Value from event for spinbox state: <a href="javascript:help_text(50,\'help_popup\')"><img src="../media/help.png"></a>');

	} else if ($('#device_cmd_type').val() == 5) { //Indicator
		$('#unit_div').show();
		$('#webapp_par1_div').hide();
		$('#webapp_par2_div').hide();
		$('#webapp_par3_div').hide();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').show();
		$('#formula_div').show();
		$('#round_div').show();
		$('#indicator_div').show();
		//$('#indicator_placeholder_select_div').show();
		$('#device_cmd_cmd_label').show();
		$('#device_cmd_cmd').show();
		$('#device_cmd_webapp_par1').val('');
		$('#device_cmd_webapp_par2').val('');
		$('#device_cmd_webapp_par3').val('');
		$('#device_cmd_webapp_par4').val('');
		$('#cmd_div').hide();
		$('#event_div').show();
		$('#state_template_div').hide();
		$('#device_cmd_unit_event_label').empty();
		$('#device_cmd_unit_event_label').append('Event from Unit: <a href="javascript:help_text(35,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_event_label').empty();
		$('#device_cmd_event_label').append('Event: <a href="javascript:help_text(36,\'help_popup\')"><img src="../media/help.png"></a>');

		//$('#device_cmd_cmd_label').append('Event: <small>Use * for wildcard<br>Example: UserEvent 1,*');
		$('#device_cmd_formula_label').empty();
		$('#device_cmd_formula_label').append('Formula: <sup>*optional </sup> <a href="javascript:help_text(37,\'help_popup\')"><img src="../media/help.png"></a>');
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Description: <a href="javascript:help_text(42,\'help_popup\')"><img src="../media/help.png"></a>');

		getIndicatorPlaceholders(objectid, placeholderid);

	} else if ($('#device_cmd_type').val() == 6) { //Indicator placeholder
		$('#cmd_div').hide();
		$('#event_div').hide();
		$('#state_template_div').hide();
		$('#device_cmd_cmd_label').hide();
		$('#device_cmd_cmd').hide();
		$('#webapp_par1_div').hide();
		$('#webapp_par2_div').hide();
		$('#webapp_par3_div').hide();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Placeholder title: <a href="javascript:help_text(53,\'help_popup\')"><img src="../media/help.png"></a>');

	} else if ($('#device_cmd_type').val() == 20 || $('#device_cmd_type').val() == 21 || $('#device_cmd_type').val() == 30 || $('#device_cmd_type').val() == 31 || $('#device_cmd_type').val() == 32) { //Graphs


		$('#unit_div').show();
		$('#webapp_par1_div').show();
		$('#webapp_par2_div').show();
		$('#webapp_par3_div').show();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#event_div').show();
		$('#value_div').show();
		$('#indicator_icon_div').hide();
		$('#indicator_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#value_div').show();
		$('#formula_div').show();
		$('#round_div').show();
		$('#cmd_div').hide();
		$('#state_template_div').hide();
		$('#label_device_cmd_webapp_par1').empty();
		$('#label_device_cmd_webapp_par2').empty();
		$('#label_device_cmd_webapp_par3').empty();
		$('#label_device_cmd_webapp_par1').append('Graph label: <small>(Example: W,millibar,kWh)</small>');
		$('#label_device_cmd_webapp_par2').append('Graph color: <small>(Example: Red = #FF0000)</small>');

		if ($('#device_cmd_type').val() == 20 || $('#device_cmd_type').val() == 21) {
			$('#label_device_cmd_webapp_par3').append('Graph default hours to show:');
		} else if ($('#device_cmd_type').val() == 30) {
			$('#label_device_cmd_webapp_par3').append('Graph default days to show:');
		} else if ($('#device_cmd_type').val() == 31) {
			$('#label_device_cmd_webapp_par3').append('Graph default weeks to show:');
		} else if ($('#device_cmd_type').val() == 32) {
			$('#label_device_cmd_webapp_par3').append('Graph default months to show:');
		}

		$('#device_cmd_webapp_par4').val('');
		$('#device_cmd_cmd_label').empty();
		$('#device_cmd_cmd_label').append('Event: <small>Use * for wildcard<br>Example: Variable 1,*');
		$('#device_cmd_formula_label').empty();
		$('#device_cmd_formula_label').append('Formula: <sup>optional </sup> <small>(Example: 100*[VALUE])</small>');
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Graph description:');

	} else if ($('#device_cmd_type').val() == 120 || $('#device_cmd_type').val() == 121 || $('#device_cmd_type').val() == 130 || $('#device_cmd_type').val() == 131 || $('#device_cmd_type').val() == 132) { //Linked Graphs
		$('#unit_div').hide();
		$('#webapp_par1_div').show();
		$('#webapp_par2_div').show();
		$('#webapp_par3_div').show();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').show();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#indicator_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#formula_div').show();
		$('#round_div').show();
		$('#cmd_div').hide();
		$('#event_div').hide();
		$('#state_template_div').hide();
		$('#device_cmd_formula_label').empty();
		$('#device_cmd_formula_label').append('Formula: <sup>optional </sup> <small>(Example: 100*[VALUE])</small>');
		$('#label_device_cmd_webapp_par1').empty();
		$('#label_device_cmd_webapp_par2').empty();
		$('#label_device_cmd_webapp_par3').empty();
		$('#label_device_cmd_webapp_par1').append('Graph label: <small>(Example: W,millibar,kWh)</small>');
		$('#label_device_cmd_webapp_par2').append('Graph color: <small>(Example: Red = #FF0000)</small>');

		if ($('#device_cmd_type').val() == 120 || $('#device_cmd_type').val() == 121) {
			$('#label_device_cmd_webapp_par3').append('Graph default hours to show:');
		} else if ($('#device_cmd_type').val() == 130) {
			$('#label_device_cmd_webapp_par3').append('Graph default days to show:');
		} else if ($('#device_cmd_type').val() == 131) {
			$('#label_device_cmd_webapp_par3').append('Graph default weeks to show:');
		} else if ($('#device_cmd_type').val() == 132) {
			$('#label_device_cmd_webapp_par3').append('Graph default months to show:');
		}
		$('#device_cmd_description_label').empty();
		$('#device_cmd_description_label').append('Graph description:');
		getGraphs();

	} else if ($('#device_cmd_type').val() == 11) { //alarm
		$('#cmd_div').hide();
		$('#event_div').hide();
		$('#state_template_div').hide();
		$('#webapp_par1_div').hide();
		$('#webapp_par2_div').hide();
		$('#webapp_par3_div').hide();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').show();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		$('#indicator_placeholder_select_div').hide();
	} else if ($('#device_cmd_type').val() == 99) { //Line & Empty space
		$('#cmd_div').hide();
		$('#event_div').hide();
		$('#state_template_div').hide();
		$('#device_cmd_cmd_label').hide();
		$('#device_cmd_cmd').hide();
		$('#webapp_par1_div').hide();
		$('#webapp_par2_div').hide();
		$('#webapp_par3_div').hide();
		$('#webapp_par4_div').hide();
		$('#linked_graph_div').hide();
		$('#alarm_div').hide();
		$('#value_div').hide();
		$('#indicator_icon_div').hide();
		$('#indicator_placeholder_select_div').hide();
		$('#formula_div').hide();
		$('#round_div').hide();
		$('#indicator_div').hide();
		if (deviceType == 2) {
			$('#device_cmd_description_label').empty();
			$('#device_cmd_description_label').append('Description: <a href="javascript:help_text(41,\'help_popup\')"><img src="../media/help.png"></a>');
		} else {
			$('#device_cmd_description_label').empty();
			$('#device_cmd_description_label').append('Line text: <a href="javascript:help_text(52,\'help_popup\')"><img src="../media/help.png"></a>');
		}
	}
}

$('#device_icon').change(function (e) {
	$('#icon1_div').empty();
	$('#icon1_div').append('<img src="../media/' + $('#device_icon').val() + '.png" height="16" width="16">');

});

$('#device_cmd_indicator').change(function (e) {
	$('#icon2_div').empty();
	$('#icon2_div').append('<img src="../media/' + $('#device_cmd_indicator').val() + '.png" height="16" width="16">');

});


