/*
 * Developerinfo View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/developerinfoModel',
        'collection/developerinfoCollection',
        'text!view_template/developerinfo/developerinfoTemplate.html',
        'text!view_template/developerinfo/developerinfoPopupTemplate.html',
        'text!view_template/developerinfo/individualDeveloperTemplate.html',
        'bootstrapLib',

        ], function($, _, Backbone,DeveloperinfoModel,DeveloperinfoCollection,DeveloperinfoTemplate, 
        		DeveloperinfoPopupTemplate,IndividualDeveloperTemplate){

	var DeveloperinfoView = Backbone.View.extend({
		el: ".site-main",
		developerinfoTemplate: _.template(DeveloperinfoTemplate),
		developerinfoPopupTemplate: _.template(DeveloperinfoPopupTemplate),
		individualDeveloperTemplate: _.template(IndividualDeveloperTemplate),
		
		initialize: function(){	
			this.render();
		},

		//Render the overall workspace view
		render: function()
		{	
			// 1.Imagine getting info from db --> manually create json
			var developerinfo = [];		
			var developer1 = new DeveloperinfoModel({image: '<img src="/images/Johnny elab.jpg" style="width:100%; height:300px">',
				id:'1' ,  idName: 'Johnny', fullName: 'Johnny Ho', year:'PhD Student', 
				biography:'Johnny is a PhD Bioengineering student. Programming is a hobby for him, and his field of interests include Machine Learning, Mathematics, and Computer Science in medical problems. His career goals are to seek a job in medical informatics, operation research and programming. He is an expert in Javascript, Java, Python, NodeJS, JSP, CSS, C++, AMPL, UNIX, and MATLAB with knowledge of ExpressJS, BackboneJS, Grails, and Spring framework. He has interned with Amazon and CellASIC in the past in addition to being a research assistant at UC Berkeley and UCLA. He is currently working on a project that models and simulates thyroid hormone regulation in babies.',
				imageSource: 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/1/000/0d1/3b1/0c43c79.jpg', 
				linkedin: '<a href="https://www.linkedin.com/pub/king-chung-ho/17/292/6aa" target="_blank"> https://www.linkedin.com/pub/king-chung-ho/17/292/6aa </a>'});
			var developer2 = new DeveloperinfoModel({image: '<img src="https://pbs.twimg.com/profile_images/378800000173281105/d46f4524c93ebd3a7be3751f9ce133b0.jpeg" style="width:100%; height:300px">',
				id:'2', idName: 'Arko', fullName: 'Arko Dewri', year:'2nd Year Undergraduate', 
				biography:'Arko is a 2nd year undergraduate Computer Science and Engineering major. He is interested in computer security. He is part of Naya Zamana Acapella. He is looking for an internship position in the field of computer science and/or electrical engineering starting June 2015. He has knowledge in C++, C, HTML, CSS, Javascript, Python, BackboneJS, NodeJS, and Ruby. He is also a member of IEEE and has worked on Arduino projects and microcontrollers. He is in particular interested in mixing hardware and software disciplines with an emphasis on web design for both the frontend and backend.',
				imageSource: 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/8/005/093/2bc/23baf2a.jpg',
				linkedin: '<a href="https://www.linkedin.com/in/arkodewri" target="_blank"> https://www.linkedin.com/in/arkodewri </a>',
				personalSite: '<a href="http://arkodewri.com/" target="_blank"> http://arkodewri.com/ </a>'});
			var developer3 = new DeveloperinfoModel({image: '<img src="http://extras.mnginteractive.com/live/media/site513/2012/0621/20120621_102452_22-WALLAREA.jpg" style="width:100%; height:300px">',
				id:'3', idName: 'Matthew', fullName: 'Matthew Lin', year:'2nd Year Undergraduate', 
				biography:'Matthew is a 2nd Year Undergraduate Computer Science and Engineering major. He is interested in artificial intelligence and robotics. In his spare time, he likes to play tennis and help out the community. He is looking for a software engineering internship for Summer 2015. He has knowledge in C++, C, HTML, CSS, Javascript, BackboneJS, and Python. He has also has elementary knowledge of Arduino microcontrollers. Some of his other projects include the Circle K Pillow Fight Website, Mapping the News, Paper Piano, and Pebble Stock Trader App. In these projects, he has worked on either the frontend design using HTML, CSS, and Javascript, or in backend Python scripting.',
				imageSource: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAKYAAAAJDI0MTU4MjU3LTMzMjgtNGQwMi05OTUxLWFiZmMwMWM3YmUxYQ.jpg',
				linkedin: '<a href="https://www.linkedin.com/pub/matthew-lin/7b/506/a95" target="_blank"> https://www.linkedin.com/pub/matthew-lin/7b/506/a95 </a>',
				personalSite: '<a href="http://matthewallenlin.me/" target="_blank"> http://matthewallenlin.me/	</a>'});
			var that = this;

			// Push the developer in to collections
			developerinfo.push(developer1);
			developerinfo.push(developer2);
			developerinfo.push(developer3);			
			
			//Create a developerinfo Collection
			this.developerinfoCollection = new DeveloperinfoCollection(developerinfo);
			
			// Apppend the general structure
			$(".site-main").append(this.developerinfoTemplate());
		
			//Show the content	
			this.developerinfoCollection.each(function(developer)
			{	
				//Clickable photo
				$('#developers').append(this.individualDeveloperTemplate(developer.toJSON()));

				//Content that puts up when photo is clicked
				$(".site-main").append(this.developerinfoPopupTemplate(developer.toJSON()));
			},this);	//this is the callback	
		},
		
	});
	
	return DeveloperinfoView;
});
