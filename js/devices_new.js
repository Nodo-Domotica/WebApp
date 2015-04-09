var DeviceTimer;
var DeviceCmdTimerArr = new Array();
var StateTimer;
var DeviceIndex;
var DeviceGroupIndex;
var DeviceGroupDefault;
var DeviceGroupDefaultName;
var DeviceGroupDefaultCounter = 0;
var ColorTimer;
var NodoCommand;
var SliderTimer;
var SliderIndex;
var SpinboxTimer;
var SpinboxIndex;

var prevValue = new Array();

var ArrDeviceID = new Array();
var ArrDeviceName = new Array();

function killDeviceCmdTimerIntervals() {
	while (DeviceCmdTimerArr.length > 0)
		clearInterval(DeviceCmdTimerArr.pop());
};

var panelhtml = '';

function startClock() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	// add a zero in front of numbers<10
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
	t = setTimeout(function () {
			startClock()
		}, 500);
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

$('#devices_page').on('pageinit', function (event) {
	checkSession();
	getDevices();
	$('#GroupSelectButton').hide();
	$("div.ui-input-search").hide(); //zoekveld verbergen
	
	startClock();

});

$('#devices_page').on('pageshow', function (event) {
	pagetitle = webapp_title;

	//Device status loop opstarten indien de pagina word weergegeven
	checkSession();
	Device_State();
	DeviceTimer = setInterval(function () {
			Device_State()
		}, 5000);
	$('#header_devices').append('<div id="nodostate">' + pagetitle + '</div>');
	Nodo_State();

});

$('#devices_page').on('pagehide', function (event) {
	//Device status loop stoppen indien een andere pagina word geopend
	clearInterval(DeviceTimer);
	$('#header_devices').empty();
});

//Device slider functie
function update_distance_device_timer(index, cmd) {
	cmdslider = cmd;
	SliderIndex = index;
	clearTimeout(SliderTimer);

	clearTimeout(StateTimer);
	killDeviceCmdTimerIntervals();

	SliderTimer = setTimeout("update_distance_device(SliderIndex,cmdslider)", 500);
}

function update_distance_device(index, cmd) {

	cmdid = index;
	cmdslider = cmd;
	value = $('#distSlider' + index).val();

	cmdslider = cmdslider.replace(/\[slider\]/gi, value);

	send_event(cmdslider, 'device');

}

//Device spinner functie
function update_spinbox_device_timer(index, cmd) {
	cmdslider = cmd;
	SpinboxIndex = index;
	clearTimeout(SpinboxTimer);

	clearTimeout(StateTimer);
	killDeviceCmdTimerIntervals();

	SpinboxTimer = setTimeout("update_distance_spinner(SpinboxIndex,cmdslider)", 500);
}
function update_distance_spinner(index, cmd) {

	var spinCommandResult;

	cmdid = index;
	cmdspinner = cmd;
	value = parseFloat($('#spinner' + index).val(), 10);

	cmdspinner = cmdspinner.replace(/\[spinbox\]/gi, value).toLowerCase();

	spinCommandResult = send_event(cmdspinner);

}

//Color timer functie
function update_color_timer(color, cmd, id) {
	cmdcolor = cmd;
	hexcolor = color;
	cmdid = id;
	clearTimeout(ColorTimer);
	ColorTimer = setTimeout("update_color(hexcolor,cmdcolor,cmdid)", 200);
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r : parseInt(result[1], 16),
		g : parseInt(result[2], 16),
		b : parseInt(result[3], 16)
	}
	 : null;
}

var rgbToHex = (function () {
	var rx = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;

	function pad(num) {
		if (num.length === 1) {
			num = "0" + num;
		}

		return num;
	}

	return function (rgb, uppercase) {
		var rxArray = rgb.match(rx),
		hex;

		if (rxArray !== null) {
			hex = pad(parseInt(rxArray[1], 10).toString(16)) + pad(parseInt(rxArray[2], 10).toString(16)) + pad(parseInt(rxArray[3], 10).toString(16));

			if (uppercase === true) {
				hex = hex.toUpperCase();
			}

			return hex;
		}

		return;
	};
}
	());

