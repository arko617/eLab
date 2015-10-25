/*
 *  Model for a project object
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',


        ], function($, _, Backbone){

	var Cospace = Backbone.Model.extend({
		urlRoot: '/workspace',

		initialize: function(){
		},

		defaults: {
			id: '',	//id from Google drive
			title: '',
		},
});
	return Cospace;

});