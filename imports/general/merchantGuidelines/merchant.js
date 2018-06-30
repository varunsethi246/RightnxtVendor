import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';

import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../generalLayout/generalLayout.js'
import './merchantGuidelines.html';

Template.merchantGuidelines.helpers({
	merchantGuidelinesData(){
		// var currentURL = FlowRouter.current().path;
		// var actualURL = currentURL.substring(1);
		// var splitUrl = currentURL.split('/');
		// var merchantGuidelines = GeneralContent.findOne({"url": splitUrl[1]});
		var currentURL = FlowRouter.getParam("url");
		var merchantGuidelines = GeneralContent.findOne({"url": currentURL});
		if(merchantGuidelines){
			return merchantGuidelines;
		} 
	}
});

Template.merchantGuidelines.onRendered(function(){
  $('html, body').scrollTop(0);
	$("#visible-lg").removeClass("merchantGuidelineslg");
	$("#visible-md").removeClass("merchantGuidelinesmd");
	$("#visible-sm").removeClass("merchantGuidelinessm");
	$("#visible-xs").removeClass("merchantGuidelinesxs");
	$(window).scroll(function() {
	    if ($(document).scrollTop() > 25) {
	    	$("#visible-lg").addClass("merchantGuidelineslg");
	    	$("#visible-md").addClass("merchantGuidelinesmd");
	    	$("#visible-sm").addClass("merchantGuidelinessm");
	    	$("#visible-xs").addClass("merchantGuidelinesxs");
	    } else {
	    	$("#visible-lg").removeClass("merchantGuidelineslg");
	    	$("#visible-md").removeClass("merchantGuidelinesmd");
	    	$("#visible-sm").removeClass("merchantGuidelinessm");
	    	$("#visible-xs").removeClass("merchantGuidelinesxs");
	    }
    });
	
});


merchantGuidelinesForm = function () {  
  BlazeLayout.render("generalLayout",{generalcontent: 'merchantGuidelines'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { merchantGuidelinesForm };