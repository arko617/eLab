/*
 * 	For add protocol dialog; inherit from dialogView
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

	var ProtocolDialogView = DialogView.extend({

		initialize:function(){
			this.render();
			this.appendForm();
		},

		//Extend the events from parent
		events:_.extend({
			"click #submitProtocolInfo":"setNewProtocolInfo",
			"keypress :input":"checkKey"
		},DialogView.prototype.events),

		//Append form into the input dialog
		appendForm: function(){
			$("#myModalLabel").append("Add New Protocol"); 
			content="Enter a file name: <input type='text' id='newProtocolTitle'/>";
			$("#dialog-content").append(content);
			content2="Enter the fileId we are copying from: <input type='text' id='newProtocolId'/>"
				$("#dialog-content").append(content2);	
			$(".modal-footer").append("<button class='btn btn-primary' id='submitProtocolInfo'>Submit</button>");
			$("#newFileName").focus();	
		},

		//Create a new project
		setNewProtocolInfo:function(){
			var fileId = $("#newProtocolId").val();
			var title = $("#newProtocolTitle").val();
			this.close();
			this.trigger("haveNewProtocolName",fileId,title);
		},

		//Check if the user press "Enter"
		checkKey: function(e){
			if (e.keyCode=="13"){
				this.setnewProtocolInfo();
				return false;
			}
		}
	});


	return ProtocolDialogView;

});