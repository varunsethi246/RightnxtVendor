import './VendorGotLikes.html';
import '../../vendorBusinessDetails/businessEventIcons.html'
import '/imports/vendor/vendorBusinessDetails/businessEventIcons.html'

import { Business } from '/imports/api/businessMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { Review } from '../../../api/reviewMaster.js';

import { FollowUser } from '/imports/api/userFollowMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';

import '../../vendor.js';
// import '../../vendorBusinessDetails/businessEventIcons.js';

// Template.VendorGotLikes.onCreated(function(){
//   this.subscribe('vendorImage');
// });

Template.VendorGotLikes.helpers({
	'businessLikesData': function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessLikes = Likes.find({"businessLink":businessLink}).fetch();
		if(businessLikes){
			for(i=0; i<businessLikes.length; i++){
				var id = businessLikes[i].userid;
				if(id){
					// console.log("id",id);
					var data = Meteor.users.findOne({"_id":id});
					// console.log("data",data);
					if(data){
						if(data.profile){
							if(data.profile.userProfilePic){
								var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
								if(pic){
									businessLikes[i].userProfilePic = pic.link();	
								}
								else{
									businessLikes[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
								}
							}else{
								businessLikes[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
							}
						}
					}
					
				}
				var timeAgo = moment(businessLikes[i].createdAt).fromNow();
				businessLikes[i].timeAgo = timeAgo;
			}
			
			return businessLikes;
		}


	},
	'businessName' : function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
		if(businessObj){
			var likeCount = Likes.find({"businessId":businessObj._id}).count();
			var value = {
							"businessTitle" : businessObj.businessTitle,
							"likeCount"		: likeCount,
						}
			return value;
		}

	},
	'likeNumber':function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
		if(businessObj){
			var likeCount = Likes.find({"businessId":businessObj._id}).count();
			if (likeCount == 0) {
				return false;
			}else{
				return true;
			}
		}

	},
	'UserFollowerCount': function(userid){
		var followersObj = FollowUser.find({"followUserId":userid}).count();
		console.log("followersObj: ",followersObj);
		if(followersObj){
			var objFollw = {
				UserFollowerNo : followersObj,
			}
			return objFollw;
		}else{
			var objFollw = {
				UserFollowerNo : 0,
			}
			return objFollw;

		}
		
	},

	'UserReviewCount': function(userId){
		var reviewObj = Review.find({"userId":userId}).count();
		console.log("reviewObj: ",reviewObj);
		if(reviewObj){
			var objRev = {
				UserReviewNo : reviewObj,
			}
			return objRev;
		}else{
			var objRev = {
				UserReviewNo : 0,
			}
			return objRev;

		}
		
	}
});

Template.businessEventIcons.events({
	// 'click #likeme': function(event){
	// 	event.preventDefault();
	// 	alert('ji');
	// 	var businessurl = FlowRouter.getParam('businessurl');
	// 	var usersData = Meteor.users.findOne({"_id":Meteor.userId()});
	// 	if(usersData){
	// 		if(usersData.roles){
	// 			if(usersData.roles[0] == "user"){
	// 				if($("#likeme").hasClass('inactivelike')){
	// 					$("#likeme").removeClass('inactivelike');
	// 					$("#likeme").addClass('activelike');
				
	// 					Meteor.call('insertLikes',businessurl,'active',
	// 						function(error,result){
	// 							if(error){
	// 								Bert.alert('Some error occured while liking this page!','danger','growl-top-right','fa-remove');
	// 							}else{

	// 								//============================================================
	// 								// 			Notification Email / SMS / InApp
	// 								//============================================================
	// 								var admin = Meteor.users.findOne({'roles':'admin'});
	// 							    if(admin){
	// 							    	var adminId = admin._id;
	// 							    }
	// 								var businessData = Business.findOne({"businessLink":businessurl});
	// 								if(businessData){
	// 									var vendorId = businessData.businessOwnerId;
	// 									var vendorDetail = Meteor.users.findOne({'_id':vendorId});
	// 									var userId = Meteor.userId();
	// 									var userDetail = Meteor.users.findOne({'_id':userId});
	// 									if(vendorDetail&&userDetail){
	// 															//Send Notification, Mail and SMS to Vendor
	// 										var vendorname 	= vendorDetail.profile.name;
	// 												var date 		= new Date();
	// 												var currentDate = moment(date).format('DD/MM/YYYY');
	// 												var msgvariable = {
	// 																'[username]' 	  : vendorname,
	// 																'[currentDate]'	: currentDate,
	// 																'[businessName]': businessData.businessTitle
	// 													};

	// 															var inputObj = {
	// 																notifPath	   : businessurl,
	// 															to           : vendorId,
	// 															templateName : 'Vendor Business Page Like',
	// 															variables    : msgvariable,
	// 															}
	// 															sendInAppNotification(inputObj);

	// 															var inputObj = {
	// 																notifPath	   : businessurl,
	// 																from         : adminId,
	// 															to           : vendorId,
	// 															templateName : 'Vendor Business Page Like',
	// 															variables    : msgvariable,
	// 															}
	// 															sendMailNotification(inputObj);

	// 															//Send Notification, Mail and SMS to Current User
	// 											var username 	= userDetail.profile.name;
	// 											var date 		= new Date();
	// 											var currentDate = moment(date).format('DD/MM/YYYY');
	// 											var msgvariable = {
	// 															'[username]' 	  : username,
	// 															'[currentDate]'	: currentDate,
	// 															'[businessName]': businessData.businessTitle
	// 													};

	// 															// var inputObj = {
	// 															// 	notifPath	 : businessurl,
	// 															//     to           : vendorId,
	// 															//     templateName : 'Vendor Business Page Like',
	// 															//     variables    : msgvariable,
	// 															// }
	// 															// sendInAppNotification(inputObj);

	// 															var inputObj = {
	// 																notifPath	   : businessurl,
	// 																from         : adminId,
	// 															to           : userId,
	// 															templateName : 'User Business Page Like',
	// 															variables    : msgvariable,
	// 															}
	// 															sendMailNotification(inputObj); 
	// 									}
	// 								}
	// 								//============================================================
	// 								// 			End Notification Email / SMS / InApp
	// 								//============================================================
	// 							}
	// 						}
	// 					);			
	// 				}else{
	// 					$("#likeme").removeClass('activelike');
	// 					$("#likeme").addClass('inactivelike');			
				
	// 					Meteor.call('insertLikes',businessurl,'inactive',
	// 						function(error,result){
	// 							if(error){
	// 								Bert.alert('Some error occured while disliking this page!','danger','growl-top-right','fa-remove');
	// 							}else{
									
	// 							}
	// 						}
	// 					);			
	// 				}
	// 			}			
	// 		}else{
	// 			$('#loginModal').modal('show');
	// 			$('.loginScreen').hide();
	// 			$('.signupScreen').hide();
	// 			$('.thankyouscreen').hide();
	// 			$('.genLoginSignup').show();
	// 			$('.thankyouscreen').hide();
	// 			$('.signUpBox').hide();
	// 		}
	// 	}else{
	// 		$('#loginModal').modal('show');
	// 		$('.loginScreen').hide();
	// 		$('.signupScreen').hide();
	// 		$('.thankyouscreen').hide();
	// 		$('.genLoginSignup').show();
	// 		$('.thankyouscreen').hide();
	// 		$('.signUpBox').hide();
	// 	}
	// },
});


VendorGotLikesForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'VendorGotLikes'});
}

export { VendorGotLikesForm };