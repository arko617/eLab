/*
 * View for the icons in control panel for project listing
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'collection/userCollection',
        'view/dialog/createFileDialogView',
        'view/dialog/userDialogView',
        'view/controlPanel/controlPanelView',
        'text!view/template/projectListControlPanel-template.html',
        'bootstrapLib'

        ], function($, _, Backbone,UserCollection,CreateFileDialogView,UserDialogView,ControlPanelView,ProjectListControlPanelTemplate){
	
	var	ProjectListControlPanelView = ControlPanelView.extend({
		template: _.template(ProjectListControlPanelTemplate),
		el: $(".controlPanel"),
		
		//Since view is initialized here, it will not run the parent initialization
		initialize:function(){
			this.render();
		},
		
		//Extend the events from parent
		events:_.extend({

		},ControlPanelView.prototype.events),
		
		//Get new project name
		getNewProjectName: function(){
			this.createFileDialogView = new CreateFileDialogView({collection:this.collection});
			this.createFileDialogView.on("haveNewProjectName",this.createNewProject,this);
		},
		//Create new projects
		createNewProject: function(name){	
			this.trigger("Control-createNewProject",name);
		},
				
		//Show all the user in the LabBook folder and able to add or remove user
		listUser: function(){
			var that = this;
			retrievePermissions(this.options.projectId,function(userList){
				//console.log(userList);
				allUsers = new UserCollection(userList);
				new UserDialogView({collection:allUsers,projectId:that.options.projectId});
			});
		},

	});

	return ProjectListControlPanelView;

});