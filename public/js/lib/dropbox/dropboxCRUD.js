// Functions to do file management (CRUD) in dropbox

// ------------------------------------------------READ---------------------

/*
 * Read a Directory Content
 */
function readDirContent(dbClient, directory, callback){
	// Get user information
	dbClient.readdir(directory, function(error, entries) {
		  if (error) {
		    return showError(error);  // Something went wrong.
		  }

		  callback && callback(entries);
		});
}

//recursive function to get all the files and their heirachical order
function readDirAllContent(cPos,fileList,fileIsFolderList,callback){
	  console.log('cPos:',cPos);
	  if (fileList[cPos]!=null){					  
		  //1. get the content
		  thisName = fileList[cPos];
		  dbClient.readdir(thisName, function readDirCallback(error, entries) {
			  if (error) {
				  return showError(error);  // Something went wrong.
			  }
			  //console.log('ssss',entries)
			  
			  //append to the file list
			  console.log(entries);
			  if (entries !=null){
				  //append the parent to all the current entries
				  for (i=0;i<entries.length;i++){
					  entries[i] = thisName + '/' + entries[i]
				  }
				  
				  fileList = fileList.concat(entries);
				  //console.log('+++',fileList);
			  }
			  
			  //store if the 'thisName' is a file or a folder
			  if (entries ==null){
				  fileIsFolderList.push(0);
			  }else{
				  fileIsFolderList.push(1);
			  }
			  						  
			  //update position
			  cPos += 1;
			  readDirAllContent(cPos,fileList,fileIsFolderList,callback);					  
		  });
	  }else{
		  callback && callback(fileList, fileIsFolderList);
	  }
}


/*
 * Read a file content
 */
function readAFile(dbClient, filePath, callback){
	dbClient.readFile(filePath, function(error, data) {
		  if (error) {
		    return showError(error);  // Something went wrong.
		  }

		  callback && callback(data);
		});
}


// --------------------------Download ----------------

/*
 * Make a donwload link
 */
function db_getDownloadLink(dbClient, filePath, options, callback){
	dbClient.makeUrl(filePath, options, function(error, url) {
		  if (error) {
		    return showError(error);  // Something went wrong.
		  }

		  callback && callback(url,error);
		});
}



// -------------------------- General--------
function showError(error){
	console.log("Oops...error:",error);
}






