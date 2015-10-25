/**
 * Manages the http of the application. Try to follow RESTFUL API
 */

//var rootFolderId ="0B99TACL_6_flb2EwbnhiLUVNdEE";	//temp root folder id from labBook2013v3@gmail.com
//var labFolderId = "0B99TACL_6_flcWlLVTZGN1B4WUU"; //the lab folder id that is currently using; should be received from Nodejs Server
//var labBookId = "0B_Dd1D8Xgj6vNklPZTlHaF80cXc"; //ttemp LabBook folder ID by stephanie
//var rootFolderId = "0B8x08fyIZQ1vbkpZMENtTGxJTVE"; //temp LabBook folder ID for labBook2013@gmail.com


//These id suppose to come from the database
var id_name_map = {
		rootFolderId : "0B99TACL_6_flb2EwbnhiLUVNdEE",		//LabBook2013v3
};

var lab_profile = {
		labName: "Kimberley_lab",
		labFolderId: "0B99TACL_6_flcWlLVTZGN1B4WUU",	// Kimberley Lab
		labProjectsFolderId: "0B99TACL_6_flLUVxNVh5MFpUajA", //Kimberley_lab/#elab.Kimberley_lab.projects
		labProtocolsFolder: "0B99TACL_6_flck5wTzBRdjJjTXc", //Kimberley_lab/#elab.Kimberley_lab.protocols
}


define([
        'jquery',
        'underscore',
        'backbone',
        'main'

        ], function($, _, Backbone,Main){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'workspace': 'loadWorkspace',
			'workspace/:projectId' : "loadAProjectView",
			'workspace/*path/:folderId' : "loadAFolderView",
			'cospace': 'loadCospace',
			'developerinfo': 'loadDeveloperinfo',
			'groupinfo': 'loadGroupinfo',
			'arko_APItest': 'loadArko_APItest',
			'cloudGoogleDrive': 'loadCloudGoogleDrive',
			'cloudDropbox': 'loadCloudDropbox',
			'mtp': 'loadmtp', // Matthew testing api function
			'matthewApiTest': 'loadMatthewApiTest',
			// Default
			'*actions': 'defaultAction',
		},
		
		loadmtp: function(){
			Main.loadmtp();
		},
		
		loadMatthewApiTest: function(){
			Main.loadMatthewApiTest();
		},
		
		loadCloudGoogleDrive: function(){
			Main.loadCloudGoogleDrive();
		},
		
		loadCloudDropbox: function(){
			Main.loadCloudDropbox();
		},
		
		loadDeveloperinfo: function(){
			Main.loadDeveloperinfo();
		},
		
		loadGroupinfo: function(){
			Main.loadGroupinfo();
		},
		
		loadCospace: function(){
			Main.loadCospace();
		},
		
		loadWorkspace: function(){
			Main.loadWorkspace(lab_profile);
		},
		
		//For project
		loadAProjectView: function(projectId){
			//alert(projectId);
			Main.loadAProjectContent(projectId,labBookId);
		},
		
		//For Folder (essentially the same as loading a project, but want to separate it to make a clear distinguishing two things are different
		loadAFolderView: function(projectId){
			//alert(projectId);
			Main.loadAProjectContent(projectId,labBookId);
		},

		// No matching route, do nothing
		defaultAction: function(actions){
			console.log('Performaing no route action: authentication');
			Main.initialize(lab_profile);
		},
	});

	var initialize = function(){
		var app_router = new AppRouter();
		Backbone.history.start({pushState: true});	//Backbone listen to hash changes since this statement; pushState has to be true in order to work
	};
	return {
		initialize: initialize
	};
});