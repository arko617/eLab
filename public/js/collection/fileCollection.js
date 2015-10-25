/*
 * 	Collection of files
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'model/fileModel'
        
        ], function($, _, Backbone,File){
	var FileCollection = Backbone.Collection.extend({
		model:File,
	});

	return FileCollection;

});