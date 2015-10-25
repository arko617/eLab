/*
 *  Model for a file object
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'view/notification/notificationView',

        ], function($, _, Backbone, NotificationView){

	var User = Backbone.Model.extend({
		urlRoot: "/project",
		
		initialize:function(){
			//Notification box
			this.notificationView = new NotificationView();
		},

		defaults: {
			id:"",
			name:"",
			role:"",	//owner,writer,reader
			type:"",	//user,group,domain,anyone
		},

		//Delete the user from the list of one that can access LabBook
		destroying: function(projectId){
			var that = this;
			if (this.role==="owner"){
				alert("Cannot delete owner");
			}else{
				this.notificationView.showLoadingNotification();
				removePermission(projectId,this.id,function(message,isSuccess){
					that.notificationView.showTaskNotification(message,isSuccess);				
					if(isSuccess){
						that.destroy({success: function(){
						}
						});
					}
				});
			}
		},

	});


	return User;

});