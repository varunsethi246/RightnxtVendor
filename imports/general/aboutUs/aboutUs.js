import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Tracker } from 'meteor/tracker';

import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../generalLayout/generalLayout.js';
import '../../admin/commonAdmin/commonAdmin.js';
import './aboutUs.html';
import './aboutUsForm.html';

Template.aboutUs.onCreated(function () {
  // // Use this.subscribe inside onCreated callback
  // this.subscribe('userfunction');
  // this.subscribe('allCity');
  // this.subscribe('area');
  // // this.subscribe('userProfileS3OneUser');
  // this.subscribe('categories');
  // this.subscribe('notification');
  // this.subscribe('notificationTemplate');
  // this.subscribe('vendorBusiness');
  // this.subscribe('userProfileS3'); 
  // this.subscribe('businessImgS3');
	this.subscribe('notificationTemplate') ;
	this.subscribe('notification');
	this.subscribe('currentuser');
	this.subscribe('area');
	this.subscribe('vendorImage');
	this.subscribe('generalContentURL','about'); 
	// this.subscribe('userProfileS3');
	// this.subscribe('businessImgS3');
});

Template.aboutUs.helpers({
	welcomeData(){
		var currentURL = FlowRouter.current().path;
		var splitUlr = currentURL.split('/');
		var actualURL = currentURL.substring(1);
		var welcome = GeneralContent.findOne({"url": splitUlr[1] , "tabName": "COMPANY" , "sectionHeading": "Welcome to RightNxt"});
		return welcome;
	},

	visionData(){
		var currentURL = FlowRouter.current().path;
		console.log('currentURL :',currentURL);
		var splitUlr = currentURL.split('/');
		var actualURL = currentURL.substring(1);
		console.log('actualURL :',actualURL);
		var vision = GeneralContent.findOne({"url": splitUlr[1] , "tabName": "COMPANY" , "sectionHeading": "Our Vision"});
		console.log('vision',vision);
		return vision;
	},

	whyWeBuiltData(){
		var currentURL = FlowRouter.current().path;
		var splitUlr = currentURL.split('/');
		var whyWeBuilt = GeneralContent.find({"url": splitUlr[1] , "tabName": "WHY WE BUILT"});
		return whyWeBuilt;
	},

	howWeHelpData(){
		var currentURL = FlowRouter.current().path;
		var splitUlr = currentURL.split('/');
 		var howWeHelp = GeneralContent.find({"url": splitUlr[1] , "tabName": "HOW WE HELP"});
 		return howWeHelp;
 	}
});

Template.aboutUsForm.events({
	'submit .aboutUsForm': function(event){
		event.preventDefault();
		if(event.target.title.value && event.target.sectionContent.value && event.target.tabName.value && event.target.sectionHeading.value){
			var aboutUsFormValues = {
				"contentType"			: 'aboutUs',
				"title" 				: event.target.title.value,
				"contentBody" 			: event.target.sectionContent.value,
				"tabName" 				: event.target.tabName.value,
				"sectionHeading" 		: event.target.sectionHeading.value,
			};

			var currentURL = FlowRouter.current().path;
			// if editpage = call update query
			if(currentURL == "/editPages") {
				aboutUsFormValues.id = Session.get('id');
				Meteor.call('updateGeneralContent',aboutUsFormValues,
				function(error, result){
					if(error){
						Bert.alert("Form values not updated.","danger","growl-top-right");
					}else{
						Bert.alert("Data updated sucessfully.","success","growl-top-right");
						$(".aboutUsForm").hide();
						$("html,body").scrollTop(0);						
					}
				});
			}
			// if aboutus-form = call insert query
			if(currentURL == "/aboutUs-form"){
				Meteor.call('insertGeneralContent',aboutUsFormValues,
				function(error, result){
					if(error){
						Bert.alert("Form values not inserted.","danger","growl-top-right");
					}else{
						Bert.alert("Data inserted sucessfully.","success","growl-top-right");
						event.target.title.value 			='';
						event.target.tabName.value 			='';
						event.target.sectionHeading.value 	='';
						event.target.sectionContent.value 	= CKEDITOR.instances['focus'].setData('');
						return;
					}
				});
			}
		}
		else{
			Bert.alert("Please enter data in the field !!!","danger","growl-top-right");
		}	
	}
		
});

Template.aboutUs.onRendered(function(){
	$('html, body').scrollTop(0);
});

Template.aboutUsForm.onRendered(function(){
	$('html, body').scrollTop(0);
});


aboutUsForm = function () {  
  BlazeLayout.render("generalLayoutWithImage",{generalcontent: 'aboutUs'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { aboutUsForm };

aboutUsFormTwo = function () {  
  BlazeLayout.render("adminLayout",{main: 'aboutUsForm'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { aboutUsFormTwo };