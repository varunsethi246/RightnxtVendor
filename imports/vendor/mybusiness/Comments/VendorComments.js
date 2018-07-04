import { Business } from '/imports/api/businessMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { UserProfileStoreS3New } from '/client/cfsjs/UserProfileS3.js';
import { FollowUser } from '/imports/api/userFollowMaster.js';
import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Tracker } from 'meteor/tracker';

import '../../vendor.js';


Template.vendorComments.helpers({
	businessComments:function () {
		var businessLink = FlowRouter.getParam('businessLink');

		var allReviews = Review.find({"businessLink": businessLink},{sort: {"reviewDate": -1}}).fetch();
		// var allReviews = Review.find({"businessLink": businessLink,{sort: {"reviewDate": -1}}}).fetch();
		// console.log("allReviews: ",allReviews);
		if(allReviews){
			if(allReviews.length == 5 || allReviews.length < 5){
				allReviews.showLoadMore = 'hideFollowButton';
			}else{
				allReviews.showLoadMore = '';
			}
			for(i=0; i<allReviews.length; i++){				
				var userId = allReviews[i].userId;
				var userObj = Meteor.users.findOne({"_id":userId});
				if (userObj){
					if(userObj.profile.userProfilePic){

							var pic = UserProfileStoreS3New.findOne({"_id":userObj.profile.userProfilePic});
							if(pic){
								allReviews[i].revProfilePic = pic.url();	
							}
							else{
								allReviews[i].revProfilePic = "/users/profile/profile_image_dummy.svg";	
							}
							// console.log('data ', data);
							// return data;
						}else{
							allReviews[i].revProfilePic = "/users/profile/profile_image_dummy.svg";
						}
				}
				if(allReviews[i].tagedFriends){
					console.log('allReviews[i].tagedFriends:',allReviews[i].tagedFriends);
					if(allReviews[i].tagedFriends.length != 0){
						console.log('allReviews[i].tagedFriends:',allReviews[i].tagedFriends.length);

						allReviews[i].tagedFriendsValidate = true;

						var tagedFriendsArray = [];
						for(m=0;m<allReviews[i].tagedFriends.length;m++){
							var userTagObj = Meteor.users.findOne({"_id":allReviews[i].tagedFriends[m]});
							var obj = {
								'tagedFriends'   : userTagObj.profile.name,
								'tagedFriendsUrl': generateURLid(allReviews[i].tagedFriends[m]),
							}
							tagedFriendsArray.push(obj);

						}
						allReviews[i].tagedFriendsArray = tagedFriendsArray;
					} else {
						allReviews[i].tagedFriendsValidate = false;
					}
				}
				
				if(userObj){
					allReviews[i].username = userObj.profile.name;
					allReviews[i].area = userObj.profile.area;
					allReviews[i].city = userObj.profile.city;
				}

				if(allReviews[i].userId === Meteor.userId()){
					allReviews[i].followButton = 'hideFollowButton';
				}else{
					allReviews[i].followButton = '';
					allReviews[i].followButtonText 	= "Follow";
					allReviews[i].followButtonClass = "";
					var verifyFollow = FollowUser.findOne({
															"userId": Meteor.userId(),
															"followUserId": allReviews[i].userId
														 });
					if(verifyFollow){
						allReviews[i].followButtonText 	= "Following";
						allReviews[i].followButtonClass = "alreadyFollowing";
						// console.log('allReviews: ', allReviews[i]);
					}
					
				}

				if(allReviews[i].userId === Meteor.userId()){
					allReviews[i].deleteButton = 'showDeleteButton';
				}else{
					allReviews[i].deleteButton = '';
				}


				if(allReviews[i].reviewImages){
					for(j=0;j<allReviews[i].reviewImages.length;j++){
						var reviewPhoto = UserReviewStoreS3New.findOne({"_id":allReviews[i].reviewImages[j].img});
						if(reviewPhoto){
							allReviews[i].reviewImages[j].imagePath = reviewPhoto.url();
						}
					}
				}

				var id = Meteor.userId();
				if(id){
					var data = Meteor.users.findOne({"_id":id},{"profile":1});
					if(data.profile.userProfilePic){

						var pic = UserProfileStoreS3New.findOne({"_id":data.profile.userProfilePic});
						if(pic){
							allReviews[i].userProfilePic = pic.url();	
						}
						else{
							allReviews[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
						}
					}else{
						allReviews[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
					}
					
				}
				
				allReviews[i].reviewDateAgo = moment(allReviews[i].reviewDate).fromNow();
				if(allReviews[i].userComments){					
					allReviews[i].userCommentsCount = allReviews[i].userComments.length;
					allReviews[i].userComments = allReviews[i].userComments.reverse();
					for(k=0;k<allReviews[i].userComments.length; k++){
						var userId  = allReviews[i].userComments[k].userId;
						var userObj = Meteor.users.findOne({"_id":userId});
						if(userObj){
							allReviews[i].userComments[k].commentUserName = userObj.profile.name;
										if(userObj.profile.userProfilePic){								
											var pic = UserProfileStoreS3New.findOne({"_id":userObj.profile.userProfilePic});
											if(pic){
												allReviews[i].userComments[k].userProfileImgPath = pic.url();	
											}
											else{
												allReviews[i].userComments[k].userProfileImgPath = "/users/profile/profile_image_dummy.svg";
											}				
										}else{

											allReviews[i].userComments[k].userProfileImgPath = '/users/profile/profile_image_dummy.svg';
										}

									allReviews[i].userComments[k].userCommentDateAgo = moment(allReviews[i].userComments[k].userCommentDate).fromNow();
								}						
							}
						}else{
							allReviews[i].userCommentsCount = 0;					
						}

				if(allReviews[i].reviewLikes){					
					allReviews[i].reviewLikeCount = allReviews[i].reviewLikes.length;
					allReviews[i].likeClass = '';
					for(l=0; l<allReviews[i].reviewLikes.length; l++){
						if(allReviews[i].reviewLikes[l].likedByUser == Meteor.userId() ){
							allReviews[i].likeClass = 'orangeHeart';
							break;
						}
					}
					
				}else{
					allReviews[i].reviewLikeCount = 0;
					allReviews[i].likeClass = '';
				} 




				var verifyFollow = FollowUser.findOne({
														"userId": Meteor.userId(),
														"followUserId": allReviews[i].userId
													 });
				if(verifyFollow){
					allReviews[i].followButtonText 	= "Following";
					allReviews[i].followButtonClass = "alreadyFollowing";
					// console.log('allReviews: ', allReviews[i]);
				}


			}//end i loop
			var totalReview = allReviews.length;
			Session.set('totalReview', totalReview);
		return allReviews;
		}

	},
	vendorBusinessTitle:function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessName = Business.findOne({"businessLink":businessLink,"status": "active"});
		var businessCommentCount = Review.find({"businessLink":businessLink}).count();

		if(businessName){
			var busComment = {
				businessName : businessName.businessTitle,
				businessCount : businessCommentCount,
			}
			return busComment;
		}
	}
});

vendorCommentsForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorComments'});
}

export { vendorCommentsForm };