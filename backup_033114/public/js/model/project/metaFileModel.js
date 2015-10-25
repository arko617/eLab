/*
 *  Model for a overview object(meta)
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'view/notification/notificationView'


        ], function($, _, Backbone,LoadingNotificationView){

	var MetaFile = Backbone.Model.extend({
		urlRoot: "/project",

		initialize: function(){
		},

		defaults: {
			title: '',
			createdDate: '',
			modifiedDate: '',
			unformattedModifiedDate: '',
			link:'',
			id:'',
			mimeType:'',
			permission:'',
			content:'',
			header:'',
		},
		
		//Edit the modelContent
		editContent:function(){
			
		},

	});


	return MetaFile;

});