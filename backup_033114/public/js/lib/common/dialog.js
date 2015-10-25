/*
 * Dialog to show inforamtion
 */

var showDialog = function(content){
	//Getting the variable's value from a link 
	var dialog = "#dialog";
	//Fade in the Popup
	$(dialog).fadeIn(300);

	// Add the mask to body
	$('body').append('<div id="mask"></div>');
	$('#mask').fadeIn(300);
	
	// Add content to the dialog
	$("#dialog-content").append(content);

	return false;
};

//When clicking on the button close or the mask layer the popup closed
var removeDialog = function(){
	$('a.close, #mask').on('click', function() { 
		$('#mask , .dialog-popup').fadeOut(300 , function() {
			//Remove mask
			$('#mask').remove();  
			
			//Remove everything in the content
			$("#dialog-content").empty();
		}); 
		return false;
	});
}
