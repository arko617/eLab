/*
 * View for a collection of file.
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'view/dialog/deleteDialogView',
        'model/project/fileModel',
        'model/project/metaFileModel',
        'collection/fileCollection',
        'collection/metaFileCollection',
        'view/controlPanel/controlPanelView',
        'view/project/fileView',
        'view/notification/notificationView',
        'view/project/aProjectMetaDataView',
        'datatable',
        'bootstrapLib',
        'jeditable',

        ], function($, _, Backbone, DeleteDialogView, FileModel, MetaDataModel,FileCollection,MetaFileCollection, ControlPanelView, FileView, NotificationView,AProjectOMetaDataView){

	var FileCollectionView = Backbone.View.extend({

		// Base the view on an existing element
		//el: $('#main'),

		initialize: function(){
			//temporary known LabBook folder ID
			//this.labBookId = "0B_Dd1D8Xgj6vNklPZTlHaF80cXc"; //ttemp LabBook folder ID by stephanie
			this.labBookId = "0B8x08fyIZQ1vbkpZMENtTGxJTVE"; //temp LabBook folder ID by Johnny

			this.projectId = this.options.projectId;
			this.metaFileCollection = this.options.metaFileCollection;
			this.metaFolderId = this.options.metaFolderId;
			this.protocolsCollection = this.options.protocolsCollection;
			this.protocolsFolderId = this.options.protocolsFolderId;

			//Binding event
			this.bindCollectionToEvent();

			//render the view
			this.render();

			//Notification box
			this.notificationView = new NotificationView();

			//Enable all the main view after all the files are retrieved
			$(".mainPanel").fadeIn(100);
		},
		
		//rename
		deleteAll: function(fileIds){
			var that = this;
			this.trigger("showLoadingNotification");
			
			var index;
			for (index = 0; index < fileIds.length; ++i){
				deleteFile(fileIds[index],function(message,isSuccess){
					that.trigger("showTaskNotification",message,isSuccess);
					//A JSON object is expected to return (ideally, the model that is deleted) when a delete request is fired so that "success" callback is made. I created a project.js response which fire a dummy JSON object when delete request is made so that here the destroy() works properly. 
					if (isSuccess){
						var temp = that.collection 
						//({success: function(){
							//console.log("Remove a file model");
				//		}
				//		});
					}
				});
			}
		},
		
		//render the page
		render: function(){
			// Cache these selectors
			this.filesDiv = $('#files tbody');
			this.metaDataDiv = $('#overview');
			this.protocolsDiv = $('#protocols tbody');

			//Empty the view first
			this.filesDiv.empty();
			this.metaDataDiv.empty();
			this.protocolsDiv.empty();

			// Create views for every one of the file in the collection and add them
			var that = this;
			this.postpone(function(){

				//#########Render overview
				that.metaFileCollection.each(function(file){
					var metaDataView = new AProjectOMetaDataView({model: file});
					that.metaDataDiv.append(metaDataView.render().el);

					//Get some file id
					thisFileTitle = file.get('title');
					switch (thisFileTitle){

					case "Project Overview":
						that.projectOverviewFileId = file.get('id');

					default:
					}
				});

				//#############Render protocols
				that.protocolsCollection.each(function(file){
					var protocolView = new FileView({model:file});
					that.protocolsDiv.append(protocolView.render(false).el);
				});				

				//############Render files
				that.collection.each(function(file){
					var view = new FileView({ model: file });
					switch (file.get("mimeType")){

					case "text/plain":
					case "text/html":
					case "application/rtf":
					case "application/pdf":
					case "application/vnd.google-apps.document":
					case "application/vnd.oasis.opendocument.text":
					case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
					case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
					case "application/x-vnd.oasis.opendocument.spreadsheet":
					case "application/vnd.google-apps.spreadsheet":	
					case "application/vnd.oasis.opendocument.presentation":
					case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
					case "application/vnd.google-apps.presentation":
					case "image/png":
					case "image/jpeg":
					case "image/gif":
					case "image/svg+xml":
					case "image/tiff":
					case "image/bmp":
					case "application/vnd.google-apps.drawing":
						that.filesDiv.append(view.render(false).el);
						break;

					default:
						//did not include any folder
					}				
				}, this);	// "this" is the context in the callback

				//For the table
				$(document).ready( function () {
					$('#projectFiles').dataTable( {
						"bPaginate": true,
						"bInfo": false,
						"bRetrieve": true,
						"bAutoWidth": false,
						"bFilter": true,	
						"aoColumnDefs": [{
							"sWidth": "10px",
							"bSortable": false,
							"aTargets": [0]}, 
							{
							"sWidth": "200px",
							"bSortable": false,
							"aTargets": [5]}]
					});
				} );

				//checkAll handler for the Files DataTable. For protocols datatable this 
				//should either be generalized or a new handler should be made. 
				$('#checkAll').click( function() {
					var oTable = $('#projectFiles').dataTable();
					$('input', oTable.fnGetNodes()).prop('checked', this.checked);
				}); 
				
				//Submit button handler
				$('#fileActionButton').click( function() {
					
					var form, fileIds, fileNames, list, index, item, selected;
					
					form = document.getElementById('fileForm');
					fileIds = [];
					fileNames = [];
					
					list = form.getElementsByTagName('input');
					for (index = 0; index < list.length; ++index){
						item = list[index];
						if (item.getAttribute('type') === "checkbox"
					        && item.checked
					        && item.name === "check1") {
					        fileIds.push(item.value);
					        fileNames.push(item.dataset.filename);
					    }
					}
					
					select = form.getElementsByTagName('select')[0].value;
					
					var deleteAll = function(fileIds){
						var that = this.file;
//						this.showLoadingNotification();
						
						var index;
						for (index = 0; index < fileIds.length; index++){
							deleteFile(fileIds[index],function(message,fileId,isSuccess){
//								that.showTaskNotification(message,isSuccess);
								//A JSON object is expected to return (ideally, the model that is deleted) when a delete request is fired so that "success" callback is made. I created a project.js response which fire a dummy JSON object when delete request is made so that here the destroy() works properly. 
								if (isSuccess){
									var trashedModel = that.collection.get(fileId);
									that.collection.remove(trashedModel); 
									//({success: function(){
										//console.log("Remove a file model");
								}
							});
						}
					};
						
					if (select === "delete" && fileNames.length > 0){
						that.deleteDialogView = new DeleteDialogView({fileIds: fileIds,
							  fileNames: fileNames});
						that.deleteDialogView.bind('deleteFileConfirmation', function() {
							deleteAll(fileIds);
						  });
					}
				});


				//*****************For jeditable, which can edit the text in the overview section
				$('.editTextarea').editable(function(value,settings){
//					console.log(this);
//					console.log(value);
//					console.log(settings);

					// update the GDrive after editing
					thisId = $(this).attr('id');
					value = value.replace(/\n/gi, '<br>');	//replace the \n with <br> because the content-type is text/html
					//Update
					switch (thisId){
					// Update the overview
					case 'overview':
						updateDriveFile(that.projectOverviewFileId, that.metaFolderId, value, function(message,isSuccess){
							console.log(message);
						});

					default:
					};
					return(value);
				},{
					type: 'textarea',	//or text
					tooltip:'Click to edit',
					onblur: 'submit',
					rows: 5,

					//To debug the html rendering issue
					//use "data" before typing
					data: function(value, settings) {
						//for <p>
						var retval = value.replace(/<p[\s\/]?>/gi, '');
						retval = retval.replace(/<\/p>/gi, '');
						retval = retval.replace(/<span[\s\/]?>/gi, '');
						retval = retval.replace(/<\/span>/gi, '');
						retval = retval.replace(/<br[\s\/]?>/gi, '\n');

						//for <br>
						//var retval = value.replace(/<br[\s\/]?>/gi, '\n');
						return retval;
					},
					//use "callback" when you want the action to happen after typing
					callback: function(value,settings){
						//var retval = value.replace(/\n/gi, "<p>"); 
						var retval = value.replace(/\n/gi, "<br>"); 
						$(this).html(retval);
					}
				});

			});
		},
		
		// This function is created to fix the problem when some code runs faster than UI. The render(0 this function because .each is faster than empty() in CHROME(not in FireFox). As a result, view rendering is weird. Although the waiting time is 0, but this function makes sure that UI will be done first.
		postpone: function(something){
			window.setTimeout(something,0);
		},
 
		openDeleteDialog: function(fileIds, fileNames){
			this.deleteDialogView = new DeleteDialogView({fileIds: fileIds,
														  fileNames: fileNames});
			
			this.deleteDialogView.on("DeleteFiles",this.deleteAll(fileIds),this);
		},

		
		//Create a drive file(doc, spreadsheet, etc)
		createGFile: function(e){
			var that = this;
			var GfileType = e["currentTarget"]["id"];
			var mimeType ="";
			var title = "";

			switch (GfileType){			
			case "GDoc":
				mimeType = "application/vnd.google-apps.document";
				title = "Untitled Document";
				break;

			case "GSheet":
				mimeType = "application/vnd.google-apps.spreadsheet";
				title = "Untitled SpreadSheet";
				break;

			case "GPresentation":
				mimeType = "application/vnd.google-apps.presentation";
				title = "Untitled Presentation";
				break;

				//For some reason the form cannot be created(probably the drive has bugs), need to fix
			case "GForm":
				mimeType = "application/vnd.google-apps.form";
				title = "Untitled Form";
				break;

			case "GDrawing":
				mimeType = "application/vnd.google-apps.drawing";
				title = "Untitled Drawing";
				break;

			default:

			}
			this.showLoadingNotification();
			createGFile(this.projectId,title,mimeType,function(message,isSuccess,respFile){
				that.showTaskNotification(message,isSuccess);
				if (isSuccess){
					var newModel = new FileModel(makeFileObject(respFile));
					that.collection.add(newModel);

					//Open the new GFile in a new browser; cannot open in new tab yet because need to physically "clicked"
					urlOfNewFile = respFile['alternateLink'];
					win=window.open(urlOfNewFile, '_blank');
					win.focus();
				}
			});	
		},

		//Upload the file to drive and trigger the FileView to re-render
		upload:function(e){
			var that = this;
			this.showLoadingNotification();
			uploadFile(this.options.projectId,e,function(message,isSuccess,respFile){
				that.showTaskNotification(message,isSuccess);
				if(isSuccess){
					//Change the ownership
					//patchPermissionByEmail(respFile.id,"LabBook2013@gmail.com","owner");

					//Add to new model
					var newModel = new FileModel(makeFileObject(respFile));
					that.collection.add(newModel);
				}
			});
		},

//		//Create a new project(Folder)
//		createNewProject: function(name){
//		var that = this;
//		this.showLoadingNotification();
//		createProject(this.options.projectId,name,function(message,isSuccess,respFile){
//		that.showTaskNotification(message,isSuccess);
//		if (isSuccess){
//		var newModel = new FileModel(makeFileObject(respFile));
//		that.collection.add(newModel);
//		}
//		});	
//		},

		//copies and moves a file. Use for adding new protocol 
		copyAndMove: function(fileId, title){
			var that = this;
			this.showLoadingNotification();
			copyAndMove(fileId,that.options.projectId,title,function(message,isSuccess,respFile){
				that.showTaskNotification(message,isSuccess);
				if (isSuccess){
					var newModel = new FileModel(makeFileObject(respFile));
					that.collection.add(newModel);
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

		//Get all the meta information
		getAllMetaContent: function(callback){
			//loop through and find the meta folder. this is good when the number of file is small
			//get the overview of the project in the meta folder
			var metaFiles =[];
			var that = this;

			//Retrieve the meta data, i.e. project overview
			retrieveChildrenFiles(this.metaFolderId,"","= 'application/vnd.google-apps.document'",function(allMetaFiles){
				for (var i =0;i<allMetaFiles.length;i++){
					thisFile = allMetaFiles[i];
					thisFileId = thisFile["id"];
					thisFileTitle = thisFile["title"];

					switch (thisFileTitle){
					//Get the content for project overview
					case "Project Overview":
						that.getGDocContent(thisFileId,function(content){
							thisFile["header"]="Description";
							thisFile["content"]=content;

							//Create the description view
							var newMetaDataModel = new MetaDataModel(makeFileObject(thisFile));
							metaFiles.push(newMetaDataModel);

							// Create the overview part
							callback && callback(metaFiles);
						});
						break;
					default:
					}
				}
			});
		},

		//Get the protocols
		getAllProtocols: function(callback){
			//Retrieve the protocols, i.e. project overview
			retrieveChildrenFiles(this.protocolsFolderId,"","= 'application/vnd.google-apps.document'",function(allProtocolFiles){
				console.log("Here are the protocols files", allProtocolFiles);
				callback && callback(allProtocolFiles);
			});
		},

		//Get LabBook Collection from drive (newest update) based on the query result
		updateCollection:function(query){
			var that = this;	//Create itself so that can be called in callback function
			query = query || "";

			this.showLoadingNotification();

			retrieveChildrenFiles(that.options.projectId,query,null,function(allFiles){
				that.closeLoadingNotification();
				//Create a new collection which store files in labBook
				labBookCollection = new FileCollection(allFiles);

				//Get the meta information
				that.getAllMetaContent(function(metaFiles){
					metaFileCollection = new MetaFileCollection(metaFiles);

					//Get the protocols
					that.getAllProtocols(function(protocols){
						protocolsCollection = new FileCollection(protocols);
						
						//Replace the old collection with the new collection that is based on query
						that.replaceCollection(labBookCollection,metaFileCollection,protocolsCollection);						
					})
				})

			});
		},

		//re-assign collection
		replaceCollection: function(collection,metaFileCollection,protocolsCollection){
			this.protocolsCollection = protocolsCollection;
			this.metaFileCollection = metaFileCollection;
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

		//get the project overview in meta folder
		getGDocContent: function(id,callback){
			downloadGDocContent(id,callback);
		},

	});

	return  FileCollectionView;

});