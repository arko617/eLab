/*
 * View for the icons in control panel for project listing
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'collection/userCollection',
        'view/dialog/protocolDialogView',
        'view/controlPanel/controlPanelView',
        'text!view/template/aProjectControlPanel-template.html',
        'bootstrapLib'

        ], function($, _, Backbone,UserCollection,ProtocolDialogView,ControlPanelView,AProjectControlPanelTemplate){
	
	var	aProjectControlPanelView = ControlPanelView.extend({
		template: _.template(AProjectControlPanelTemplate),
		el: $(".controlPanel"),
		
		//Since view is initialized here, it will not run the parent initialization
		initialize:function(){
			//Rename
			this.projectId = this.options.projectId;
			
			//Render
			this.render();
		},
		
		//Extend the events from parent
		events:_.extend({
			"click .addGFile":"addGFile",
			
		},ControlPanelView.prototype.events),
		
		//Create Google Drive files, such as google doc
		addGFile: function(e){
			this.trigger("Control-createGDoc",e);
		},
				
		//Upload a file
		upload: function(e){
			this.trigger("Control-upload",e);
		},
		
		//Create a protocol from the template
		getProtocolInfo: function(){
			this.protocolDialogView = new ProtocolDialogView({collection:this.collection});
			this.protocolDialogView.on("haveNewProtocolName",this.copyAndMove,this);
		},
		
		copyAndMove: function(fileId, title){
			this.trigger("Control-copyAndMove",fileId, title);
		},

	});

	return aProjectControlPanelView;

});