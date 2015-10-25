/*
 * General Dialog View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/notification/notificationModel',
        'text!view/template/taskNotification-template.html',
        'text!view/template/loadingNotification-template.html',


        ], function($, _, Backbone, NotificationModel, TaskNotificationTemplate, LoadingNotificationTemplate){

	var NotificationView = Backbone.View.extend({
		el: $(".notify-wrapper"),
		taskTemplate:_.template(TaskNotificationTemplate),
		loadingTemplate: _.template(LoadingNotificationTemplate),

		initialize:function(){
		},

		render: function(){

		},
		
		setModel: function(message,isSuccess){
			this.model = new NotificationModel({content:message,isSuccess:isSuccess});
		},
		
		showTaskNotification:function(message,isSuccess){
			//update Model
			this.close();
			this.setModel(message,isSuccess);
			
			this.$el.empty();
			this.$el.hide();
			
			//prepare the content
			this.$el.append(this.taskTemplate(this.model.toJSON()));
			var notify = $("#notify");
			
			//Notification bar
			this.$el.fadeIn(200);
			this.$el.delay(1000).fadeOut(200);
			
			if (this.model.get("isSuccess")){
				notify.addClass("server-success");
			}else{
				notify.addClass("server-fail");
			}
			return this; // enable chained calls
		},
		
		showLoadingNotification:function(){
			this.close();	//Clean up first
			this.$el.append(this.loadingTemplate());
			this.$el.show();
			return this; // enable chained calls
		},

		close:function(){
			//Enforce the WebKit to redrew, a bug in chrome
			this.$el.empty();
//			this.$el.css("display",'none');
//			this.$el.offsetHeight;
//			this.$el.css("display",'block');
		},	
	});

	return NotificationView;

});