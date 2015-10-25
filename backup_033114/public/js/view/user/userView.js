/*
 * View for single file
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'text!view/template/user-template.html',        

        ], function($, _, Backbone,userTemplate){

	var UserView = Backbone.View.extend({
		tagName: 'tr',
		userTemplate:_.template(userTemplate),

		// Initialization action
		initialize: function(){
			this.model.on("change",this.render,this);	//re render the view when the model content is changed
		},

		events: {
			"click #deleteUser" : "deleteUser",
		},

		//For rendering a view
		render: function(){
			this.$el.html(this.userTemplate(this.model.toJSON()));
			
			//Check if the view is for owner or not. Cannot delete owner
			if (this.model.get("role")!="owner"){
				this.$el.append("<td><button class='btn btn-danger' id='deleteUser'>Delete</button></td>");
				//this.$el.append("<td><input type='button' class='deleteUser' value='Delete'></td>");
			}else{
				this.$el.append("<td></td>")
			}
			return this; // enable chained calls
		},
		
		//Delete the user from drive
		deleteUser:function(){
			this.model.destroying(this.options.projectId);
		}
	});


	return UserView;

});