function update_color(color, cmd, id) {
	var hexcolor = color;
	var cmdcolor = cmd;
	var cmdid = id;
	cmdcolor = cmdcolor.replace(/\[r\]/gi, hexToRgb(hexcolor).r);
	cmdcolor = cmdcolor.replace(/\[g\]/gi, hexToRgb(hexcolor).g);
	cmdcolor = cmdcolor.replace(/\[b\]/gi, hexToRgb(hexcolor).b);

	send_event(cmdcolor, 'device');

}

function update_cmd_state(index) {

	console.log('update state');

	//$("#devices_extra_panel_content_error").empty();
	//$("#devices_extra_panel_content_error").append('<br><small><b>DEBUG: updating state ' + index + '</b> TimerID: '+DeviceCmdTimer+'</small>');


	$.ajax({
		type : 'GET',
		url : 'api/devicecmds/' + index,
		dataType : "json",
		success : function (data) {
			$.each(data.devicecmds, function (index, devicecmd) {

				if (prevValue[index] != devicecmd.state) { //alleen uitvoeren als de laatst opgehaalde waarde anders is dan de vorige om te voorkomen dat de slider of spinner onder het instellen terug schieten naar de oude waarde.
					if (devicecmd.type == 2) { //slider

						var sliderDivId = '#distSlider' + devicecmd.id;
						$(sliderDivId).val(devicecmd.state).slider("refresh");
					}

					if (devicecmd.type == 4) { //spinbox

						var stateValue;

						if (devicecmd.state != '') {
							stateValue = parseFloat(devicecmd.state);
						} else {
							stateValue = devicecmd.webapp_par1;
						}

						var spinnerDivId = '#spinner' + devicecmd.id;
						$(spinnerDivId).val(stateValue + devicecmd.webapp_par4);
					}
				}

				if (devicecmd.type == 6) { //indicator placeholder

					var indicator_text = devicecmd.indicator_text;
					var indicator_icon = devicecmd.indicator_icon;
					var indicator_placeholderDivId = '#indicator_placeholder' + devicecmd.id;
					var indicator_placeholder_iconDivId = '#indicator_placeholder_icon' + devicecmd.id;
					
					

					if (devicecmd.indicator_text != '' && devicecmd.indicator_icon > 0) {
						$(indicator_placeholderDivId).html('<img src="" class="indicator_icon" id="indicator_placeholder_icon' + devicecmd.id + '" > ' + devicecmd.indicator_text);

					} else if (devicecmd.indicator_text != '') {
						$(indicator_placeholderDivId).html(devicecmd.indicator_text);
					}

					if (devicecmd.indicator_icon > 0) {
						$(indicator_placeholder_iconDivId).attr('src', 'media/' + devicecmd.indicator_icon + '.png');
					}
				}

				prevValue[index] = devicecmd.state;
			});

		}
	});

}

