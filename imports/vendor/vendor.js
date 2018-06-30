import './vendorSidebarMain.html';

import './vendorLayout.html';
import './vendorProfile/vendorProfile.js';
import './VendorSidebar/VendorSidebar.js';
import './mybusiness/myBusiness.js';
import './VendorPayments/VendorPayments.js'
import './VendorProfileSetting/VendorProfileSetting.html'
import './AddNewBusiness/addNewBusiness.js'

import './vendorBusinessDetails/vendorBusinessDetails.js';
import './venLayScrollTT.js';

import './BusinessEnquiry/businessEnquiry.html';
import './BusinessEnquiry/businessEnquiry.js';
import './BusinessEnquiry/businessEnqValidation.js';

import './businessList/businessList.html';
import './businessList/businessList.js';

import './vendorDashboard/vendorDashboard.js';
import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userarea/userProfile/userProfile.js';
// import '../userarea/userSidebar/userSidebar.js';
import '../common/header.html';
import '../common/generalHeader.js';
import '../common/searchbar.js';
import '../common/vendorSignUpForm.js';
import './VendorSidebar/VendorSidebar.js'


Template.vendorLayout.events({

	'click .bussScrollTop' : function(event){
    	var $this = $(event.target);
		$('html, body').animate({
   		     scrollTop: $('body').offset().top
      		}, 1000,
  		);
    },
});
Template.vendorLayout.onRendered(function(){
	$(window).scroll(function() {
     	if ($(document).scrollTop() > 80) {
	    	$('.bussScrollTop').fadeIn("slow");
	    } else {
	    	$('.bussScrollTop').fadeOut("slow");
	    }
    });
});

Template.vendorLayout.helpers({
	'ownerVendor' : function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var owner = Business.findOne({"businessLink":businessLink});
		if(owner){
			if(owner.businessOwnerId == Meteor.userId()){
				return true;
			}else{
				return false;
			}
		}		
	}
});




