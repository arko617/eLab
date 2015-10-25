/*
 * 	Collection of projects
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'model/projectModel'
        
        ], function($, _, Backbone,Project){
	var ProjectCollection = Backbone.Collection.extend({
		model:Project,
	});

	return ProjectCollection;

});