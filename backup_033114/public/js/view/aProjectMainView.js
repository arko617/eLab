/*
 * Parent View of the /project/* and Children of labBookMainView, which creates the project folder views. 
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'view/controlPanel/aProjectControlPanelView',
        'view/project/fileCollectionView',
        'view/navigation/navigationView',
        'view/labBookMainView'
        

        ], function($, _, Backbone, AProjectControlPanelView, FileCollectionView,NavigationView,LabBookMainView){
	
	var aProjectMainView = LabBookMainView.extend({

		initialize: function(options){
			//Execute initialization of the parent, i.e. LabBookMainView
			this.constructor.__super__.initialize.apply(this,[options]);
			
			var that = this;
			//Set up the comparator for the collection, depending on the newest update
			this.options.projectCollection.comparator = function(file){
				return -file.get("unformattedModifiedDate");
			};
			
			//construction of view
			//this.controlPanelView = new AProjectControlPanelView({collection:this.options.projectCollection,projectId:this.options.projectId});
			this.navigationView = new NavigationView({projectId:this.options.projectId});
			this.fileCollectionView = new FileCollectionView({collection:this.options.projectCollection,projectId:this.options.projectId,protocolsCollection: this.options.protocolsCollection,protocolsFolderId:this.options.protocolsFolderId,metaFileCollection:this.options.metaFileCollection,metaFolderId:this.options.metaFolderId});
			
			//Bind Control panel action 
			/*
			this.controlPanelView.on("Control-updateCollection",this.updateCollection,this);
			this.controlPanelView.on("Control-upload",this.upload,this);
			this.controlPanelView.on("Control-checkStorage",this.checkStorage,this);
			this.controlPanelView.on("Control-copyAndMove",this.copyAndMove,this);
			this.controlPanelView.on("Control-createGDoc",this.createGFile,this);
			//this.controlPanelView.on("Control-listUser",this.listUser,this);
			
			*/
			
			//Enable all the main view after all the files are retrieved
			$(".mainPanel").fadeIn(100);AddANewProtocol
			
			//Set up socket.io
			this.socket = io.connect("127.0.0.1:3000");			
			this.socket.on("connect", function(){
				console.log("aProjectMainView socket.io receive signal from server side socket.io");
//				getUserName(function(name){
//					that.userName = name;
//					that.socket.emit("userName",that.userName);
//				});
				
				//Update collection whenever the server calls
				that.socket.on("UpdateCollectionNow", function(){
					console.log("Client side receive 'updateCollection'");
					that.updateCollection(null);
				});				
			});
    	},
		//Create a Drive file    	
    	createGFile:function(e){
    		this.fileCollectionView.createGFile(e);
    	},
    	
		//Update the collection View
		updateCollection: function(query){
			this.fileCollectionView.updateCollection(query);	//this.options.projectId is passed from the class which initiate this view
		},
		
		//Upload
		upload: function(e){
			this.fileCollectionView.upload(e);
		},
		
		//Check Storage
		checkStorage: function(){
			this.fileCollectionView.checkStorage();
		},	
		
		copyAndMove: function(fileId, title){
			this.fileCollectionView.copyAndMove(fileId, title);
		},
		
		//List users
//		listUser:function(){
//			retrievePermissions(this.options.projectId,function(resp){
//				console.log(resp);
//			});
//		},
		
	});

	return  aProjectMainView;

});