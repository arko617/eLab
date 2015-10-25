/*
 * Info Dialog model
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone'    
        
        ], function($, _, Backbone){
	var NotificationModel = Backbone.Model.extend({
		defaults: {
			content:'',
			isSuccess:'',
		},
	});

	return NotificationModel;

});