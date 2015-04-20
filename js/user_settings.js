var theme;
var nodoip;
var nodoport;
var nodoid;
var webappversion='WebApp (SWINWA-PROD-V1.5)';
var usergroup;
var webapp_title;

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}




	
function getUsersettings() {
$.ajax({ 
         async: false,
		 url: path+'api/usersettings', 
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
					$.mobile.loading( "hide");
					
				}
				},
         success: function(data) {
 			
			theme=data.webapp_theme;
			//themeheader=data.webapp_theme;
			nodoip=data.nodo_ip;
			nodoport=data.nodo_port;
			nodoid=data.nodo_id;
			usergroup=data.user_group;
			webapp_title=data.webapp_title;
			changeGlobalTheme(theme);
			
			
			
	}	
});

}


function changeGlobalTheme(theme)
    {
 //Thema instellen
			$('[data-role=page]').removeClass( "ui-page-theme-a ui-page-theme-b ui-page-theme-c ui-page-theme-d ui-page-theme-e ui-page-theme-f ui-page-theme-g ui-page-theme-h" ).addClass( "ui-page-theme-" + theme );
			$('[data-role=page]').removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e ui-body-f ui-body-g ui-body-h').addClass('ui-body-'+theme).attr('data-theme', theme); 
			$('[data-role=header]').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f ui-bar-g ui-bar-h').addClass('ui-header ui-bar-'+theme);
			$('[data-role=footer]').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f ui-bar-g ui-bar-h').addClass('ui-footer ui-bar-'+theme);
			$('[data-role=listview]').attr('data-split-theme', theme);
			$('[data-role=dialog]').attr('data-theme', theme);
			//$('[data-role=page]').addClass( "ui-shadow-icon" );
			//$( '[data-role=page]' ).removeClass( "noshadow" );
		
		
		
			
    }
	


getUsersettings();






