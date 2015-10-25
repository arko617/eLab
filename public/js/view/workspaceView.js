/*
 *Workspace View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'text!view_template/workspace/workspaceViewTemplate.html',
        'view/wNavView',
        'view/wMainView/wMainView',
        'view/wTagInfoView/wTagInfoView',
        'collection/projectCollection',
        'model/projectsOverviewModel',
        'bootstrapLib',
        'sideBar',

        ], function($, _, Backbone,WorkspaceViewTemplate,WNavView,WMainView, WTagInfoView, ProjectCollection, ProjectsOverviewModel){

	var WorkspaceView = Backbone.View.extend({
		el: ".site-main",
		workspaceViewTemplate: _.template(WorkspaceViewTemplate),

		initialize: function(){	
			//window.history.pushState("object or string", "Title", "/new-url");

			//Initialize variables
			this.labProjectFolderId  = this.options.labProfile.labProjectsFolderId;
			this.labName = this.options.labProfile.labName;
			var that = this;
			
			//Get projects overview details
			getFileMeta(this.labProjectFolderId,function(response){
				convertResponseToProjectsOverviewModel(response,function(projectsOverview){
					projectsOverviewModel = new ProjectsOverviewModel(projectsOverview);
					//Get essential data from drive
					retrieveChildrenFiles(that.labProjectFolderId ,"","= 'application/vnd.google-apps.folder'",function(response){
						//Convert the projects into a projects array---driveConvertResponse.js
						convertResponseToProject(response,function(projects){
							//Convert the projects array into a backbonejs collection
							projectCollection = new ProjectCollection(projects);					
							//Sort models by date
							projectCollection.comparator = function(file){
								return -file.get("modifiedDate")
							}
							
							//Set properties in projectsOverviewModel
							projectsOverviewModel.set({numProjects:projectCollection.length});
							
							//Rendering views
							that.render(projectsOverviewModel,projectCollection);
						})
					})
					
				});
			});
		},

		//Render the overall workspace view
		render: function(projectsOverviewModel, projectCollection){
			this.$el.html(this.workspaceViewTemplate());	//$el is the jQuery version of el so that it can use JQuery function

			// render wnavview
			this.wNavView = new WNavView({labProjectFolderId :this.labProjectFolderId
				, projectCollection:projectCollection
				, labName: this.labName});
			
			//For side bar
			$("#wNavViewSideBar").sidebar({
				open: "click",
				position:"left",
			});
						
			//#######################Render the basic view of wTagInfoView
			this.wTagInfoView = new WTagInfoView();
			
			// render wMainView
			this.wMainView = new WMainView({labProjectFolderId :this.labProjectFolderId
				, projectCollection:projectCollection
				, labName: this.labName
				, projectsOverviewModel: projectsOverviewModel});
			this.bindActions();
			
			// beyondINitialize of wMainView
			this.wMainView.beyondInitialize();
		},
		
		// Bind actions from subview
		bindActions: function(){
			//wNavView
			this.wNavView.on("open:file-in-tab", this.openAFile,this);	//open a file in wMainView; BE CAREFUll: the last parameter is the object (view) that give to that function, make sure you don't always put the worspace view, i.e., this, you should put the subview or mainview depending on what you wanna do
			this.wMainView.on("open:file-in-tab", this.openAFile,this);	//open a file in wMainView
			this.wMainView.on("open:projectsOverview-wTagInfo", this.wTagInfoView.openProjectsOverview,this.wTagInfoView); //open projects overview in wTagInfo
			this.wMainView.on("open:projectDetails-in-wTagInfo", this.wTagInfoView.openProjectDetails,this.wTagInfoView); //open a project details in wTagInfo
		},
		
		//Open Projects Overview (for all projects) in wTagInfo
//		openProjectsOverview:function(model){
//			this.wTagInfoView.openProjectsOverview(model);
//		},
//		
//		//Open a project details in wTagInfo
//		openProjectDetails: function(project){
//			
//		},
		
		//wMainView Action
		//Open a File in wMainView
		openAFile: function(fileId){
			var that = this;
			//Get the file metaData
			getFileMeta(fileId,function(response){
				console.log(response);
				var linkToFile = response.alternateLink;
				var embedLink = response.embedLink;
				var fileTitle = response.title;
				var fileId = response.id;
				var webContentLink = response.webContentLink;
				
				//For assignment;
				var link_preview;
				var link_download;
				
				//this is the link directly to the google doc editable link. However, because of security issue, there is no concrete to render perfectly the doc in iframe. Therefore, decide to use static content (embedlink_
				//console.log(embedLink)
				if (embedLink){
					link_preview = embedLink;
				}else{
					link_preview= linkToFile;
				}
				//If it is not a google docs, then it should have webContentLink. Otherwise, it should be in exportLinks-->assume we provides a M.S. formate 
				if(webContentLink){
					link_download = webContentLink;
				}else{
					var exportLink_MS = response.exportLinks["application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
					link_download = exportLink_MS;
				}
				
				
				//A simpler file object
				file = {title: fileTitle,
						id: fileId,
						link_preview: link_preview,
						link_download: link_download};
				
				//Send to wMainView
				that.wMainView.openAFile_intab(file);
			})
		},

	});

	return  WorkspaceView;

});