/**
 * Google Drive Javascript Client Operation:CRUD  
 */
var folderId ="0B8x08fyIZQ1vbkpZMENtTGxJTVE"; //"root" for the root folder; currently it is the 'LabBook' folder Id


/******************************CREATE***************************/
/**
 * Create a GDoc
 */
function createGFile(folderId,title,mimeType,callback){
	var successMessage = "Create GFile completed.";
	var failMessage="Sorry, create GFile incompleted";
	data = new Object();
	data.title = title;
	data.mimeType = mimeType;
	gapi.client.drive.files.insert({'resource': data}).execute(function(resp){
		//console.log(resp);
		if (!resp.error){
			insertFileIntoFolder(folderId,resp.id,function(resp2){
				if (!resp2.error){
					callback && callback(successMessage,true,resp);
				}else{
					callback && callback(failMessage,false);
				}
			});
		}else{
			callback && callback(failMessage,false);
		}
	});	
};


/**
 * Create a project(folder) in google drive
 */
function createProject(folderId,title,callback){
	var successMessage = "Create project completed.";
	var failMessage="Sorry, create project incompleted";
	data = new Object();
	data.title = title;
	//data.parents = [{"id":jQuery('#parent').val()}];
	data.mimeType = "application/vnd.google-apps.folder";
	gapi.client.drive.files.insert({'resource': data}).execute(function(resp){
		if (!resp.error){
			insertFileIntoFolder(folderId,resp.id,function(resp2){
				if (!resp2.error){
					console.log(successMessage,resp2);
					callback && callback(successMessage,true,resp);
				}else{
					callback && callback(failMessage,false);
				}
			});
		}else{
			callback && callback(failMessage,false);
		}

		//Permission of the folder
//		var folderID = response["id"];
//		insertPermission(folderID,"johnny5550822@gmail.com","user","owner");				
	});	
};

/***************************READ***************************/
/**
 * Retrieve a list of all File/folder in Google drive.
 *
 * @param {Function} callback Function to call when the request is complete.
 */
function retrieveAllFiles(query, callback) {
	console.log("Getting files & folders list from drive...");
	var retrievePageOfFiles = function(request, result) {
		request.execute(function(resp) {
			result = result.concat(resp.items);

			//Testing
			//alert("Result:"+result.length);
			//console.log("Result:"+JSON.stringify(result[0]));

			//If the number of files exceed limits, it will go to next page (cumulative)
			var nextPageToken = resp.nextPageToken;
			if (nextPageToken) {
				request = gapi.client.drive.files.list({
					'pageToken': nextPageToken,
					"maxResults":1000,
					"q":query,
				});
				retrievePageOfFiles(request, result);
			} else {
				//wait until all the files information are obtained
				console.log("Drive files",result);
				console.log("Drive files", result.length);
//				console.log("The totle length of the files list:",result.length);
				return loopFiles(result,callback);
			};
		});
	}
	var initialRequest = gapi.client.drive.files.list({
		"maxResults":1000,
		"q":query,
	});
	retrievePageOfFiles(initialRequest, []);
};

/**
 * Retrieve a list of all File/folder in a particular folder.
 *
 * @param {Function} callback Function to call when the request is complete.
 */
function retrieveChildrenFiles(folderId,query, mimeType, callback) {
	var defaultQuery = "'{0}' in parents ".f(folderId);
	// Formulate the search query
	if(mimeType){
		defaultQuery +="and mimeType" + mimeType;
	}
	console.log("Getting files & folders list from LabBook project...");
	var retrievePageOfFiles = function(request, result) {
		request.execute(function(resp) {
			result = result.concat(resp.items);

			//Testing
//			alert("Result:"+result.length);
//			console.log("Result:"+JSON.stringify(result[0]));

			//If the number of files exceed limits, it will go to next page (cumulative)
			var nextPageToken = resp.nextPageToken;
			if (nextPageToken) {
				request = gapi.client.drive.files.list({
					"folderId":folderId,
					'pageToken': nextPageToken,
					"maxResults":1000,
					"q":query || defaultQuery,
				});
				retrievePageOfFiles(request, result);
			} else {
				//wait until all the files information are obtained
				console.log("LabBook files", result);
				return loopFiles(result,callback);
			};
		});
	}
	var initialRequest = gapi.client.drive.files.list({
		"folderId":folderId,
		"maxResults":1000,
		"q":query || defaultQuery,
	});
	retrievePageOfFiles(initialRequest, []);
};

