/*
 * Overview of the entire LabBook page, handling the project list and the user name and other information.
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'bootstrapLib'

        ], function($, _, Backbone){

	var ProjectMainView = Backbone.View.extend({
		el: $("body"),
		
		initialize: function(){
			var that = this;

			//Set up the comparator for the collection, depending on the newest update
			this.options.labBookCollection.comparator = function(file){
				return -file.get("unformattedModifiedDate");
			};

			//Get the list of projects
			this.getProjectInfo(function(projectsList){
				//Get the basic information,such as userName
				getUserName(function(name){
					//set the meta data on the page
					that.setMetaData(name,projectsList);

					//Set up socket.io
					that.socket = io.connect("127.0.0.1:3000");
					//that.socket = io.connect("http://snapshot.stashd.org:3000/");
					that.socket.on("connect", function(){
						console.log("labBookMainView socket.io receive signal from server side socket.io");
						that.userName = name;
						that.socket.emit("userName",that.userName);
					});
				});
			});
		},
		
		events: {
			"mouseenter #projectDropDown": "showProjectList",
			"mouseleave #projectDropDown": "hideProjectList",
		},

		//set the meta data
		setMetaData: function(userName,projectsList){
			//Set the user name
			$("#userName").append(userName);

			//Set the project list
			for (var i=0;i<projectsList.length;i++){
				aProject = projectsList[i];
				link = "/project/"+aProject["id"];
				title = aProject["title"];
				var content="<li role='presentation'><a role='menuitem' tabindex='-1' href='{0}'>{1}</a></li>".f(link,title);
				$("#projectDropDownList").append(content);
			}
			
		},

		//Get the projects' info
		getProjectInfo: function(callback){
			var projectsList=[];

			this.options.labBookCollection.each(function(file){
				if (file.get("mimeType") == "application/vnd.google-apps.folder"){
					var aProject = {title:file.get("title"),id:file.get("id")};					
					projectsList.push(aProject);
				};
			},this);			
			callback && callback(projectsList);

		},
		
		//Show the lists of projects
		showProjectList: function(){
			$("#projectDropDownList").slideDown();	//.slideToggle()
		},
		
		//end the lists of projects
		hideProjectList: function(){
			$("#projectDropDownList").slideUp();
		},

	});

	return  ProjectMainView;

});