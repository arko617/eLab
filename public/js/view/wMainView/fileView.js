/*
 * View for single file
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view_template/workspace/wMainViewProjectTemplate.html',	//For the project page component

        ], function($, _, Backbone,fileTemplate){

	var FileView = Backbone.View.extend({
		tagName: 'tr',
		attributes: function(){
			return {
				class : 'selection',
				id: this.model.get('id'),
			};
		},		
		fileTemplate: _.template(fileTemplate),

		// Initialization action
		initialize: function(){
		},

		//For rendering a view
		render: function(){
			var that = this;
			var iconObject ={};
			//determine file icon; use google provided icons
//			var icon = getIcon(this.model.get("mimeType"));
//			var iconObject = {icon:icon};
			
			//concate JSON objects
			var finalJSON = $.extend({},iconObject,this.model.toJSON());
			
			//concat the model object and others JSON objects
			this.$el.html(this.fileTemplate(finalJSON));	//toJSON() returns an array containing the attributes of each model
			
			return this;	// return the el
		},		

	});


	return FileView;

});