/*
 * 	Collection for the index page
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