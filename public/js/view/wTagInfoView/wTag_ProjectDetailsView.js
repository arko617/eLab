/*
 * View for a project details (for the particular projects folder in each drive)
 * Details include three types: details, tag, and notes
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view_template/workspace/wTagInfoView_projectdetailsTemplate.html',	//For the wTaginfoView
        
        ], function($, _, Backbone,projectDetailsTemplate){

	var wTag_ProjectDetailsView = Backbone.View.extend({
		tagName: 'div',	
		projectDetailsTemplate: _.template(projectDetailsTemplate),

		// Initialization action
		initialize: function(){
			
		},

		//For rendering general details about a project
		render: function(){
			this.$el.html(this.projectDetailsTemplate(this.model.toJSON()));	//toJSON() returns an array containing the attributes of each model
			return this;	// return the el
		},

	});
	return wTag_ProjectDetailsView;

});