function getDevices() {

	$.getJSON('api/devices', function (data) {

		devices = data.devices;

		$('#deviceslist').empty();

		if (data.devices != null) {

			$.each(devices, function (index, device) {

				ArrDeviceID[index] = device.id;
				ArrDeviceName[index] = device.description;

				if (device.type == 1) {
					$('#deviceslist').append('<li data-icon="carat-r" class="ui-shadow-icon" data-filtertext="' + device.group_id + '"><a id=switch_description' + device.id + ' href="javascript:OpenDevicePanel(' + index + ')" data-ajax="false"><img src="media/' + device.icon + '.png" class="ui-li-icon" id=switch_' + device.id + ' >' + device.description + '</a></li>');
				} else if (device.type == 2) {
					$('#deviceslist').append('<li data-icon="carat-r" class="ui-shadow-icon" data-filtertext="' + device.group_id + '"><a id=switch_description' + device.id + ' href="javascript:OpenRemotePage(' + index + ')" data-ajax="false"><img src="media/' + device.icon + '.png" class="ui-li-icon" id=switch_' + device.id + ' >' + device.description + '</a></li>');
				} else if (device.type == 3) {
					$('#deviceslist').append('<li data-icon="action" class="ui-shadow-icon" data-filtertext="' + device.group_id + '"><a id=switch_description' + device.id + ' href="javascript:ExecActivity(' + index + ')" data-ajax="false"><img src="media/' + device.icon + '.png" class="ui-li-icon" id=switch_' + device.id + ' >' + device.description + '</a></li>');
				} else if (device.type == 4) {
					$('#deviceslist').append('<li data-icon="false" class="ui-shadow-icon" data-filtertext="' + device.group_id + '"><a id=switch_description' + device.id + ' href="#" data-ajax="false"><img src="media/' + device.icon + '.png" class="ui-li-icon" id=switch_' + device.id + ' >' + device.description + '</a></li>');
				} else if (device.type == 5) {
					$('#deviceslist').append('<li data-icon="graph" class="ui-shadow-icon" data-filtertext="' + device.group_id + '"><a id=switch_description' + device.id + ' href="javascript:OpenGraph(' + index + ')" data-ajax="false"><img src="media/' + device.icon + '.png" class="ui-li-icon" id=switch_' + device.id + ' >' + device.description + '</a></li>');
				} else if (device.type == 6) {
					$('#deviceslist').append('<li data-icon="clock" class="ui-shadow-icon" data-filtertext="' + device.group_id + '"><a id=switch_description' + device.id + ' href="javascript:OpenAlarmPanel(' + index + ')" data-ajax="false"><img src="media/' + device.icon + '.png" class="ui-li-icon" id=switch_' + device.id + ' >' + device.description + '</a></li>');
				}
			});
		}

		$('#deviceslist').listview('refresh');

		getGroups();

		Device_State();

	});
}

function getGroups() {

	$.getJSON('api/groups', function (data) {

		if (data.groups != null) {

			groups = data.groups;

			$('#devicegrouppopuplist').append('<li data-icon="search"><a href="javascript:filterDevice(&quot;&quot;,&quot;All objects&quot;)" data-ajax="false">All objects</a></li>');

			$.each(groups, function (index, group) {

				DeviceGroupIndex = index;

				$('#devicegrouppopuplist').append('<li data-icon="search"><a href="javascript:filterDevice(' + group.id + ',&quot;' + group.name + '&quot;)" data-ajax="false">' + group.name + '</a></li>');

			});

			if (DeviceGroupIndex >= 0) {

				$('#GroupSelectButton').show(); //Alleen de group button weergeven indien er groepen zijn gedefinieerd

			} else {
				//Er zijn geen groepen eventueel opgeslagen cookie verwijderen.
				setCookie("groupid", '', 365);
				setCookie("groupname", 'All Objects', 365);

			}

			$('#devicegrouppopuplist').listview('refresh');

			var groupId = getCookie("groupid");
			var groupName = getCookie("groupname");

			if (groupId != "" && groupName != "") {
				filterDevice(groupId, groupName);
			} //Als er een standaard groep is gedefinieerd dan filteren we de lijst na het openen van de pagina


		}

	});

	//$('#deviceslist').show();
}

function filterDevice(id, name) {

	if (id != '') {
		var groupIdFilter = 'XX' + id + 'XX';
	} else {
		var groupIdFilter = '';
	}

	$("#device_group_popup").popup("close");
	$("div.ui-input-search").find("input").val(groupIdFilter);
	$("div.ui-input-search").find("input").keyup();
	$('#GroupSelectButton').text(name);
	setCookie("groupid", id, 365);
	setCookie("groupname", name, 365);

}

function OpenDeviceGroupPopup() {

	$("#device_group_popup").popup("open");
};

