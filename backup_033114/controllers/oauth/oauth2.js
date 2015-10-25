/**
 * For user authetication. Redirect to google drive oauth page
 * See Oauth2 details: https://developers.google.com/accounts/docs/OAuth2 
 */
exports.oauth = function(req,res){
	var CLIENT_ID = '102710631798-lb77ojeikkaa0dsjcuvq08igkd8llrjh.apps.googleusercontent.com';
	var CLIENT_SECRET = 'M0aKD4ZLIU6q3UQ_l3H_06ON';
	var REDIRECT_URL = 'http://localhost:3000/driveApi';
	var googleapis = require('googleapis');
	var oauth2Client =
		new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	
	//Get the access token after getting the "code"
	function getAccessCode(oauth2Client, callback) {
		var url = oauth2Client.generateAuthUrl({
			access_type: 'offline',	// obtain a refresh token
			scope: 'https://www.googleapis.com/auth/drive'
		});

		//Visit the page to accept the authentication
		console.log("Getting Code...,",url);
		res.redirect(url);		
	};

	// Get the code for Access Token
	getAccessCode(oauth2Client);
};