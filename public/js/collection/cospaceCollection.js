/*
 * 	Collection of projects
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'model/cospaceModel'
        
        ], function($, _, Backbone,Cospace){
	var CospaceCollection = Backbone.Collection.extend({
		model:Cospace,
	});

	return CospaceCollection;

});