function OpenDevicePanel(index) {
	DeviceIndex = index;
	$("#devices_extra_panel_content_error").empty();
	panelhtml = '';
	panelhtml = panelhtml + '<h4>' + ArrDeviceName[DeviceIndex] + '</h4>'

		$.getJSON('api/devicecmds/' + ArrDeviceID[DeviceIndex], function (data) {

			devicecmds = data.devicecmds;

			$('#devices li').remove();

			if (data.devicecmds != null) {

				$.each(devicecmds, function (index, devicecmd) {

					NodoCommand = devicecmd.command;

					//BUTTON
					if (devicecmd.type == 1) {
						panelhtml = panelhtml + '<a href="javascript:send_event(&quot;' + NodoCommand + '&quot;,&quot;device&quot;)" class="ui-btn ui-shadow ui-corner-all">' + devicecmd.description + '</a>';
					}

					//SLIDER 1...16
					if (devicecmd.type == 2) {

						panelhtml = panelhtml + ' <label for="slider' + devicecmd.id + ' ">' + devicecmd.description + '</label><input  name="distSlider" id="distSlider' + devicecmd.id + '" value="' + devicecmd.state + '" min="' + devicecmd.webapp_par1 + '" max="' + devicecmd.webapp_par2 + '" step="' + devicecmd.webapp_par3 + '" data-type="range" onChange="update_distance_device_timer(' + devicecmd.id + ',\'' + NodoCommand + '\')">';

					}

					//COLOR WHEEL
					if (devicecmd.type == 3) {

						rec_value = devicecmd.rec_value

							var rgb = 'rgb(' + devicecmd.state + ')'
							var colorwheelState = '#' + rgbToHex(rgb);

						//console.log(stateToHex);

						panelhtml = panelhtml + ('<div id="callback_colorwheel' + devicecmd.id + '">' +

								'<div >' +
								'<div style="float:left; width:100%; margin-bottom:20px">' +
								'<div class="colorwheel' + devicecmd.id + '" style="float:right; margin-right:20px; width:200px; text-align:left;"></div>' +
								'</div>' +
								'</div>' +

								'<script type="text/javascript">' +
								'var cw' + devicecmd.id + ' = Raphael.colorwheel($("#callback_colorwheel' + devicecmd.id + ' .colorwheel' + devicecmd.id + '")[0],200,180);' +
								'cw' + devicecmd.id + '.color("' + colorwheelState + '");' +
								'cw' + devicecmd.id + '.onchange(function(color)' +
								'{' +
								'update_color_timer(color.hex' + ',\'' + NodoCommand + '\',\'' + devicecmd.id + '\');' +
								'})' +
								'</script>');
					}
					//Input spinner
					if (devicecmd.type == 4) {

						var stateValue;

						if (devicecmd.state != '') {
							stateValue = parseFloat(devicecmd.state);
						} else {
							stateValue = devicecmd.webapp_par1;
						}

						panelhtml = panelhtml + ' <label for="spinner' + devicecmd.id + ' ">' + devicecmd.description + '</label><input class="spinner" name="spinner" id="spinner' + devicecmd.id + '" value="' + stateValue + devicecmd.webapp_par4 + '" min="' + devicecmd.webapp_par1 + '" max="' + devicecmd.webapp_par2 + '" step="' + devicecmd.webapp_par3 + '" suffix="' + devicecmd.webapp_par4 + '" readonly="readonly" data-role="spinbox" data-options=\'\{"type":"vertical"\}\' onChange="update_spinbox_device_timer(' + devicecmd.id + ',\'' + NodoCommand + '\')">';

					}

					//Indicator
					if (devicecmd.type == 6) {

						if (devicecmd.indicator_icon > 0) {
							panelhtml = panelhtml + '<div id="indicator_placeholder' + devicecmd.id + '"><img src="" class="indicator_icon" id="indicator_placeholder_icon' + devicecmd.id + '" > ' + devicecmd.description + '</div>';
						} else {
							panelhtml = panelhtml + '<div id="indicator_placeholder' + devicecmd.id + '">' + devicecmd.description + '</div>';
						}
					}

					//Line & Empty space
					if (devicecmd.type == 99) {
						panelhtml = panelhtml + devicecmd.description + '</BR>';
					}
				});
			}

			$("#devices_extra_panel_content").html(panelhtml);

			$("#devices_extra_panel").trigger("create");

			update_cmd_state(ArrDeviceID[DeviceIndex]);

			DeviceCmdTimerArr.push(setInterval(function () {
					update_cmd_state(ArrDeviceID[DeviceIndex]);
				}, 2000));

			$("#devices_extra_panel").panel("open");

		});
}

