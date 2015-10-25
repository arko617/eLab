/*
 *  Model for a single projects overview object (the root folder "projects" for all projects)
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',

        ], function($, _, Backbone){

	var ProjectsOverview = Backbone.Model.extend({
		urlRoot: '/workspace',

		initialize: function(){
		},

		defaults: {
			id: '',	//id from Google drive
			title: '',
			size: '', 
			permission: '',
			createdDate: '',
			modifiedDate: '',
			mimeType: '',
			ownerNames: new Array(),
			numProjects: '',
		},
});
	return ProjectsOverview;

});