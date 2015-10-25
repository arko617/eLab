/*
 * Group Picture View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'bootstrapLib',

        ], function($, _, Backbone){

	var GrouppictureView = Backbone.View.extend({
		el: ".site-main",
		
		initialize: function(){	
			this.render();
		},

		//Render the group picture view
		render: function(){
			
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>D. Models & Collections (partial; for phase 3)</b></ins></h4>');
			$(".site-main").append('<br>');
			$(".site-main").append('<p align="center"><a href="https://docs.library.ucla.edu/download/attachments/134187558/Models%20%26%20Collections%20%281%29.jpg?version=2&modificationDate=1421221450000&api=v2"><img src="https://docs.library.ucla.edu/download/attachments/134187558/Models%20%26%20Collections%20%281%29.jpg?version=2&modificationDate=1421221450000&api=v2" style="width:490px;height:280px"></a></p>');
		
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>E. Views (partial; for phase 3)</b></ins></h4>');
			$(".site-main").append('<br>');
			$(".site-main").append('<p align="center"><a href="https://docs.library.ucla.edu/download/attachments/134187558/Views%20architecture.jpg?version=1&modificationDate=1421221594000&api=v2"><img src="https://docs.library.ucla.edu/download/attachments/134187558/Views%20architecture.jpg?version=1&modificationDate=1421221594000&api=v2" style="width:475px;height:280px"></a></p>');
		
			$(".site-main").append('<h4><ins><b>E.1 WorkspaceView</b></ins></h4>');
			$(".site-main").append('<br>');
			$(".site-main").append('<p align="center"><a href="https://docs.library.ucla.edu/download/attachments/134187558/Views%20architecture%20%282%29.jpg?version=1&modificationDate=1421221760000&api=v2"><img src="https://docs.library.ucla.edu/download/attachments/134187558/Views%20architecture%20%282%29.jpg?version=1&modificationDate=1421221760000&api=v2" style="width:475px;height:270px"></a></p>');
		},
		
	});
	
	return GrouppictureView;
});