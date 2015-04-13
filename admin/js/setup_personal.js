$( function() {
		$( "#popupLogin" ).enhanceWithin().popup();
	});


$('#personal_page').on('pageinit', function (event) {

	Nodo_State();
	//checkSession();
	getUserSettings();
	
	
	

});

$('#personal_page').on('beforepageshow', function (event) {

//changeGlobalTheme(theme)

});

$('#personal_page').on('pageshow', function (event) {

	pagetitle = 'Setup: Personal';
	$('#header_setup_personal').append('<div id="nodostate">' + pagetitle + '</div>');
	

});

$('#personal_page').on('pagehide', function (event) {

	$('#header_setup_personal').empty();

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

$('#personal_btnSave').click(function () {

	
		//editUser()
		
		
		 $(".error").hide();
		 var hasError = false;
		 var passwordVal = $("#password").val();
		 var password2Val = $("#password2").val();
		 if(passwordVal != password2Val) {
		 $("#password_label").before('<span class="error, blink_me" ><b>Your Password and the Verification don\'t match<b></span>');
		 hasError = true;
		 }
		 		 
		 if(hasError == true) { return false; }
		 
		 editUser();
	
	return false;
});

function getUserSettings() {
	$.mobile.loading("show");
	$.ajax({
		type : 'GET',
		url : '../api/usersettings',
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
			
			renderUserDetails(data);
			
		}
	});
}



function editUser() {

	$.mobile.loading("show");

	$.ajax({
		type : 'PUT',
		contentType : 'application/json',
		url : '../api/usersettings',
		dataType : "json",
		data : formToJSONUser(),
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
			
		},
		error : function (jqXHR, textStatus, errorThrown) {
			alert('editGroups error: ' + textStatus);
		}
	});
}



function renderUserDetails(data) {

	
	$('#user_name').val(data.user_login_name);
	$('#title').val($("<div>").html(data.webapp_title).text());
	$('#first_name').val($("<div>").html(data.first_name).text());
	$('#last_name').val($("<div>").html(data.last_name).text());
	
	$('#theme').val(data.webapp_theme);
	$('#theme').change();

}

$('#theme').change(function (e) {

	changeGlobalTheme($('#theme').val());

});

// Helper function to serialize all the form fields into a JSON string
function formToJSONUser() {

	return JSON.stringify({
		"user_login_name" : $('#user_name').val(),
		"webapp_title" : $('#title').val(),
		"first_name" : $('#first_name').val(),
		"last_name" : $('#last_name').val(),
		"webapp_theme" : $('#theme').val(),
		"user_password" : $('#password').val()
		

	});

}



