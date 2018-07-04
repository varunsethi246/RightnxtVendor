import './vendorSidebar.html';
import '../../userarea/userSidebar/userSidebar.js';

import { Likes } from '/imports/api/likesMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { Reports } from '/imports/api/reportMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { Enquiry } from '/imports/api/enquiryMaster.js';
import { Review } from '/imports/api/reviewMaster.js';  

import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { Offers } from '/imports/api/offersMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


Template.vendorSidebar.helpers({
	'bussinessDetails' : function () {
		// console.log('bussinessDetails');
		var usrId = Meteor.userId();

		var data = Business.find({"businessOwnerId":usrId,"status": "active"}).fetch();
		if(data.length>0){
			for(i=0;i<data.length;i++){
				var businessLink = data[i].businessLink;

				// Likes count noofLikes
				var likesCount = Likes.find({"businessLink":businessLink}).count();
				if(likesCount){
					data[i].noofLikes = likesCount;
				} else{
					data[i].noofLikes = 0;
				}
				var beenthereCount = BeenThere.find({"businessLink":businessLink}).count();
				if(beenthereCount){
					data[i].noofbeenthere = beenthereCount;
				} else{
					data[i].noofbeenthere = 0;
				}

				// Report Count noofReports
				var reportsCount = Reports.find({"businessLink":businessLink}).count();
				if(reportsCount){
					data[i].noofReports = reportsCount;
				} else{
					data[i].noofReports = 0;
				}

				// Comments Count noofComments
				var commentsCount = Review.find({"businessLink":businessLink}).count();
				if(commentsCount){
					data[i].noofComments = commentsCount;
				}else{
					data[i].noofComments = 0;
				}
				
				// Photos Count noofPhotosCount
				var reviewPhotosCount = Review.find({'businessLink':businessLink}).fetch();
				// console.log("photosCount: ",reviewPhotosCount);
				// console.log("Review businessLink: ",businessLink);
				var busPhotoCount = 0;
				var userPhotoCount = 0;

				if(data[i]){
					if(data[i].businessImages){
						for(j = 0 ; j < data[i].businessImages.length ; j++){
							var imgId =  data[i].businessImages[j];
							var imgData = BusinessImgUploadS3.findOne({"_id":imgId.img});
							if(imgData){
								busPhotoCount++;  					 
							}
						}
					}	
				}
				if(reviewPhotosCount){
					for (var k = 0; k < reviewPhotosCount.length; k++) {
						if(reviewPhotosCount[k].reviewImages){
							var imgListCount = reviewPhotosCount[k].reviewImages.length;
							userPhotoCount = userPhotoCount + imgListCount;
						}else{
							userPhotoCount = 0;
						}
					}
				}
				var photosCount = busPhotoCount + userPhotoCount;
				data[i].noofPhotosCount = photosCount;

				
				// My Offers Count noofOffersCount
				var businessId = data[i]._id;
				var offersCount = Offers.find({"businessId" : businessId}).count();
				if(offersCount){
					data[i].noofOffersCount = offersCount;
				} else{
					data[i].noofOffersCount = 0;
				}
				
				// Enquiry Count noofEnquiries
				var enqCount = Enquiry.find({"businessid":businessId}).count();
				if(enqCount){
					data[i].noofEnquiries = enqCount;
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
				var currentCity = cityObject.selectedCity;
			}else {
				var currentCity = "Pune";
			}
		}
		return currentCity;
	},
});

Template.vendorSidebar.events({
	'click .clickAddNewBusi': function(){
    	Session.set("backlinkurl",'');
	},
	'click .myBussinessList': function(){
		Session.set('EnqIDSes','');
	},

	//Sidebar Menu My Business, Add New Business, Payment Menu Click Events for Selected item
	'click .menusidebarClass0':function(){
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
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').toggleClass('mymenucolorSelect');
		$("html,body").scrollTop(0);
	},

	//Sidebar Business Sub-Menu Click Events for Selected item
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