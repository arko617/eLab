/*
 * 	Collection of projects
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'model/APIModel'
        
        ], function($, _, Backbone,APIModel){
	var APICollection = Backbone.Collection.extend({
		model:APIModel,
	});

	return APICollection;

});