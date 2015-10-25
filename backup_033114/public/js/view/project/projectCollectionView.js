/*
 * View for a collection of file.
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/project/fileModel',
        'collection/fileCollection',
        'view/project/fileView',
        'view/notification/notificationView',
        'bootstrapLib'

        ], function($, _, Backbone,FileModel, FileCollection, FileView, NotificationView){

	var ProjectCollectionView = Backbone.View.extend({

		// Base the view on an existing element
		//el: $('#main'),

		initialize: function(){
			this.labBookId = this.options.labBookId;

			//Binding event
			this.bindCollectionToEvent();

			//render the view
			this.render();

			//Notification box
			this.notificationView = new NotificationView();

			//Enable all the main view after all the files are retrieved
			$(".mainPanel").fadeIn(100);
		},

		//render the page
		render: function(){			
			// Cache these selectors
			this.projectDiv = $('#project tbody');
			var that = this;

			//Empty the view first
			this.projectDiv.empty();

			// Create views for every one of the file in the collection and add them
			this.postpone(function(){
				that.collection.each(function(file){
					var view = new FileView({ model: file });
					that.projectDiv.append(view.render(true).el);
				}, this);	// "this" is the context in the callback
			});
		},

		// This function is created to fix the problem when some coe runs faster than UI. The render(0 this function because .each is faster than empty() in CHROME(not in FireFox). As a result, view rendering is weird. Although the waiting time is 0, but this function makes sure that UI will be done first.
		postpone: function(something){
			window.setTimeout(something,0);
		},

		//Create a new project(Folder) and related info about a project: Project Overview
		createNewProject: function(name){
			var that = this;
			this.showLoadingNotification();
			createProject(this.labBookId,name,function(message,isSuccess,respFile){
				that.showTaskNotification(message,isSuccess);
				if (isSuccess){
					var newModel = new FileModel(makeFileObject(respFile));
					that.collection.add(newModel);
					thisProjectId = respFile.id;

					//create the "meta" folder inside the project which stores the configuration, project description, etc
					createProject(thisProjectId,"meta",function(message,isSuccess,respFile){
						if (isSuccess){
							console.log("Create meta folder for the project:" + thisProjectId);
							thisMetaFolderId = respFile.id;
							
							//Create the empty project overview file
							createGFile(thisMetaFolderId,"Project Overview","application/vnd.google-apps.document",function(message,isSuccess,respFile){
								if (isSuccess){
								//console.log(message);
								console.log("Create Empty Project Overview for the project:" + thisProjectId);
								}else{
									console.log(message);
								};
							});
							
						}else{
							console.log("fail to create meta folder for the project");
						};
					})
					
					//create the "protocol" folder
					
					//Creat 
					createProject(thisProjectId,"protocols",function(message,isSuccess,respFile){
						if (isSuccess){
						//console.log(message);
						console.log("Create Protocol folder for the project:" + thisProjectId);
						//TODO create a empty protocol which has basic behavior of a protocol
						}else{
							console.log(message);
						};
					});
				}
			});	
		},

		//Check Storage
		checkStorage: function(){
			var that = this;
			var storager = $("#storager");
			this.showLoadingNotification();
			printStorage(function(percentageUsed, totalStorage, summary){
				that.closeLoadingNotification();
				//Avoid passing allover the place, so directly called popover-content here
				//Add the content
				content = "<p>" + summary + "</p>";
				content+= "<div class='progress'>";
				content+= "<div class='bar' style='width:"+percentageUsed+"%;'></div>";
				content+= "</div>";	

				//Set-up
				storager.popover({
					title:"Disk Space",
					content:content,
					html:true,
				});				
				storager.popover("show");
			});
		},				

		//Get LabBook Collection from drive (newest update) based on the query result
		updateCollection:function(query){
			var that = this;	//Create itself so that can be called in callback function
			query = query || "";

			this.showLoadingNotification();

			retrieveChildrenFiles(that.labBookId,query,"= 'application/vnd.google-apps.folder'",function(allFiles){
				that.closeLoadingNotification();
				//Create a new collection which store files in labBook
				labBookCollection = new FileCollection(allFiles);

				//Replace the old collection with the new collection that is based on query
				that.replaceCollection(labBookCollection);
			});
		},

		//re-assign collection
		replaceCollection: function(collection){
			this.collection=collection;
			this.bindCollectionToEvent();
			this.render();
		},	

		//Bind the collection to certain event
		bindCollectionToEvent: function(){
			this.collection.bind("remove",this.render,this);
			this.collection.bind("add",this.render,this);
			this.collection.bind("change",this.render,this);
			this.collection.on("UpdateCollection",this.updateCollection,this);	//Update collection when there is an event fired for update collection, form individual model
			this.collection.on("showLoadingNotification",this.showLoadingNotification,this);	//Update collection when there is an event fired for update collection, form individual model
			this.collection.on("showTaskNotification",this.showTaskNotification,this);	//Update collection when there is an event fired for update collection, form individual model

		},

		//Show loading notification
		showLoadingNotification: function(){
			this.notificationView.showLoadingNotification();
		},

		//Close loading notification
		closeLoadingNotification:function(){
			this.notificationView.close();
		},

		//Show task notification
		showTaskNotification: function(message,isSuccess){
			this.notificationView.showTaskNotification(message,isSuccess);
		},

	});

	return  ProjectCollectionView;

});