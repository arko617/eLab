/*
 * 	Collection of info
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'model/groupnodeAPIModel'
        
        ], function($, _, Backbone,GroupnodeAPI){
	var GroupnodeAPICollection = Backbone.Collection.extend({
		model:GroupnodeAPI,
	});

	return GroupnodeAPICollection;

});