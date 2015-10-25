/*
 *  Model for a project object
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',


        ], function($, _, Backbone){

	var Developerinfo = Backbone.Model.extend({
		urlRoot: '/workspace',

		initialize: function(){
		},

		defaults: {
			image: '', //Image of user in HTML
			id: '',	//ID for the template
			idName: '', //Name of user used to identify the id
			fullName: '', //Full name of user displayed on the screen
			title: '',
			position: '',	//Position in elab
			year: '',	//Year in school
			biography: '', //Information about each person
			imageSource: '',	//Image of user as a URL link
			linkedin: '', //Link to the user's Linkedin profile
			personalSite: '', //Link to the user's personal website
		},
});
	return Developerinfo;

});