/*
 * View for meta data file for a project
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view/template/projectMetaData-template.html',      

        ], function($, _, Backbone,projectMetaDataTemplate){

	var AProjectMetaDataView = Backbone.View.extend({
		$el: $('#overview'),
		tagName: 'span',	//determine what kind of being tag is
		projectMetaDataTemplate: _.template(projectMetaDataTemplate),

		// Initialization action
		initialize: function(){
			this.model.on("change",this.render,this);	//re render the view when the model content is changed
		},

		events: {

		},

		//For rendering a view
		render: function(){
			//Preprocess the content so that it renders well on html
			tempContent = this.model.get('content');
			tempContent = tempContent.replace(/\r\n/gi, "<br>"); 	//\r\n: use as a new line character in windows
			this.model.set('content',tempContent);
			
			//Add to the html
			this.$el.html(this.projectMetaDataTemplate(this.model.toJSON()));
			//console.log("hoho",this.el)
			return this;	//important to do return so that el can be passed
		},
	});


	return AProjectMetaDataView;

});