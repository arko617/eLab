/*
 *  Model for a project object
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',


        ], function($, _, Backbone){

		var APIModel = Backbone.Model.extend({
		urlRoot: '/workspace',

		initialize: function(){
		},

		defaults: {
			title: '',
			isFolder: '',
			createdDate: '',
			download: '',
			del: '',
			rename: '',
			intro: '',
			action: '',
		},

});
	
	return APIModel;

});