/**
 * Loop the file and get certain information
 */
function loopFiles(result,callback){
	//console.log(result);
	//alert("Looping result list");
	var fileArray = [];	//Reformat the file array
	if (typeof result[0] !='undefined'){
		for (var i=0;i<result.length;i++){
			var file = makeFileObject(result[i]);

			//Push to file array
			fileArray.push(file);						
		}
	}
	//Callback
	return callback(fileArray);
}	

/**
 * Make a file object from the original file object which have desire attributes
 */
function makeFileObject(oldFile){
	var title = oldFile.title
	, createdDate = formatDate(oldFile.createdDate)
	, modifiedDate = formatDate(oldFile.modifiedDate)
	, unformattedModifiedDate = new Date(oldFile.modifiedDate)
	, link = oldFile.alternateLink
	, id = oldFile.id
	, mimeType = oldFile.mimeType
	, permission = oldFile.userPermission
	, header = oldFile.header
	, content = oldFile.content;
	var file = {title:title,id:id,createdDate:createdDate,modifiedDate:modifiedDate,unformattedModifiedDate:unformattedModifiedDate,link:link,mimeType:mimeType,permission:permission, header:header, content:content};

	return file;
}



/**
 * Get a file metedata
 */
function getFileMeta(fileId,callback){
	var request = gapi.client.drive.files.get({
		'fileId': fileId
	});
	request.execute(function(resp) {
		callback(resp);
	});
}


/*******************************Delete*********************/
/**
 * Permanently delete a file, skipping the trash.
 */
//function deleteFile(fileId, callback) {
//	var successMessage = "Delete complete";
//	var failMessage = "Sorry, delete incomplete";
//	var request = gapi.client.drive.files.delete({
//		'fileId': fileId
//	});
//	request.execute(function(resp) { 
//		if (!resp.error){
//			if (isEmptyObject(resp["result"])){
//				//console.log(successMessage);
//				callback && callback(successMessage, true);
//			}
//		}else{
//			callback && callback(failMessage,false);
//		}
//
//	});
//}
function deleteFile(fileId, callback) {
	getFileMeta(fileId, function(file){
		var successMessage = "Delete complete";
		var failMessage = "Sorry, failed to delete <b><u>{0}</u></b>".f(file["title"]),url = "";
		var request = gapi.client.drive.files.delete({
			'fileId': fileId
		});
		request.execute(function(resp) { 
			if (!resp.error){
				if (isEmptyObject(resp["result"])){
					//console.log(successMessage);
					callback && callback(successMessage, fileId, true);
				}
			}else{
				callback && callback(failMessage, fileId, false);
			}

		});
	});
}


/*********************************Download*********************
/**
 * Download a file
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(fileId, callback) {
	getFileMeta(fileId,function(file){
		var header = "Download <b><u>{0}</u></b> from LabBook:<br>".f(file["title"])
		,url = "";
		console.log(file);		
		//only non-google-drive created file have downloadURL, i.e. your uploaded files each has a downloadURL
		//If the document is created in Google, it has exportLinks
		//If it is a folder, it cannot be downloaded
		if (file.downloadUrl) {	
			url += "<a href='{0}'>Download Link</a>".f(file['webContentLink']);
		}else if (file['exportLinks']){
			var exportLinks = file['exportLinks'];

			for (var property in exportLinks) {				
				//TO ensure the properties is not from inheritance, i.e. object's own properties
				if (exportLinks.hasOwnProperty(property)) {
					switch (property){
					case "application/pdf":
						url+="<a href='{0}'>.pdf</a><br>".f(exportLinks[property]);
						break;
					case "application/rtf":
						url+="<a href='{0}'>.rtf</a><br>".f(exportLinks[property]);
						break;
					case "application/vnd.oasis.opendocument.text":
						url+="<a href='{0}'>.odt</a><br>".f(exportLinks[property]);	
						break;
					case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
						url+="<a href='{0}'>.docs</a><br>".f(exportLinks[property]);
						break;
					case "text/html":
						url+="<a href='{0}'>.html</a><br>".f(exportLinks[property]);
						break;
					case "text/plain":
						url+="<a href='{0}'>.txt</a><br>".f(exportLinks[property]);
						break;
					case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
						url+="<a href='{0}'>.xlsx</a><br>".f(exportLinks[property]);	
						break;
					case "application/x-vnd.oasis.opendocument.spreadsheet":
						url+="<a href='{0}'>.ods</a><br>".f(exportLinks[property]);
						break;
					case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
						url+="<a href='{0}'>.pptx</a><br>".f(exportLinks[property]);
						break;
					case "image/png":
						url+="<a href='{0}'>.png</a><br>".f(exportLinks[property]);	
						break;
					case "image/jpeg":
						url+="<a href='{0}'>.jpeg</a><br>".f(exportLinks[property]);
						break;
					case "image/svg+xml":
						url+="<a href='{0}'>.svg</a><br>".f(exportLinks[property]);	
						break;
					}
				}
			}
		}else{
			url+="Sorry, this cannot be downloaded";
		};

		// Download the file in browser
		callback(header, url);
	});
}

/**
 * Download a GDoc's content (doc mainly), used for configuration file
 *
 */
