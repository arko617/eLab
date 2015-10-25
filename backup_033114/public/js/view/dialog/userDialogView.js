/*
 * 	For create file dialog; inherit from dialogView
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'model/user/userModel',
        'collection/userCollection',
        'view/dialog/dialogView',
        'view/notification/notificationView',
        'view/user/userView',

        ], function($, _, Backbone,UserModel,UserCollection, DialogView, NotificationView, UserView){

	var UserDialogView = DialogView.extend({

		initialize:function(){
			this.render();
			this.appendForm();

			//Binding event
			this.bindCollectionToEvent();
			
			//Notification box
			this.notificationView = new NotificationView();
		},

		//Extend the events from parent
		events:_.extend({
			"keypress :input":"checkKey",
			"click #addUser" : "insertNewUserPermission"
		},DialogView.prototype.events),

		//Append form into the input dialog
		appendForm: function(){
			var dialogContent = $("#dialog-content");
			var footer = $(".modal-footer");
			var header = $("#myModalLabel");
			
			//Empty
			dialogContent.empty();
			footer.empty();
			header.empty();
			
			//Header
			header.append("Member List");
			
			//Content
			dialogContent.append("<table class='table' id='permissionList'>");
			var permissionList = $("#permissionList");
			permissionList.append("<thead><tr><th>Member</th><th>Permision</th><th></th></tr></thead>");
			permissionList.append("<tbody>");
			var that = this;
			this.collection.each(function(user){
				var view = new UserView({model:user,projectId:that.options.projectId});
				permissionList.append(view.render().el);
			});
			dialogContent.append("New gmail account: ");
			dialogContent.append("<input type='text' class='span4' id='newUserEmail'>");

			//Footer
			footer.append("<button class='btn btn-primary' id='addUser'>Add</button>");

			//Focus
			$("#newUserEmail").focus();
		},

		//Done in the UserModel
		deleteUser: function(){},

		// Insert new user
		insertNewUserPermission: function(){
			var that = this
			, newUserEmail = $("#newUserEmail")
			, value = newUserEmail. val()
			, type = "user"
			, role = "writer";
			this.notificationView.showLoadingNotification();
			insertPermission(this.options.projectId,value,type,role,function(message, isSuccess,newUser){
				that.notificationView.showTaskNotification(message,isSuccess);
				newUserEmail.val("");
				if (isSuccess){
					that.collection.add(new UserModel(newUser));
				}
			});			
		},

		//Check if the user press "Enter"
		checkKey: function(e){
			if (e.keyCode=="13"){
				var newUserEmail = $("#newUserEmail");
				if (newUserEmail.val()!==""){
					this.insertNewUserPermission();
					return false;
				}
			}
		},

		//Bind the collection to certain event
		bindCollectionToEvent: function(){
			this.collection.bind("remove",this.appendForm,this);
			this.collection.bind("add",this.appendForm,this);
			this.collection.bind("change",this.appendForm,this);
		},
	});


	return UserDialogView;

});