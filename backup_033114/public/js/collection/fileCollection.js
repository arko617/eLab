/*
 * 	Collection of files
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/project/fileModel'
        
        ], function($, _, Backbone,File){
	var FileCollection = Backbone.Collection.extend({
		model:File,
	});

	return FileCollection;

});