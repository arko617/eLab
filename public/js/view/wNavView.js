/*
 *Workspace file Navigation (File Tree) View
 */

define([
        'jquery',     
        'underscore', 
        'backbone',
        'text!view_template/workspace/wNavViewTemplate.html',
        'bootstrapLib',
        'jqueryCookie',
        'dynatree',
        'customScrollbar',
        'customScrollbarMousewheel',
        'bootstrapLib',

        ], function($, _, Backbone,WNavViewTemplate){

	//functions declarations:
	//initialize
	//render
	//events
	//searchProject: search projects from the search field
	//getProjects
	//getFilesFromKey
	//createNavTree

	//Initiate the view
	var WNavView = Backbone.View.extend({
		el: "#wNavView",
		wNavViewTemplate: _.template(WNavViewTemplate),

		initialize: function(){    
			//Initialize variables
			this.labProjectFolderId = this.options.labProjectFolderId;
			this.labName = this.options.labName;
			this.projectCollection = this.options.projectCollection;
			this.scrollBarLocation = "#wNavView";

			//Rendering view
			this.render();
		},

		//Render the file navigation view
		render: function(){
			this.$el.html(this.wNavViewTemplate()); 
			this.projectsList = this.getProjects();	//partial version of projectCollection
			this.createNavTree(this.projectsList);

			//For scrollbar when overflow
			$(this.scrollBarLocation).mCustomScrollbar({
				theme:"light",
				mouseWheel: true,
				autoHideScrollbar: true,
				autoDraggerLength: true,
				scrollInertia: 100,
				mouseWheelPixels: 10000,
//				horizontalScroll: true, //seem like it does not support both together, it will come out in few weeks, check it back

			});
		},

		//event
		events: {
			"click #nav-search-icon": "searchProject",
			"keyup #searchProjectInput": "searchProject",	//instant search 
		},

		//Search projects
		searchProject: function(){
			console.log("start searching...");
			var searchProjectInputId = "#searchProjectInput";
			var searchQuery = $(searchProjectInputId).val();

			//Search the projects and see if anything matches to searchQuesry
			var searchResult = $.grep(this.projectsList, function(project){ 
				var isFound = false;
				if (project.title.indexOf(searchQuery)!==-1){
					isFound = true;    
				}
				return isFound; 
			});

			//Update the nav tree
			console.log("das");
			var navRootNode = $("#wNavTree").dynatree("getRoot"); //get root node, i.e. invisible to us
			var projectRoot = (navRootNode.getChildren())[0];	// i.e. the project root
			projectRoot.removeChildren();
			projectRoot.addChild(searchResult);
		},

		//Get the projects
		getProjects: function(){
			var projectsList = [];	//project list only store few information, unlike a project model
			this.projectCollection.each(function(project){
				var thisProject = {
						title: project.get("title"),
						key: project.get("id"),
						tooltip: "Last modified: " + formatDate(project.get("modifiedDate")),		
						isFolder: true,
						isLazy: true, //load the file when the arrow is presses
						children: [],
				};
				projectsList.push(thisProject);
			});			
			return projectsList;
		},

		// Get the files associate with a folder by key
		getFilesFromKey: function(parentId,callback){
			var filesList = []; //files list only store few information
			retrieveChildrenFiles(parentId,"",null,function(response){
				if (typeof response[0] !='undefined'){
					for (var i=0;i<response.length;i++){
						var file = response[i];
						//check if the file is a folder or not
						var isFolder = false;
						var isLazy = false;
						if (file.mimeType == "application/vnd.google-apps.folder"){
							isFolder = true;
							isLazy = true;
						};
						
						//Check if the folder is the elab's default folder, e.g. #elab.xxxx
						if (doesNotContainString(file.title,'#elab.')){
							var thisFile = {
									title: file.title,
									key: file.id,
									tooltip: "Last modified: " + file.modifiedDate,	
									mimeType: file.mimeType,
									isFolder: isFolder,
									isLazy: isLazy, //load the file when the arrow is presses	
							};	
							filesList.push(thisFile);
						}
					}
				}
				callback(filesList);
			});
		},

		//create the nav tree
		createNavTree: function(treeData){
			var that = this;
			$("#wNavTree").dynatree({
				title: 'project navigation',
				fx: { height: "toggle", duration: 200 }, // the expansion speed
				autoFocus: true, // Set focus to first child, when expanding or lazy-loading.
				minExpandLevel: 1, //cannot ex
				selectMode: 2,	//the mode without checkbox
				//checkbox: true,
				autoCollapse: true,	//Collapse all other non-selected file
				autoFocus: true,	//set the focus to first child, when expanding or lazy-loading
				children: [{
					title: that.labName,
					key: that.labProjectFolderId,		
					isFolder: true,
					isLazy: true, //load the file when the arrow is presses
					expand: true,
					hideCheckbox: true,
					children: treeData
				}],

				//Error message
				strings: {
					loading: "Loading...",
					loadError: "Empty"
				},

				// For loading child nodes on demand (lazy)
				onLazyRead: function(node){
					// Check if it is a folder. If so, contact google drive to get its content
					if (node.data.isFolder){
						that.getFilesFromKey(node.data.key,function(files){
							node.setLazyNodeStatus(DTNodeStatus_Ok);	// To make sure that even if there is nothing, i.e. [], the arrow still work
							node.addChild(files);

							//update the scrollbar
							$(that.scrollBarLocation).mCustomScrollbar("update");
							$(that.scrollBarLocation).mCustomScrollbar("scrollTo","bottom");
						});
					};
				},

				//when some nodes are selected, do something, e.g. delete them
				onSelect: function(select, node) {
					// Get a list of all selected nodes, and convert to a key array:
					var selKeys = $.map(node.tree.getSelectedNodes(), function(node){
						return node.data.key;
					});
					console.log(selKeys);

					// Get a list of all selected TOP nodes
					var selRootNodes = node.tree.getSelectedNodes(true);
					// ... and convert to a key array:
					var selRootKeys = $.map(selRootNodes, function(node){
						return node.data.key;
					});
					console.log(selRootKeys);
					console.log(selRootNodes);
				},

				//when a node is clicked
				onClick: function(node){

					//To check if the event is from the "dynatree-title", if so, do the desired function. 
					if(node.getEventTargetType(event) == "title"){

						//If it is a Folder/project, let the node expands
						if (node.data.isFolder){
							return true;
						}else{			
							that.trigger("open:file-in-tab",node.data.key);	//send the key(id) to the workspace View to render a the object, e.g. a file/google doc
							return false;	// prevent default processing, which is expanding the node
						}
					}
				},

				// The following options are only required, if there are more than one tree on one page:
//				initId: "treeData",
//				cookieId: "dynatree-wNavTree",
//				idPrefix: "dynatree-wNavTree - "
			});

		},
	});

	return  WNavView;

});