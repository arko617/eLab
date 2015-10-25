/**
 * Google Drive Javascript Client Operation: drive info
 */

/**
 * Print information about the current user, such as storage left
 */
function getDriveStorageInfo(callback) {
	var request = gapi.client.drive.about.get();

	request.execute(function(resp) {
//		console.log('Current user name: ' + resp.name);
//		console.log('Root folder ID: ' + resp.rootFolderId);
//		console.log('Total quota (bytes): ' + resp.quotaBytesTotal);
//		console.log('Used quota (bytes): ' + resp.quotaBytesUsed);
		var gbToBytes = 1073741824; // 1 Gb = 1073741824 bytes
		var percentageUsed= ((parseFloat(resp.quotaBytesUsed)/parseFloat(resp.quotaBytesTotal))*100.0).toFixed(2);	//corrected to 1 decimal place 
		var totalUsage = (parseFloat(resp.quotaBytesUsed)/parseFloat(gbToBytes)).toPrecision(3);
		var totalGb = parseInt(resp.quotaBytesTotal)/gbToBytes;
		spaceSummary = "{0}% of {1} GB is used".f(percentageUsed, totalGb);

		//Report
		console.log(spaceSummary);    
		callback && callback(percentageUsed,totalGb,totalUsage,spaceSummary);
	});
}

/**
 * Get current user name
 */
function getUserName(callback) {
	var request = gapi.client.drive.about.get();

	request.execute(function(resp) {
		callback && callback(resp["name"]);
	});
}

/**
 * Get the parents list of a folder/file
 */
function getFileParents(fileId,callback) {
  var request = gapi.client.drive.parents.list({
    'fileId': fileId
  });
  request.execute(function(resp) {
    for (parent in resp.items) {
      console.log('File Id: ' + resp.items[parent].id);
    }
    
    callback && callback(resp);
  });
}


/*
 * *************************************************Project comments******************************
 */

/**
 * Insert a new document-level comment.
 */
function insertComment(fileId, content,callback) {
  var body = {'content': content};
  var request = gapi.client.drive.comments.insert({
    'fileId': fileId,
    'resource': body
  });
  
  request.execute(function(resp) {
	  console.log("The response of inseting comment is:",resp);
	  callback && callback();
	  
  });
}

 /**
  * Retrieve a list of comments.
  *
  */
 function retrieveComments(fileId, callback) {
   var request = gapi.client.drive.comments.list({
     'fileId': fileId
   });
   request.execute(function(resp){
	   console.log("Retrieve Comments:",resp);
	   callback && callback();
	   
   });
 }
  

/*
 * ******************************************Permission***********************************88
 */
/**
 * Print the Permission ID for an email address. 
 *
 * @param {String} email Email address to retrieve ID for.
 */
function printPermissionIdForEmail(email,callback) {
	var request = gapi.client.drive.permissions.getIdForEmail({
		'email': email,
	});
	request.execute(function(resp) {
		callback && callback(resp.id);
	});
};

/**
 * Handle the permission. Value: user or group e-mail address; Type: user, group, domain, default; Role: owner, writer, reader
 */
function insertPermission(fileId, value, type, role, callback) {
	var successMessage = "Grant new user permission completes.";
	var failMessage = "Grant new user permission incompletes.";
	var body = {
			'value': value,
			'type': type,
			'role': role
	};
	var request = gapi.client.drive.permissions.insert({
		'fileId': fileId,
		'resource': body
	});
	request.execute(function(resp) {
		if (!resp.error){
			console.log(successMessage,resp);
			callback && callback(successMessage,true,resp);
		}else{
			console.log(failMessage,resp);
			callback && callback(failMessage,false,resp);
		}
	});
};

/**
 * Remove a permission for a file/folder
 *
 */
function removePermission(fileId, permissionId,callback) {
	var successMessage = "Remove permission complete.";
	var failMessage = "Sorry, Remove permission incomplete";
	var request = gapi.client.drive.permissions.delete({
		'fileId': fileId,
		'permissionId': permissionId
	});
	request.execute(function(resp) { 
		if (!resp.error){
			console.log(successMessage,resp);
			callback && callback(successMessage,true);
		}else{
			console.log(failMessage,false,resp);
			callback && callback(failMessage,false);
		}
	});
}

/**
 * Retrieve a list of permissions.
 *
 */
function retrievePermissions(fileId, callback) {
	var request = gapi.client.drive.permissions.list({
		'fileId': fileId
	});
	request.execute(function(resp) {
		callback && callback(resp.items);	//resp.items = array of user info
	});
}

