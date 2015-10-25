/*
 *  Model for a file object
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'view/dialog/infoDialogView',
        "view/dialog/renameFileDialogView",
        'view/notification/notificationView'


        ], function($, _, Backbone,InfoDialogView, RenameFileDialogView, LoadingNotificationView){

	var File = Backbone.Model.extend({
		urlRoot: "/project",

		initialize: function(){
		},

		defaults: {
			title: '',
			createdDate: '',
			modifiedDate: '',
			unformattedModifiedDate: '',
			link:'',
			id:'',
			mimeType:'',
			permission:'',
			content:'',
		},

		//Show details of model
		showing: function(){
			//Set the information
			var header = "Details";
			var fileDetail= "";
			fileDetail+="<p>"+"<b> File Title: </b>" + this.get("title")+"</p>";
			fileDetail+="<p>"+"<b> Date Created: </b>" + this.get("createdDate")+"</p>";
			fileDetail+="<p>"+"<b> Last Date Modified: </b>" + this.get("modifiedDate")+"</p>";
			fileDetail+="<p>"+"<b> Link: </b>" + this.get("link")+"</p>";
			fileDetail+="<p>"+"<b> Permission: </b>" + this.get("permission")["role"]+"</p>";
			
			var info = {header:header, content:fileDetail};
			new InfoDialogView(info);
		},

		//Download the file
		downloading: function(){
			var that = this;
			var url = downloadFile(this.get("id"),function(header,url){
				//Pop-up a dialog;
				//showDialog(content);
				//removeDialog();		
				var info = {header:header, content:url};
				new InfoDialogView(info);
				
				//Testing for the configuration file
				//downloadGDocContent(that.get("id"));
			});	
		},

		//Open rename dialog
		openRenameDialog:function(){
			this.renameFileDialogView = new RenameFileDialogView({model:this});
			this.renameFileDialogView.on("GetNewName",this.renaming,this);
		},

		//rename
		renaming: function(name){
			var that = this;
			this.trigger("showLoadingNotification");
			renameFile(this.get("id"),name,function(message,isSuccess){
				that.trigger("showTaskNotification",message,isSuccess);
				if (isSuccess){
					that.set("title",name);	//Change the model title to new one
				}
			});
		},

		//Destroy model (also removed it in the collection), but this does not mean you remove the model from view
		//Remove file in Google drive first
		destroying:function(){	
			var that = this;
			this.trigger("showLoadingNotification");
			deleteFile(this.get("id"),function(message,isSuccess){
				that.trigger("showTaskNotification",message,isSuccess);
				//A JSON object is expected to return (ideally, the model that is deleted) when a delete request is fired so that "success" callback is made. I created a project.js response which fire a dummy JSON object when delete request is made so that here the destroy() works properly. 
				if (isSuccess){
					that.destroy({success: function(){
						//console.log("Remove a file model");
					}
					});
				}

			});
		},		

		//Fire a update collection command to the collection object which this model belong to
		updateCollection:function(){
			this.trigger("UpdateCollection");
		},


	});


	return File;

});