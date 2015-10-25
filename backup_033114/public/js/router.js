//var labBookId = "0B_Dd1D8Xgj6vNklPZTlHaF80cXc"; //ttemp LabBook folder ID by stephanie
var labBookId = "0B8x08fyIZQ1vbkpZMENtTGxJTVE"; //temp LabBook folder ID by Johnny

//Filename: router.js
define([
        'jquery',
        'underscore',
        'backbone',
        'main'


        ], function($, _, Backbone,Main){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'project': 'loadProjectsList',
			'project/:projectId' : "loadAProjectView",
			'project/*path/:projectId' : "loadAProjectView",
			'testpushnotification': "testpushnotificationView",	//use for different test purpose

			// Default
			'*actions': 'defaultAction',
		},

		loadProjectsList: function(){
			Main.loadProjectsList(labBookId);
		},
		
		//For shorter project url
		loadAProjectView: function(projectId){
			//alert(projectId);
			Main.loadAProjectContent(projectId,labBookId);
		},
		
		testpushnotificationView: function(labBookId){
			Main.testpushnotification(labBookId);
		},

		// No matching route, do nothing
		defaultAction: function(actions){
			console.log('Performaing no route action: authentication');
			Main.initialize(labBookId);
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