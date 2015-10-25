/*
* Matthew API Test View
*/

define([
        //These are the path aliases that we configured in our bootstrap
        'jquery',
        'underscore',
        'backbone',
        'model/matthewApiTestModel',
        'collection/matthewApiTestCollection',
        'text!view_template/matthewApiTest/matthewApiTestTemplate.html',
        'bootstrapLib',
        
        ], function($, _, Backbone, matthewApiTestModel, 
        		matthewApiTestCollection, MatthewApiTestTemplate){
				
        		var files = [];
        		var MatthewApiTestView = Backbone.View.extend({
        			el: ".site-main",
        			matthewApiTestTemplate: _.template(MatthewApiTestTemplate),
        			
        			initialize: function(){
        				this.renderAlert();
        				this.renderAction();
        				this.renderFiles();
        			},
        			
        			//Render the overall workspace viewp
        			renderAlert: function()
        			{
        				alert("Created view!");
        			},
        		
        			//Creates all the actions for the API's
        			renderAction: function()
        			{
        				$(".site-main").append('<br></br>');
        				
        				$(".site-main").append('<div id="alignCenter" align="center"></div>');
        				
        				$("#alignCenter").append('<button class="btn btn-primary" id="createFile" type="button" style="height:50px; width:100px;"><h4>Create</h4></button>');
        				$("#alignCenter").append('<div style="height:50px; width:50px; display:inline-block;"></div>')
        				
        				$("#alignCenter").append('<button class="btn btn-primary" id="createFile" type="button" style="height:50px; width:100px;"><h4>Grab</h4></button>');
        				$("#alignCenter").append('<div style="height:50px; width:50px; display:inline-block;"></div>')
        				
        				$("#alignCenter").append('<button class="btn btn-primary" id="createFile" type="button" style="height:50px; width:100px;"><h4>Rename</h4></button>');
        				$("#alignCenter").append('<div style="height:50px; width:50px; display:inline-block;"></div>')
        				
        				$("#alignCenter").append('<button class="btn btn-primary" id="createFile" type="button" style="height:50px; width:100px;"><h4>Delete</h4></button>');
        				$("#alignCenter").append('<div style="height:50px; width:50px; display:inline-block;"></div>')

        				$(".site-main").append('<br><br><br>');
        				
        				$("#createFile").click(function()
        				{
        					var fileType = prompt("Create Google Doc or Folder?", "Type 'DOC' or FOLDER'");
        					var newFile;
        					
        					if (fileType)
        					{
        						newFile = prompt("Enter a new name for your file.");
        						
        						var fileExists = 0;
        						for (var i = 0; i < files.length; i++)
        						{
        							if (files[i].title == newFile)
        							{
        								fileExists++;
        								break;
        							}	 
        						}
        						
        						while(1)
        						{
        							if (fileExists === 0 && fileType.toUpperCase() == 'DOC')
        							{
        								if(!newFile)
        								{
        									alert("Please type the name of the file.");
        									break;
        								}
        								
        								createGFile("0B99TACL_6_flb2EwbnhiLUVNdEE",newFile,'',
        										function()
        										{
        											window.location.reload();
        										});
        								break;
        							}
        							
        							else if (fileExists === 0 && fileType.toUpperCase() == 'FOLDER')
        							{
        								if(!newFile)
        								{
        									alert("Please type the name of the file.");
        									break;
        								}
        								
        								createProject("0B99TACL_6_flb2EwbnhiLUVNdEE",newFile,
        										function()
        										{
        											window.location.reload();
        										});	
        								break;
        							}
        							
        							else if (fileExists > 0)
        							{
        								alert("File already exists.");
        								break;
        							}
        							
        							else
        								break;
        						}
        					}
        					
    						else
    							alert("Unable to process input. Please enter file again.");
        				});
        				
        				var findFile, fileFound = 0;
        				
        				$("#grabFile").click(function()
        				{
        					findFile = prompt("Type file name");
        					for (var i = 0; i < files.length; i++)
        					{
        						if(files[i].title == findFile)
        						{
        							fileFound++;
        							var boolFileFound = confirm("File found! Click OK to download it.");
            						if (boolFileFound)
            						{
            							downloadFile(files[i].id, function(header, url) 
            							{
            								alert(url);
            							});
            						}
            						
            						break;
        						}	
        					}
        					
        					if (!fileFound)
        						alert("No such file exists.");
        				});
        				
        				$("#renameFile").click(function()
        				{
        					findFile = prompt("Type file name");
        					for (var i = 0; i < files.length; i++)
        					{
        						if(files[i].title === findFile)
        						{
        							fileFound++;
        							var newName = prompt("File was found. Type new name for your file.");
            						if(!newName)
            						{
            							alert("No name typed.");
            							break;
            						}
            						
            						renameFile(files[i].id, newName, function(message)
            						{
            							console.log(message);
            						});
            						
            						break;
        						}
        					}
        					
        					if (fileFound === 0)
        						alert("No such file exists.");
        				});
        				
        				$("#deleteFile").click(function()
        				{
        					for (var i = 0; i < files.length; i++)
        					{
        						if(files[i].title == findFile)
        						{
        							fileFound++;
        							var deletion = confirm("Are you sure? Click OK to delete");
        							
        							if(deletion)
        							{
        								deleteFile(files[i].id, function()
        								{
        									window.location.reload();
        								});
        							}
        							
        							break;
        						}
        					}
        					
        					if (found === 0)
        						alert("No file exists.");
        				});
        				
        				//End of function
        			},
        		
        			//Show the listing of all the files on your Drive
        			renderFiles: function()
        			{
        				var that = this;
        				//Get all the files from drive
        				retrieveAllFiles('', function(result)
        				{
        					convertResponseToFile(result, function(newFiles, oldFiles)
        					{
        						var fileModels = [];
        						
        						for (var i = 0; i < newFiles.length; i++)
        							files.push(newFiles[i]);
        						
        						//Sort the files
        						var sortFunction = function(x, y)
        						{
        							if(x.title < y.title)
        								return -1;
        							
        							else if(x.title > y.title)
        								return 1;
        							
        							else
        								return 0;
        						}
        						
        						files.sort(sortFunction);
        						
        						var model = new matthewApiTestModel();
        					});
        				});
        				
        				this.render();
        			},
        			
        			//Render the overall workspace view
        			render: function()
        			{
        				alert("Created view!");
        			},
        		
        			getFiles: function(callback) 
        			{
        				var retrievePageOfFiles = function(request, result) 
        				{
        					
        				    request.execute(function(resp) 
        				    {	    	
        				    	result = result.concat(resp.items);
        				    	var nextPageToken = resp.nextPageToken;
        				      
        				      	if (nextPageToken) 
        				      	{
        				        request = gapi.client.drive.files.list({
        				          'pageToken': nextPageToken
        				        });
        				        	retrievePageOfFiles(request, result);
        				      	}
        				      
        				      	else 
        				      	{
        				    	  callback(result);
        				      	}
        				    });
        				}
        				  var initialRequest = gapi.client.drive.files.list();
        				  retrievePageOfFiles(initialRequest, []);
        			},
        		});
        		
      return MatthewApiTestView;
});
