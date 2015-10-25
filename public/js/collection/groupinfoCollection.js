/*
 * 	Collection of info
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'model/groupinfoModel'
        
        ], function($, _, Backbone,Groupinfo){
	var GroupinfoCollection = Backbone.Collection.extend({
		model:Groupinfo,
	});

	return GroupinfoCollection;

});