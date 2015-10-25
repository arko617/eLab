
/**
 * LabBook web app is designed to improve researchers to share files within the research group.
 */

/*
 * Model dependencies 
 */
var express = require('express')
, mainController = require('./controllers')	//it will automatically look for index.js and load everything from index.js
, drive = require("./controllers/driveApi")
, oauth2 = require("./controllers/oauth/oauth2")
, gtoken = require("./controllers/oauth/gtoken")
, project = require("./controllers/project")
, http = require('http')
, path = require('path');

var app = express();

//Configure the environments
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.engine('html', require('jade').renderFile);
	
	//use middlewares;seqence is matter
	app.use(express.favicon());	//site icon
	app.use(express.logger('dev'));	//use development mode log
	app.use(express.bodyParser());	//for parsing the body, such as JSON, urlencoded, and multipart requests
	app.use(express.methodOverride());	//for app.delete and app.put, not just post
	
	//session storage; placed before router
	app.use(express.cookieParser());
	app.use(express.session({secret: 'HABCD12365!'}));
	
	//Router setting
	app.use(app.router);  // A router code that run my code
	app.use(express.static(path.join(__dirname, 'public')));	//include the static files, which are in public
});

//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//Create the http server
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


//Pages Navigation
app.get('/', mainController.index);
app.get("/testpushnotification",mainController.testpushnotification);
app.get("/contact",mainController.contact);
app.get("/driveApi",drive.driveapi);
app.get("/oauth",oauth2.oauth);
app.get("/project",project.showProjectList);	
app.get(/project(\/\w+)*$/,project.showAProject);	// This is a regular expression which accept /project/*, anything that follow/project

app.delete("/project/*",project.response);	// For collabration with backbonejs, fire a response when delete request is made (supposed to database, but now it's to google drive)

//Create a socket.io and setting this as a universal object; may have a better way
var io = require("socket.io").listen(server);
var userList={};	//Keep the list of user and the latest usage time for logging
var socketList={};	//To maintain a reference of all the sockets
var socketNo=0;

//socket.io function
io.sockets.on("connection",function(socket){
	socketList[socket.id] = socket;
	console.log("Server Socket.io detect connection with client side socket.io");
	//Receive user name
	socket.on("userName",function(data){
		userList[data]=new Date();
		socket.userName = data;
		console.log(userList);
	});
	
	// Instead of updateCollection whenever there is a change to the files in Drive, emitting a 'UpdateCollectionNow' trigger from time to time save server's load, and reduce complexity in dealing with user view. THrough doing this, the gial can still be achieved.
	var intervalID = setInterval(function(){
		console.log("Server calling update collection with socket id",socket.id);
		socket.emit("UpdateCollectionNow");
	},10000);
	
	//When connection is close()
	socket.on("disconnect",function(){
		console.log("A user disconnected");
		if (userList[socket.userName]){
			delete userList[socket.userName];
		};
		console.log("Current user List", userList);
		
		//remove the setInterval function
		clearInterval(intervalID);		
	});
	
	
});
