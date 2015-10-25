/**
 * Convert a drive response to a particular form, i.e. to a project collection
 */

/**
 * Convert response to project
 */
function convertResponseToProject(response,callback){
	var projects = [];	//Reformat the file array
	if (typeof response[0] !='undefined'){
		for (var i=0;i<response.length;i++){
			var thisProject = response[i];

			//Attributes
			var project = {
					id : thisProject.id
					, title : thisProject.title
					, size : thisProject.quotaBytesUsed
					, permission : thisProject.userPermission
					, modifiedDate : thisProject.modifiedDate
					, createdDate:thisProject.createdDate
					, link : thisProject.alternateLink
					, mimeType: thisProject.mimeType
					, hasAllDetails: ''
					, children: new Backbone.Collection()
					, details : {title: thisProject.title,
						description:'',
						objective:'',
						contributors:'',
						fundingSources:'',
						tags:[],
						stickyNotes: [],
						Goals: [],
					}
			};
			//Push to file array
			projects.push(project);		
		}
	}
	return callback(projects);
}

/**
 * Convert response to file
 */
function convertResponseToFile(response,callback){
	var files = [];
	var defaultFiles = []; //default files/folders being used by elab if there are any
	if (typeof response[0]!='undefined'){
		for (var i=0;i<response.length;i++){
			var thisFile = response[i];

			//Check if it has certain preview links
			var linkToFile = thisFile.alternateLink;
			var embedLink = thisFile.embedLink;
			var link_preview;			
			//this is the link directly to the google doc editable link. However, because of security issue, there is no concrete to render perfectly the doc in iframe. Therefore, decide to use static content (embedlink_
			//console.log(embedLink)
			if (embedLink){
				link_preview = embedLink;
			}else{
				link_preview= linkToFile;
			}

			//Check if it is a folder
			var isFolder = false;
			if (thisFile.mimeType=="application/vnd.google-apps.folder"){
				isFolder = true;
			}

			//Attributes
			var file = {
					id : thisFile.id
					, title : thisFile.title
					, size : thisFile.quotaBytesUsed
					, permission : thisFile.userPermission
					, createdDate:thisFile.createdDate
					, modifiedDate : thisFile.modifiedDate
					, link : link_preview
					, thumbnailLink : thisFile.thumbnailLink
					, mimeType: thisFile.mimeType
					, iconLink: thisFile.iconLink
					, createdBy:thisFile.ownerNames
					, isFolder:isFolder
					, children: new Backbone.Collection()//Only has children
			, parent:thisFile.parents,	//which project/folder it belong to

			};
			if (doesNotContainString(thisFile.title,'#elab.')){
				//Push to file array
				files.push(file);
			}else{
				defaultFiles.push(file);
			}
		}
	}
	
	//return statement
	return callback(files,defaultFiles);
}

/**
 * Convert response to projectsOverview <-- for the projects folder in drive
 * return a model, not collection
 */
function convertResponseToProjectsOverviewModel(response,callback){
	var file;
	var thisFile = response;

	//Attributes
	file = {
			id : thisFile.id
			, title : thisFile.title
			, size : thisFile.quotaBytesUsed
			, permission : thisFile.userPermission
			, createdDate:thisFile.createdDate
			, modifiedDate : thisFile.modifiedDate
			, mimeType: thisFile.mimeType
			, ownerNames: thisFile.ownerNames
			, numProjects: '' //obtained later
				, numOwners: thisFile.ownerNames.length 
	};
	return callback(file);
}

/**
 * Convert response to a project details
 */
function convertResponseToAProjectDetailsObject(response,callback){
	var details = {
			description:''
			, objective:''
			, contributors:new Array()
			, funding:''
			, tags:new Array()
			, stickyNotes: new Array()
	};
	
	//console.log("%%%",response);
	
	//parse it
	html = $.parseHTML(response);
	//console.log("!!!",html);
	
	//Get the context
	$.each(html,function(i,el){
		switch (el.nodeName){
		case 'DESCRIPTION':{
				details.description= el.innerText;
				break;
		}
		case 'OBJECTIVE':{
				details.objective= el.innerText;
				break;
		}
		case 'CONTRIBUTORS':{
				var text = el.innerText;				
				details.contributors= text.split(",");				
		}
		case 'FUNDING':{
				var text = el.innerText;
				details.funding= text.split(",");
				break;
		}
		case 'TAGS':{
				var text= el.innerText;
				details.tags = text.split(",");
				break;
		}			
		case 'STICKYNOTES':{
				var text = el.innerText;
				console.log(text)
				//text='[{"date": "05/20/14","note":"Design Notes interface"},{"date":"05/18/14","note":"Design the tags interface. Finish both backend and frontend implementation"}]';
				details.stickyNotes = JSON.parse(text);
				break;
		}
		default:
		}
	});
	console.log(">>>",details);
	
	return callback(details);
}

/**
 * To format date to a readable format by user
 */
function formatDate(unformattedDate){
	var date = new Date(unformattedDate);
	var formattedDate = date.toLocaleDateString()+"\t"+ date.toLocaleTimeString();
	return formattedDate;
}

///**
//* Loop the file and get certain information
//*/
//function loopFiles(result,callback){
////console.log(result);
////alert("Looping result list");
//var fileArray = [];	//Reformat the file array
//if (typeof result[0] !='undefined'){
//for (var i=0;i<result.length;i++){
//var file = makeFileObject(result[i]);

////Push to file array
//fileArray.push(file);						
//}
//}
////Callback
//return callback(fileArray);
//}	

///**
//* Make a file object from the original file object which have desire attributes
//*/
//function makeFileObject(oldFile){
//var title = oldFile.title
//, createdDate = formatDate(oldFile.createdDate)
//, modifiedDate = formatDate(oldFile.modifiedDate)
//, unformattedModifiedDate = new Date(oldFile.modifiedDate)
//, link = oldFile.alternateLink
//, id = oldFile.id
//, mimeType = oldFile.mimeType
//, permission = oldFile.userPermission
//, header = oldFile.header
//, content = oldFile.content;
//var file = {title:title,id:id,createdDate:createdDate,modifiedDate:modifiedDate,unformattedModifiedDate:unformattedModifiedDate,link:link,mimeType:mimeType,permission:permission, header:header, content:content};

//return file;
//}