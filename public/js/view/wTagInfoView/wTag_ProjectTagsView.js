/*
 * View for a project's tags in wTagInfoView
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view_template/workspace/wTagInfoView_projectTagsTemplate.html',	//For the wTaginfoView
        'tagManager',

        ], function($, _, Backbone,projectTagsTemplate){

	var wTag_ProjectTagsView = Backbone.View.extend({
		tagName: 'div',	
		projectTagsTemplate: _.template(projectTagsTemplate),

		// Initialization action
		initialize: function(){
		},

		//For rendering a view
		render: function(){
			this.$el.html(this.projectTagsTemplate(this.model.toJSON()));	//toJSON() returns an array containing the attributes of each model
			return this;	// return the el
		},		
		
		//Inject Tags into the input field using tabManager
		injectTags: function(){
			var that = this;
			$("#projectRelatedTags").tagsManager({
				prefilled: that.model.get("details").tags,
				tagClass:'btn btn-primary',	//bootstrap
				//fillInputOnTagRemove: true, //If true, fills back the content of the removed tag to the input field.
			});
			
			//TODO add a button for user to click save to save the changes
		},

	});
	return wTag_ProjectTagsView;

});