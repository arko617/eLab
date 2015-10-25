
/**
 * Main controller; put things that don't require a model
 */

//General information
var title = "LabBook";
var description = "A user-friendly collaborative platform for sharing text documents, images, videos, and other media to help you succeed in your research.";
//Modules used
var googleDrive = require('google-drive');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var googleapis = require('googleapis');
//Application information
var app_info={
		"CLIENT_ID":'102710631798-lb77ojeikkaa0dsjcuvq08igkd8llrjh.apps.googleusercontent.com',	//for johnny5550822
//		var CLINET_ID = '900888398054.apps.googleusercontent.com';	//For labbook2013 account
		"CLIENT_SECRET":'M0aKD4ZLIU6q3UQ_l3H_06ON',
		"SCOPES":'https://www.googleapis.com/auth/plus.me',	//Different scope have different meaning, see https://developers.google.com/drive/scopes
		"REDIRECT_URL":'http://127.0.0.1:3000/workspace'
}

//Run OAuth function
function runOauth(req,res,pageName){
	
	var api_plus = require('./all_apis/plus');
	var OAuth2Client = googleapis.OAuth2Client;
	var oauth2Client = new OAuth2Client(app_info["CLIENT_ID"], app_info["CLIENT_SECRET"], app_info["REDIRECT_URL"]);

	var dropboxTesting = true;	// for testing dropb oauth

	if (dropboxTesting){
		res.render(pageName,{
			title: 'eLab',
			profile: {image:{url:'#'},displayName:'Johnny Ho',url:'#'},
			labList : '',
			session : '',
			labDetailsList : '',
			labAnnoucementsList : '',
			labDefault : ''
		});
	}else{		
		//Load the Google plus driver with oauth
		googleapis.discover('plus', 'v1').execute(function(err, client) {
			// Do oauth if the gToken is not present
			if ((!req.param("code")) && (!req.session.gToken)){
				oauth2 = require("./oauth/oauth2");	
	
				//Do the oauth
				oauth2.oauth(req,res,oauth2Client);
			}else{			
				//Run the index page
				oauth2.getToken(req,res,oauth2Client,function(oauth){
					req.session.oauth2Client = oauth;
					
					
					// Run the index page. Created a testing set for testing backbonejs in particular.
					//runIndex(client,req.session.oauth2Client);
					res.render(pageName,{
						title: 'eLab',
						profile: {image:{url:'#'},displayName:'Johnny Ho',url:'#'},
						labList : '',
						session : '',
						labDetailsList : '',
						labAnnoucementsList : '',
						labDefault : ''
					});
					
				});
	
			}
		});
	}


	// Execute what should be index doing,
	function runIndex(client,oauth2Client){
		api_plus.getUserProfile(client, oauth2Client, 'me', function(err, profile) {
			if (err) {
				console.log('An error occured', err);
				res.render('error'); // error page
			}else{			
				//store the user info
				req.session.userProfile = profile;
				
				//Testing Drive

				//extract access token

				//refresh the List contents
				req.session.labDetailsList = {};
				req.session.labAnnoucementsList = {};

				var ACC = oauth2Client.credentials.access_token;
			
	    		// Method to edit or update file content
	    		function editDriveFile(fileID, newContent){
					googleapis.discover('drive', 'v2').execute(function(err, client) {
					    client.drive.files.update({fileId:fileID})
					      .withMedia('text/plain', newContent)
					      .withAuthClient(oauth2Client)
					      .execute(function(err, result) {
					        console.log('error:', err, 'updated:', result.id)
					      });
						});
					}
				if(pageName == 'update'){
					editDriveFile(req.session.labDetailsIdList[req.body.Name+'_details'], JSON.stringify(req.body, null, 4));
					return res.render('index',{
						msg: "Update is success",
					 	title: title,
					 	profile: req.session.userProfile,
				 		labList : req.session.labList,
				 		session : req.session,
				 		labDetailsList : req.session.labDetailsList
				 	});
				}
				//download default lab and the rest of the lab names.
				googleDrive(ACC)
					.files().list({q:"title = 'default_lab_settings'",fields: "items"}, function (err, response, body) {
					  if (err) return console.log('err', err);

				  	var obj = eval ("(" + body + ")");

				  	var exportLinks = obj.items[0].exportLinks;
				  	var title = obj.items[0].title;
				  	var id = obj.items[0].id;

				  	console.log('title', title);
				    console.log('id', id);

				    var exportTxtLink = exportLinks['text/plain'];
				    //XML request for downloading lablist and default lab.
				   	var xhr = new XMLHttpRequest();
				   	xhr.open('GET', exportTxtLink);
  					xhr.setRequestHeader('Authorization', 'Bearer ' + ACC);
  					xhr.onload = function() {
 				     	 	var settingObj = eval ("(" + xhr.responseText + ")");

 				     	 	//set contained labs
					      req.session.labList =  settingObj['labList'];
					      //set default lab
					      req.session.defaultLab = settingObj['default'];

				      	console.log("I am starting to download details for you!!\n");
					      	
				      	//setting storage for Id's and for downloads
				      	req.session.labDetailsIdList = {};
				      	req.session.labAnnoucementsIdList = {};
				      	var loaded1 = 0;
				      	var loaded2 = 0;
								getByExtensionName("_annoucements", err, response, body);
								getByExtensionName("_details", err, response, body);

				      	function getByExtensionName(extension, err, response, body){
					      	//downloading each individual Labdetails
					      	var holder = req.session.labList.map(function(obj){
					      			
					      			var searchName = obj +extension;
					      			console.log("For %s: %s: %s\n",extension, obj, searchName);
      									googleDrive(ACC).files().list({q:"title = '" + searchName +"'",fields: "items"}, function (err, response, body){
											  if (err) return console.log('err', err);

												  //parse into body into JS object
												  var fileInfo = eval ("(" + body + ")");
												  //console.log(obj.items);
											  	var exportLinks = fileInfo.items[0].exportLinks;
											  	var title = fileInfo.items[0].title;
											  	var id = fileInfo.items[0].id;

											    console.log('title', title);
											    console.log('id', id);
											    if(extension == '_details')
											    	req.session.labDetailsIdList[title] = id;
											    if(extension == '_annoucements')
											    	req.session.labAnnoucementsIdList[title] = id

											    //export link
											   	var exportTxtLink = exportLinks['text/plain'];
											   	//download file in text/plain
											   	var xhr2 = new XMLHttpRequest();
											   	xhr2.open('GET', exportTxtLink);
						    					xhr2.setRequestHeader('Authorization', 'Bearer ' + ACC);
						    					xhr2.onload = function() {
											      //console.log('settings response:\n',xhr.responseText);
											      var detailsObj = eval ("(" + xhr2.responseText + ")");
											      console.log(detailsObj);
											      //add to array of details
											    
											    if(extension == '_details'){
											      req.session.labDetailsList[obj] = detailsObj;
											      loaded1++;
											    }
											    if(extension == '_annoucements'){
											    	console.log("name is ", detailsObj.Name, detailsObj)
											      req.session.labAnnoucementsList[obj] = detailsObj;
											      loaded2++;
													}

										      console.log("loaded 1  is:", loaded1);
										      console.log("loaded 2  is:", loaded1);
													if(loaded1+loaded2 == 2 * req.session.labList.length)
													{
														console.log("details list:", req.session.labDetailsList);
														console.log("annouce list:", req.session.labAnnoucementsList);
														console.log("default lab is:", req.session.defaultLab)
														res.render(pageName,{
															title: title,
															profile: req.session.userProfile,
															labList : req.session.labList,
															session : req.session,
															labDetailsList : req.session.labDetailsList,
															labAnnoucementsList : req.session.labAnnoucementsList,
															labDefault : req.session.defaultLab
														});
													}
									      	
										    };
										    xhr2.onerror = function() {
										      callback(null);
									    };
									    xhr2.send();
										});

					     }
				    )};
								

							}
					    xhr.onerror = function() {
					      callback(null);
					    };
					    xhr.send();
				  		console.log("if this work go on:",req.session.labDetailsList);
						});
				


				googleDrive(ACC).files().list({q:"title = 'Kimberley_Lab_details'",fields: "items"}, function (err, response, body){
				  if (err) return console.log('err', err);

					  //parse into body into JS object
					  var obj = eval ("(" + body + ")");

					  	var exportLinks = obj.items[0].exportLinks;
					  	var title = obj.items[0].title;
					  	var id = obj.items[0].id;

					    //export link
					   	var exportTxtLink = exportLinks['text/plain'];
					   	//download file in text/plain
					   	var xhr2 = new XMLHttpRequest();
					   	xhr2.open('GET', exportTxtLink);
    					xhr2.setRequestHeader('Authorization', 'Bearer ' + ACC);
    					xhr2.onload = function() {
					      //console.log('settings response:\n',xhr.responseText);
					      var detailsObj = eval ("(" + xhr2.responseText + ")");
					      //console.log(detailsObj);
					      //console.log(req.session.labList =  settingObj['labList']);
					      
					    };
					    xhr2.onerror = function() {
					      callback(null);
					    };
					    xhr2.send();
				  		
					});


				//Rendering user info
				//console.log("!!!!!!!!!!!!",req.session.labList);
				
			}
		});
	}


	 
}

//Render a page
exports.page = function(pageName){
	return function(req,res){
		runOauth(req,res,pageName);
	};
};

//The contact page
exports.contact = function(req,res){
	res.render("contact");
};

//The workspace view: show projects and files
//exports.workspace = function(pageName){
//	res.render("workspace");	
//};