/**
 * Print the Permission ID for an email address. 
 */
function getPermissionIdForEmail(email,callback) {
	var request = gapi.client.drive.permissions.getIdForEmail({
		'email': email,
	});
	request.execute(function(resp) {
		callback && callback(resp.id);
	});
};

/**
 * Update a permission's role by permissionId
 *
 */
function updatePermissionByPermissionId(fileId, permissionId, newRole) {
  // First retrieve the permission from the API.
  var request = gapi.client.drive.permissions.get({
    'fileId': fileId,
    'permissionId': permissionId
  });
  request.execute(function(resp) {
    resp.role = newRole;
    var updateRequest = gapi.client.drive.permissions.update({
      'fileId': fileId,
      'permissionId': permissionId,
      'resource': resp
    });
    updateRequest.execute(function(resp) { 
    	console.log("!!!!!!",resp);
    });
  });
}

/**
 * Update a permissions'role by email
 */
function updatePermissionByEmail(fileId,email,newRole){
	getPermissionIdForEmail(email,function(permissionId){
		updatePermissionByPermissionId(fileId,permissionId,newRole);
	});	
}

/**
 * Patch a permission's role.
 *
 */
function patchPermissionByPermissionId(fileId, permissionId, newRole) {
  var body = {'role': newRole};
  var request = gapi.client.drive.permissions.patch({
    'fileId': fileId,
    'permissionId': permissionId,
    'resource': body
  });
  request.execute(function(resp) {
  	console.log("!!!!!!",resp);
  });
}

/**
 * Patch a permissions'role by email
 */
function patchPermissionByEmail(fileId,email,newRole){
	getPermissionIdForEmail(email,function(permissionId){
		patchPermissionByPermissionId(fileId,permissionId,newRole);
	});	
}


/**
 * Recursion for Hierarchical File View
 *
 */
function recursion(inherit, immediateParent, filesArray, modelArray, callback){
	
	var APItestModel = Backbone.Model.extend({

		initialize: function(){
		},

		defaults: {
			id: '',
			title: '',
			isFolder: '',
			createdDate: '',
			download: '',
			del: '',
			rename: '',
		},
		
	});
	
	var i = 0;

	for(; i < filesArray.length; i++) {
		
		if(filesArray[i].parent.length > 0){
			
			for(var j = 0; j < filesArray[i].parent.length; j++){
				
				if(filesArray[i].parent[j].id == immediateParent){
					if(filesArray[i].isFolder == true){	
						var model = new APItestModel({id: filesArray[i].id, title: inherit + "&nbsp;&nbsp;" + '<img src="'+ filesArray[i].iconLink +'" style="width:20px;height:20px">' + "&nbsp;&nbsp;" + filesArray[i].title.bold(), download: '<input type="image" src="http://openbrewery.org/images/download_icon-3333px.png" name=' + filesArray[i].id + ' class="grabFile" style="width:15px;height:15px" />', del: '<input type="image" src="http://www.snowcamping.org/images/icon/delete.png" name=' + filesArray[i].id + ' class="deleteFile" data-toggle="modal" data-target="#sureDelete" style="width:15px;height:15px" />'});
						
						modelArray.push(model);											
						recursion(inherit + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp", filesArray[i].id, filesArray, modelArray, callback);
					}
					
					else{
						var model = new APItestModel({id: filesArray[i].id, title: inherit + "&nbsp;&nbsp;" + '<img src="'+ filesArray[i].iconLink +'" style="width:20px;height:20px">' + "&nbsp;&nbsp;" + filesArray[i].title, download: '<input type="image" src="http://openbrewery.org/images/download_icon-3333px.png" name=' + filesArray[i].id + ' class="grabFile" style="width:15px;height:15px" />', del: '<input type="image" src="http://www.snowcamping.org/images/icon/delete.png" name=' + filesArray[i].id + ' class="deleteFile" data-toggle="modal" data-target="#sureDelete" style="width:15px;height:15px" />'});
						
						modelArray.push(model);
						recursion(inherit + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp", filesArray[i].id, filesArray, modelArray, callback);
					}
					
				}
			}
		}
	}
	
	if (i == filesArray.length && immediateParent == "0AN9TACL_6_flUk9PVA"){
		console.log('reached end');
		callback && callback();
	}
	
	console.log("Files Rendered Hierarchically");
}


/**
 * Custom Sort based on File Parent
 *
 */
var sortFunc = function(a, b){
	if(a.parent.length < b.parent.length)
		return -1;
	
	else if(a.parent.length > b.parent.length)
		return 1;
	
	else
		return 0;
}



