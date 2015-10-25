/*
* Matthew's collection of API's
*/

define([
        'jquery',
        'underscore',
        'backbone',
        'model/matthewApiTestModel'
        
        ], function($, _, Backbone, matthewApiTestModel){
	
	var matthewApiTestCollection = Backbone.Collection.extend({
		model: matthewApiTestModel,
	});
	
	return matthewApiTestCollection;
});
