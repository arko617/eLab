/*
 *  Model for a file object inside a project
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',

        ], function($, _, Backbone){

	var File = Backbone.Model.extend({
		urlRoot: '/workspace',

		initialize: function(){
		},

		defaults: {
			id: '',	//id from Google drive
			title: '',
			size: '', 
			permission: '',
			createdData: '',
			modifiedDate: '',
			link: '', //Link to the drive
			thumbnailLink:'', //Link to preview(like the small preview, i.e. thumbnail view
			mimeType:'',	//File Type in gooogle drive
			iconLink: '', //The link for the icons
			createdBy:'',
			isFolder:'',
			children:new Backbone.Collection(),//Only has children if it is a folder
			parents:'',	//which project/folder it belong to
		},
});
	return File;

});