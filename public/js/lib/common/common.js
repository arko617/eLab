/**
 * Common functions that can be reused
 */

/**
 * Create Spinner for loading
 * target=id/class/etc of the DOM object
 */
function createSpinner(target,opts){
	$(target).empty();
	//Check if options are provided
	if (!opts){
		$(target).spin();
	}else{
		$(target).spin(opts);
	}
}

/**
 * Determine what icon should be used for a particular mimetype. 
 * Not for files (or folder inside a project) <--because they use default google icons
 */
function getIcon(mimeType){
	//console.log(mimeType)
	switch (mimeType){
	//For folder
	case "application/vnd.google-apps.folder":
		return "/icon/cheser/24x24/places/folder-documents.png";
	
	//For files
	case "text/plain":
		return "/icon/cheser/24x24/mimetypes/text-x-generic.png";
	case "text/html":
		return "/icon/cheser/24x24/mimetypes/text-html.png";
	case "application/rtf":
	case "application/pdf":
		return "/icon/cheser/24x24/mimetypes/application-pdf.png";
	case "application/vnd.google-apps.document":
		return "/icon/cheser/24x24/mimetypes/x-office-document.png";
	case "application/vnd.oasis.opendocument.text":
		return "/icon/cheser/24x24/mimetypes/x-office-document.png";
	case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		return "/icon/cheser/24x24/mimetypes/x-office-document.png";
	case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
		return "/icon/cheser/24x24/mimetypes/x-office-spreadsheet.png";
	case "application/x-vnd.oasis.opendocument.spreadsheet":
		return "/icon/cheser/24x24/mimetypes/x-office-spreadsheet.png";
	case "application/vnd.google-apps.spreadsheet":	
		return "/icon/cheser/24x24/mimetypes/x-office-spreadsheet.png";
	case "application/vnd.oasis.opendocument.presentation":
		return "/icon/cheser/24x24/mimetypes/x-office-presentation.png";
	case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
		return "/icon/cheser/24x24/mimetypes/x-office-presentation.png";
	case "application/vnd.google-apps.presentation":
		return "/icon/cheser/24x24/mimetypes/x-office-presentation.png";
	case "image/png":
		return "/icon/cheser/24x24/mimetypes/image-x-generic.png";
	case "image/jpeg":
		return "/icon/cheser/24x24/mimetypes/image-x-generic.png";
	case "image/gif":
		return "/icon/cheser/24x24/mimetypes/image-x-generic.png";
	case "image/svg+xml":
		return "/icon/cheser/24x24/mimetypes/image-x-generic.png";
	case "image/tiff":
		return "/icon/cheser/24x24/mimetypes/image-x-generic.png";
	case "image/bmp":
		return "/icon/cheser/24x24/mimetypes/image-x-generic.png";
	case "application/vnd.google-apps.drawing":
		return "/icon/cheser/24x24/mimetypes/x-office-drawing.png";

	default:
		//other applications
		return "/icon/cheser/24x24/mimetypes/applications-other.png";
	}				
}


/**
 * Check if an object is empty, i.e. {}
 * @param o
 * @returns {Boolean}
 */
function isEmptyObject(object){
    for(var i in object){
        if(object.hasOwnProperty(i)){
            return false;
        }
    }
    return true;
}

/**
 * A function to do simple string formatting
 * 
 * @returns {String}
 */
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
//Examples coode
//'Added {0} by {1} to your collection'.f(title, artist)
//'Your balance is {0} USD'.f(77.7) 

///**
// * To format date that is obtained from google drive
// */
//function formatDate(unformattedDate){
//	var date = new Date(unformattedDate);
//	var formattedDate = date.toLocaleDateString()+"\t"+ date.toLocaleTimeString();
//	return formattedDate;
//}

/****************For dialog***************/
/**
 * Dialog to show information
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

/**
 * When clicking on the button close or the mask layer the popup closed 
 */
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