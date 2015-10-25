/*
 *  Model for a project object
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',


        ], function($, _, Backbone){

	var Project = Backbone.Model.extend({
		urlRoot: '/workspace',

		initialize: function(){
		},

		defaults: {
			id: '',	//id from Google drive
			title: '',
			size: '', 
			permission: '',
			modifiedDate: '',
			createdDate:'',	//from gDrive
			link: '', //Link to the drive
			mimeType:'',	//File Type in gooogle drive; should be folder
			children: new Backbone.Collection(),	//Array of File ids
			Protocols: new Backbone.Collection(),	//Array of Protocol ids
			hasAllDetails: false, //to indicate whether the details have obtained yet
			//Static information provided by user
			details: {title:'',
				description:'',
				objective:'',
				contributors:'',
				fundingSources:'',
				tags:[],
				stickyNotes: [],
				Goals: [],
			},
		},
});
	return Project;

});