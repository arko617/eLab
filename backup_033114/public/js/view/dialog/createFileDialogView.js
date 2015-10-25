/*
 * 	For create file dialog; inherit from dialogView
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'view/dialog/dialogView',
        'model/project/fileModel',
        'collection/fileCollection'

        ], function($, _, Backbone,DialogView,FileModel,FileCollection){

	var CreateFileDialogView = DialogView.extend({

		initialize:function(){
			this.render();
			this.appendForm();
		},

		//Extend the events from parent
		events:_.extend({
			"click #submitNewProjectName":"setNewProjectName",
			"keypress :input":"checkKey"
		},DialogView.prototype.events),

		//Append form into the input dialog
		appendForm: function(){
			$("#myModalLabel").append("Create New Project");
			content="Enter a new name: <input type='text' id='newProjectName'/>";
			$("#dialog-content").append(content);
			$(".modal-footer").append("<button class='btn btn-primary' id='submitNewProjectName'>Submit</button>");
			$("#newFileName").focus();	
		},

		//Create a new project
		setNewProjectName:function(){
			var name = $("#newProjectName").val();
			this.close();
			this.trigger("haveNewProjectName",name);
		},

		//Check if the user press "Enter"
		checkKey: function(e){
			if (e.keyCode=="13"){
				this.setNewProjectName();
				return false;
			}
		}
	});


	return CreateFileDialogView;

});