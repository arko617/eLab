/*
 * View for wTagInfo
 */

define([
        // These are path alias that we configured in our bootstrap
        'jquery',     
        'underscore', 
        'backbone',  
        'view/wTagInfoView/wTag_ProjectsOverviewView',
        'view/wTagInfoView/wTag_ProjectDetailsView',
        'view/wTagInfoView/wTag_ProjectTagsView',
        'view/wTagInfoView/wTag_ProjectNotesView',
        'text!view_template/workspace/wTagInfoViewTemplate.html',	//For the wTaginfoView
        
        'wTwoUi',
        'jquerySpinner',	//spinner

        ], function($, _, Backbone, wTagProjectsOverviewView, wTagProjectDetailsView, wTagProjectTagsView, wTagProjectNotesView, wTagInfoViewTemplate){

	var wTagInfoView = Backbone.View.extend({
		el: '#wTagInfoView',	
		wTagInfoViewTemplate: _.template(wTagInfoViewTemplate),

		// Initialization action
		initialize: function(){
			this.render();
			
			//Hide all the components within the wTagInfoViewContent
			$(".wTagInfoViewContent").hide();
		},

		//For rendering a view
		render: function(){
			var that = this;
			this.wTagInfoViewSpinner="#wTagInfoViewSpinner";
			this.wTagInfoViewContent = ".wTagInfoViewContent";
			this.wTagInfoViewDetailsDiv= "#wTagInfoViewDetailsDiv";	//not sure when I cannot define in initialize().
			this.wTagInfoViewTagsDiv = "#wTagInfoViewTagsDiv";
			this.wTagInfoViewNotesDiv = "#wTagInfoViewNotesDiv";
			//div's content
			this.wTagInfoViewDetailsDivContent= "#wTagInfoViewDetailsDiv-content";	//not sure when I cannot define in initialize().
			this.wTagInfoViewTagsDivContent= "#wTagInfoViewTagsDiv-content";	//not sure when I cannot define in initialize().
			this.wTagInfoViewNotesDivContent= "#wTagInfoViewNotesDiv-content";	//not sure when I cannot define in initialize().
			
			//Add html
			this.$el.html(this.wTagInfoViewTemplate());	//toJSON() returns an array containing the attributes of each model
			
			//Initialize the tag system
			this.wTagInfoViewNavTags = "#wTagInfoViewNavTags";
			$(this.wTagInfoViewNavTags).w2tabs({
				name: 'w2tab_wTagInfoViewNavtabs',
				active: 'wTagInfoViewTag-details',
				tabs: [
				       {id: 'wTagInfoViewTag-details', caption: 'Details'},
				       {id: 'wTagInfoViewTag-tags', caption: 'Tags'},
				       {id: 'wTagInfoViewTag-notes', caption: 'Notes'},
				       ],
				onClick: function(event){
					//Hide everything; show appropriate content
					$(that.wTagInfoViewContent).hide();
					switch(event.target){
						case 'wTagInfoViewTag-tags':
							$(that.wTagInfoViewTagsDiv).show();
							break;
						case 'wTagInfoViewTag-notes':
							$(that.wTagInfoViewNotesDiv).show();
							break;
						//default: wTagInfoViewTag-details
						default: 
							console.log("+++",event.target);
							$(that.wTagInfoViewDetailsDiv).show();
					}
				}
			})
			
			//Create spinner
			createSpinner(this.wTagInfoViewSpinner);
			$(this.wTagInfoViewSpinner).hide();
			
			return this;	// return the el
		},		
		
		//Open Projects Overview (for all projects) in wTagInfo
		openProjectsOverview:function(model){
			//Process
			console.log("Openning projects Overview...");
			//Clean content
			$(this.wTagInfoViewDetailsDivContent).empty();
			$(this.wTagInfoViewTagsDivContent).empty();
			$(this.wTagInfoViewNotesDivContent).empty();
			
			//Add content
			if(model){
				var projectsOverviewView = new wTagProjectsOverviewView({model:model});
				$(this.wTagInfoViewDetailsDivContent).append(projectsOverviewView.render().el);
			}else{
				$(this.wTagInfoViewDetailsDivContent).append("<p>No Details</p>");
			}
			
			//show the details content
			this.showDefaultComponents();
			
		},
		
		//Open a project details in wTagInfo
		openProjectDetails: function(model){
			//process
			console.log("Openning a project details...");	
			
			//Clean content
			$(this.wTagInfoViewDetailsDivContent).empty();
			$(this.wTagInfoViewTagsDivContent).empty();
			$(this.wTagInfoViewNotesDivContent).empty();
			
			//If the server fails to retreive model from db, show something meaningful instead of pointing out error
			if (model){	
				//Add General details
				var projectDetailsView = new wTagProjectDetailsView({model:model});
				$(this.wTagInfoViewDetailsDivContent).append(projectDetailsView.render().el);
				
				//Add tags
				var projectTagsView = new wTagProjectTagsView({model:model});
				$(this.wTagInfoViewTagsDivContent).append(projectTagsView.render().el)
				projectTagsView.injectTags();
				
				//Add Notes
				var projectNotesView = new wTagProjectNotesView({model:model});
				$(this.wTagInfoViewNotesDivContent).append(projectNotesView.render().el);
				projectNotesView.addNotes();
			}else{
				$(this.wTagInfoViewDetailsDivContent).append("<p>No details.</p>")
				$(this.wTagInfoViewTagsDivContent).append("<p>No Tags.</p>")
				$(this.wTagInfoViewNotesDivContent).append("<p>No Notes.</p>")
			}
			
			//show the details content
			this.showDefaultComponents();
		},
		
		//hide some components before rendering any content
		//by default, show the details whenever a project/file is clicked
		showDefaultComponents:function(){
			//everything
			this.wTagInfoViewContent = ".wTagInfoViewContent";
			$(this.wTagInfoViewContent).hide();
			
			//spinner
			wTagInfoViewSpinner = "#wTagInfoViewSpinner";
			$(wTagInfoViewSpinner).hide();
			
			//show the details content
			w2ui['w2tab_wTagInfoViewNavtabs'].select('wTagInfoViewTag-details'); //select the tab
			$(this.wTagInfoViewDetailsDiv).show();
		}

	});
	return wTagInfoView;

});

