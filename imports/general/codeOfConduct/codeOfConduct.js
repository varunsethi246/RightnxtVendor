import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';

import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../generalLayout/generalLayout.js';
import './codeOfConduct.html';

Template.codeOfConduct.helpers({
	codeOfConductData(){
		// var currentURL = FlowRouter.current().path;
		// var actualURL = currentURL.split("/");
		// var codeOfConduct = GeneralContent.findOne({"url": actualURL[1]});
		var currentURL = FlowRouter.getParam("url");
		var codeOfConduct = GeneralContent.findOne({"url": currentURL});
		return codeOfConduct;
	}
});

Template.codeOfConduct.onRendered(function(){
	$("#visible-lg").removeClass("merchantGuidelineslg");
	$("#visible-md").removeClass("merchantGuidelinesmd");
	$("#visible-sm").removeClass("merchantGuidelinessm");
	$("#visible-xs").removeClass("merchantGuidelinesxs");
	$('html, body').scrollTop(0);
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

codeOfConductForm = function () {  
  BlazeLayout.render("generalLayout",{generalcontent: 'codeOfConduct'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { codeOfConductForm };