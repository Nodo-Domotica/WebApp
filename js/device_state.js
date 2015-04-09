var ArrayDeviceDimvalue=new Array();
function Device_State(){

var url='api/devicestate';



var status;

	
		$.getJSON(url,function(data){
			
			if (data != null) {
				$.each(data, function(i,data){
				
					indicator_text = data.indicator_text;

					// The array of regex patterns to look for
					$format_search =  [
						/\[small\](.*?)\[\/small\]/ig,
						/\[i\](.*?)\[\/i\]/ig,
						/\[u\](.*?)\[\/u\]/ig,
						/\[sup\](.*?)\[\/sup\]/ig,
						/\[sub\](.*?)\[\/sub\]/ig						
					]; // note: NO comma after the last entry

					// The matching array of strings to replace matches with
					$format_replace = [
						'<font size=-1>$1</font>',
						'<i>$1</i>',
						'<u>$1</u>',
						'<sup>$1</sup>',
						'<sub>$1</sub>'
					];

					// Perform the actual conversion
					for (var i =0;i<$format_search.length;i++) {
					  indicator_text = indicator_text.replace($format_search[i], $format_replace[i]);
					}
					//lert($str)
				 
					
					
					if (data.indicator_text != '') {
					
						document.getElementById('switch_description'+data.id).innerHTML = '<img src="" class="ui-li-icon" id=switch_'+ data.id+' >'+ indicator_text;
						//$('switch_description'+data.id).html('<img src="" class="ui-li-icon" id=switch_'+ data.id+' >'+ data.indicator_text);
					}
					//else {
					
					//document.getElementById('switch_description'+data.id).innerHTML = '<img src="" class="ui-li-icon" id=switch_'+ data.id+' >'+ data.description;
						
					
					//}
					
					if (data.indicator_icon == 0 && data.icon == 0 ) {
						
						
							
							document.getElementById('switch_'+data.id).src = '';
						
					}
					else if  (data.indicator_icon > 0) {
					
							document.getElementById('switch_'+data.id).src = 'media/'+data.indicator_icon+'.png';
					}
					else {
							document.getElementById('switch_'+data.id).src = 'media/'+data.icon+'.png';
					
					}			   
				});
			}
		});

}