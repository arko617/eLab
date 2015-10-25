/*
 * The main.js which define our application main logic
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/project/metaFileModel',
        'collection/fileCollection',
        'collection/metaFileCollection',
        'view/project/fileCollectionView',
        'view/aProjectMainView',
        'view/labBookMainView',
        'view/projectListMainView',

        ], function($, _, Backbone, MetaDataModel,FileCollection, MetaFileCollection, FileCollectionView,aProjectMainView,LabBookMainView,ProjectListMainView){
	var projectId;	//Global Variable for project id

	// Authetication, which requires everytime
	var authentication = function(callback){
		var CLIENT_ID = '102710631798-lb77ojeikkaa0dsjcuvq08igkd8llrjh.apps.googleusercontent.com';	//for johnny5550822
		//var CLINET_ID = '900888398054.apps.googleusercontent.com';	//For labbook2013 account
		var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/plus.login'];	//Different scope have different meaning, see https://developers.google.com/drive/scopes
		var apiKey = "AIzaSyB71KszVh0JIH-7EXVgmTv8vt2uy33lPMU";
		//var SCOPES = 'https://www.googleapis.com/auth/drive';	//Different scope have different meaning, see https://developers.google.com/drive/scopes 

		// Load the Authentication process
		handleClientLoad();
		//checkAuth();

		/**
		 * Called when the client library is loaded to start the auth flow.
		 */
		function handleClientLoad() {
			gapi.client.setApiKey(apiKey);
			window.setTimeout(checkAuth, 200);	//e.g.500ms; remember to wait some time for the google script to load
			//console.log("Checking auth");
		}

		/**
		 * Check if the current user has authorized the application.
		 */
		function checkAuth() {
			gapi.auth.authorize(
					{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
					handleAuthResult);	//immediate:true-->refresh the token without a popup
		}

		/**
		 * Called when authorization server replies.
		 */
		function handleAuthResult(authResult) {
			var authButton = document.getElementById('authorizeButton');
			authButton.style.display = 'none';

			if (authResult && !authResult.error) {
				//For share dialog to work
				//Couple of things to be careful:
				//(1) The app openURL (in google console "DriveSDK" Tab) must be the same the the link that the page is rendered
				//(2) The app must be "installed" in the browser, using scope:drive.install
				//(3) If you are not the owner, you cannot share the folder with other

				//Do the callback
				 gapi.client.load('plus', 'v1', function() {
                     var request = gapi.client.plus.people.get({
                       'userId': 'me'
                     });
                     request.execute(function(resp) {
                         var image = document.getElementById('profile-pic');
                         image.src = resp.image.url;
                     });
                 });
				 
				callback && callback();

			} else {
				// No access token could be retrieved, show the button to start the authorization flow.
				authButton.style.display = 'block';
				authButton.onclick = function() {
					gapi.auth.authorize(
							{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
							handleAuthResult);
				};
			}
		}
	};

	// Initialization; login to the account and get the projects information
	var initialize = function(labBookId){
		authentication(function(){
			gapi.client.load('drive', 'v2', function() {
				console.log("Initalizing...");
				retrieveChildrenFiles(labBookId,null,"= 'application/vnd.google-apps.folder'",function(allFiles){
					//Create a new collection which store files in labBook
					labBookCollection = new FileCollection(allFiles);

					//Create LabBook MainView
					new LabBookMainView({labBookCollection:labBookCollection});
				});

			});
		});
	};

	// Load the list of project.
	var loadProjectsList = function(labBookId){
		authentication(function(){
			gapi.client.load('drive', 'v2', function() {
				retrieveChildrenFiles(labBookId,null,"= 'application/vnd.google-apps.folder'",function(allFiles){
					//Create a new collection which store files in labBook
					projectsCollection = new FileCollection(allFiles);

					//Create LabBook MainView
					new ProjectListMainView({labBookCollection:projectsCollection,projectsCollection:projectsCollection,labBookId:labBookId});
				});

			});
		});
	};

	// Load the content of google drive
	var loadAProjectContent = function(projectId,labBookId){		
		//Load the JS client
		authentication(function(){
			gapi.client.load('drive', 'v2', function() {

				//Get the LabBook project files INFO
				retrieveChildrenFiles(labBookId,null,"= 'application/vnd.google-apps.folder'",function(allFiles){
					labBookCollection = new FileCollection(allFiles);

					//Get the project's content (including getting the folder)
					retrieveChildrenFiles(projectId,"",null,function(projectFiles){
						//retrieveChildrenFiles(projectId,"","!= 'application/vnd.google-apps.folder'",function(projectFiles){
						//Create a new collection which store files in labBook
						projectCollection = new FileCollection(projectFiles);

						// Get all the metafiles
						getAllMetaContent(projectCollection,function(metaFiles,metaFolderId){
							metaFileCollection = new MetaFileCollection(metaFiles);
							console.log("MetaFiles:",metaFiles);
							
							//Get all the protocols
							getAllProtocols(projectCollection,function(protocols,protocolsFolderId){
								protocolsCollection = new FileCollection(protocols);
								
								//Create the project main view
								new aProjectMainView({labBookCollection:labBookCollection,projectCollection:projectCollection,projectId:projectId, protocolsCollection:protocolsCollection,protocolsFolderId:protocolsFolderId,metaFileCollection:metaFileCollection, metaFolderId:metaFolderId});

							});
						})

					});
				});
			});
		});

		//get the project overview in meta folder
		function getGDocContent(id,callback){
			downloadGDocContent(id,callback);
		};
		
		//Get the protocols
		function getAllProtocols(projectCollection,callback){
			var allProtocolFiles = null;
			var protocolsFolderId = null;
			for (var i = 0;i<projectCollection.length;i++){
				file = projectCollection.at(i);
				if (file.get("mimeType")=="application/vnd.google-apps.folder"){
					if (file.get("title") == "protocols"){
						protocolsFolderId = file.get("id");

						//Retrieve the protocols, i.e. project overview
						retrieveChildrenFiles(protocolsFolderId,"","= 'application/vnd.google-apps.document'",function(allProtocolFiles){
							console.log("Here are the protocols files", allProtocolFiles);
							callback && callback(allProtocolFiles,protocolsFolderId);
						});
					}
				}
			}
			if (protocolsFolderId == null){ //temporary statement so we can move forward if protocolsFolderId and allProtocolFiles don't exist
				callback && callback(allProtocolFiles,protocolsFolderId);
			}
		};
		
		//Get all the meta information
		function getAllMetaContent(projectCollection,callback){
			//loop through and find the meta folder. this is good when the number of file is small
			//get the overview of the project in the meta folder
			var metaFiles =[];
			for (var i = 0;i<projectCollection.length;i++){
				file = projectCollection.at(i);
				if (file.get("mimeType")=="application/vnd.google-apps.folder"){
					if (file.get("title") == "meta"){
						metaFolderId = file.get("id");

						//Retrieve the meta data, i.e. project overview
						retrieveChildrenFiles(metaFolderId,"","= 'application/vnd.google-apps.document'",function(allMetaFiles){
							for (var i =0;i<allMetaFiles.length;i++){
								thisFile = allMetaFiles[i];
								thisFileId = thisFile["id"];
								thisFileTitle = thisFile["title"];

								switch (thisFileTitle){
								//Get the content for project overview
								case "Project Overview":
									getGDocContent(thisFileId,function(content){
										thisFile["header"]="Description";
										thisFile["content"]=content;

										//Create the description view
										var newMetaDataModel = new MetaDataModel(makeFileObject(thisFile));
										metaFiles.push(newMetaDataModel);

										// Create the overview part
										callback && callback(metaFiles,metaFolderId);
									});
									break;
								default:
								}
							}
							if (allMetaFiles.length == 0){ //temporary statement so we can move forward if no metafiles exist
								callback && callback(metaFiles,metaFolderId);
							}
						});
					}
				}
			}
		};
	};

	// To test the push notification
	var testpushnotification = function(labBookId){
		authentication(function(){
		alert('testing....');
		});
	};



	return {
		initialize: initialize,
		loadAProjectContent: loadAProjectContent,
		loadProjectsList: loadProjectsList,
		testpushnotification: testpushnotification,
	};

});