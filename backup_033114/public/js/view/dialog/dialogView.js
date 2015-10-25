/*
 * General Dialog View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'text!view/template/dialog-template.html',
        'bootstrapLib'


        ], function($, _, Backbone,dialogTemplate){
	
	var DialogView = Backbone.View.extend({
		template: _.template(dialogTemplate),
		el: $("body"),

		initialize:function(){
			this.render();

		},

		events:{
			"click .modal-backdrop":"close",
			"click .modal-header .close":"close",
			"click .modal-footer .closeDialog": "close"
		},

		render:function(){
			this.$el.append(this.template());
//			this.$el.append('<div id="mask"></div>');
//			$("#dialog").fadeIn(300);
//			$('#mask').fadeIn(300);
			$("#myModal").modal("show");
			return this; // enable chained calls
		},

		close:function(){
			var myModal = $("#myModal");
			myModal.modal("hide");
			myModal.on("hidden",function(){
				myModal.remove();
			})
			this.undelegateEvents();	//Need to unbind the event!!!
		
//			var that = this;
//			$('#mask , .dialog-popup').fadeOut(300 , function() {
//				//Remove dialog DOM object
////				$('#mask').remove();  
////				$('#dialog').remove();
//
//				//Remove all the events
//				that.undelegateEvents();		
//
//				//Remove the view
//				this.remove();
//			}); 
		},	
	});

	return DialogView;

});