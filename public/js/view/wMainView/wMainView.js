/*
 * wMainView
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'collection/fileCollection',
        'view/wMainView/projectView',
        'view/wMainView/fileView',
        'text!view_template/workspace/wMainViewTemplate.html',
        'text!view_template/workspace/wMainViewNewPageTemplate.html', // specifically a template for a new page
        'text!view_template/workspace/wMainViewNewPageTabTemplate.html',	//For the new page tab
        'text!view_template/workspace/wMainView_wProjectViewTemplate.html',	//For the wProjectView in wMainView
        'text!view_template/workspace/wMainView_wFileViewTemplate.html',	//For the wProjectView in wMainView
        'xeditable',
        'bootstrapLib',

        ], function($, _, Backbone,FileCollection,ProjectView,FileView,wMainViewTemplate, wMainViewNewPageTemplate, wMainViewNewPageTabTemplate,wProjectViewTemplate,wFileViewTemplate){

	var WMainView = Backbone.View.extend({
		el: "#wMainView",
		wMainViewTemplate: _.template(wMainViewTemplate),
		wMainViewNewPageTemplate: _.template(wMainViewNewPageTemplate),	
		wMainViewNewPageTabTemplate: _.template(wMainViewNewPageTabTemplate),
		wProjectViewTemplate: _.template(wProjectViewTemplate),
		wFileViewTemplate: _.template(wFileViewTemplate),

		initialize: function(){	
			// Initialize the variable
			this.projectsOverviewModel = this.options.projectsOverviewModel;
			this.projectCollection = this.options.projectCollection;
			//this.folderCollection = new Backbone.Collection();

		},

		//Sequences of stuffs to do after initiallization. Do in this way to avoid some viewing problem with other workspaceView
		beyondInitialize: function(){			
			// Initialize the template
			this.render();

			//Activate the tab
			this.activateTab();

			//Activate the x-editable
			//this.activateXEditable();

			//Activate project JS action
			this.activateProjectJS();
		},

		//Render the overall workspace view
		render: function(){
			var that = this;

			//################ render the basic view of wMainView
			this.$el.html(this.wMainViewTemplate());
			// get the content handle
			this.wMainViewContent = ".wMainViewContent";	//location where the content(projects/files) should be loaded in the wMainView
			this.wMainViewMain = ".wMainViewMain";	//The class of a content block inside wMainViewContent
			this.wProjectsView = ".wProjectsView";	//The class for the content block of projects view
			this.wFilesView = ".wFilesView";	//The class for the content block of files view in a project
			$(this.wMainViewContent).append(this.wProjectViewTemplate());	//the wProjectView

			// render the tab pages for list of projects
			this.projectCollection.each(function(model){
				//console.log(model);
				//change the date format
				var modifiedDate = model.get("modifiedDate");
				model.set("modifiedDate",formatDate(modifiedDate));

				//Create view for each project
				var projectView = new ProjectView({model:model});
				$(".projects_list").append(projectView.render().el);

			},this);	//this is the callback	

			//#######################Render the basic view of wTagInfoView
			this.trigger("open:projectsOverview-wTagInfo",this.projectsOverviewModel);
		},


		//tab
		activateTab: function(){
			//remove a page
			$("#wMainView > .nav-tabs").on("click","a",function(e){
				e.preventDefault();	//this will prevent the default action to be shown
				$(this).tab('show');
			}).on("click",".closePage", function(){
				$(this).parent().parent().remove();	//remove the <li> and all the children
				var tabId = $(this).attr('title');
				//$(tabId).remove();	//remove the content
				//$(tabId+"_tab").remove(); //remove the pop-up menu from tab
				$("#wMainView > .nav-tabs li").children('a').first().click();	//click the first child
			});

			//Add a new page
//			$('.add-new-page').click(function(e){
//			e.preventDefault();
//			var id = $(".nav-tabs").children().length;
//			$(this).closest('li').before('<li><a href="#file_'+id+'">New Page<button class="close closePage" type="button" title="#file_'+id+'">x</button></a></li>');         
//			$("#wMainView > .tab-content").append('<div class="tab-pane" id="file_'+id+'">New page '+id+'</div>');

//			//select the last tab
//			$("#wMainView > .nav-tabs a:last").tab('show');
//			})			
		},

		//activate various projects' view JS actions
		activateProjectJS:function(){
			var that = this;
			//*****************
			//Open the project content when the a project row is clicked. 
			//Cannot do this in a projectView because the events are established before the attributes of a projectView are being set. This is not a neat way to solve this.
			$(".selection").dblclick(function(){
				var projectId = $(this).attr("id");
				//Look for this project in the project Collection
				project = that.projectCollection.get(projectId);
				var projectTitle = project.get("title");

				//Check if the project has zero files, if so, call google api to get the files
				if (project.get("children").length==0){
					retrieveChildrenFiles(projectId,"",null, function(response){
						convertResponseToFile(response,function(files,defaultFolders){	
							// Update the project Collection
							var fileCollection = new FileCollection(files);
							fileCollection.comparator = function(file){
								return -file.get("modifiedDate")
							};							
							project.set("children",fileCollection);

							// Show the files of a project
							that.openAProject(fileCollection,projectId,projectTitle);
							//Trigger Opening of Projects details in wTagInfo

							that.showProjectDetails(project,defaultFolders);
						});
					})
				}else{
					that.openAProject(project.get("children"),projectId,projectTitle);
					//Trigger Opening of Projects details in wTagInfo
					that.showProjectDetails(project);		//at this point, the project details should have been received				
				};

			});

			//**********************
			//Performs action when a browsing location (for nav in wmainView) is clicked
			this.updateNavJS();
		},

		//Create a new page (& tab) based on the file link
		openAFile_intab: function(file){
			//console.log(file);heightL

			//Tab + content
			$(".nav-tabs > li:last").after(this.wMainViewNewPageTabTemplate(file));
			$("#wMainView > .tab-content").append(this.wMainViewNewPageTemplate(file));

			//select the last tab (which is the newest tab just created)
			$("#wMainView > .nav-tabs > .dropdown:last a:first").tab('show');			

			// Activate the download function
			$("#wMainView > .nav-tabs > .dropdown:last > .dropdown-menu > .tab_downloadLink").click(function(){
				var downloadLink = $(this).attr("downLoadLink");
				window.open(downloadLink);	//open the download and start downloading it
			});
		},

		//1.Open a project.
		//2.Show its content in the wMainView mainContent
		//3.Hide all other content
		openAProject: function(files,projectId, projectTitle){
			//Hide all the wFileView and wProjectView
			$(".wMainViewMain").hide();

			//check if the view has existed or not. If not, create one
			var selector = "{0}[projectId='{1}'".f(this.wFilesView,projectId);
			if (!$(selector).length){
				//Create a wFileView
				$(this.wMainViewContent).append(this.wFileViewTemplate({projectId:projectId}));
				//render each file
				files.each(function(model){
					//console.log(model);
					//change the date format
					var modifiedDate = model.get("modifiedDate");
					model.set("modifiedDate",formatDate(modifiedDate));

					//Create view for each FILE
					var selector = "div[projectId='{0}'] .files_list".f(projectId);
					var fileView = new FileView({model:model});
					$(selector).append(fileView.render().el);	
				},this);	//this is the callback	
			}else{
				$(selector).show();
			}
			//##############update navigation
			//Update the navigation in wMainViewNavigation
			var new_nav = "<span class='glyphicon glyphicon glyphicon-chevron-right browseLoc browseRightArrow'></span>"
				+ "<button type='button' class='btn btn-link browseLoc browseNormal' id={0}>".f(projectId)
				+ "{0}".f(projectTitle)
				+ "</button>"; 
			$(".wMainViewNavigation").append(new_nav);

			//update the JS of the new nav
			this.updateNavJS();

			//update the JS of the selections class of the list of files
			this.updateFilesJS(projectId);
		},

		//Update the JS for the files object inside a project,i.e. open the folder if it is a folder
		updateFilesJS: function(projectId){
			var that = this;
			//select children(files/folders) of belong to a projectId
			var selector = ".wFilesView[projectId={0}] .selection".f(projectId);

			//unbind previous selector's actions
			$(selector).unbind('dblclick');
			//add action
			$(selector).dblclick(function(){
				//console.log("dasddassdasd",that.projectCollection.get(projectId))
								console.log("[[[",that.projectCollection);
				var modelId = $(this).attr("id");
				var model = that.projectCollection.get(projectId).get("children").get(modelId);
				var modelTitle = model.get("title");

				//If the model is a folder, then treat it as a "project" and open it
				if (model.get("isFolder")){
					//check it has children or not
					if (model.get("children").length<1){
						retrieveChildrenFiles(modelId,"",null, function(response){
							convertResponseToFile(response,function(files){	
								// Update the project Collection
								var fileCollection = new FileCollection(files);
								fileCollection.comparator = function(file){
									return -file.get("modifiedDate")
								};							
								model.set("children",fileCollection);
								
								//update to project collection(assume a folder is a project)
								if (!that.projectCollection.get(modelId)){
									that.projectCollection.add(model);
								}
								
								// Show the files of a folder
								that.openAProject(fileCollection,modelId,modelTitle);
							});
						})
					}else{
						fileCollection = model.get("children");
						// Show the files of a project
						that.openAProject(fileCollection,modelId,modelTitle);
					}
				}else{
					//Open the file preview in tab
					that.trigger("open:file-in-tab",modelId);	//send to workspaceView and it will initiate the mechanism to open the file
				}				
			});
		},

		//Update JS of navigation location in wMainView when a new nav loc is created
		//Have to do these here because the every time a new loc is created we need to add the JS again
		updateNavJS: function(){
			var that=this;
			//########unbind all actions first
			$(".browseRoot").unbind("click");
			$(".browseLoc").unbind("click");
			$(".browseNormal").unbind("click");

			//####bind action again
			//Root
			$(".browseRoot").click(function(){
				$(that.wMainViewMain).hide();
				//only show the HOME one
				$(that.wProjectsView).show();

				//trigger the project overview
				that.trigger("open:projectsOverview-wTagInfo",that.projectsOverviewModel);
			});

			//delete all the next sublings of a browse location
			$(".browseLoc").click(function(){
				$(this).nextAll().remove();
			});

			//Normal location (i.e. not root)
			$(".browseNormal").click(function(){
				//hide everything first
				$(that.wMainViewMain).hide();
				//show its content
				var id = $(this).attr("id");
				var selector = "{0}[projectId='{1}'".f(that.wFilesView,id);
				//console.log(selector);
				$(selector).show();
			});
		},

		//Obtain the project details if there isn't any. Pass the info to wTagInfoView and show it out
		showProjectDetails: function(project,defaultFolders){
			console.log("+++",project)
			var that = this;
			if (!project.hasAllDetails){
				//Create spinner for the entire delay
				var wTagInfoViewSpinner="#wTagInfoViewSpinner";
				$(wTagInfoViewSpinner).show();

				//Obtain the details folder
				var detailsFolder = null ;
				if (defaultFolders){
					for (var i =0;i<defaultFolders.length;i++){
						var thisFolder = defaultFolders[i];
						if (thisFolder.title == "#elab.project.details"){
							detailsFolder = thisFolder;
							break;
						}
					}
				}
				if (detailsFolder){
					//Get the details document in the folder
					retrieveChildrenFiles(detailsFolder.id,null,"",function(response){
						if (response.length<1){
							//something goes wrong. For example, 'details' are removed accendiatelly by user
							console.log("ERROR: no default files in #elab.project.details");
							console.log("ERROR:Cannot find 'details' in #elab.project.details.");
						}else{
							//Obtain the 'details' file
							var detailsFile;
							for (var i = 0;i<response.length;i++){
								var thisFile = response[i];
								if (thisFile.title=="details"){
									detailsFile = thisFile;
									break;
								}
							}

							//Read the details file and create a details object
							downloadGDocContent(detailsFile.id,function(response){
								convertResponseToAProjectDetailsObject(response,function(details){
									//update details
									that.projectCollection.get(project.id).hasAllDetails= true;
									that.projectCollection.get(project.id).set("details",details);								
									//console.log("!!!!!!!!!!!!%%%",that.projectCollection.get(project.id));

									//trigger call to workspaceview to open content in wTagInfo
									that.trigger("open:projectDetails-in-wTagInfo",that.projectCollection.get(project.id));
								});
							});
						}

					})
				}else{
					console.log("ERROR: no #elab details folder");
					that.trigger("open:projectDetails-in-wTagInfo",null);
				}

			}else{
				console.log("Have details!");
//				//Create spinner for delay<--SHOULD BE FAST ENOUGH
//				var wTagInfoViewContent = ".wTagInfoViewContent";
//				$(wTagInfoViewContent).empty();
//				$(wTagInfoViewContent).spin();
				//Trigger
				that.trigger("open:projectDetails-in-wTagInfo",project);
			}
		}

//		//Activate the necessary function for xeditable, 
//		activateXEditable: function(){
//		$.fn.editable.defaults.mode = 'popup';
//		//$("#projects_list").editable();
//		},

	});

	return  WMainView;

});

