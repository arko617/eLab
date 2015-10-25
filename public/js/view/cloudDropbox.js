/*
 * Arko API Test View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/APIModel',
        'collection/APICollection',
        'text!view_template/arko_APItest/APITemplate.html',
        'text!view_template/arko_APItest/popupTemplate.html',
        'bootstrapLib',

        ], function($, _, Backbone,APIModel,APICollection,APITemplate,PopupTemplate){

	var allFiles = [];
	var fileList = [];
	var folderList = [];
	var drapUploadFile = '';
	var CloudDropbox = Backbone.View.extend({
		el: ".site-main",
		apiTemplate: _.template(APITemplate),
		popupTemplate: _.template(PopupTemplate),
		initialize: function(){
			
			this.renderFiles();
			this.renderAction();
			dbClient = this.options.dbClient;
		},

		renderAction: function(){
			$(".site-main").append('<br>');
			$(".site-main").append('<div id="alignCenter" align="center"></div>');
			
			var buttons = [];
			var create = new APIModel({title: 'Create', intro:'<div style="text-align:center"><h4>Type New Folder Name...</h4></div>', action:'<input type="text" id="folderName"><br><br><br><button class="btn btn-primary" id="createFolder" type="button" style="height:57px; width:75px;"><h4>OK</h4></button>'});
			var upload = new APIModel({title: 'Upload', intro:'Select The File...', action:'<div align="center" style="height:48px; width:200px; display:inline-block;"><form action="demo_form.asp"><input id="uploadFileToDrive" type="file"  name="anything"></form></div><br><div class="upload-drop-zone" id="drop-zone" style="height:200px; width:450px; margin-bottom:30px; border-width:2px; border-style:dashed; text-align:center; line-height:190px; color:#ccc; border-color:#ccc">Just Drag And Drop Files Here...</div><button class="btn btn-primary" id="newFileUpload" type="button" style="height:57px; width:75px;"><h4>OK</h4></button>'});
			var that = this;
			
			// Push the model in to collections
			buttons.push(create);
			buttons.push(upload);		
			
			//Create a cospace Collection
			this.actionCollection = new APICollection(buttons);
			

			this.actionCollection.each(function(model){
				//Show new content
				$("#alignCenter").append('<div style="height:50px; width:25px; display:inline-block;"></div>');			
				$("#alignCenter").append(this.popupTemplate(model.toJSON()));
				$("#alignCenter").append('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#'+ model.get('title') +'" style="height:57px; width:107px;"><h4>' + model.attributes.title + '</h4></button>');
				$("#alignCenter").append('<div style="height:50px; width:25px; display:inline-block;"></div>');			
			},this);	//this is the callback	
			
			$(".site-main").append('<br><br>');
			
			var popDoc = new APIModel({title: 'newDocName', intro:'<div style="text-align:center"><h4>Type New Document Name...</h4></div>', action: '<input type="text" id="documentName"><br><br><br><button class="btn btn-primary" id="newGoogleDoc" type="button" style="height:50px; width:75px;"><h4>OK</h4></button>'});
			var popFolder = new APIModel({title: 'newFolderName', intro:'<div style="text-align:center"><h4>Type New Folder Name...</h4></div>', action: '<input type="text" id="folderName"><br><br><br><button class="btn btn-primary" id="newFolder" type="button" style="height:50px; width:75px;"><h4>OK</h4></button>'});
			var popSure = new APIModel({title: 'sureDelete', intro:'<div style="text-align:center"><h4>Are You Sure???</h4></div>', action: '<div align="center" style="height:48px; width:125px; display:inline-block;"><button class="btn btn-primary" id="deleteSure" type="button" style="height:60px; width:110px;"><h4>Delete</h4></button></div>'});
			$("#alignCenter").append(this.popupTemplate(popDoc.toJSON()));
			$("#alignCenter").append(this.popupTemplate(popFolder.toJSON()));
			$("#alignCenter").append(this.popupTemplate(popSure.toJSON()));
			
			
			var obj = $("#drop-zone");
			
			obj.on('dragenter', function (e) 
			{
			    e.stopPropagation();
			    e.preventDefault();
			    $(this).css('border', '2px solid #0B85A1');
			});
			
			obj.on('dragover', function (e) 
			{
			     e.stopPropagation();
			     e.preventDefault();
			});
			
			obj.on('drop', function (e) 
			{
				 dragUploadFile = e;
			     $(this).css('border', '2px dotted #0B85A1');
			     e.preventDefault();
			     var files = e.originalEvent.dataTransfer.files;
			});
			
			
			$("#createFolder").click(function(){
				var title = document.getElementById('folderName').value;
				var exists = 0;
				
				for(var i = 0; i != allFiles.length; i++){
					if(title == ""){
						alert("No File Name!")
						exists = 1;
						break;
					}
					
					else if(allFiles[i].attributes.name == title){
						alert("File Name Already Exists!")
						exists = 1;
						break;
					}
				}
				
				if(exists == 0){
					dbClient.mkdir("/" + title, function(){
						window.location.reload();
						console.log("Folder Created");
					});
				}
			});
			
			/*$("#newFileUpload").click(function(){
				if(dragUploadFile){
					console.log(dragUploadFile);
					uploadFile("0AN9TACL_6_flUk9PVA",dragUploadFile,function(){
						window.location.reload();
						console.log("File Uploaded");
					});
				}
			});*/
		},
		
		// Event handling for download, delete, and rename
		events:{
			"click .grabFile": "Grabbing",
			"click .deleteFile": "Deleting",
			"click #transferFile": "Transfering",
			"change #uploadFileToDrive": "UploadingFileToDrive"
		},
		
		//upload file into drive
		UploadingFileToDrive: function(evt){
			$("#newFileUpload").click(function(){
				dbClient.writeFile("/" + evt.value, evt, null, function(){
					window.location.reload();
					console.log("File Uploaded");
				});
			});
		},
		
		Grabbing: function(evt){
			console.log(evt.currentTarget.name);
			options = {download:true};
			db_getDownloadLink(dbClient, evt.currentTarget.name, options, function(link, error){
				window.location.assign(link.url);
				console.log("Grabbed");
			});
		},
		
		Deleting: function(evt){
			$("#deleteSure").click(function(){
				dbClient.remove(evt.currentTarget.name, function(){
					window.location.reload();
					console.log("Deleted");
				});
			});
		},
		
		//---------------transfer all files from Google drive to dropbox with folders hierachy
		Transfering: function(evt){
			var completeFile = [];
			var folderIsFoler = [];
			
			for(var i = 0; i < allFiles.length; i++){
				var checking = evt.currentTarget.name.split("/");
				if(evt.currentTarget.name == allFiles[i].attributes.id){
					completeFile.push(evt.currentTarget.name);
					for(var j = i+1; j < allFiles.length; j++){
						var checkNext = allFiles[j].attributes.id.split("/");
						if(checking.length < checkNext.length){
							completeFile.push(allFiles[j].attributes.id);
						}
						
						else{
							break;
						}
					}
					break;
				}
			}
			
			for(var k = 0; k < completeFile.length; k++){
				for(var l = 0; l < fileList.length; l++){
					if(completeFile[k] == ("/" + fileList[l])){
						folderIsFoler.push(folderList[l]);
					}
				}
			}
			
			console.log(completeFile);
			console.log(folderIsFoler);
			
			var transferDB = function(completeFileList,fileIsFolerList,callback){
				var that = this;
				console.log('????????????',completeFileList);
				console.log(fileIsFolerList)
				
				posCounter = 0; // Counter for array position
				
				//---------------- Upload to Google drive
				// 1.insert the dropbox files into google drive dropbox folder if it does not exist
				folderId = 'root';
				query = "title contains 'dropbox_elab'"
				mimeType = "= 'application/vnd.google-apps.folder'";
				posCounter = 0; // start to look at file at position 0
				
				retrieveChildrenFiles(folderId,query,mimeType,function(folder){
					if (folder.length < 1){
						console.log('Creating root folder...dropbox_elab....');
						createProject(folderId,'dropbox_elab',function(message,createIsSuccess,dropboxFolder){
							if (createIsSuccess) {
								//uploadFileFromDropbox(dropboxFolder.id,fileName,blob,function(message,uploadIsSuccess,file){
								//})
								loopFileListInDropbox(dropboxFolder.id,completeFileList,fileIsFolerList,posCounter,callback);
							}
						})
					}else{
						dropboxFolder = folder[0];
						//uploadFileFromDropbox(dropboxFolder.id,fileName,blob,function(message,uploadIsSuccess,file){
						//})
						loopFileListInDropbox(dropboxFolder.id,completeFileList,fileIsFolerList,posCounter,callback);
						
					}
				});
				
				// loop the files list provided from dropbox and then upload the google drive
				function loopFileListInDropbox(dropboxFolderId, completeFileList,fileIsFolerList, posCounter,callback){
					// Progress bar update
					percentageDone = Math.round(posCounter/completeFileList.length*100);
					text = '{0}%'.f(percentageDone);
					valuenow = '{0}'.f(percentageDone);
					style = 'width: {0}%'.f(percentageDone);
					// more for progress bar
					
					// transfer file
					if (completeFileList[posCounter] != null){
						thisPath = completeFileList[posCounter];					
						thisPathContent = thisPath.split("/");	
						
						// Progress bar
						$(that.dbToGDriveProgressBarDescription).text('Uploading: {0}'.f(thisPath));
						
						// Check if the path contains folders. 
						// If not, that mean the path is either a file/folder in the root, i.e., dropbox_elab
						// If yes, check if those folder location exist. If not, create one for it, and then add the file/folder. 
						if (thisPathContent.length>1){	
							console.log(thisPathContent);
							
							currentPathPos = 0; //start for the beginning of the path					
							
							//Go through all the folders in the path and then reach to the file level and then upload it.	
							loopPathinGDrive(dropboxFolderId,thisPathContent,currentPathPos,function(thisFolderId){
								// upload the file and then repeat the function
								//NOTE: if the top of the path is folder, create folder, otherwise upload
								if (fileIsFolerList[posCounter]==1){								
									createProject(thisFolderId,thisPathContent[thisPathContent.length-1],function(message,createIsSuccess,dropboxFolder){
										if (createIsSuccess){
											console.log('Create folder in drive:',thisPathContent[0]);
											
											//update the pointer 
											posCounter = posCounter + 1;
											loopFileListInDropbox(dropboxFolderId, completeFileList,fileIsFolerList, posCounter,callback)
										}else{
											console.log('Fail to createa folder in drive:',thisPathContent[0]);									
										}
									})								
								}else
								aFileFromDBToGDrive("",thisPath,thisFolderId,function(){								
									//update the pointer 
									posCounter = posCounter + 1;
									loopFileListInDropbox(dropboxFolderId, completeFileList,fileIsFolerList, posCounter,callback)
								});							
							})
						}else{
							console.log(thisPathContent);
							
							//Check if it is a folder or not. If so, create that folder. If not, upload the file to the root
							if (fileIsFolerList[posCounter]==1){
								createProject(dropboxFolderId,thisPathContent[0],function(message,createIsSuccess,dropboxFolder){
									if (createIsSuccess){
										console.log('Create folder in drive:',thisPathContent[0]);
										
										//update the pointer 
										posCounter = posCounter + 1;
										loopFileListInDropbox(dropboxFolderId, completeFileList,fileIsFolerList, posCounter,callback)
									}else{
										console.log('Fail to createa folder in drive:',thisPathContent[0]);									
									}
								})
							}else{
								// do something
								aFileFromDBToGDrive("",thisPathContent[0],dropboxFolderId,function(){								
									//update the pointer 
									posCounter = posCounter + 1;
									loopFileListInDropbox(dropboxFolderId, completeFileList,fileIsFolerList, posCounter,callback)
								});
							}							
						}
					}else{
						callback && callback();
					}
				}
				
				//loop through the path from a dropox file in google drive until to the top, i.e. the file name
				function loopPathinGDrive(folderId,thisPathContent,currentPos,callback){
					//Check if the path reach to the end yet
					if (currentPos+1 < thisPathContent.length){
						query = "title contains '{0}'".f(thisPathContent[currentPos]);
						mimeType = "= 'application/vnd.google-apps.folder'";						
						retrieveChildrenFiles(folderId,query, mimeType, function(resp){
							// no such folder; create it
							if (resp.length==0){
								createProject(folderId,thisPathContent[currentPos],function(message,createIsSuccess,thisFolder){
									if (createIsSuccess){
										console.log('Create folder in drive:',thisPathContent[currentPos]);
										console.log('!!!!!!!!!!!!!!!',thisFolder)
										//update the pointer 
										currentPos = currentPos + 1;
										loopPathinGDrive(thisFolder.id,thisPathContent,currentPos,callback);
									}else{
										console.log('Fail to create a folder in drive:',thisPathContent[currentPos]);									
									}
								})
							}else{
								thisFolder = resp[0];
								console.log(thisFolder)
								currentPos = currentPos + 1;
								
								// call itself again
								loopPathinGDrive(thisFolder.id,thisPathContent,currentPos,callback);
							}
						});						
					}else{
						// if reach to the top, then can transfer that file from dropbox to drive
						console.log('wwwwwwww',folderId)
						callback && callback(folderId);					
					}
					
				}
				
				// upload a single file into drive from dropbox
				function aFileFromDBToGDrive(path,fileName, destinationFolderId,callback){
					filePath = path + fileName;
					options = {download:true};	// Enforce a direct download link instead of preview
					
					db_getDownloadLink(dbClient,filePath,options,function(url, error){
						console.log("File download link:",url.url);
						
						//------------testing to save the file object and then put into google drive
						// ref:http://qnimate.com/javascript-create-file-object-from-url/
						var blob = null;	// the data blob
						var xhr = new XMLHttpRequest(); 
						xhr.open("GET", url.url); 
						xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
						xhr.onload = function() 
						{
							//Get the data blob
						    blob = xhr.response;//xhr.response is now a blob object
							console.log('!!!+++____',blob);
							
							//----------------insert the dropbox files into google drive dropbox folder
							folderId = 'root';
							query = "title contains 'dropbox_elab'"
							mimeType = "= 'application/vnd.google-apps.folder'";
							
							//Steps:
							//Upload
							uploadFileFromDropbox(destinationFolderId,fileName,blob,function(message,uploadIsSuccess,file){
								if (uploadIsSuccess){
									callback && callback()
								}
							});
						}
						xhr.send();
					});
				}
				
			}
			//completeFile = ["Apps/Static Web Apps/elab/public/index.html"]
			
			console.log('++++++++++++++++++++++++',completeFile)
			console.log('------------------------',folderIsFoler)
			
			
			transferDB(completeFile,folderIsFoler,function(){
				console.log("Transferred");
			});
		},
		
