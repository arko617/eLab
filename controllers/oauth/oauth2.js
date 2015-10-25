/**
 * For user authetication. Redirect to google drive oauth page
 * See Oauth2 details: https://developers.google.com/accounts/docs/OAuth2 
 */
exports.oauth = function(req,res,oauth2Client){
	// Get the code for Access Token
	getAccessCode(oauth2Client);

	//Get the access token after getting the "code"
	function getAccessCode(oauth2Client) {
		var thisUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',	// obtain a refresh token
			scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive'
		});
 
		//Visit the page to accept the authentication
		console.log("Getting Code...,",thisUrl);		
		res.redirect(thisUrl);	
		//return oauth2Client;
	};
};

/**
 * Use the "code" to exchange for "Access Token"
 */
exports.getToken = function(req,res,oauth2Client,callback){
	//########## Add additional codes here later to check if the token has expired or not
	if (!req.session.gToken){
		//Parse the url for code
		var code = req.param("code");
		// request access token
		oauth2Client.getToken(code, function(err, tokens) {
			// set tokens to the client
			oauth2Client.setCredentials(tokens);
			req.session.gToken = tokens;

			//For testing
			console.log("New Access tokens:",req.session.gToken);

			//To activate the callback function
			callback(oauth2Client);
		});
	}else{
		oauth2Client.setCredentials(req.session.gToken);
		callback(oauth2Client);
	}

	return oauth2Client;
};
