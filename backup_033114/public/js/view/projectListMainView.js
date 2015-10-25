/*
 * Parent View of the /project/* and Children of labBookMainView, which creates the project folder views. 
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'view/project/projectCollectionView',
        'view/navigation/navigationView',
        'view/labBookMainView',
        'view/controlPanel/projectListControlPanelView',
        

        ], function($, _, Backbone, ProjectCollectionView,NavigationView,LabBookMainView,ProjectListControlPanelView){
	
	var ProjectListMainView = LabBookMainView.extend({

		initialize: function(options){
			//Execute initialization of the parent, i.e. LabBookMainView
			this.constructor.__super__.initialize.apply(this,[options]);
			
			var that = this;
			//Set up the comparator for the collection, depending on the newest update
			this.options.projectsCollection.comparator = function(file){
				return -file.get("unformattedModifiedDate");
			};
			
			//construction of view
			projectId = null;
			labBookId = this.options.labBookId;
			this.projectCollectionView = new ProjectCollectionView({collection:this.options.projectsCollection,labBookId:labBookId});	//no project id
			this.navigationView = new NavigationView({projectId:projectId});
			this.projectListControlPanelView = new ProjectListControlPanelView({collection:this.options.projectCollection,projectId:labBookId});

			//Bind Control panel action
			this.projectListControlPanelView.on("Control-updateCollection",this.updateCollection,this);
			this.projectListControlPanelView.on("Control-createNewProject",this.createNewProject,this);
			this.projectListControlPanelView.on("Control-checkStorage",this.checkStorage,this);
			
			//Set up socket.io
			this.socket = io.connect("127.0.0.1:3000");
			//this.socket = io.connect("http://snapshot.stashd.org:3000/");
			this.socket.on("connect", function(){
				console.log("projectListMainView socket.io receive signal from server side socket.io");
				
				//Update collection whenever the server calls
				that.socket.on("UpdateCollectionNow", function(){
					console.log("Client side receive 'updateCollection'");
					that.updateCollection(null);
				});				
			});
			
			//*********Testing for insert comment
			// Need to figure out how to update a comment and avoid overlapping comment
			//test_projectID = '0B84r2JBhfUhnb2FIYzlCSWV0NVE';
			//insertComment(test_projectID,"This is a testing project",retrieveComments(test_projectID));
    	},		
		
		//Update the collection View
		updateCollection: function(query){
			this.projectCollectionView.updateCollection(query);	//this.options.projectId is passed from the class which initiate this view
		},
		
		//Create a New project
		createNewProject: function(name){
			this.projectCollectionView.createNewProject(name);
		},
		
		//Check Storage
		checkStorage: function(){
			this.projectCollectionView.checkStorage();
		},	
		
	});


	return  ProjectListMainView;

});