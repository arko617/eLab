/**
 * Functions to access dropbox information, such as user information
 */

/**
 * To get the dropbox user information
 */
function getDropboxUserInfo(dbClient, callback){
	// Get user information
	dbClient.getAccountInfo(function(error, accountInfo) {
		  if (error) {
		    return showError(error);  // Something went wrong.
		  }

		  callback && callback(accountInfo);
		});
}

/**
 * Get information about storage
 */
function getDropboxStorageInfo(dbClient,callback) {
	dbClient.getAccountInfo(function(error, accountInfo) {
		  if (error) {
		    return showError(error);  // Something went wrong.
		  }
			var gbToBytes = 1073741824; // 1 Gb = 1073741824 bytes
			var percentageUsed= ((parseFloat(accountInfo.usedQuota)/parseFloat(accountInfo.quota))*100.0).toFixed(2);	//corrected to 1 decimal place 
			var totalUsage = (parseFloat(accountInfo.usedQuota)/parseFloat(gbToBytes)).toPrecision(3);
			var totalGb = parseInt(accountInfo.quota)/gbToBytes;
			spaceSummary = "{0}% of {1} GB is used".f(percentageUsed, totalGb);

			//Report
			console.log(spaceSummary);    
			callback && callback(percentageUsed,totalGb,totalUsage,spaceSummary);

		});
}

/**
 * Recursion for Hierarchical File View
 *
 */
function recursionDropbox(filesArray, isFolderArray, modelArray, callback){
	
	var APItestModel = Backbone.Model.extend({

		initialize: function(){
		},

		defaults: {
			id: '',
			name: '',
			title: '',
			isFolder: '',
			createdDate: '',
			download: '',
			del: '',
			rename: '',
			rename: '',
		},
		
	});
	
	var i = 0;

	for(; i < filesArray.length; i++) {	
		var icon = '<img src="http://www.kolbe.com/mKcom/assets/Image/document-icon1.png" style="width:20px;height:20px">';
		if(isFolderArray[i] == 1){
			icon = '<img src="http://dropboxformac.com/wp-content/uploads/2012/07/Dropbox-Folder.png" style="width:20px;height:20px">';
		}
		var string = filesArray[i].split("/");
		var space = "";
		for(var j = 0; j < string.length-1; j++){
			space += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		}
		var displayName = string[string.length-1];
		//console.log(string[string.length-1]);
		console.log(filesArray[i]);
		var model = new APItestModel({id: '/' + filesArray[i], name: displayName, title: "&nbsp;&nbsp;" + space + icon + "&nbsp;&nbsp;" + displayName, download: '<input type="image" src="http://openbrewery.org/images/download_icon-3333px.png" name="/{0}"'.f(filesArray[i]) + ' class="grabFile" style="width:15px;height:15px" />', del: '<input type="image" src="http://www.snowcamping.org/images/icon/delete.png" name="/{0}"'.f(filesArray[i]) + ' class="deleteFile" data-toggle="modal" data-target="#sureDelete" style="width:15px;height:15px" />', rename: '<input type="image" src="http://www.teelar.gr/images/Site_managment/Article_thumbs/Diafora/transfer_1.png" name="/{0}"'.f(filesArray[i]) + ' id="transferFile" style="width:15px;height:15px" />'});
		modelArray.push(model);															
	}
	
	if (i == filesArray.length){
		console.log('reached end');
		callback && callback();
	}
	
	console.log("Files Rendered Hierarchically");
}


/**
 * Custom Sort based on File Parent
 *
 */
var sortFuncDropbox = function(a, b)
{
	if(a.id < b.id)
		return -1;
	
	else if(a.id > b.id)
		return 1;
	
	else
		return 0;
}

