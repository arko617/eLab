/*
 * 	For delete file dialog; inherit from dialogView
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'view/dialog/dialogView',
        'bootstrapLib',

        ], function($, _, Backbone,DialogView){

	var DeleteDialogView = DialogView.extend({

		initialize:function(options){
			this.fileNames = options.fileNames;
			this.fileIds = options.fileIds;
			this.fileData = options.fileData;
			
			this.render();
			this.appendForm();
		},

		//Extend the events from parent
		events:_.extend({
			"click #submitDelete":"deleteAll",
			"keypress :input":"checkKey"
		},DialogView.prototype.events),

		//Append form into the input dialog
		appendForm: function(){
			var headerText;
			if (this.fileNames == null){
				headerText = "No file selected.";
			}
			else {
				headerText = "Are you sure you want to delete the following files?";
			}
			$("#myModalLabel").html(headerText);
			var index;
			content="";
			for (index = 0; index < this.fileNames.length; ++index){
				content += this.fileNames[index] + "<p>";
			}
			$("#dialog-content").html(content);
			$(".modal-footer").html("<button class='btn btn-primary' id='submitDelete'>Yes</button>");
			$("#newFileName").focus();			
		},
		
		//delete the selected files.
		deleteAll:function(){
			this.trigger('deleteFileConfirmation');
			this.close();
		},	

		//Check if the user press "Enter"
		checkKey: function(e){
			if (e.keyCode=="13"){
				this.deleteAll();
				return false;
			}
		},
	});


	return DeleteDialogView;

});