function downloadGDocContent(fileId, callback) {	
	getFileMeta(fileId,function(file){
		//console.log(file);		
		//only non-google-drive created file have downloadURL, i.e. your uploaded files each has a downloadURL
		//If the document is created in Google, it has exportLinks and we use exportLink as the downloadLink
		if (file['exportLinks']){
			var exportLinks = file['exportLinks'];
			var plainTxtLink = exportLinks['text/plain'];

			//Get content through xml http request
			var accessToken = gapi.auth.getToken().access_token;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', plainTxtLink);
			xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
			xhr.onload = function() {
				//console.log("this is the content",xhr.responseText);

				//Callback function
				callback && callback(xhr.responseText);
			};

			//Error messages
			xhr.onerror = function() {
				console.log("Download Gdoc content error");
			};
			xhr.send(); // establish a connection

		}else{
			console.log("Fail to download Gdoc content.");
		};
	});
}


/****************************************Upload***********************/

/**
 * Start the file upload using javascript File API
 */
function uploadFile(folderId,evt,callback) {
	var successMessage = "Upload complete.";
	var failMessage = "Sorry, upload incomplete";
	var file = evt.target.files[0];
	//first insert the file into drive
	insertFile(file,function(resp){
		if (!resp.error){
			//then move the file into destinated folder, e.g. LabBook folder
			insertFileIntoFolder(folderId,resp.id,function(resp2){
				if (!resp2.error){
					console.log(successMessage);
					callback && callback(successMessage,true,resp);
				}else{
					callback && callback(failMessage,false);
				}
			});
		}else{
			callback && callback(failMessage,false);
		}
	});
}

/**
 * Insert new file to drive root.
 */
function insertFile(fileData, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";
	var reader = new FileReader();
	reader.readAsBinaryString(fileData);
	reader.onload = function(e) {
		var contentType = fileData.type || 'application/octet-stream';
		var metadata = {
				'title': fileData.name,
				'mimeType': contentType
		};

		var base64Data = btoa(reader.result);
		var multipartRequestBody =
			delimiter +
			'Content-Type: application/json\r\n\r\n' +
			JSON.stringify(metadata) +
			delimiter +
			'Content-Type: ' + contentType + '\r\n' +
			'Content-Transfer-Encoding: base64\r\n' +
			'\r\n' +
			base64Data +
			close_delim;

		var request = gapi.client.request({
			'path': '/upload/drive/v2/files',
			'method': 'POST',
			'params': {'uploadType': 'multipart'},	//no resumable upload at this moment. File size<5MB
			'headers': {
				'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
			},
			'body': multipartRequestBody});
		request.execute(callback);
	};
};

/**
 * Insert a file into a folder of drive.
 *
 */
function insertFileIntoFolder(folder_Id, fileId, callback) {
	var body = {'id': fileId};
	var request = gapi.client.drive.children.insert({
		'folderId': folder_Id,
		'resource': body
	});
	request.execute(function(resp) { 
		callback && callback(resp);
	});
}


