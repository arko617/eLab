/*
 * 	Collection of files
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/project/metaFileModel'
        
        ], function($, _, Backbone,File){
	var MetaFileCollection = Backbone.Collection.extend({
		model:File,
	});

	return MetaFileCollection;

});