import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';

import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../generalLayout/generalLayout.js';
import './privacyPolicy.html';

Template.privacyPolicy.helpers({
	privacyPolicyData(){
		// var currentURL = FlowRouter.current().path;
		// var actualURL = currentURL.split("/");
		// var privacyPolicy = GeneralContent.findOne({"url": actualURL[1]});
		var currentURL = FlowRouter.getParam("url");
		var privacyPolicy = GeneralContent.findOne({"url": currentURL});
		return privacyPolicy;
	},
});

Template.privacyPolicy.onRendered(function(){
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
	$('html, body').scrollTop(0);
});
privacyPolicyForm = function () {  
  BlazeLayout.render("generalLayout",{generalcontent: 'privacyPolicy'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { privacyPolicyForm };