$("#devices_extra_panel").on("panelclose", function (event, ui) {
	killDeviceCmdTimerIntervals();
	clearTimeout(StateTimer);
});

function OpenRemotePage(index) {
	DeviceIndex = index;

	$("#header_remote").empty();
	html = '';
	$("#header_remote").html(ArrDeviceName[DeviceIndex]);
	x = 1;

	$.getJSON('api/devicecmds/' + ArrDeviceID[DeviceIndex], function (data) {

		devicecmds = data.devicecmds;

		$('#remote_grid').html('');

		if (data.devicecmds != null) {

			$.each(devicecmds, function (index, devicecmd) {

				NodoCommand = devicecmd.command;

				if (x == 1) {
					block = 'ui-block-a';
				}
				if (x == 2) {
					block = 'ui-block-b';
				}
				if (x == 3) {
					block = 'ui-block-c';
				}

				//BUTTON
				if (devicecmd.type == 1) {
					html = html + '<div id="' + devicecmd.id + '" class="' + block + '"><a href="javascript:send_event(&quot;' + NodoCommand + '&quot;)" class="ui-shadow ui-btn ui-corner-all ui-mini ">' + devicecmd.description + '</a></div>';
					//html = html + '<script>var btntimer' + devicecmd.id + ';$("#' + devicecmd.id + '").on("taphold",function(){btntimer' + devicecmd.id + '=setInterval(function () {send_event(\'' + NodoCommand + '\')}, 1000);});'
					//html = html + '$("#' + devicecmd.id + '").on("vmouseup",function(){clearInterval(btntimer' + devicecmd.id + ')});</script>'
				}

				if (devicecmd.type == 99) {
					html = html + '<div class="' + block + '"></div>';
				}

				x++;
				if (x > 3) {
					x = 1;
				}

			});
		}

		//alert(html);
		$("#remote_grid").html(html);
		$.mobile.changePage("#remote_page", {
			transition : "none"
		});

	});

};

function ExecActivity(index) {
	DeviceIndex = index;
	NodoCommand = '';

	//$.mobile.loading( "show");
	$.getJSON('api/devicecmds/' + ArrDeviceID[DeviceIndex], function (data) {

		devicecmds = data.devicecmds;
		var nrofdevicecmds = (data.devicecmds.length);

		if (data.devicecmds != '') {

			$.each(devicecmds, function (index, devicecmd) {

				if (index + 1 != nrofdevicecmds) {
					NodoCommand = NodoCommand + devicecmd.command + ';';
				} else {
					NodoCommand = NodoCommand + devicecmd.command;
				}

			});

			send_event(NodoCommand);
		}

		//$.mobile.loading( "hide");


	});
}

