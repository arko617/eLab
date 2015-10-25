/*
 * View for single file
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view/template/file-template.html',
        'text!view/template/project-template.html',        

        ], function($, _, Backbone,fileTemplate,projectTemplate){

	var FileView = Backbone.View.extend({
		tagName: 'tr',
		fileTemplate: _.template(fileTemplate),
		projectTemplate:_.template(projectTemplate),

		// Initialization action
		initialize: function(){

			//!!!This can be commanded out because the view will be refreshed when collection is changed
			//Listen to the event destroy called in the Model, i.e. this.destroy, and then remove the model from the view
			//this.model.on('destroy', this.remove, this);

			this.model.on("change",this.render,this);	//re render the view when the model content is changed
		},

		events: {
			"click .delete":"destroy",
			"click .detail":"show",
			"click .download":"download",
			"click .rename":"openRenameDialog"
		},

		//For rendering a view
		render: function(isProject){
			if (isProject){
				//var currentRoute = {"currentRoute": Backbone.history.fragment};
				this.$el.html(this.projectTemplate(this.model.toJSON()));
			}else{
				this.$el.html(this.fileTemplate(this.model.toJSON()));
			}
			return this; // enable chained calls
		},

		//Delete itself
		destroy: function(){
			this.model.destroying();
		},

		//Show itself details
		show: function(){
			this.model.showing();
		},

		//Download the file
		download: function(event){
			this.model.downloading();
		},

		//Open Rename dialog
		openRenameDialog: function(){
			this.model.openRenameDialog();
		}
	});


	return FileView;

});