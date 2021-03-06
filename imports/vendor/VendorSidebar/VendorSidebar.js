import './vendorSidebar.html';
import '../../userarea/userSidebar/userSidebar.js';

import { Likes } from '/imports/api/likesMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { Reports } from '/imports/api/reportMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { Enquiry } from '/imports/api/enquiryMaster.js';
import { Review } from '/imports/api/reviewMaster.js';  

import { Offers } from '/imports/api/offersMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';

Template.vendorSidebar.onCreated(function() {
  this.subscribe('businessImage');
});

Template.vendorSidebar.helpers({
	'likesCounts':function(){
		var count = Counts.get('VendorLikesCount');
				// var likedDataReturn = {
				// 		noofLikes		: count,
				// }
				// console.log('count ------>',count);
					return count;
	},
	'reportsCount':function(){
		var reportcount = Counts.get('VendorReportCount');
		// var ReportDataReturn = {
		// 	noofReport		: count,
		// }
		// console.log('count report------>',reportcount);
		return reportcount;
	},
	'bussinessDetails' : function () {
		// console.log('bussinessDetails');
		var usrId = Meteor.userId();

		var data = Business.find({"businessOwnerId":usrId,"status": "active"}).fetch();
		if(data.length>0){
			for(i=0;i<data.length;i++){
				var businessLink = data[i].businessLink;

				// Likes count noofLikes
				var count = Counts.get('VendorLikesCount');
				if(count){
					data[i].noofLikes = count;
				}else{
					data[i].noofLikes = 0 ;
				}

				// Report Count noofReports
				var reportcount = Counts.get('VendorReportCount');
				if(reportcount){
					data[i].reportcount = reportcount;
				}else{
					data[i].reportcount = 0;
				}

				var beenthereCount = Counts.get('VendorBeenThereCount');
				// console.log('beenthereCount',beenthereCount);
				if(beenthereCount){
					data[i].noofbeenthere = beenthereCount;
				} else{
					data[i].noofbeenthere = 0;
				}
				// Comments Count noofComments
				var commentsCount = Counts.get('VendorCommentCount');
				if(commentsCount){
					data[i].noofComments = commentsCount;
				}else{
					data[i].noofComments = 0;
				}
				
				// Photos Count noofPhotosCount

				var ReviewsUserPhotoCount = Counts.get('ReviewsUserPhotoCount');
				var ReviewsOwnerPhotoCount = Counts.get('ReviewsOwnerPhotoCount');
				
				// console.log('ReviewsUserPhotoCount :',ReviewsUserPhotoCount);
				// console.log('ReviewsPhotoCount :',ReviewsOwnerPhotoCount);

				if(ReviewsUserPhotoCount || ReviewsOwnerPhotoCount){
					data[i].noofPhotosCount = ReviewsUserPhotoCount + ReviewsOwnerPhotoCount;
				}else{
					data[i].noofPhotosCount = 0;
				}
				
				// My Offers Count noofOffersCount
	
				var offerCount = Counts.get('offerCount');
				// console.log('offerCount :',offerCount);
				if(offerCount){
					data[i].noofOffersCount = offerCount;
				} else{
					data[i].noofOffersCount = 0;
				}
				
				// Enquiry Count noofEnquiries
				var enquiryCount = Counts.get('enquiryCount');
				// console.log('commentsCount sadas:',commentsCount);
				if(enquiryCount){
					data[i].noofEnquiries = enquiryCount;
				}else{
					data[i].noofEnquiries = 0;
				}
			}
		}
		

		// console.log("data: ",data);

		return data;	
	},
	'businessCity': function(){

	},
	currentCity(){
		var userId = Meteor.userId();
		if(userId){
			var cityObject = Meteor.users.findOne({"_id":userId});
			if(cityObject.selectedCity){
				// var city = cityObject.selectedCity.replace(/ /g, "-");
				var city = cityObject.selectedCity;
				var currentCity = city;
			}else {
				var currentCity = "Pune";
			}
		}
		return currentCity;
	},
	'getBusinessName':function(){
    	var businessName = Business.findOne({'businessOwnerId':Meteor.userId()});
    	if(businessName){
    		return businessName.businessLink;
    	}
    },
});

Template.vendorSidebar.events({
	'click .closeMenuTab': function(event){
		$(event.currentTarget).parent().parent().removeClass('in');
	},
	'click .closeSubMenuTab': function(event){
		// console.log($(event.currentTarget));
		var windowWidth = $(window).width();
		if (windowWidth >= 320 && windowWidth <= 767){
			// $(event.currentTarget).parent().parent().removeClass('in');
			$('#businessMenuCollapse').removeClass('in');
			$(event.currentTarget).parent().parent().parent().parent().parent().parent().removeClass('in');
		}
	},
	'click .clickAddNewBusi': function(){
    	Session.set("backlinkurl",'');
	},
	'click .myBussinessList': function(){
		Session.set('EnqIDSes','');
	},

	//Sidebar Menu My Business, Add New Business, Payment Menu Click Events for Selected item
	'click .menusidebarClass0':function(){
		$('#myBussiness').removeClass('in');
		$('.sidebarCollabse').removeClass('in');
		$('.menusidebarClass0').toggleClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
	},
	'click .menusidebarClass1': function(){
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').toggleClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
	},
	'click .menusidebarClass2': function(){
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').toggleClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		// Session.set("backlinkurl",'');
	},
	'click .menusidebarClass3': function(){
		$('#myBussiness').removeClass('in');
		$('.sidebarCollabse').removeClass('in');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').toggleClass('mymenucolorSelect');
		$("html,body").scrollTop(0);
	},

	//Sidebar Business Sub-Menu Click Events for Selected item
	'click .editSidebarBusiness': function(event){
		var businessLink = $(event.currentTarget).attr('data-link');
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$(".menuSubCat1").addClass('mymenucolorSelect');
		FlowRouter.go('/aboutBusiness/'+businessLink);
		$("html,body").scrollTop(0);
	},
	'click .menuSubCat1': function(event){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$(".menuSubCat1").addClass('mymenucolorSelect');
	},
	'click .menuSubCat2': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat2').addClass('mymenucolorSelect');
	},
	'click .menuSubCat3': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat3').addClass('mymenucolorSelect');
	},
	'click .menuSubCat4': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat4').addClass('mymenucolorSelect');		
	},
	'click .menuSubCat5': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat5').addClass('mymenucolorSelect');		
	},
	'click .menuSubCat6': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat6').addClass('mymenucolorSelect');		
	},
	'click .menuSubCat7': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat7').addClass('mymenucolorSelect');		
	},
	'click .menuSubCat8': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat8').addClass('mymenucolorSelect');		
	},
	'click .menuSubCat9': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat9').addClass('mymenucolorSelect');		
	},
	'click .menuSubCat10': function(){
		$('.menuSubCat').removeClass('mymenucolorSelect');
		$('.menuSubCat10').addClass('mymenucolorSelect');		
	},
	
});

Template.userSidebar.helpers({


});