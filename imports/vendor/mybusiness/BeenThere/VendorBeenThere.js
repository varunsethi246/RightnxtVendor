import './VendorBeenThere.html';
import '../../vendorBusinessDetails/businessEventIcons.html'
import '/imports/vendor/vendorBusinessDetails/businessEventIcons.html'

import { Business } from '/imports/api/businessMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { Review } from '../../../api/reviewMaster.js';

import { FollowUser } from '/imports/api/userFollowMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';

import '../../vendor.js';


// console.log('-------------before code----------');

// Template.VendorBeenThere.onCreated(function(){
//   this.subscribe('vendorImage');
// });
Template.VendorBeenThere.helpers({
	'businessBeenThereData': function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessBeenThere = BeenThere.find({"businessLink":businessLink}).fetch();
		if(businessBeenThere){
			for(i=0; i<businessBeenThere.length; i++){
				var id = businessBeenThere[i].userId;
				if(id){
					// console.log("id",id);
					var data = Meteor.users.findOne({"_id":id});
					// console.log("data",data);
					if(data){
						if(data.profile){
							businessBeenThere[i].username = data.profile.name;
							if(data.profile.userProfilePic){
								var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
								if(pic){
									businessBeenThere[i].userProfilePic = pic.link();	
								}
								else{
									businessBeenThere[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
								}
							}else{
								businessBeenThere[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
							}
						}
					}		
				}
				var timeAgo = moment(businessBeenThere[i].createdAt).fromNow();
				// businessBeenThere[i].timeAgo = timeAgo;
			}	
			// console.log('businessBeenThere ',businessBeenThere);
			return businessBeenThere;
		}
	},
	'businessName' : function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
		if(businessObj){
			var beenthereCount = BeenThere.find({"businessId":businessObj._id}).count();
			var value = {
							"businessTitle" : businessObj.businessTitle,
							"beenthereCount": beenthereCount,
						}
			return value;
		}

	},
	'UserFollowerCount': function(userid){
		var followersObj = FollowUser.find({"followUserId":userid}).count();
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



VendorBeenThereForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'VendorBeenThere'});
}

export { VendorBeenThereForm };