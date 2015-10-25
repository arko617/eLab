/*
 *  Matthew's API Test Model page
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',


        ], function($, _, Backbone){

	var matthewApiTestModel = Backbone.Model.extend({
			urlRoot: '/workspace',

			initialize: function(){},

			defaults: {
				title: '',
				folder: '',
				date: '',
			},
	});
	
	return matthewApiTestModel;
});
