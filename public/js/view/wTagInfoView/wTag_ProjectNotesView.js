/*
 * View for a project notes
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view_template/workspace/wTagInfoView_projectNotesTemplate.html',	//For the wTaginfoView
        'text!view_template/workspace/wTagInfoView_aProjectNoteTemplate.html',	//a note template
        ], function($, _, Backbone,projectNotesTemplate,aNoteTemplate){

	var wTag_ProjectNotesView = Backbone.View.extend({
		tagName: 'div',	
		attributes: function(){
			return {
				class : 'wTagInfoViewProjectNotes',
			};
		},	
		projectNotesTemplate: _.template(projectNotesTemplate),
		aNoteTemplate:_.template(aNoteTemplate),

		// Initialization action
		initialize: function(){
			this.wTagInfoViewProjectNotes=".wTagInfoViewProjectNotes";
		},

		//For rendering general details about a project
		render: function(){
			this.$el.html(this.projectNotesTemplate(this.model.toJSON()));	//toJSON() returns an array containing the attributes of each model
			return this;	// return the el
		},
		
		//Add notes
		addNotes:function(){
			var that = this;
			details = this.model.get("details");
			console.log("Adding sticky notes....")
			if(details.stickyNotes.length>0){
				var notes = details.stickyNotes;
				for (var i = 0;i<notes.length;i++){
					var thisNote = notes[i];
					selector = this.wTagInfoViewProjectNotes+ "> ul"
					$(selector).append(this.aNoteTemplate(thisNote));
				}
			}else{
				$(this.wTagInfoViewProjectNotes).append("<p>There are no notes.</p>");
			}
		}

	});
	return wTag_ProjectNotesView;

});