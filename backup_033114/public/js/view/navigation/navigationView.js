/*
 * For navigation
 */

define([
        'jquery',     
        'underscore', 
        'backbone',   
        'text!view/template/navigation-template.html'

        ], function($, _, Backbone,NavigationTemplate){

	var NavigationView = Backbone.View.extend({
		template:_.template(NavigationTemplate),
		el: $('.projectNavBar'),

		events:{
			//"click #projectRoot":"redirectToRoot",
		},

		initialize:function(){
			this.render();			
		},

		render: function(){
			this.$el.empty();
			this.$el.append(this.template());

			//To append necessary path in navigation
			var that = this;
			var labBookId = "0B8x08fyIZQ1vbkpZMENtTGxJTVE"; //temp known LabBook folder ID

			//Check it is project list page
			if (this.options.projectId){
				getFileMeta(this.options.projectId,function(content){
					if (content){
						var projectId = content.id;
						var projectName = content.title;

						if (projectId!==labBookId){
							that.$el.find(".breadcrumb").append("<li class='active'><span class='divider'>/</span>"+projectName+"</li>");
						}else{
							$("#projectRoot").addClass("active");
						}
					}
				});
			}else{
				$("#projectRoot").addClass("active");
			}
		},

		//Redirect to root directory, i.e. LabBook
//		redirectToRoot: function(){
//			var MyApp = new Backbone.Router();
//			MyApp.navigate('/project', {trigger: true}); 
//		}

	});


	return NavigationView;

});