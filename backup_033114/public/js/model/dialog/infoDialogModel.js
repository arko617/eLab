/*
 * Info Dialog model
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone'    
        
        ], function($, _, Backbone){
	var InfoDialogModel = Backbone.Model.extend({
		defaults: {
			content:'',
		},
	});

	return InfoDialogModel;

});