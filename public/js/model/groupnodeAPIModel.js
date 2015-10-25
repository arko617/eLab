/*
 *  Model for an info object
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',


        ], function($, _, Backbone){

	var GroupnodeAPI = Backbone.Model.extend({
		urlRoot: '/workspace',

		initialize: function(){
		},

		defaults: {
			id: '',	//id of api link
			title: '',
			modifiedDate: '',
			link: '',
		},
});
	return GroupnodeAPI;

});