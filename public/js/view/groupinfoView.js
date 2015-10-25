/*
 * Groupinfospace View
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',
        'model/groupinfoModel',
        'collection/groupinfoCollection',
        'text!view_template/groupinfo/groupinfoTemplate.html',
        'bootstrapLib',

        ], function($, _, Backbone,GroupinfoModel,GroupinfoCollection,GroupinfoTemplate){

	var GroupinfoView = Backbone.View.extend({
		el: ".site-main",
		groupinfoTemplate: _.template(GroupinfoTemplate),

		initialize: function(){	
			this.render();
		},

		//Render the overall groupinfo view
		render: function(){
			
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>A.1 Background and motivation</b></ins></h4>');
			$(".site-main").append('<p>Recently, cloud storage becomes extremely popular because of several reasons: (1) it is convenient to store information online, (2) it can be used as a backup, and (3) You files can be accessed anywhere in any time as long as you have a digital device.. There are several well-known cloud storage such as Dropbox, Google drive, OneDrive, etc. Because of limited storage capacity and personal interest, a person usually have multiple cloud storage accounts to manage their files. However, there is lacking of an efficient tool to communicate between these storage, i.e., a centralized place to allow efficient file operations to move one file from one storage to another. This is very useful, for example, when you have some files in Google drive and you want to share them via Dropbox with someone, it is inconvenient to first download the files from Google drive into you desktop and then upload to Dropbox. Our goal is to implement an all-in-one web interface for users to effectively manage their files in multiple cloud storage.</p>');
			
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>A.2 Additional objective (optional)</b></ins></h4>');
			$(".site-main").append('<p>When an all-in-one web interface is implemented, we would like to extend our application to facilitate research. Researchers relied heavily on their paper lab notebooks in traditional research. However, this kind of way to store lab information is only good for single-use purpose and it is hard to share information within a laboratory. As research data is generated tremendously, it is difficult to keep track on research progress on a paper lab notebook and thus not to mention sharing research data and result within a lab. Therefore, digital lab notebook becomes the next common way to keep track on research progress. Having an interacting platform to organize digital protocols, experiments agenda, and research data becomes important for a lab. Our goal is to design an digital “lab notebook”, which is not only to helps researchers to organize and share their resources within a laboratory, but it also helps facilitating communication and resources sharing between laboratories. Here are some goals of “elab”: </p>');
			$(".site-main").append('<li style="text-indent: 50px">1. To provide a sharing platform for a lab’s members to share projects’ information, such as experimental result (image, text, audio, etc.), protocols,  and other project details.</li>');
			$(".site-main").append('<li style="text-indent: 50px">2. To provide research-oriented features to facilitate research, that is:</li>');
			$(".site-main").append('<li style="text-indent: 100px">- Allow researchers to design experiment-specific protocol templates and reuse them.</li>');
			$(".site-main").append('<li style="text-indent: 100px">- Tagging system to organize experiment-specific files easily and enable quick search of a particular file.</li>');
			$(".site-main").append('<li style="text-indent: 100px">- “Notes” to allow researchers to share idea easily on a specific projects.</li>');
			$(".site-main").append('<li style="text-indent: 50px">3. To provide a collaboration platform for labs, that is:</li>');
			$(".site-main").append('<li style="text-indent: 100px">- sharing of protocols/tools/etc. which can be reused by other labs.</li>');
			$(".site-main").append('<li style="text-indent: 100px">- Easy look up for a lab’s information, such as contact, on-going projects, lab equipment, etc. The goal is to enable a researcher to search easily for labs that are doing similar projects and possible collaboration can be</li>');
			$(".site-main").append('<li style="text-indent: 110px">established. Also, a lab may be able to find equipment that are from another labs and save money to purchase new equipment.</li>');
			$(".site-main").append('<li style="text-indent: 100px">- Funding, thesis defense announcements from graduate students, departments, labs, or industry.</li>');
			$(".site-main").append('<li style="text-indent: 100px">- Q&A engine→ to answer a graduate student from domain A about a domain B questions.</li>');
			
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>B. Project Phases</b></ins></h4>');
			$(".site-main").append('<li style="text-indent: 50px">Phase 1: Create a web interface to mange files in Google Drive.</li>');
			$(".site-main").append('<li style="text-indent: 50px">Phase 2: Enable communication between cloud storage, such as Google Drive. OneDrive, and Dropbox.</li>');
			$(".site-main").append('<li style="text-indent: 50px">Phase 3 (Optional): Implement research-oriented features to facilitate research. </li>');
			
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>C.1 Programming language/Libraries</b></ins></h4>');
			$(".site-main").append('<li style="text-indent: 50px">- CSS & HTML</li>');
			$(".site-main").append('<li style="text-indent: 50px">- Javascript</li>');
			$(".site-main").append('<li style="text-indent: 50px">- Jquery</li>');
			
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>C.2 Framework/platform</b></ins></h4>');
			$(".site-main").append('<li style="text-indent: 50px">- Twitter Bootstrap</li>');
			$(".site-main").append('<li style="text-indent: 50px">- ExpressJs</li>');
			$(".site-main").append('<li style="text-indent: 50px">- BackboneJs</li>');
			$(".site-main").append('<li style="text-indent: 50px">- NodeJs</li>');
			
			$(".site-main").append('<br>');
			
			$(".site-main").append('<h4><ins><b>C.3 NodeJS Supported API</b></ins></h4>');
			
			/*
			// 1.Imagine getting info from db --> manually create json
			var groupinfos = [];
			var modelA1 = new GroupinfoModel({title:'<p>Hello</p>'});
			var model0 = new GroupinfoModel({title:''}); 
			var that = this;
			
			// Push the model in to collections
			groupinfos.push(modelA1);

			
			//Create a groupinfo Collection
			this.groupinfoCollection = new GroupinfoCollection(groupinfos);
			
			//Show the content
			$(".site-main").append('<p></p>');	
			
			this.groupinfoCollection.each(function(model){
				// Create table format
				$("#site-main").append(that.groupinfoTemplate(model.toJSON()));				
			},this);	//this is the callback	

			*/
		},
		
	});
	
	return GroupinfoView;
});