function OpenGraph(index) {
	DeviceIndex = index;
	ValueHtml = '';
	$('#graph').empty();

	//$.mobile.loading( "show");
	$.getJSON('api/devicecmds/' + ArrDeviceID[DeviceIndex], function (data) {

		devicecmds = data.devicecmds;
		var nrofdevicecmds = (data.devicecmds.length);

		if (data.devicecmds != '') {

			$.each(devicecmds, function (index, devicecmd) {

				if (devicecmd.type == 20 || devicecmd.type == 120 || devicecmd.type == 21 || devicecmd.type == 121) { //line graph

					var options = {

						xaxis : {
							mode : "time",
							minTickSize : [1, 'minute']
						},
						legend : {
							backgroundOpacity : 0
						},
						shadowSize : 2
					};

					if (devicecmd.type == 120 || devicecmd.type == 121) {
						url = 'api/graphdata/' + devicecmd.webapp_par4 + '/' + devicecmd.webapp_par3 + '/' + devicecmd.type;
					} else {
						url = 'api/graphdata/' + devicecmd.id + '/' + devicecmd.webapp_par3 + '/' + devicecmd.type;
					}

					ValueHtml = ValueHtml + '<h3>' + devicecmd.description + '</h3>';
					ValueHtml = ValueHtml + '<div id="graph' + devicecmd.id + '" style="width:100%;height:300px;position: relative;"></div><br>';
					$.getJSON(url, function (data) {

						var plotarea = $("#graph" + devicecmd.id);

						if (devicecmd.type == 21 || devicecmd.type == 121) {
							Steps = true;
						} else {
							Steps = false;
						}

						$.plot(plotarea, [{
									label : devicecmd.webapp_par1,
									data : data,
									color : devicecmd.webapp_par2,
									lines : {
										lineWidth : 1,
										steps : Steps,
										fill : true,
										zero : false,
										fillColor : {
											colors : [{
													opacity : 0.1
												}, {
													opacity : 1
												}
											]
										}
									}
								}
							], options);

					});

				} else if (devicecmd.type == 30 || devicecmd.type == 130) { //bar graph day totals

					var options = {
						xaxis : {
							mode : "time",
							minTickSize : [1, 'minute']
						},
						legend : {
							backgroundOpacity : 0
						},
						shadowSize : 3
					};
					ValueHtml = ValueHtml + '<h3>' + devicecmd.description + '</h3>';
					ValueHtml = ValueHtml + '<div id="graph' + devicecmd.id + '" style="width:100%;height:300px;position: relative;"></div><br>';
					$.getJSON('api/graphdata/' + devicecmd.id + '/' + devicecmd.webapp_par3 + '/' + devicecmd.type, function (data) {

						var plotarea = $("#graph" + devicecmd.id);

						$.plot(plotarea, [{
									label : devicecmd.webapp_par1,
									data : data,
									color : devicecmd.webapp_par2,
									bars : {
										show : true,
										barWidth : 43200000,
										align : "center",
										lineWidth : 0,
										fillColor : {
											colors : [{
													opacity : 0.8
												}, {
													opacity : 0.3
												}
											]
										}
									}
								}
							], options);

					});

				} else if (devicecmd.type == 31 || devicecmd.type == 131) { //bar graph week totals


					var options = {
						
						
						xaxis : {
							mode : null,
							tickLength : 0,
							minTickSize : 1,
							tickDecimals : 0
						},
						legend : {
							backgroundOpacity : 0
						},
						shadowSize : 3,

					};
					console.log(devicecmd.type);
					if (devicecmd.type == 131) {
						url = 'api/graphdata/' + devicecmd.webapp_par4 + '/' + devicecmd.webapp_par3 + '/' + devicecmd.type;
					} else {
						url = 'api/graphdata/' + devicecmd.id + '/' + devicecmd.webapp_par3 + '/' + devicecmd.type;
					}

					ValueHtml = ValueHtml + '<h3>' + devicecmd.description + '</h3>';
					ValueHtml = ValueHtml + '<div id="graph' + devicecmd.id + '" style="width:100%;height:300px;position: relative;"></div><br>';
					$.getJSON(url, function (data) {

						var plotarea = $("#graph" + devicecmd.id);

						$.plot(plotarea, [{
									label : devicecmd.webapp_par1,
									data : data,
									color : devicecmd.webapp_par2,
									bars : {
										show : true,
										barWidth : 0.8,
										order : 1,
										align : "center",
										lineWidth : 0,
										fillColor : {
											colors : [{
													opacity : 0.8
												}, {
													opacity : 0.3
												}
											]
										}
									}
								}
							], options);

					});

				} else if (devicecmd.type == 32 || devicecmd.type == 132) { //bar graph month totals

					var options = {
						xaxis : {
							mode : "time",
							minTickSize : [1, 'month'],
							timeformat : "%b"
						},
						legend : {
							backgroundOpacity : 0
						},
						shadowSize : 3
					};
					console.log(devicecmd.type);
					if (devicecmd.type == 132) {
						url = 'api/graphdata/' + devicecmd.webapp_par4 + '/' + devicecmd.webapp_par3 + '/' + devicecmd.type;
					} else {
						url = 'api/graphdata/' + devicecmd.id + '/' + devicecmd.webapp_par3 + '/' + devicecmd.type;
					}

					ValueHtml = ValueHtml + '<h3>' + devicecmd.description + '</h3>';
					ValueHtml = ValueHtml + '<div id="graph' + devicecmd.id + '" style="width:100%;height:300px;position: relative;"></div><br>';
					$.getJSON(url, function (data) {

						var plotarea = $("#graph" + devicecmd.id);

						$.plot(plotarea, [{
									label : devicecmd.webapp_par1,
									data : data,
									color : devicecmd.webapp_par2,
									bars : {
										show : true,
										barWidth : 1000 * 60 * 60 * 24 * 15,
										align : "center",
										lineWidth : 0,
										fillColor : {
											colors : [{
													opacity : 0.8
												}, {
													opacity : 0.3
												}
											]
										}
									}
								}
							], options);

					});

				}

			});

			$.mobile.changePage("#graph_page", {
				transition : "none"
			});
			$('#graph').append(ValueHtml);
			$('#graph').trigger('create');

		}

	});

	//$.mobile.loading( "show");

}

