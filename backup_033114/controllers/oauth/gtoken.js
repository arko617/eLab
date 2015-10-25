/**
 * Use the "code" to exchange for "Access Token"
 */
exports.getToken = function(req,res,callback){
	//Lab-Book app Set-up
	var CLIENT_ID = '102710631798-lb77ojeikkaa0dsjcuvq08igkd8llrjh.apps.googleusercontent.com';
	var CLIENT_SECRET = 'M0aKD4ZLIU6q3UQ_l3H_06ON';
	var REDIRECT_URL = 'http://localhost:3000/driveApi';
	var googleapis = require('googleapis');
	var OAuth2Client = googleapis.OAuth2Client;

	//Create an outh2Client
	var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	var code = req.param("code");

	// request access token
	if (!req.session.gToken){
		oauth2Client.getToken(code, function(err, tokens) {
			// set tokens to the client
			oauth2Client.credentials = tokens;
			req.session.gToken = tokens;
			console.log("New Access tokens:",req.session.gToken);

			//To activate the callback function
			callback(oauth2Client);
		});
	}else{
		oauth2Client.credentials = req.session.gToken;
		
		//To activate the callback function
		callback(oauth2Client);
	}

	return oauth2Client;
};