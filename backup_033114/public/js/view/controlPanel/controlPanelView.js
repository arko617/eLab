/*
 * View for the icons in control panel
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'collection/userCollection',
        'view/dialog/createFileDialogView',
        'view/dialog/userDialogView',
        'view/dialog/protocolDialogView',
        //'text!view/template/controlPanel-template.html',
        'bootstrapLib'

        ], function($, _, Backbone,UserCollection,CreateFileDialogView,UserDialogView,ProtocolDialogView,controlPanelTemplate){
	var	ControlPanelView = Backbone.View.extend({
		//template: _.template(controlPanelTemplate),
		el: $(".controlPanel"),

		//Since view is initialized here, it will not run the parent initialization
		initialize:function(){
			this.render();
		},

		events: {
			//"click .createFolder":"show",
			"change #filePicker": "upload",
			"click #newProtocol":"getProtocolInfo",
			"click #projectCreater": "getNewProjectName",
			"click #storager": "checkStorage",
			"mouseout #storager" : "closeStorage",
			"click #searchButton":"search",
			//"click #sharer": "shareLabBook",
			"click #userLister" : "listUser",
			"keypress :input":"checkKey"
		},

		//For rendering a view
		render: function(){
			this.$el.html(this.template());
			return this; // enable chained calls
		},
		
		//Check storage
		checkStorage: function(){
			this.trigger("Control-checkStorage");
		},
		
		//Close the storage notification
		closeStorage: function(){
			//Not a good practice
			$("#storager").popover("destroy");
		},
		
		//Launch the google drive share dialog 
//		shareLabBook: function(){
//			driveShareDialog.showSettingsDialog();	//driveShareDialog is defined at the start-up of the page,currently in main.js
//		},

		//Search query
		search: function(){
			text = $(".searchTextInput").val();
			query = "title contains '{0}'".f(text);
			this.trigger("Control-updateCollection",query);
		},

		//Check if the user press "Enter"
		checkKey: function(e){
			if (e.keyCode=="13"){
				this.search();
				return false;
			}
		},	

	});

	return ControlPanelView;

});