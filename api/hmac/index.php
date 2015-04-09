<!DOCTYPE html>
<html>
<head>
<title>HMAC Authentication</title>
<script src="https://code.jquery.com/jquery-latest.js" type="text/javascript"></script>
<script src="js/hmac-sha1.js" type="text/javascript"></script>
</head>
<body>

<h1>HMAC Authentication</h1>

<div class="loggedIn">
    <span class="name"></span>
    <a href="#" class="sendRequest">Send a request to /test</a>
</div>

<div class="loggedOut">
<a href="#" class="sendRequest">Try to send a request to /test (without being logged in)</a>    
    
<h3>Sign in Below</h3>
<form id="loginForm">

    <p><label>Username</label><input type="text" id="username" /></p>
    <p><label>Password</label><input type="text" id="password" /></p>
    <p><a href="#" id="login">Login</a></p>
	
</form>
</div>
<script>

var app = (function($){
    
    var baseURL = '../index2.php';
    var apiSecretKey = 'ABC123';
    
    var init = function(){
	
	$('.loggedIn').hide();
	$('#login').on('click', function(e){
	    e.preventDefault();
	    login();
	});
	
	$('.sendRequest').on('click', function(e){
	    e.preventDefault();
	    testRequest();
	});	
	
	
    };
    
    var login = function() {
	    
	var u = $('#username').val();
	var p = $('#password').val();

	$.ajax({
	    type: "POST",
	    url: baseURL + "/login",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    data: JSON.stringify({username: u, password: p}),					
	    success: function (data) {
		$('.loggedOut').hide();
		$('.loggedIn').show();
		$('.loggedIn .name').text("Hello, " + readCookie('PUBLIC-KEY') + " ");
	    },
	    error: function (errorMessage) {
		alert('Error logging in');
	    }
	});
    };
    
    var testRequest = function() {
	var data = { test: 'test'}
	var timestamp = getMicrotime(true).toString();
	$.ajax({
	    type: "GET",
	    url: baseURL + "/test",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader('X-MICROTIME', timestamp);
		request.setRequestHeader('X-HASH', getHMAC(readCookie('PUBLIC-KEY'), timestamp));
            },	
	    data: JSON.stringify(data),
	    success: function (data) {
		alert(data.message);
	    },
	    error: function (errorMessage) {
               if(errorMessage.status == 401)
                   alert('Access denied');
	    }
	});
    };

    var readCookie =  function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
	    var c = ca[i];
	    while (c.charAt(0)==' ') c = c.substring(1,c.length);
	    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
    };  
    
    var getHMAC = function(key, timestamp) {
	var hash = CryptoJS.HmacSHA1(key+timestamp, apiSecretKey);
	return hash.toString();
    };

    var getMicrotime = function (get_as_float) {

      var now = new Date().getTime() / 1000;
      var s = parseInt(now, 10);

      return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
    };	
    
    return {
	init:init
    };
    
    
})(jQuery);


app.init();


</script>

</body>
</html>
