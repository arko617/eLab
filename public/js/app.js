/*
 * The backbonejs application main module; should be light weight
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',   
        'router',

        ], function($, _, Backbone,Router){
	var initialize= function(){
		Router.initialize();
	};


	return {
		initialize:initialize
	};

});