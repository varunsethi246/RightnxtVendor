import { Business } from '/imports/api/businessMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { FollowUser } from '/imports/api/userFollowMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Tracker } from 'meteor/tracker';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';
import { ReviewImage } from '/imports/videoUploadClient/reviewImageClient.js';
import { ReviewCommentLikes } from '/imports/api/reviewCommentLikesMaster.js';

import '../../vendor.js';

// Template.vendorComments.onCreated(function(){
//   this.subscribe('vendorImage');
// });
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
				allReviews[i].userProfileUrl = generateURLid(allReviews[i].userId);	
				var userId = allReviews[i].userId;
				var userObj = Meteor.users.findOne({"_id":userId});
				if (userObj){
					if(userObj.profile.userProfilePic){

							var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
							if(pic){
								allReviews[i].revProfilePic = pic.link();	
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
					// console.log('allReviews[i].tagedFriends:',allReviews[i].tagedFriends);
					if(allReviews[i].tagedFriends.length != 0){
						// console.log('allReviews[i].tagedFriends:',allReviews[i].tagedFriends.length);

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
						var reviewPhoto = ReviewImage.findOne({"_id":allReviews[i].reviewImages[j].img});
						if(reviewPhoto){
							allReviews[i].reviewImages[j].imagePath = reviewPhoto.link();
						}
					}
				}

				var id = Meteor.userId();
				if(id){
					var data = Meteor.users.findOne({"_id":id},{"profile":1});
					if(data.profile.userProfilePic){

						var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
						if(pic){
							allReviews[i].userProfilePic = pic.link();	
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
						if(allReviews[i].userComments[k]){

							var userId  = allReviews[i].userComments[k].userId;
							var userObj = Meteor.users.findOne({"_id":userId});
							if(userObj){
								allReviews[i].userComments[k].commentUserName = userObj.profile.name;
									if(userObj.profile.userProfilePic){								
										var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
										if(pic){
											allReviews[i].userComments[k].userProfileImgPath = pic.link();	
										}
										else{
											allReviews[i].userComments[k].userProfileImgPath = "/users/profile/profile_image_dummy.svg";
										}				
									}else{

										allReviews[i].userComments[k].userProfileImgPath = '/users/profile/profile_image_dummy.svg';
									}

								allReviews[i].userComments[k].userCommentDateAgo = moment(allReviews[i].userComments[k].userCommentDate).fromNow();
							}

							var selector = {
												"reviewId" 		: allReviews[i]._id,
												"commentId" 	: allReviews[i].userComments[k].userCommentId.toString(),
												"likedByUserId"	: Meteor.userId(),
												"replyId" 		: '',
											};
							var checkCommentLike =  ReviewCommentLikes.findOne(selector);
							if(checkCommentLike){
								allReviews[i].userComments[k].likeUnlike = true;	
							}else{
								allReviews[i].userComments[k].likeUnlike = false;
							}
							var commentLikeCount = ReviewCommentLikes.find({
														"reviewId" 		: allReviews[i]._id,
														"commentId" 	: allReviews[i].userComments[k].userCommentId.toString(),
														"replyId" 		: '',
													}).fetch();
							if(commentLikeCount){
								allReviews[i].userComments[k].commentLikeCount = commentLikeCount.length;
							} 

							if(allReviews[i].commentReply){
								// console.log(allReviews[i].commentReply);
								var commentReplyArr = [];
								var rn = 0;
								for(l=0;l<allReviews[i].commentReply.length; l++){
									var replyObj = {};
									if(allReviews[i].commentReply[l].userCommentId == allReviews[i].userComments[k].userCommentId){
										replyObj.commentReplyUserId = allReviews[i].commentReply[l].userId;
										replyObj.commentReply = allReviews[i].commentReply[l].commentReply;
										replyObj.userCommentID = allReviews[i].commentReply[l].userCommentId;
										var replyId  = allReviews[i].commentReply[l].userReplyId;
										var reviewId  = allReviews[i]._id;
										replyObj.replyId = replyId;
										replyObj.reviewId = reviewId;
										var userId1  = allReviews[i].commentReply[l].userId;
										var userObj1 = Meteor.users.findOne({"_id":userId1});

										var newUserIdTwo = Meteor.userId();
										if(newUserIdTwo){
											if((Meteor.users.findOne({"_id": newUserIdTwo}).roles[0] === 'admin') || (userId1 === Meteor.userId()) ){
												replyObj.repEditBlock = 'show';
											} else{
												replyObj.repEditBlock = 'hide';
											}
										} else{
											replyObj.repEditBlock = 'hide';
										}
								
										if(userObj1){
											replyObj.commentReplyUserName = userObj1.profile.name;
											if(userObj1.profile.userProfilePic){								
												var pic = VendorImage.findOne({"_id":userObj1.profile.userProfilePic});
												if(pic){
													replyObj.replyProfileImgPath = pic.link();	
												}
												else{
													replyObj.replyProfileImgPath = "/users/profile/profile_image_dummy.svg";
												}				
											}else{
												replyObj.replyProfileImgPath = '/users/profile/profile_image_dummy.svg';
											}
											replyObj.commentReplyDateAgo = moment(allReviews[i].commentReply[l].commentReplyDate).fromNow();
											var replySelector = {
																"reviewId" 		: allReviews[i]._id,
																"replyId"		: replyObj.replyId.toString(),
																"likedByUserId"	: Meteor.userId(),
																"commentId" 	: replyObj.userCommentID.toString(),
															};
											var checkCommentReplyLike =  ReviewCommentLikes.findOne(replySelector);

											if(checkCommentReplyLike){
												replyObj.replyLikeUnlike = true;	
											}else{
												replyObj.replyLikeUnlike = false;
											}
											var commentReplyLikeCount = ReviewCommentLikes.find({
																			"reviewId" 		: allReviews[i]._id,
																			"replyId" 		: replyObj.replyId.toString(),
																			"commentId" 	: replyObj.userCommentID.toString(),
																		}).fetch();
											if(commentReplyLikeCount){
												replyObj.commentReplyLikeCount = commentReplyLikeCount.length;
											}
										}

										commentReplyArr.push(replyObj);
										rn++;
									}//if
								}//for

								allReviews[i].userComments[k].commentReplyArr = commentReplyArr;
								allReviews[i].userComments[k].commentReplyCount = rn;
								commentReplyArr = [];
							}else{
								allReviews[i].userComments[k].commentReplyCount = 0;
							}
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
		console.log(allReviews);
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