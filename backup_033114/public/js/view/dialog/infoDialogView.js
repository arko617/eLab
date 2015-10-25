/*
 * For Info dialog; inherit from dialogView
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'view/dialog/dialogView'

        ], function($, _, Backbone,DialogView){
	
	var InfoDialogView = DialogView.extend({
		initialize:function(content){
			this.render();
			$("#myModalLabel").append(content["header"]);
			$("#dialog-content").append(content["content"]);
		}

	});


	return InfoDialogView;

});