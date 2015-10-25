/*
 * Developerinfo View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'bootstrapLib',

        ], function($, _, Backbone){

	var mtpView = Backbone.View.extend({
		el: ".site-main",
	
		initialize: function(){	
			this.render();
			this.getFiles(function(content){
				alert(JSON.stringify(content));
				a=1
				a+1

			});
		},

		//Render the overall workspace view
		render: function(){
			alert("Created view!");
		},
		
		getFiles: function(callback) {
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
	
	return mtpView;
});