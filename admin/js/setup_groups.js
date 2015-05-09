$( function() {
		$( "#popupLogin" ).enhanceWithin().popup();
	});


$('#groups_page').on('pageinit', function (event) {

	Nodo_State();
	//checkSession();
	getGroups();
	
	
	

});

$('#groups_page').on('beforepageshow', function (event) {

//changeGlobalTheme(theme)

});

$('#groups_page').on('pageshow', function (event) {

	pagetitle = 'Setup: Groups';
	$('#header_setup_groups').append('<div id="nodostate">' + pagetitle + '</div>');
	

});

$('#groups_page').on('pagehide', function (event) {

	$('#header_setup_groups').empty();

});

$('#groups_form_page').on('pageshow', function (event) {

	

	//als de pagina word vernieuwd gaan we terug naar de hoofdpagina.
	if ($('#group_form_refreshed').val() == '') {

		$.mobile.changePage("#groups_page", {
			transition : "none"
		});

	}

});

$('#btnAddGroup').click(function () {
	newGroup()
	return false;
});

$('#btnSignin').click(function () {

	var u = $('#un').val();
	var p = $('#pw').val();
	if ($("#checkbox-1").prop('checked') == true) {
		var s = 1;
	} else {
		var s = 0;
	}

	$.ajax({cache: false,
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

$('#btnSaveGroup').click(function () {

	if ($('#group_id').val() == '') {
		addGroup()
	} else {
		editGroup($('#group_id').val())
	}
	return false;
});

function findGroup(id) {
	$.mobile.loading("show");
	$.ajax({cache: false,
		type : 'GET',
		url : '../api/groups/' + id,
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
				$.mobile.loading("hide");
				$('#popupLogin').popup("open");
			}
		},
		success : function (data) {
			$.mobile.loading("hide");
			currentGroup = data;
			renderGroupDetails(currentGroup);
			pagetitle = 'Setup: Edit Group';
			$('#header_setup_groups_form').empty();
			$('#header_setup_groups_form').append('<div id="nodostate">' + pagetitle + '</div>');
			$.mobile.changePage("#groups_form_page", {
				transition : "none"
			});
			$("#default_group").checkboxradio('refresh');
		}
	});
}

function addGroup() {

	$.mobile.loading("show");

	$.ajax({cache: false,
		type : 'POST',
		contentType : 'application/json',
		url : '../api/groups',
		dataType : "json",
		data : formToJSONGroups(),
		beforeSend : function (xhr) {
			var user = decodeURIComponent(getCookie("USERID"));
			var password = decodeURIComponent(getCookie("TOKEN"));

			var words = CryptoJS.enc.Utf8.parse(user + ":" + password);
			var base64 = CryptoJS.enc.Base64.stringify(words);

			xhr.setRequestHeader("Authorization", "Basic " + base64);
		},
		error : function (xhr, ajaxOptions, thrownError) {
			if (xhr.status == 403) {

				$.mobile.loading("hide");
				$('#popupLogin').popup("open");
			}

		},
		success : function (data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			getGroups()
			$.mobile.changePage("#groups_page", {
				transition : "none"
			});
		}
	});
}

function editGroup(id) {

	$.mobile.loading("show");

	$.ajax({cache: false,
		type : 'PUT',
		contentType : 'application/json',
		url : '../api/groups/' + id,
		dataType : "json",
		data : formToJSONGroups(),
		beforeSend : function (xhr) {

			var user = decodeURIComponent(getCookie("USERID"));
			var password = decodeURIComponent(getCookie("TOKEN"));

			var words = CryptoJS.enc.Utf8.parse(user + ":" + password);
			var base64 = CryptoJS.enc.Base64.stringify(words);

			xhr.setRequestHeader("Authorization", "Basic " + base64);
		},
		error : function (xhr, ajaxOptions, thrownError) {
			if (xhr.status == 403) {
				$('#popupLogin').popup("open");
				$.mobile.loading("hide");
			}
		},
		success : function (data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			getGroups()
			$.mobile.changePage("#groups_page", {
				transition : "none"
			});
		},
		error : function (jqXHR, textStatus, errorThrown) {
			alert('editGroups error: ' + textStatus);
		}
	});
}

function newGroup() {

	currentGroup = {};
	renderGroupDetails(currentGroup); // Display empty form
	$.mobile.changePage("#groups_form_page", {
		transition : "none"
	});
	pagetitle = 'Setup: Add Group';
	$('#header_setup_groups_form').empty();
	$('#header_setup_groups_form').append('<div id="nodostate">' + pagetitle + '</div>');
	$("#default_group").checkboxradio('refresh');

}

function confirmDeleteGroup(id) {

	$('#delete_message_groups').empty();
	$('#delete_button_groups').empty();
	$('#delete_message_groups').append('Delete Group?');
	$('#groups_popup_delete').popup("open");
	$('#delete_button_groups').append('<a href="javascript:DeleteGroup(' + id + ')" id="ok_delete" data-role="button" data-inline="true" >Delete</a> ');
	$('#groups_popup_delete').trigger("create");
}

function DeleteGroup(id) {

	$.ajax({cache: false,
		type : 'DELETE',
		url : '../api/groups/' + id,
		beforeSend : function (xhr) {

			var user = decodeURIComponent(getCookie("USERID"));
			var password = decodeURIComponent(getCookie("TOKEN"));

			var words = CryptoJS.enc.Utf8.parse(user + ":" + password);
			var base64 = CryptoJS.enc.Base64.stringify(words);

			xhr.setRequestHeader("Authorization", "Basic " + base64);
		},
		error : function (xhr, ajaxOptions, thrownError) {
			if (xhr.status == 403) {
				$('#popupLogin').popup("open");
				$.mobile.loading("hide");
			}
		},
		success : function (data, textStatus, jqXHR) {
			getGroups();
			$('#groups_popup_delete').popup("close");

		}
	});
}

function renderGroupDetails(group) {

	$('#group_form_refreshed').val('No');
	$('#group_id').val(group.id);
	$('#group_name').val($("<div>").html(group.name).text());

	if (group.devices_default == 1) {
		$("#default_group").prop("checked", true);
	} else {
		$("#default_group").prop("checked", false);
	}

}

// Helper function to serialize all the form fields into a JSON string
function formToJSONGroups() {

	return JSON.stringify({
		"id" : $('#group_id').val(),
		"name" : $('#group_name').val(),
		"devices_default" : $('#default_group').is(':checked')

	});

}

function getGroups() {

	$.ajax({cache: false,
		type : 'GET',
		url : '../api/groups',
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
				$('#popupLogin').popup("open");
			} // reset();
			//alert('Invalid username or password. Please try again.');
			//$('#loginform #user_login').focus();
		},
		success : function (data) {
			var html

			if (data.groups != null) {

				$('#grouplist').empty();

				groups = data.groups;

				$.each(groups, function (index, group) {

					html = ('<div data-role="collapsible" data-collapsed="true" data-inset="false" data-iconpos="right">')

					html = html + ('<h3>' + group.name + '</h3>');

					html = html + ('<a href="javascript:findGroup(' + group.id + ')" data-role="button" data-icon="edit" data-ajax="false">Edit</a>' +
							'<a href="javascript:confirmDeleteGroup(' + group.id + ')" data-role="button"  data-icon="delete" data-rel="dialog">Delete</a>');

					html = html + ('</div>');

					$('#grouplist').append(html);

				});

				$('#grouplist').trigger('create');

			} else {

				$('#grouplist').append('No groups defined...');

			}
		}
	});
}
