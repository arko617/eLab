/*
 * Cospace View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/cospaceModel',
        'collection/cospaceCollection',
        'text!view_template/cospace/cospaceTemplate.html',
        'text!view_template/cospace/cospacePopupTemplate.html',
        'bootstrapLib',

        ], function($, _, Backbone,CospaceModel,CospaceCollection,CospaceTemplate,CospacePopupTemplate){

	var CospaceView = Backbone.View.extend({
		el: ".site-main",
		cospaceTemplate: _.template(CospaceTemplate),
		cospacePopupTemplate: _.template(CospacePopupTemplate),

		initialize: function(){	
			this.render();
			//------------List all dropbox files
			//this.listAllDropboxFiles();
			//this.callDropboxApi();
			
			// progress bar
			this.dbToGDriveProgressBar = '#dropboxToGDriveProgressBarMain';
			this.dbToGDriveProgressBarChild = '#dropboxToGDriveProgressBarChild';	
			this.dbToGDriveProgressBarDescription = "#dropboxToGDriveProgressBarDescription";

		},
		
		events: {
			'click #oneClickDropboxToGoogleDrive': 'transferFromDropboxToGDrive',
			//'click #gDriveSpaceButton': 'getGDriveStorage',
			//'click #dropboxSpaceButton': 'getDropboxStorage',
		},
		

		//Render the overall workspace view
		render: function(){
			//----------0. insert the main template
			$(".site-main").append(this.cospaceTemplate());
			
			//----------_JS
			$('[data-toggle="tooltip"]').tooltip(); 
			
			//--------update storage
			this.getGDriveStorage(function(percentageUsed,totalGb){
				$("#gdrive-usage").empty();
				$("#gdrive-storage-size").empty();
				$("#gdrive-usage").text('{0}% usage'.f(percentageUsed));
				$("#gdrive-storage-size").text('Out of {0}GB'.f(totalGb));
			});
			this.getDropboxStorage(function(percentageUsed,totalGb){
				$("#dropbox-usage").empty();
				$("#dropbox-storage-size").empty();
				$("#dropbox-usage").text('{0}% usage'.f(percentageUsed));
				$("#dropbox-storage-size").text('Out of {0}GB'.f(totalGb));				
			});
			
			
		},		
		
		//**********************************************************Dropbox api example		
		//--------------Dropbox api calls
		callDropboxApi: function(callback){
			//Checking
			console.log('Dropbox client:',this.options.dbClient);
			
			// Get directory content
			readDirContent(this.options.dbClient, "/", function(entries){
				//alert("Your Dropbox Contains" + entries);
				console.log("In the dropbox, you have:", entries);
			});
			
			// Get a file: you need to provide path
			readAFile(this.options.dbClient, "/testing/testFile", function(data){
				console.log("File content:", data);  // data has the file's contents
			});			
		},
		
		//**********************************************************End example
		
		//***************************************************Layout******************
		updateProgressBarChild: function(progressBarChild,text,valuenow,style){
			$(progressBarChild).text(text);
			$(progressBarChild).attr('aria-valuenow',valuenow);
			$(progressBarChild).attr('style',style)
		},
		
		//*******************************************End layout******************

		//*******************************************Info******************************
		
		//------------- Get storage from Google Drive
		getGDriveStorage:function(callback){
			getDriveStorageInfo(function(percentageUsed,totalGb,totalUsage,spaceSummary){
				console.log('!!+++',percentageUsed);
				console.log('!!++',totalGb);
				console.log(totalUsage);
				console.log('!!=++',spaceSummary);
				
				callback && callback(percentageUsed,totalGb);
			})
		},
		
		//--------------Get storage from Dropbox
		getDropboxStorage:function(callback){
			getDropboxStorageInfo(this.options.dbClient,function(percentageUsed,totalGb,totalUsage,spaceSummary){
				console.log('!!+++',percentageUsed);
				console.log('!!++',totalGb);
				console.log(totalUsage);
				console.log('!!=++',spaceSummary);
				
				callback && callback(percentageUsed,totalGb);
			})
			
			getDropboxUserInfo(this.options.dbClient,function(accountInfo){
				console.log(accountInfo)
			})
		},	
		
		
		//******************************************ENd info
		
		
		//**********************************************************************Code for dropbox to google drive************************
		//--------------Main to transfer files from dropbox to google drive
		transferFromDropboxToGDrive: function(){
			var that = this;
						
			completeFileList = ["Apps", "backbonetutorials.pdf", "emptyFolder", "Getting Started.pdf", "gitignore", "testing", "Apps/Static Web Apps", "testing/2015 incorporating temporal ehr data in pr…tratification of renal function deterioration.pdf", "testing/haha/testFile", "testing/testFile.txt", "Apps/Static Web Apps/elab", "Apps/Static Web Apps/elab/public", "Apps/Static Web Apps/elab/public/index.html"];
			fileIsFolerList = [1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0];
			completeFileList = ["Apps", "backbonetutorials.pdf", "testing", "testing/haha/testFile"];
			completeFileList = ["testing/haha/testFile"];
			
			//Initialize the process bar
			text = '0%';
			valuenow = '0';
			style = 'width: 0%';
			this.updateProgressBarChild(this.dbToGDriveProgressBarChild,text,valuenow,style);
			$(this.dbToGDriveProgressBarDescription).text('Initializing ...');
			$(this.dbToGDriveProgressBar).show();			
			
			this.listAllDropboxFiles(function(completeFileList,fileIsFolerList){
				//completeFileList = ["Apps/Static Web Apps/elab/public/index.html"];
				//fileIsFolerList = [0];

				that.dbToGDriveHierarchy(completeFileList,fileIsFolerList,function(){
					// progress bar
					//$(that.dbToGDriveProgressBar).hide();
					$(that.dbToGDriveProgressBarDescription).text('Complete!');
					$(that.dbToGDriveProgressBarChild).removeClass('progress-bar-striped');
					
					//Do more things if needed
				});
			});	
		},
		
		//list all of the dropbox files (in a stacked role, no hierarchical'
		listAllDropboxFiles: function(callback){			
			//-------- Get all the files in dropbox
			rootDir = '/';
			dbClient  = this.options.dbClient;
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
						  
						  //callback
						  callback && callback(completeFileList,fileIsFolerList);
					  });
				  }				  
				});		
			
			
		},
		
		//---------------transfer all files from Google drive to dropbox with folders hierachy
		dbToGDriveHierarchy: function(completeFileList,fileIsFolerList,callback){
			var that = this;
			console.log(completeFileList);
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
				that.updateProgressBarChild(that.dbToGDriveProgressBarChild,text,valuenow,style);
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
									console.log('!Next!!!!!!!!!',thisPathContent[currentPos])
									loopPathinGDrive(thisFolder.id,thisPathContent,currentPos,callback);
								}else{
									console.log('Fail to create a folder in drive:',thisPathContent[currentPos]);									
								}
							})
						}else{
							thisFolder = resp[0];
							console.log('Folder found:',thisFolder)
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
				
				db_getDownloadLink(that.options.dbClient,filePath,options,function(url){
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
						})
					}
					xhr.send();
				});
			}
			
		},
		
		
		//(ONLY!!!!!! proof of concept example)---------------transfer files from Google drive to dropbox 
		transferAllFromDBToGoogleDrive: function(){
			// Get a download link for a file. FILE must be path
			path = "";
			fileName = "gitignore";
			filePath = path + fileName;
			//filePath = "/testing/testFile.txt";
			//filePath = "/testing";
			options = {download:true};	// Enforce a direct download link instead of preview
			db_getDownloadLink(this.options.dbClient,filePath,options,function(url){
				console.log("File download link:",url.url);
				
				// Create a hidden download link for downloading the file. This is for the problem in CHROME which will open a txt in browser, and you need to enforce is with html5 <a>.
//				$(".hiddenDownloadDiv").remove(); // remove the div for hidden download
//				$(".site-main").append("<div class='hiddenDownloadDiv'></div>");
//				$(".hiddenDownloadDiv").append("<a href ='{0}' id='hiddenDownload' download hidden>hidden file download link</a>".f(url.url));
//				// Trigger the download
//				$(document).ready(function(){
//					//$("#hiddenDownload")[0].click();
//				});		
				
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
					//1. check if dropbox folder is present. 
					//2. If no, then create and insert, if yes, insert
					//3. rename the file to the original file name
					retrieveChildrenFiles(folderId,query,mimeType,function(folder){
						if (folder.length < 1){
							createProject(folderId,'dropbox_elab',function(message,createIsSuccess,dropboxFolder){
								if (createIsSuccess) {
									uploadFileFromDropbox(dropboxFolder.id,fileName,blob,function(message,uploadIsSuccess,file){
									
									})
								}
							})
						}else{
							dropboxFolder = folder[0];
							uploadFileFromDropbox(dropboxFolder.id,fileName,blob,function(message,uploadIsSuccess,file){
								
							})
						}
					})
				}
				xhr.send();
			});
		},
	});
	
	return CospaceView;
});