/*************************************************Update*************************/
/**
 * Rename a file/folder
 *
 */
function renameFile(fileId, newTitle,callback) {
	var successMessage = "Rename complete.";
	var failMessage = "Sorry, rename incomplete.";
	var body = {'title': newTitle};
	var request = gapi.client.drive.files.patch({
		'fileId': fileId,
		'resource': body
	});
	request.execute(function(resp) {
		if (!resp.error){
			console.log("Rename fileId:{0} to {1}".f(fileId,newTitle));
			callback && callback(successMessage,true);
		}else{
			callback && callback(failMessage,false);
		}
	});
}

/**
 * Version1: Update an existing file's metadata and content.
 */
function updateDriveFile(fileId, folderId, text, callback) {
	console.log(text)
	var successMessage = "Update Drive file complete.";
	var failMessage = "Sorry, update incomplete.";
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";

	var contentType = "text/html";
	var metadata = {'mimeType': contentType,};

	var multipartRequestBody =
		delimiter +  'Content-Type: application/json\r\n\r\n' +
		JSON.stringify(metadata) +
		delimiter + 'Content-Type: ' + contentType + '\r\n' + '\r\n' +
		text +
		close_delim;

	if (!callback) { callback = function(file) { console.log("Update Complete ",file) }; }

	var request = gapi.client.request({
		'path': '/upload/drive/v2/files/'+folderId+"?fileId="+fileId+"&uploadType=multipart",
		'method': 'PUT',
		'params': {'fileId': fileId, 'uploadType': 'multipart'},
		'headers': {'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
		'body': multipartRequestBody,
	})

	request.execute(function(resp){
		if (!resp.error){
			callback && callback(successMessage,true);
		}else{
			callback && callback(failMessage,false);
		}
	});
}


/**
 * Version2: Update an existing file's metadata and content.
 */
//function updateDriveFile(fileId, fileMetadata, fileData, callback) {
//var successMessage = "Update Drive file complete.";
//var failMessage = "Sorry, update incomplete.";
//const boundary = '-------314159265358979323846';
//const delimiter = "\r\n--" + boundary + "\r\n";
//const close_delim = "\r\n--" + boundary + "--";

//var reader = new FileReader();
//reader.result = fileData;
//reader.onload = function(e) {
//var contentType = fileData.type || 'application/octet-stream';
//// Updating the metadata is optional and you can instead use the value from drive.files.get.
//var base64Data = btoa(reader.result);
//var multipartRequestBody =
//delimiter +
//'Content-Type: application/json\r\n\r\n' +
//JSON.stringify(fileMetadata) +
//delimiter +
//'Content-Type: ' + contentType + '\r\n' +
//'Content-Transfer-Encoding: base64\r\n' +
//'\r\n' +
//base64Data +
//close_delim;

//var request = gapi.client.request({
//'path': '/upload/drive/v2/files/' + fileId,
//'method': 'PUT',
//'params': {'uploadType': 'multipart', 'alt': 'json'},
//'headers': {
//'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
//},
//'body': multipartRequestBody});
//if (!callback) {
//callback = function(file) {
//console.log(file)
//};
//}
//request.execute(function(resp) {
//if (!resp.error){
//callback && callback(successMessage,true);
//}else{
//callback && callback(failMessage,false);
//}
//console.log(resp.error);
//});
//}
//reader.onload()
//}

/***************Copy and Move**************************************/

/**
 * Copy a given file and move it to a new folder
 *
 * @param {Function} callback Function to call when the request is complete.
 * @param {string} fileId - fileId of the file to copy
 * @param {string} parentId - folder id of the folder to move the file to
 * @param {string} title - name of the new file
 */
function copyAndMove(fileId, parentId, title, callback) {
	var successMessage = "Created new protocol!";
	var failMessage = "Could not create new protocol.";

	var parent = {'id' : parentId};
	var body = {'title' : title, 'parents' : [parent]};

	var request = gapi.client.drive.files.copy ({
		'fileId' : fileId,
		'resource' : body
	});
	request.execute(function(resp) {
		if (!resp.error){
			console.log("Creating new file:{0}".f(title));
			callback && callback(successMessage,true,resp);
		}else{
			callback && callback(failMessage,false,resp);
		}
	});
};




