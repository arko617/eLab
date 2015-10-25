/*
 * 	For rename file dialog; inherit from dialogView
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'view/dialog/dialogView',
        'bootstrapLib',

        ], function($, _, Backbone,DialogView){

	var RenameFileDialogView = DialogView.extend({

		initialize:function(){
			//this.model = model;
			this.render();
			this.appendForm();
		},

		//Extend the events from parent
		events:_.extend({
			"click #submitRename":"rename",
			"keypress :input":"checkKey"
		},DialogView.prototype.events),

		//Append form into the input dialog
		appendForm: function(){
			$("#myModalLabel").append("Rename");
			content="Enter a new name: <input type='text' id='newFileName'/>";
			$("#dialog-content").append(content);
			$(".modal-footer").html("<button class='btn btn-primary' id='submitRename'>Submit</button>");
			$("#newFileName").focus();			
		},

		//Create a new project
		rename:function(){
			var name = $("#newFileName").val();
			this.close();
			this.model.renaming(name);
		},	

		//Check if the user press "Enter"
		checkKey: function(e){
			if (e.keyCode=="13"){
				this.rename();
				return false;
			}
		},
	});


	return RenameFileDialogView;

});