function OpenAlarmPanel(index) {
	DeviceIndex = index;

	//$.mobile.loading( "show");
	$.getJSON('api/devicecmds/' + ArrDeviceID[DeviceIndex], function (data) {

		devicecmds = data.devicecmds;
		var nrofdevicecmds = (data.devicecmds.length);

		if (data.devicecmds != '') {

			$.each(devicecmds, function (index, devicecmd) {

				if (devicecmd.type == 11) {

					editAlarm(devicecmd.webapp_par1);

				}

			});

		}

		//$.mobile.loading( "hide");


	});
}

function send_event(event, type, sync) {

	$.post("api/cmdsend/" + event, function (data) {

		clearTimeout(StateTimer);
		killDeviceCmdTimerIntervals();

		$("#devices_extra_panel_content_error").empty();
		data = data.toLowerCase();
		event = event.toLowerCase();
		var arrEvent = event.split(";");

		if (event.indexOf('sendto') == -1 && event.indexOf('fileexecute') == -1) { //sendto geeft (nog) geen response

			arrEvent.forEach(function (s) {
				event = s.trim();

				if (data.indexOf('event=' + event) == -1) {

					if (data.indexOf('???') == -1) {

						//alert('Error sending command ' + event + ' to Nodo!!');
						$("#devices_extra_panel_content_error").append('<br><small><b>Error sending command ' + event + '</b></small>');

					} else {
						//alert(event + ' is not a valid nodo command !!');
						$("#devices_extra_panel_content_error").append('<br><small><b>' + event + ' is not a valid nodo command !!</b></small>');

					}
				} else {
					console.log('Command ' + event + ' received by Nodo!');
					setTimeout(function () {
						Device_State()
					}, 500);
				}

			});

		}

	}).done(function () {

		clearTimeout(StateTimer);
		killDeviceCmdTimerIntervals();

		StateTimer = setTimeout(function () {

				DeviceCmdTimerArr.push(setInterval(function () {
						update_cmd_state(ArrDeviceID[DeviceIndex]);
					}, 2000));
			}, 500);
	});
}


	

