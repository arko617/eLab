/*
 * 	Collection of users affiliated to LabBook
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/user/userModel'
        
        ], function($, _, Backbone,User){
	var UserCollection = Backbone.Collection.extend({
		model:User,
	});

	return UserCollection;

});