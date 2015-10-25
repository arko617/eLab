/*
 * The main.js which define our application main logic
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'view/workspaceView',
        'view/cospaceView',
        'view/developerinfoView',
        'view/groupinfoView',
        'view/groupnodeAPIView',
        'view/grouppictureView',
        'view/cloudGoogleDrive',
        'view/cloudDropbox',
        'view/mtpView',
        'view/matthewApiTestView',
        'bootstrapLib',
        'sbAdmin',
        'metisMenu',
        ], function($, _, Backbone, WorkspaceView, CospaceView, DeveloperinfoView, GroupinfoView, 
        		GroupnodeAPIView, GrouppictureView, CloudGoogleDrive, CloudDropbox, MtpView, MatthewApiTestView){

	var projectId;	//Global Variable for project id

	//####################### Authentication, which requires everytime. Will be moved to server side authentication
	var authentication = function(callback){
		
		//--------------Google APIs information
		var CLIENT_ID = '102710631798-lb77ojeikkaa0dsjcuvq08igkd8llrjh.apps.googleusercontent.com';	//for johnny5550822
		//var CLINET_ID = '900888398054.apps.googleusercontent.com';	//For labbook2013 account
		var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/plus.login'];	//Different scope have different meaning, see https://developers.google.com/drive/scopes
		var apiKey = "AIzaSyB71KszVh0JIH-7EXVgmTv8vt2uy33lPMU";
		//var SCOPES = 'https://www.googleapis.com/auth/drive';	//Different scope have different meaning, see https://developers.google.com/drive/scopes 

		//--------------Dropbox APIs information
		//-----Documentation: https://github.com/dropbox/dropbox-js
		//-----To be more specific: https://github.com/dropbox/dropbox-js/blob/stable/guides/getting_started.md
		var dropboxAPIKey = 'r2k206ydj5s5kv1';
		var dropBoxClient = new Dropbox.Client({ key: dropboxAPIKey });
		console.log("##$$$$$$",dropBoxClient);
		
		//----------------------------- Load DROPBOX OAUTH
		var that = this;
		dropBoxClient.authenticate(function(error,dbClient){
			if(error){
				alert(error);
				return error;
			}			
			//Assign variable
			that.dbClient = dbClient;
			
			// Example with Dropbox. Get user information
			getDropboxUserInfo(dbClient, function(accountInfo){
				console.log("Hello, " + accountInfo.name + "!");
			});
			
			//----------------------------LOAD GOOGLE DRIVE OAUTH
			console.log('Dropbox is authorized successfully:', dbClient);
			handleGoogleClientLoad();
		});

		//checkAuth();

		/**
		 * Called when the client library is loaded to start the auth flow.
		 */
		function handleGoogleClientLoad() {
			gapi.client.setApiKey(apiKey);
			window.setTimeout(checkAuth, 200);	//e.g.500ms; remember to wait some time for the google script to load
			console.log("Checking auth...");
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
				console.log("Done Client Oauth");
				gapi.client.load('drive','v2',function(){
					callback && callback(that.dbClient);
				})
			} else {
				// No access token could be retrieved, show the button to start the authorization flow.
				authButton.style.display = 'block';
				console.log("Fail to do client oauth");
				authButton.onclick = function() {
					gapi.auth.authorize(
							{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
							handleAuthResult);
				};
			}
		}
	};
	//###########################################Done authentication

	//Load the index page of elab; will have a dashboard to show up-to-date messages
	var initialize = function(){
		console.log("#######Load index page......")

	};
	
	//Load the workspace 
	var loadWorkspace = function(labProfile){
		console.log("#######Load workspace......");
		
		//Create the workspace view
		authentication(function(dbClient){
				console.log("!!!!!",dbClient)
				new WorkspaceView({labProfile:labProfile, dbClient: dbClient});
		});
	};
	
	//Load Cospace
	var loadCospace = function(){
		console.log("Load cospace!!!!!!!!");
		
		authentication(function(dbClient){
			cospaceView = new CospaceView({dbClient:dbClient});
		});
	}

	//Load Developerinfo
	var loadDeveloperinfo = function(){
		console.log("Loaded developerinfo");
		developerinfoView = new DeveloperinfoView();
	}

	//Load Groupinfo
	var loadGroupinfo = function(){
		console.log("Load groupinfo...");
		groupinfoView = new GroupinfoView();
		groupnodeAPIView = new GroupnodeAPIView();
		grouppictureView = new GrouppictureView();
	}
	
	var loadCloudGoogleDrive = function(){
		console.log("Google Drive Loaded...");
		
		authentication(function(){
			cloudGoogleDrive = new CloudGoogleDrive();
		});
	}
	
	var loadCloudDropbox = function(){
		console.log("Dropbox Loaded...");
		
		authentication(function(dbClient){
			cloudDropbox = new CloudDropbox({dbClient:dbClient});
		});
	}
	
	var loadMatthewApiTest = function(){
		alert("Loaded Matthew API Test");
		
		authentication(function(){
			matthewApiTestView = new MatthewApiTestView();
		});
	}
	
	var loadmtp = function(){
		alert("Hi");
		
		authentication(function(){
			mtpView = new MtpView();
		});
	}
	
	var loadMatthewApiTest = function(){
		alert("Loaded Matthew's API Test View");
		
		authentication(function(){
			matthewApiTestView = new MatthewApiTestView();
		});
	}

	return {
		initialize: initialize,
		loadWorkspace: loadWorkspace,
		loadCospace: loadCospace,
		loadDeveloperinfo: loadDeveloperinfo,
		loadGroupinfo: loadGroupinfo,
		loadCloudGoogleDrive: loadCloudGoogleDrive,
		loadCloudDropbox: loadCloudDropbox,
		loadmtp: loadmtp,
		loadMatthewApiTest: loadMatthewApiTest,
	};

});
