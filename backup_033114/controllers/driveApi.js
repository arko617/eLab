/**
 * Controller for the drive page. Get the access token and list all the files from the google drive
 */
//****Read the files in google drive
function loopFiles(result,callback){
	var fileArray = [];	//Reformat the file array
	var files = result["items"];
	for (var i=0;i<files.length;i++){
		var title = files[i].title
		, createdDate = files[i].createdDate
		, link = files[i].alternateLink
		, id = files[i].id;
		var file = {title:title,id:id,createdDate:createdDate,link:link};

		//Push to file array
		console.log(title);
		fileArray.push(file);						
	}

	//callback
	callback(fileArray);
}

//Get the oauth setting (Access code, etc)
function readFiles(req,res){
	var googleapis = require('googleapis');
	var gtoken = require("./oauth/gtoken");
	gtoken.getToken(req,res,function(result){
		auth = result;

		// load google plus v1 API resources and methods
		googleapis
		.discover('drive', 'v2')
		.execute(function(err, client) {
			//Setting up the request body
			req = client.drive.files.list().withAuthClient(auth);

			// Execute the request
			req.execute(function(err, result) {
				if (err){
					console.log(err);
				}else{
					//console.log(result);
					loopFiles(result,function(fileArray){						
						//render view
						console.log("Rendering view...");
						res.render("driveApi",{fileArray:fileArray});
					});
				};
			});
		});
	});
}

//Main function
exports.driveapi = function(req, res){
	// Setting up the socket io. and Google Api
	var io =req.app.settings.socketio;
	io.sockets.on("connection",function(socket){
		console.log("User opens driveapi!");
		
		socket.on("disconnect",function(){
			console.log("User leave driveapi!");
		});
	});

	//Read the files to google drive
	readFiles(req,res);

};

