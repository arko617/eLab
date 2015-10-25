/*
 * View for projects overview (for the particular projects folder in each drive)
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view_template/workspace/wTagInfoView_projectsOverviewTemplate.html',	//For the wTaginfoView

        ], function($, _, Backbone,projectsOverviewTemplate){

	var wTag_ProjectsOverviewView = Backbone.View.extend({
		tagName: 'div',	
		projectsOverviewTemplate: _.template(projectsOverviewTemplate),

		// Initialization action
		initialize: function(){
		},

		//For rendering a view
		render: function(){
			this.$el.html(this.projectsOverviewTemplate(this.model.toJSON()));	//toJSON() returns an array containing the attributes of each model
			return this;	// return the el
		},		

	});
	return wTag_ProjectsOverviewView;

});