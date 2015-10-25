/**
 * Bootstrap file for starting the app. Using requireJs to organize the code
 * -There is no lib for making .jade to .html (The online "require-jade" have problem). Therefore, all the .jade template is converted to .html--> Use text.js, a plugin with requirejs, to interpret the html code
 */
require.config({
	baseUrl: "/js",

	//Create alias
	paths:{
		jquery: "lib/jquery-min",
		underscore: "lib/underscore-min",
		backbone: "lib/backbone-min",
		bootstrapLib: "lib/bootstrap-min",
		datatable: "lib/DataTables/media/js/jquery.dataTables",
		jeditable: "lib/jeditable-min",
		text: "lib/requirejs/plugin/text"
	},

	//MUST have, define the parameters alias
	shim: {
		'bootstrapLib': {
			deps:["jquery"]
		},
		
		'backbone': {
			deps: ['jquery','underscore'],
			exports: 'Backbone'
		},

		'underscore': {
			exports: '_'
		},	

		'jquery':{
			exports: '$'
		},
		
		'jeditable':{
			deps:["jquery"]
		},
	}

});

//require something to start
require([
         //load the main module and pass it to definition function
         "app",

         ],function(App){
	// The "main" dependency is passed in as "Main" and the initialization function is called
	App.initialize();

});