/*
 * Google Drive
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/APIModel',
        'collection/APICollection',
        'text!view_template/arko_APItest/APITemplate.html',
        'text!view_template/arko_APItest/popupTemplate.html',
        'bootstrapLib',

        ], function($, _, Backbone,APIModel,APICollection,APITemplate,PopupTemplate){

	var allFiles = [];
	var drapUploadFile = '';
	var CloudGoogleDrive = Backbone.View.extend({
		el: ".site-main",
		apiTemplate: _.template(APITemplate),
		popupTemplate: _.template(PopupTemplate),
		initialize: function(){
			
			this.renderFiles();
			this.renderAction();
		},

		renderAction: function(){
			$(".site-main").append('<br>');
			$(".site-main").append('<div id="alignCenter" align="center"></div>');
			
			var buttons = [];
			var create = new APIModel({title: 'Create', intro:'Choose The File Type...', action:'<button class="btn btn-primary" id="createDoc" type="button" data-toggle="modal" data-target="#newDocName" style="height:60px; width:125px;"><h4>Google Doc</h4></button><div style="height:50px; width:50px; display:inline-block;"></div><button class="btn btn-primary" id="createFolder" type="button" data-toggle="modal" data-target="#newFolderName" style="height:60px; width:125px;"><h4>Folder</h4></button>'});
			var upload = new APIModel({title: 'Upload', intro:'Select The File...', action:'<div align="center" style="height:48px; width:200px; display:inline-block;"><form action="demo_form.asp"><input id="uploadFileToDrive" type="file"  name="anything"></form></div><br><div class="upload-drop-zone" id="drop-zone" style="height:200px; width:450px; margin-bottom:30px; border-width:2px; border-style:dashed; text-align:center; line-height:190px; color:#ccc; border-color:#ccc">Just Drag And Drop Files Here...</div><button class="btn btn-primary" id="newFileUpload" type="button" style="height:50px; width:75px;"><h4>OK</h4></button>'});
			var that = this;
			
			// Push the model in to collections
			buttons.push(create);
			buttons.push(upload);		
			
			//Create a cospace Collection
			this.actionCollection = new APICollection(buttons);
			

			this.actionCollection.each(function(model){
				//Show new content
				$("#alignCenter").append('<div style="height:50px; width:25px; display:inline-block"></div>');			
				$("#alignCenter").append(this.popupTemplate(model.toJSON()));
				$("#alignCenter").append('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#'+ model.get('title') +'" style="height:57px; width:107px;"><h4>' + model.attributes.title + '</h4></button>');
				$("#alignCenter").append('<div style="height:50px; width:25px; display:inline-block;"></div>');		
			},this);	//this is the callback	
			
			$(".site-main").append('<br><br>');
			
			var popDoc = new APIModel({title: 'newDocName', intro:'<div style="text-align:center"><h4>Type New Document Name...</h4></div>', action: '<input type="text" id="documentName"><br><br><br><button class="btn btn-primary" id="newGoogleDoc" type="button" style="height:50px; width:75px;"><h4>OK</h4></button>'});
			var popFolder = new APIModel({title: 'newFolderName', intro:'<div style="text-align:center"><h4>Type New Folder Name...</h4></div>', action: '<input type="text" id="folderName"><br><br><br><button class="btn btn-primary" id="newFolder" type="button" style="height:50px; width:75px;"><h4>OK</h4></button>'});
			var popSure = new APIModel({title: 'sureDelete', intro:'<div style="text-align:center"><h4>Are You Sure???</h4></div>', action: '<div align="center" style="height:48px; width:125px; display:inline-block;"><button class="btn btn-primary" id="deleteSure" type="button" style="height:60px; width:110px;"><h4>Delete</h4></button></div>'});
			$("#alignCenter").append(this.popupTemplate(popDoc.toJSON()));
			$("#alignCenter").append(this.popupTemplate(popFolder.toJSON()));
			$("#alignCenter").append(this.popupTemplate(popSure.toJSON()));
			
			
			var obj = $("#drop-zone");
			
			obj.on('dragenter', function (e) 
			{
			    e.stopPropagation();
			    e.preventDefault();
			    $(this).css('border', '2px solid #0B85A1');
			});
			
			obj.on('dragover', function (e) 
			{
			     e.stopPropagation();
			     e.preventDefault();
			});
			
			obj.on('drop', function (e) 
			{
				 dragUploadFile = e;
			     $(this).css('border', '2px dotted #0B85A1');
			     e.preventDefault();
			     var files = e.originalEvent.dataTransfer.files;
			});
			
						
			$("#createDoc").click(function(){
				$("#Create").modal('hide');
				$("#newGoogleDoc").click(function(){
					var newTitle = document.getElementById('documentName').value;
					var exists = 0;
					
					for(var i = 0; i != allFiles.length; i++){
						if(newTitle == ""){
							alert("No File Name!")
							exists = 1;
							break;
						}
						
						else if(allFiles[i].title == newTitle){
							alert("File Name Already Exists!")
							exists = 1;
							break;
						}
					}
					
					if(exists == 0){
						createGFile("0AN9TACL_6_flUk9PVA",newTitle,'',function(){
							window.location.reload();
							console.log("Google Doc Created");
						});
					}
				});
			});
			
			
			$("#createFolder").click(function(){
				$("#Create").modal('hide');
				$("#newFolder").click(function(){
					var title = document.getElementById('folderName').value;
					var exists = 0;
					
					for(var i = 0; i != allFiles.length; i++){
						if(title == ""){
							alert("No File Name!")
							exists = 1;
							break;
						}
						
						else if(allFiles[i].title == title){
							alert("File Name Already Exists!")
							exists = 1;
							break;
						}
					}
					
					if(exists == 0){
						createProject("0AN9TACL_6_flUk9PVA",title,function(){
							window.location.reload();
							console.log("Folder Created");
						});
					}
				});
			});
			
			/*$("#newFileUpload").click(function(){
				if(dragUploadFile){
					console.log(dragUploadFile);
					uploadFile("0AN9TACL_6_flUk9PVA",dragUploadFile,function(){
						window.location.reload();
						console.log("File Uploaded");
					});
				}
			});*/
		},
		
		// Event handling for download, delete, and rename
		events:{
			"click .grabFile": "Grabbing",
			"click .deleteFile": "Deleting",
			"click #renameFile": "Renaming",
			"change #uploadFileToDrive": "UploadingFileToDrive"
		},
		
		//upload file into drive
		UploadingFileToDrive: function(evt){
			$("#newFileUpload").click(function(){
				uploadFile("0AN9TACL_6_flUk9PVA",evt,function(){
					window.location.reload();
					console.log("File Uploaded");
				});
				
			});
		},
		
		Grabbing: function(evt){
			downloadFile(evt.currentTarget.name, function(header, url){
				
				var link = "";
				
				for(var i = 0; i < url.length; i++){
					if(url[i] == "'"){
						for(var j = i+1; url[j] != "'"; j++){
							link += url[j];
						}
						break;
					}
				}
				
				window.location.assign(link);
				console.log("Grabbed");
			});
		},
		
		Deleting: function(evt){
			$("#deleteSure").click(function(){
				deleteFile(evt.currentTarget.name, function(){
					window.location.reload();
					console.log("Deleted");
				});
			});
		},
		
		Renaming: function(evt){
			var newName = document.getElementById("NEW_" + evt.currentTarget.name).value;
			var exists = 0;
			
			for(var i = 0; i != allFiles.length; i++){
				if(newName == ""){
					alert("No File Name!")
					exists = 1;
					break;
				}
				
				else if(allFiles[i].title == newName){
					alert("File Name Already Exists!")
					exists = 1;
					break;
				}
			}
			
			if(exists == 0){
				renameFile(evt.currentTarget.name, newName,function(){
					window.location.reload();
					console.log("Renamed");
				});
			}
		},
		
		//Render overall hierarchical view of all the files
		renderFiles: function(){
			var that = this;
			// Get all the files from drive
			retrieveAllFiles('',function(result){
				convertResponseToFile(result,function(newfiles, oldfiles){
					
					var fileModels = [];
					
					for(var i = 0; i < newfiles.length; i++) {
						allFiles.push(newfiles[i]);
					}
					
					allFiles.sort(sortFunc);
					
					
					//"0AN9TACL_6_flUk9PVA"	is the root drive				
					recursion("", "0AN9TACL_6_flUk9PVA", allFiles, fileModels, function(){
						
						console.log("File Loaded...");
						
						//Create a files Collection
						this.fileCollection = new APICollection(fileModels);
						
						//Show the content
						$(".site-main").append('<table class="table info table-hover" id="content_table"></table>');	
						
						this.fileCollection.each(function(model){
							// Create table format
							var popup = new APIModel({title: model.attributes.id, intro:'<div style="text-align:center"><h4>Type the new name you want...</h4></div>', action: '<input type="text" id="NEW_' + model.attributes.id + '"><br><br><br><button name="' + model.attributes.id + '" class="btn btn-primary" id="renameFile" type="button" style="height:50px; width:75px;"><h4>OK</h4></button>'});
							$("#content_table").append(that.popupTemplate(popup.toJSON()));
							model.attributes.rename = '<input type="image" src="https://cdn3.iconfinder.com/data/icons/othericons-3-0/50/pencil-512.png" name=' + model.attributes.id + ' data-toggle="modal" data-target="#'+ model.attributes.id +'" style="width:15px;height:15px" />';
							$("#content_table").append(that.apiTemplate(model.toJSON()));
						},this);	//"this" is the callback
						
						var model = new APIModel({});
						$("#content_table").append(that.apiTemplate(model.toJSON()));
						
					});
					
				})
			});;
		
		},
		
	});
	
	return CloudGoogleDrive;
});