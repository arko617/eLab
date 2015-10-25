/*
 * Groupinfospace View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/groupnodeAPIModel',
        'collection/groupnodeAPICollection',
        'text!view_template/groupinfo/groupnodeAPITemplate.html',
        'bootstrapLib',

        ], function($, _, Backbone,GroupnodeAPIModel,GroupnodeAPICollection,GroupnodeAPITemplate){

	var GroupnodeAPIView = Backbone.View.extend({
		el: ".site-main",
		groupnodeAPITemplate: _.template(GroupnodeAPITemplate),

		initialize: function(){	
			this.render();
		},

		//Render the overall groupnodeAPI view
		render: function(){
			
			// 1.Imagine getting info from db --> manually create json
			var groupnodeAPIs = [];
			var model0 = new GroupnodeAPIModel({id:'<h5><b>No.</b></h5>',title:'<h5><b>Site</b></h5>',modifiedDate:'<h5><b>Date Accessed</b></h5>',link:'<h5><b>Description</b></h5>'});
			var model1 = new GroupnodeAPIModel({id:'1.',title:'<a href="https://developers.google.com/drive/web/quickstart/quickstart-nodejs">Google Drive</a>',modifiedDate:'Jan 21, 2015',link:'Storage Management'});
			var model2 = new GroupnodeAPIModel({id:'2.',title:'<a href="http://www.raweng.com/blog/2014/08/19/file-uploading-in-dropbox-using-node-js/">Dropbox</a>',modifiedDate:'Jan 21, 2015',link:'Storage Management'});
			var model3 = new GroupnodeAPIModel({id:'3.',title:'<a href="https://github.com/Skycatch/node-box">Box</a>',modifiedDate:'Feb 2, 2015',link:'Storage Management'});
			var model4 = new GroupnodeAPIModel({id:'4.',title:'<a href="https://msdn.microsoft.com/en-us/library/hh243643.aspx">OneDrive</a>',modifiedDate:'Jan 21, 2015',link:'Storage Management'});
			var model5 = new GroupnodeAPIModel({id:'5.',title:'<a href="https://www.sugarsync.com/dev/get-auth-token-example.html">SugarSync</a>',modifiedDate:'Feb 2, 2015',link:'Storage Management'});
			var model6 = new GroupnodeAPIModel({id:'6.',title:'<a href="https://developers.kloudless.com/">Kloudless</a>',modifiedDate:'Jan 30, 2015',link:'Multiple Storage Management'});
			var model7 = new GroupnodeAPIModel({id:'7.',title:'<a href="https://gist.github.com/nickytoh/fc0eb01271a45448db16">iCloud</a>',modifiedDate:'Jan 21, 2015',link:'Cloud Storage'});
			var model8 = new GroupnodeAPIModel({id:'8.',title:'<a href="https://github.com/tdebarochez/node-cloudapp">Cloud App</a>',modifiedDate:'Jan 30, 2015',link:'Storage App'});
			var model9 = new GroupnodeAPIModel({id:'9.',title:'<a href="http://aws.amazon.com/sdk-for-node-js/">Amazon</a>',modifiedDate:'Jan 30, 2015',link:'Shopping & Storage'});
			var model10 = new GroupnodeAPIModel({id:'10.',title:'<a href="http://udidu.blogspot.com/2012/11/facebook-api-with-nodejs.html">Facebook</a>',modifiedDate:'Jan 30, 2015',link:'Networking'});
			var model11 = new GroupnodeAPIModel({id:'11.',title:'<a href="https://www.npmjs.com/package/node-twitter-api">Twitter</a>',modifiedDate:'Jan 30, 2015',link:'Networking'});
			var model12 = new GroupnodeAPIModel({id:'12.',title:'<a href="https://www.npmjs.com/package/instagram-node">Instagram</a>',modifiedDate:'Jan 21, 2015',link:'Photo Storage'});
			var model13 = new GroupnodeAPIModel({id:'13.',title:'<a href="https://www.npmjs.com/package/4shared">4shared</a>',modifiedDate:'Jan 21, 2015',link:'Storage'});
			var model14 = new GroupnodeAPIModel({id:'14.',title:'<a href="https://www.npmjs.com/package/github">GitHub</a>',modifiedDate:'Jan 21, 2015',link:'Git Storage'});
			var model15 = new GroupnodeAPIModel({id:'15.',title:'<a href="https://www.npmjs.com/package/nodecloudpt">CloudPT</a>',modifiedDate:'Jan 30, 2015',link:'Cloud Storage'});
			var model16 = new GroupnodeAPIModel({id:'16.',title:'<a href="https://www.npmjs.com/package/azure-storage">Microsoft Azure Storage</a>',modifiedDate:'Feb 2, 2015',link:'Storage Management'});
			var model17 = new GroupnodeAPIModel({id:'17.',title:'<a href="https://github.com/fvdm/nodejs-youtube">YouTube</a>',modifiedDate:'Jan 30, 2015',link:'Video Storage'});
			var model18 = new GroupnodeAPIModel({id:'18.',title:'<a href="https://www.npmjs.com/package/brightbox">BrightBox</a>',modifiedDate:'Jan 21, 2015',link:'Storage'});
			var model19 = new GroupnodeAPIModel({id:'19.',title:'<a href="https://www.npmjs.com/package/node-flickr">Flickr</a>',modifiedDate:'Jan 30, 2015',link:'Photo Storage'});
			var model20 = new GroupnodeAPIModel({id:'20.',title:'<a href="https://www.npmjs.com/package/asana-api">Asana</a>',modifiedDate:'Feb 2, 2015',link:'Information Management'});
			var model21 = new GroupnodeAPIModel({id:'21.',title:'<a href="https://www.npmjs.com/package/airvantage-api-nodejs">AirVantage</a>',modifiedDate:'Feb 2, 2015',link:'Cloud Management'});
			var model22 = new GroupnodeAPIModel({id:'22.',title:'<a href="https://www.npmjs.com/package/spotify">Spotify</a>',modifiedDate:'Feb 2, 2015',link:'Music Storage'});
			var that = this;
			
			// Push the model in to collections
			groupnodeAPIs.push(model0);
			groupnodeAPIs.push(model1);
			groupnodeAPIs.push(model2);			
			groupnodeAPIs.push(model3);
			groupnodeAPIs.push(model4);
			groupnodeAPIs.push(model5);
			groupnodeAPIs.push(model6);
			groupnodeAPIs.push(model7);
			groupnodeAPIs.push(model8);
			groupnodeAPIs.push(model9);
			groupnodeAPIs.push(model10);
			groupnodeAPIs.push(model11);
			groupnodeAPIs.push(model12);
			groupnodeAPIs.push(model13);
			groupnodeAPIs.push(model14);
			groupnodeAPIs.push(model15);
			groupnodeAPIs.push(model16);
			groupnodeAPIs.push(model17);
			groupnodeAPIs.push(model18);
			groupnodeAPIs.push(model19);
			groupnodeAPIs.push(model20);
			groupnodeAPIs.push(model21);
			groupnodeAPIs.push(model22);
			
			//Create a groupinfo Collection
			this.groupnodeAPICollection = new GroupnodeAPICollection(groupnodeAPIs);
			
			//Show the content
			$(".site-main").append('<table class="table table-striped info" id="content_table"></table>');	
			
			this.groupnodeAPICollection.each(function(model){
				// Create table format
				$("#content_table").append(that.groupnodeAPITemplate(model.toJSON()));				
			},this);	//this is the callback	

		},
		
	});
	
	return GroupnodeAPIView;
});