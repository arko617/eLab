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
		text: "lib/requirejs/plugin/text",
		jqueryCookie: "lib/jquery-cookie-1.4.1/jquery.cookie", //for dynatree
		jqueryUI: "lib/jquery-ui-1.10.4/jquery-ui-1.10.4.custom",	//entension of jquery to create better UI, mainly used to solve a bug in dynatree
		dynatree: "lib/jquery.dynatree-1.2.5-all/src/jquery.dynatree", //file tree plugin
	    //nanoScroller: "lib/nanoScroller/nanoScroller-min", //for better scrollbar
	    customScrollbar: "lib/custom-scrollbar/mCustomScrollbar.min", //for custom scrollbar
	    customScrollbarMousewheel: "lib/custom-scrollbar/mCustomScrollbarMousewheel.min",	//for scrollbar additional mousewheel handle
	    xeditable : "lib/bootstrap-editable/js/bootstrap-editable.min", // for x-Editable
	    sideBar: "lib/sidebar/jquery.sidebar", //for side bar plugin
	    spin: "lib/spin/spin",
	    jquerySpinner: "lib/spin/jquery.spin",	//spin loading icon when something is loading
	    wTwoUi : "lib/w2ui-1.3.2/w2ui-1.3.2",	//powerful plugin for tab, grid, toolbar, etc
	    tagManager : "lib/tagManager/tagmanager",	//for nicely looking tag
	    //------------ for the dashboard theme
	    metisMenu: "/stylesheets/bower_components/metisMenu/dist/metisMenu.min", //Metis Menu Plugin JavaScript
	    sbAdmin: "/stylesheets/bower_components/startbootstrap-sb-admin-2/dist/js/sb-admin-2", // the dashboard theme custom JS
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
		
		'jqueryUI':{
			deps:["jquery"]
		},
		
		'jqueryCookie':{
			deps:["jquery"]
		},
		
		'dynatree':{
			//deps:["jquery","jqueryUI"]
			deps:["jquery","jqueryCookie","jqueryUI"]
		},
		
//		'nanoScroller':{
//			deps:["jquery"]
//		},
		
		'customScrollbar':{
			deps:["jquery"]
		},
		
		'customScrollbarMousewheel':{
			deps:["jquery"]
		},
		
		'xeditable':{
			deps:["jquery"]
		},	
		
		'sideBar':{
			deps:["jquery"]
		},	
		
		'jquerySpinner':{
			deps:["jquery","spin"]	//require spin.js
		},	
		
		'wTwoUi':{
			deps:["jquery"]
		},	
		
		'tagManager':{
			deps:["jquery"]
		},	
		'metisMenu':{
			deps:["jquery"]
		},
		'sbAdmin':{
			deps:["jquery","metisMenu"]
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