//		Renaming: function(evt){
//			var newName = document.getElementById("NEW_" + evt.currentTarget.name).value;
//			var exists = 0;
//			
//			for(var i = 0; i != allFiles.length; i++){
//				if(newName == ""){
//					alert("No File Name!")
//					exists = 1;
//					break;
//				}
//				
//				else if(allFiles[i].title == newName){
//					alert("File Name Already Exists!")
//					exists = 1;
//					break;
//				}
//			}
//			
//			if(exists == 0){
//				renameFile(evt.currentTarget.name, newName,function(){
//					window.location.reload();
//					console.log("Renamed");
//				});
//			}
//		},
		
		//Render overall hierarchical view of all the files
		renderFiles: function(){
			var that = this;	
			//-------- Get all the files in dropbox
			rootDir = '/';
			dbClient.readdir(rootDir, function(error, entries) {
				  if (error) {
				    return showError(error);  // Something went wrong.
				  }
				  
				  //----loop each entries and determine if it is a folder, if so, load again and extend the list of file
				  initialFileList = [];
				  initialFileList =  initialFileList.concat(entries);
				  fileIsFolderList = []; // to determine if a 'file' name is a folder or not
				  cPos = 0;
				  
				  //recursively obtain a list of all files and folders in the dropbox
				  console.log('Getting all the files and folders in dropbox...');
				  if (initialFileList[cPos]!=null){
					  readDirAllContent(cPos,initialFileList,fileIsFolderList,function(completeFileList,fileIsFolerList){
						  console.log('This is the entire file list',completeFileList); 
						  console.log('Is the path a folder?',fileIsFolerList);
						  recursionDropbox(completeFileList, fileIsFolerList, allFiles, function(){
							  fileList = completeFileList;
							  folderList = fileIsFolerList;
							 allFiles.sort(sortFuncDropbox);
							 console.log(allFiles); 
						  });
		
						  
						//Create a files Collection
							this.fileCollection = new APICollection(allFiles);
						
							//Show the content
							$(".site-main").append('<table class="table info table-hover" id="content_table"></table>');	
							
							this.fileCollection.each(function(model){
								// Create table format
								$("#content_table").append(that.apiTemplate(model.toJSON()));
							},this);	//"this" is the callback
							
							var model = new APIModel({});
							$("#content_table").append(that.apiTemplate(model.toJSON()));
							
					  });
				  }

				});		
		},
		
	});
	
	return CloudDropbox;
});