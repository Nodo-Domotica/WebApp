var theme;
var nodoip;
var nodoport;
var nodoid;
var webappversion='WebApp (SWINWA-PROD-V1.5)';
var usergroup;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

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

	
//$.ajax omdat we de settings synchroon willen ophalen zodat we zeker weten dat de settings beschikbaar zijn als de pagina's worden geladen.
$.ajax({ 
         async: false,
         url: '/webservice/json_settings.php', 
         dataType: "json", 
         success: function(data) {
 			settings = data.settings;
			$.each(settings, function(index, setting) {
			theme=setting.theme;
			themeheader=setting.theme;
			webapp_title=setting.webapp_title;
			nodoip=setting.nodoip;
			nodoport=setting.nodoport;
			nodoid=setting.nodoid;
			usergroup=setting.usergroup;
			

		 });

		$(document).delegate('[data-role="page"]', 'pagecreate', function () { 
			
			
		 //Thema instellen
			$(this).removeClass( "ui-page-theme-a ui-page-theme-b ui-page-theme-c ui-page-theme-d ui-page-theme-e ui-page-theme-f ui-page-theme-g ui-page-theme-h" ).addClass( "ui-page-theme-" + theme );
			$(this).removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e ui-body-f ui-body-g ui-body-h').addClass('ui-body-'+theme).attr('data-theme', theme); 
			$('[data-role=header]').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f ui-bar-g ui-bar-h').addClass('ui-header ui-bar-'+theme);
			$('[data-role=footer]').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f ui-bar-g ui-bar-h').addClass('ui-footer ui-bar-'+theme);
			$('[data-role=listview]').attr('data-split-theme', theme);
			$('[data-role=dialog]').attr('data-theme', theme);
			//$('[data-role=page]').addClass( "ui-shadow-icon" );
			//$( '[data-role=page]' ).removeClass( "noshadow" );
			
			
			
			
			
		});
		
			
	}	
});










