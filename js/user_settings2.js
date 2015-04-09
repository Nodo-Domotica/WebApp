var theme;
var nodoip;
var nodoport;
var nodoid;
var webappversion='WebApp (SWINWA-PROD-V1.5)';
var usergroup;

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



	

$.ajax({ 
         async: false,
		 url: '/api2/usersettings', 
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
					//$('#popupLogin').popup();
					//$('#popupLogin').popup("open");
				}
				},
         success: function(data) {
 			
			theme=data.webapp_theme;
			themeheader=data.webapp_theme;
			nodoip=data.nodoip;
			nodoport=data.nodoport;
			nodoid=data.nodoid;
			usergroup=data.usergroup;
			changeGlobalTheme(theme);
			
	}	
});

function changeGlobalTheme(theme)
    {
        // These themes will be cleared, add more
        // swatch letters as needed.
        var themes = " a b c d e f g h";

        // Updates the theme for all elements that match the
        // CSS selector with the specified theme class.
        function setTheme(cssSelector, themeClass, theme)
        {
            $(cssSelector)
                    .removeClass(themes.split(" ").join(" " + themeClass + "-"))
                    .addClass(themeClass + "-" + theme)
                    .attr("data-theme", theme);
        }

        // Add more selectors/theme classes as needed.
        setTheme(".ui-mobile-viewport", "ui-overlay", theme);
        setTheme("[data-role='page']", "ui-page-theme", theme);
        setTheme(".ui-header", "ui-bar", theme);
		setTheme(".ui-footer", "ui-bar", theme);
        setTheme("[data-role='listview'] > li", "ui-bar", theme);
        setTheme(".ui-btn", "ui-btn-up", theme);
        setTheme(".ui-btn", "ui-btn-hover", theme);
    }
	









