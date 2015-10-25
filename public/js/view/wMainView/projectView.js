/*
 * View for single file
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view_template/workspace/wMainViewProjectTemplate.html',	//For the project page component

    

        ], function($, _, Backbone,projectTemplate){

	var ProjectView = Backbone.View.extend({
		tagName: 'tr',
		attributes: function(){
			return {
				class : 'selection',
				id: this.model.get('id'),
			};
		},		
		projectTemplate: _.template(projectTemplate),

		// Initialization action
		initialize: function(){
		},

		//For rendering a view
		render: function(){
			var that = this;
			//determine file icon
			var icon = getIcon(this.model.get("mimeType"));	//use chester icons
			var iconObject = {iconLink:icon};
			
			//concate JSON objects
			var finalJSON = $.extend({},iconObject,this.model.toJSON());
			
			//Pass to the tempplate
			//console.log(this.model.toJSON())
			this.$el.html(this.projectTemplate(finalJSON));	//toJSON() returns an array containing the attributes of each model
			
			return this;	// return the el
		},		

	});


	return ProjectView;

});