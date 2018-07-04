import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import { Business } from '/imports/api/businessMaster.js';

import { Review } from '/imports/api/reviewMaster.js';
import { ReviewCommentLikes } from '/imports/api/reviewCommentLikesMaster.js';

import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { UserProfileStoreS3New } from '/client/cfsjs/UserProfileS3.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { FollowUser } from '/imports/api/userFollowMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './businessEventIcons.js'
import './businessEvntIcons2.html'

// var options = {
// 	keepHistory: 1000 * 60 * 5,
// 	localSearch: true
// };
// var fields = ['profile.name'];
// tagFriend1 = new SearchSource('tagFriend', fields, options);
tagedFriends = [];

var filesR = [];
var counterImg = 0;

Template.userReviewTemplate.helpers({

	showRating(_id){
		// userId,businessLink
		var userId = _id;
		var businessUrl = FlowRouter.getParam('businessurl');
		var businessLink = FlowRouter.getParam('businessLink');
		if(businessUrl){
			var ratingInt = Review.findOne({"_id" : userId,"businessLink":businessUrl});
		}else{
			var ratingInt = Review.findOne({"_id" : userId,"businessLink":businessLink});
		}
		if(ratingInt){
			// console.log("ratingInt = ", ratingInt);
			var latestRating = ratingInt.rating;

			var intRating = parseInt(latestRating);
			var balRating = latestRating - intRating;
			var finalRating = intRating + balRating;
			if(balRating > 0 && balRating < 0.5){
				var finalRating = intRating + 0.5;
			}
			if(balRating > 0.5){
				var finalRating = intRating + 1;
			}

			ratingObj = {};

			for(i=1; i<=10; i++){
				var x = "star" + i;
				if(i <= finalRating*2){
					if( i%2 == 0){
						ratingObj[x] = "fixStar2";
					}else{
						ratingObj[x] = "fixStar1";
					}				
				}else{
					ratingObj[x]  = "";
				}
			
			}
			return ratingObj;
		}else{
			return {};
		}
	},


	'getFrndsList' : function(){
		var data =  tagFriend1.getData();
	    var data1 = [];
		if(tagedFriends.length > 0){
			for(var i = 0 ; i < data.length ; i++){
				var temp = 0 ;
				for(var j = 0 ; j < tagedFriends.length; j++){
					if(tagedFriends[j].selectedUserId == data[i]._id){
						temp = 1;
						break;
					}
				}
				if(temp == 0 ){
					data1.push(data[i]);
				}
			}
		var resultFrnds = tagedFriends.reduce(function(memo, e1){
		var matches = memo.filter(function(e2){
			return e1.selectedUserId == e2.selectedUserId && e1.selectedUserId == e2.selectedUserId
		})
		if (matches.length == 0)
			memo.push(e1)
			return memo;
		}, []);

		tagedFriends = resultFrnds;

		// console.log('resultFrnds: ',resultFrnds);

			data = data1;
			var result =  {data,resultFrnds};
		}else{
			var result =  {data,resultFrnds};
		}
		// console.log('result: ',result);

	    return result;
	},
});

Template.descriptionTabContent.helpers({
	businessReviews(){
		var businessLink = FlowRouter.getParam('businessurl');
		if(Session.get('loadmore')){
				limitFollows = Session.get('loadmore');
			}else{
				limitFollows = 5;
			}
		var businessData= Business.findOne({"businessLink":businessLink});
		var allReviewsTotalCount = Review.find({"businessLink": businessLink},{sort: {reviewDate:-1}}).count();
		var allReviews = Review.find({"businessLink": businessLink},{sort: {"reviewDate": -1}, limit:limitFollows }).fetch();
		if(allReviews){
			if(allReviews.length < 5 || allReviews.length == allReviewsTotalCount){
				allReviews.showLoadMore = 'hideFollowButton';
			}else{
				allReviews.showLoadMore = '';
			}

			for(i=0; i<allReviews.length; i++){
				allReviews[i].userProfileUrl = generateURLid(allReviews[i].userId);	
				var newUserThree = Meteor.userId();
				if(newUserThree){
					if((Meteor.users.findOne({"_id": newUserThree}).roles[0] === 'admin') || (allReviews[i].userId === newUserThree)){
						allReviews[i].revEditButton = 'show';
					} else {
						allReviews[i].revEditButton = 'hide';
					}
				} else {
					allReviews[i].revEditButton = 'hide';
				}
				
				if(allReviews[i].reviewComment){
				// console.log("allReviews[i].reviewComment :",allReviews[i].reviewComment);
					if(allReviews[i].reviewComment.length > 300){
						var desc3 = allReviews[i].reviewComment.substring(0,300);
						var desc4 = allReviews[i].reviewComment.substring(300,allReviews[i].reviewComment.length);
						allReviews[i].ownerDesc3 = desc3;
						allReviews[i].ownerDesc4 = desc4;
					}
				}

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
						}else{
							allReviews[i].revProfilePic = "/users/profile/profile_image_dummy.svg";
						}
				}
				if(allReviews[i].tagedFriends && allReviews[i].tagedFriends.length != 0){
					allReviews[i].tagedFriendsValidate = true;
					var tagedFriendsArray = [];
					for(m=0;m<allReviews[i].tagedFriends.length;m++){
						var userTagObj = Meteor.users.findOne({"_id":allReviews[i].tagedFriends[m]});
						// console.log('userTagObj:',userTagObj);
						var dataImgUser = '';
						if (userTagObj) {

							if(userTagObj.profile.userProfilePic){
								var imgData = UserProfileStoreS3New.findOne({"_id":userTagObj.profile.userProfilePic});
								if(imgData)	{
									dataImgUser = imgData.url();
								}else{
									dataImgUser = '/users/profile/profile_image_dummy.svg';
								}
							}else{
								dataImgUser = '/users/profile/profile_image_dummy.svg';
							}
							var obj = {
								'tagedFriends'   : userTagObj.profile.name,
								'tagedFriendsUrl': generateURLid(allReviews[i].tagedFriends[m]),
								'userTagged':allReviews[i].tagedFriends[m],
								'imagePath':dataImgUser,
							}

						}else{
								dataImgUser = '/users/profile/profile_image_dummy.svg';

						}


						tagedFriendsArray.push(obj);
					}
					allReviews[i].tagedFriendsArray = tagedFriendsArray;
				} else{
					allReviews[i].tagedFriendsValidate = false;
				}
				
				if(userObj){
					allReviews[i].username = userObj.profile.name;
					allReviews[i].area = userObj.profile.area;
					allReviews[i].city = userObj.profile.city;
					if(!allReviews[i].username){
						allReviews[i].username = "Anonymous User";
					}
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
					}
				}

				var meteorUserUn = Meteor.userId();
				if(meteorUserUn){
					if((Meteor.users.findOne({"_id": meteorUserUn}).roles[0] === 'admin') || allReviews[i].userId === meteorUserUn){
						allReviews[i].deleteButton = 'showDeleteButton';
					} else{
						allReviews[i].deleteButton = '';
					}
				} else{
					allReviews[i].deleteButton = '';
				}


				if(allReviews[i].reviewImages){
					for(j=0;j<allReviews[i].reviewImages.length;j++){
						var reviewPhoto = UserReviewStoreS3New.findOne({"_id":allReviews[i].reviewImages[j].img});
						if(reviewPhoto){
							if(reviewPhoto.copies){
								if(reviewPhoto.original.type == 'image/png'){
									allReviews[i].reviewImages[j].checkpngImg = '';
								}else{
									allReviews[i].reviewImages[j].checkpngImg = 'bgGif';
								}
								allReviews[i].reviewImages[j].imagePath = reviewPhoto.url();								
							}
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
				if(Roles.userIsInRole(Meteor.userId(), ['user'])){
					allReviews[i].userCommentBox = 'show';
				}else{
					if(businessData.businessOwnerId === Meteor.userId()){
						allReviews[i].userCommentBox = 'show';
					}else{
						allReviews[i].userCommentBox = 'hide';
					}
				}
				allReviews[i].reviewDateAgo = moment(allReviews[i].reviewDate).fromNow();

				if(allReviews[i].commentReply){					
					allReviews[i].commentReply.sort(function(a,b){
						commentId1 = a.commentId;
						commentId2 = b.commentId;
						if(commentId1 > commentId2) return -1;
						if(commentId1 < commentId2) return 1;
						return 0;
					});
				}
				if(allReviews[i].userComments){
					allReviews[i].userCommentsCount = allReviews[i].userComments.length;
					allReviews[i].userComments = allReviews[i].userComments.reverse();
					for(k=0;k<allReviews[i].userComments.length; k++){
						var userId  = allReviews[i].userComments[k].userId;
						var userObj = Meteor.users.findOne({"_id":userId});

						var newUserIdOne = Meteor.userId();
						if(newUserIdOne){
							if((Meteor.users.findOne({"_id": newUserIdOne}).roles[0] === 'admin') || userId === newUserIdOne){
								allReviews[i].userComments[k].deleEditBlock = 'show';
							} else{
								allReviews[i].userComments[k].deleEditBlock = 'hide';
							}
						} else{
							allReviews[i].userComments[k].deleEditBlock = 'hide';
						}

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
						if(allReviews[i].commentReply){
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
											var pic = UserProfileStoreS3New.findOne({"_id":userObj1.profile.userProfilePic});
											if(pic){
												replyObj.replyProfileImgPath = pic.url();	
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

										// if(checkCommentReplyLike){
										// 	replyObj.replyLikeUnlike = true;	
										// }else{
										// 	replyObj.replyLikeUnlike = false;
										// }
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
						if(allReviews[i].userComments[k]){
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
				}
			}//end i loop
			var totalReview = allReviews.length;
			Session.set('totalReview', totalReview);
		return allReviews;
		}
	},
});


Template.userReviewTemplate.onRendered(function(){

	$(document).ready(function(){
		$('.reComtOne').each(function(){
			var i = 0;
			$(this).children('.commentReplyArr').each(function(){
				if(i>1){
					$(this).hide();
				}
				i++;
			});
			if($(this).children('.commentReplyArr').length > 2){
				if($(this).children('.showreplyCmt').length == 0){
					$(this).append("<div class='col-lg-3 pull-right showreplyCmt'> Show all replies </div>");
				}
			}
		});

	});

});


Template.userReviewTemplate.events({
	'change #reviewImgfilesEdit' : function(event){
			$('#reviewImgtext').hide();
			// files = event.target.files; // FileList object\
			var file = event.target.files; // FileList object\
			// console.log('file ',file);
			for(var j = 0 , f1;f1 = file[j]; j++){
				filesR[counterImg] = file[j];
				counterImg = counterImg + 1;
			}
			// console.log('filesR ',filesR);

			// Loop through the FileList and render image files as thumbnails.
			for (var i = 0, f; f = file[i]; i++) {
				// filesR[i].businessLink = Session.get('SessionBusinessLink');
			    // Only process image files.
			    if (!f.type.match('image.*')) {
			      continue;
				}
				var reader = new FileReader();
				// Closure to capture the file information.
			    reader.onload = (function(theFile) {
			      return function(e) {
			        // Render thumbnail.
			        var span = document.createElement('span');
			        span.innerHTML = ['<img class="draggedReviewImg" src="', e.target.result,
			                          '" title="', escape(theFile.name), '"/>'].join('');
			        document.getElementById('reviewImglistEdit').insertBefore(span, null);
			      };
			    })(f); //end of onload
			    // Read in the image file as a data URL.
			    reader.readAsDataURL(f);		    
			}// end of for loop
		},	
	'click .showreplyCmt' : function(event){
		event.preventDefault();
		var thisElem = event.currentTarget;

		$(thisElem).siblings('.commentReplyArr').slideDown();
		$(thisElem).removeClass('showreplyCmt');
		$(thisElem).addClass('hideReplyCmt');
		$(thisElem).text("Show Less replies");	

	},
	'click .hideReplyCmt' : function(event){
		event.preventDefault();
		var thisElem = event.currentTarget;

		$(thisElem).siblings('.commentReplyArr').slideUp();
		$(thisElem).siblings('.commentReplyArr').first().slideDown();
		$(thisElem).siblings('.commentReplyArr').first().next().slideDown();

		$(thisElem).text("Show all replies");

		$(thisElem).removeClass('hideReplyCmt');
		$(thisElem).addClass('showreplyCmt');

	},

	"keydown #searchFrndsEdit":function(e){
		//For Up and Down arrow selection in dropdown
		$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
		
		if(e.keyCode == 9) {
			e.preventDefault();
		}

		var current_index = $('.selectedSearch').index();
		// console.log("current_index: ",current_index);
		
		var $number_list = $('.tagFrndUlFrieldList');
		// console.log("$number_list: ",$number_list);
		
		var $options = $number_list.find('.tagFrndLiFrieldList');
		// console.log("$options: ",$options);
		
		var items_total = $options.length;
		// console.log("items_total: ",items_total);
		if (e.keyCode == 40) {
	        if (current_index + 1 < items_total) {
	            current_index++;
	            change_selection();
	        }
	    } else if (e.keyCode == 38) {
	        if (current_index > 0) {
	            current_index--;
	            change_selection();
	        }
	    }
	    var selectedUser = $('.selectedSearch').attr('data-username');
		var frndId = $('.selectedSearch').attr('id');
		var userImage = $('.selectedSearch').attr('data-photo');


	    if(e.keyCode===9 &&selectedUser.length>0){
	    	selectedUser = selectedUser.trim();
	    	tagedFriends.push({'selectedUser':selectedUser, 'selectedUserId':frndId, 'userImage':userImage});

	    }

	    function change_selection() {
			$options.removeClass('selectedSearch');
			$options.eq(current_index).addClass('selectedSearch');
			// To scroll the selection
			var $s = $('.tagFrndUlFrieldList');
			var optionTop = $('.selectedSearch').offset().top;
			var selectTop = $s.offset().top;
			$s.scrollTop($s.scrollTop() + (optionTop - selectTop)-4);
		}
	},
	"keyup #searchFrndsEdit": _.throttle(function(e) {
		if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 37 && e.keyCode != 39){
			$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
			var text = $(e.currentTarget).val();
			// console.log('text:',text);
			if (text) {
				$('.tagFrndUlFrieldList').css('display','block');
		// $('.tagFrndUlFrieldList').css('display','none');

				tagFriend1.search(text);
			}
		}
	}, 200),
	// 'click .tagFrndLiDiv':function(e){
	// 	event.preventDefault();
	// 	$('#searchFrndsEdit').val();
	// 	console.log('#searchFrndList:',$('#searchFrndsEdit').val());
	// },
	'click #searchFrndsEdit': function(e){
		e.stopPropagation();
		$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
	},
	"click .tagFrndLiFrieldList" : function(e){
		var selectedUser = $(e.currentTarget).attr('data-userName');
		var frndId = $(e.currentTarget).attr('id');
		var userImage = $(e.currentTarget).attr('data-photo');
    	selectedUser = selectedUser.trim();
		tagedFriends.push({'selectedUser':selectedUser, 'selectedUserId':frndId, 'userImage':userImage});
		$('#searchFrndsEdit').trigger('keyup');
		$('#searchFrndsEdit').val('');
		// console.log('$(#searchFrndsEdit).val();',$('#searchFrndsEdit').val(''));
		$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
	},

	"click .bunchTagFrndCross":function(e){
		var userId = $(e.currentTarget).attr('data-userId');
		var tagfrnd = [];
		for(var i = 0 ; i < tagedFriends.length; i++ ){
			if(tagedFriends[i].selectedUserId != userId){
				tagfrnd.push(tagedFriends[i])
			}
		}
		$('#searchFrndsEdit').trigger('keyup');
		tagedFriends = tagfrnd;
	},
	// ============================================================
	// ============================================================
	// ============================================================

	'click .shareBussPageRev':function(event){
		var currentUserMail = $('#toVEmailRev').val();
		var currentUserNote = $('#toVAddNoteRev').val();
		var businessLink = FlowRouter.getParam('businessurl');
		var currentPath = Meteor.absoluteUrl(businessLink);
		var businessData = Business.findOne({"businessLink":businessLink});
		var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		if (currentUserMail==null||currentUserMail==""||!currentUserMail.match(nameRegex)) {
			Bert.alert('Please enter correct Email','danger','growl-top-right');
		} else {
			if(currentUserMail&&currentPath&&businessData){
				//============================================================
				// 			Notification Email / SMS / InApp
				//============================================================
				var currentUserId = Meteor.userId();
				var currentUser = Meteor.users.findOne({'_id':currentUserId});
	
				var admin = Meteor.users.findOne({'roles':'admin'});
				if(admin){
					var adminId = admin._id;
				}
	
				if(currentUser&&admin){
					var username = currentUser.profile.name;
					var date 		= new Date();
					var currentDate = moment(date).format('DD/MM/YYYY');
					var msgvariable = {
						'[username]' 		: username,
						'[currentDate]'		: currentDate,
						'[businessName]'	: businessData.businessTitle,
						'[currentPath]' 	: currentPath,
						'[note]'			: currentUserNote,
					   };
	
					var inputObj = {
						from         : adminId,
						to           : currentUserMail,
						templateName : 'Business Page Review Share',
						variables    : msgvariable,
					}
					sendPageShareMail(inputObj);
					$('#busPageShare').modal('hide');
					
				}
				
				//============================================================
				// 			End Notification Email / SMS / InApp
				//============================================================
			}
			$('#toVEmailRev').val('');
			$('#toVAddNoteRev').val('');
		}

		

	},
	'keypress .commenTxt': function(event){
		var userComment = $(event.currentTarget).val();
		var businessUrl = FlowRouter.getParam('businessurl');
		var reviewedUserId = $(event.currentTarget).attr('data-addedReviewUser');

		if(event.which === 13 && userComment){
			var id = event.currentTarget.id;
			Meteor.call('insertUserComment', id, userComment, function(error, result){
				if(error){
				}else{
					$(event.target).val('');
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
				    var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }
                    var reviewData = Review.findOne({"_id":id});
                    if(reviewData){
                      	var businessLink = reviewData.businessLink;
                      	var businessData = Business.findOne({"businessLink":businessLink});
                      	if(businessData){
                        	var vendormailId = businessData.businessOwnerId;
                        	var userDetail = Meteor.users.findOne({'_id':vendormailId});
                        	if(userDetail){
                        		var username 	= userDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[currentDate]'	: currentDate,
				   					'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businessUrl,
								    to           : vendormailId,
								    templateName : 'Vendor Review and Rating Comment',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessUrl,
									from         : adminId,
								    to           : vendormailId,
								    templateName : 'Vendor Review and Rating Comment',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj); 
		                    }
		                    if(reviewData.userComments){
	                      	  	var length = reviewData.userComments.length;
	                      	  	var userId = Meteor.userId();
		                      	var userVar    		= Meteor.users.findOne({'_id':userId});
		                      	var otherUserVar    = Meteor.users.findOne({'_id':reviewedUserId});
		                	  	if(userVar&&otherUserVar){
		                	  		var otherUsername 	= otherUserVar.profile.name;
			                		var otherDate 		= new Date();
			                		var othreCurrentDate = moment(otherDate).format('DD/MM/YYYY');
			                		var otherMsgvariable = {
										'[username]' 	: otherUsername,
					   					'[currentDate]'	: othreCurrentDate,
				   						'[businessName]': businessData.businessTitle
					               	};
									var inputObj = {
										notifPath	 : businessUrl,
									    to           : reviewedUserId,
									    templateName : 'Other User Review and Rating Comment',
									    variables    : otherMsgvariable,
									}
									sendInAppNotification(inputObj);
									var inputObj = {
										notifPath	 : businessUrl,
										from         : adminId,
									    to           : reviewedUserId,
									    templateName : 'Other User Review and Rating Comment',
									    variables    : otherMsgvariable,
									}
									sendMailNotification(inputObj);
									var username 	= userVar.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[currentDate]'	: currentDate,
				   						'[businessName]': businessData.businessTitle
					               	};
									var inputObj = {
										notifPath	 : businessUrl,
										from         : adminId,
									    to           : userId,
									    templateName : 'Current User Review and Rating Comment',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
	                      		}                    
		                    }
		                }
                	}
                	//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
				}
			});
		}
	},

	'click .heart' : function(event){

		var businessUrl = FlowRouter.getParam('businessurl');
		var likeid = event.currentTarget.id.split('-');
		var id = likeid[1];
		Meteor.call('insertReviewLike',id, function(error, result){
			if(error){
				// Bert.alert('Some technical issue happened... Your like is not registered.', 'danger', 'growl-top-right');
			}else{
				var heartColor = $(event.currentTarget).hasClass('orangeHeart');
				if(heartColor){
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
	                var businessData = Business.findOne({"businessLink":businessUrl});

				    if(admin){
				    	var adminId = admin._id;
				    }
	                var reviewData = Review.findOne({"_id":id});
	                if(reviewData){
	                  	if(businessData){
		                    var vendormailId = businessData.businessOwnerId;
		                    var userDetail = Meteor.users.findOne({'_id':vendormailId});
		                    if(userDetail){
								var userId 	= Meteor.userId();
								var userVar = Meteor.users.findOne({'_id':userId});

	                  			var reviewUserId 	= reviewData.userId;
								var reviewUserVar   = Meteor.users.findOne({'_id':reviewUserId});
								if(userVar&&reviewUserVar){
		                	  		var username 	= userDetail.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[LikeDate]'	: currentDate,
						   				'[businessName]': businessData.businessTitle

					               	};
									var inputObj = {
										notifPath	 : businessUrl,
									    to           : vendormailId,
									    templateName : 'Vendor Review and Rating Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
									var inputObj = {
										notifPath	 : businessUrl,
										from         : adminId,
									    to           : vendormailId,
									    templateName : 'Vendor Review and Rating Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
									var username 	= reviewUserVar.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[LikeDate]'	: currentDate,
						   				'[businessName]': businessData.businessTitle

					               	};
					               	if(userId!=reviewUserId){
										var inputObj = {
											notifPath	 : businessUrl,
										    to           : reviewUserId,
										    templateName : 'Other User Review and Rating Like',
										    variables    : msgvariable,
										}
										sendInAppNotification(inputObj);
										var inputObj = {
											notifPath	 : businessUrl,
											from         : adminId,
										    to           : reviewUserId,
										    templateName : 'Other User Review and Rating Like',
										    variables    : msgvariable,
										}
										sendMailNotification(inputObj);
									}
									var username 	= userVar.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[LikeDate]'	: currentDate,
						   				'[businessName]': businessData.businessTitle

					               	};
									var inputObj = {
										notifPath	 : businessUrl,
										from         : adminId,
									    to           : userId,
									    templateName : 'Current User Review and Rating Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
			                    }
			                }
	                  	}
	                }
	                //============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
				}
                $(this).removeClass('heart');
			}
		});
	},
	'click .orangeHeart' : function(event){
    	event.preventDefault();
		var businessUrl = FlowRouter.getParam('businessurl');
		var likeid = event.currentTarget.id.split('-');
		var id = likeid[1];
		Meteor.call('removeReviewLike',id, function(error, result){
			if(error){
				// Bert.alert('Some technical issue happened... Your like is not registered.', 'danger', 'growl-top-right');
			}else{
				
			}
		});
	},

	'click .busiDeleteRev' : function(event){
		event.preventDefault();
		var delid = event.currentTarget.id.split('-');
		var id = delid[1];
		Meteor.call('deleteReview',id, function(error, result){
			if(error){
				// Bert.alert('Some technical issue happened... You couldn\'t delete this review.', 'danger', 'growl-top-right');
			}else{
				$('.modal-backdrop').hide();
				$('.passwordWrongSpan').text("");
           		$('.passwordWrongSpan').removeClass('reviewWrngErrorMsg');	
			}
		});
	},
	'click .userFollow' : function(event){
		event.preventDefault();
		var followid = event.currentTarget.id.split('-');
		var followUserId = followid[1];
		var userId = Meteor.userId();
		var verifyFollow = FollowUser.findOne({"userId": Meteor.userId(),"followUserId": followUserId});
		
		if(verifyFollow){
			var id = verifyFollow._id;
			Meteor.call('removeUserFollow',id,function(error,result){
				if (error) {
					console.log(error);
				}else{
					var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }//admin

	                	var userVar    = Meteor.users.findOne({'_id':followUserId});
	                	if(userVar){
	        				var username 	= userVar.profile.name;
	                		var date 		= new Date();
	                		var currentDate = moment(date).format('DD/MM/YYYY');
	                		var msgvariable = {
								'[username]' 	: username,
			   					'[currentDate]'	: currentDate
			               	};
							var inputObj = {
							    to           : followUserId,
							    templateName : 'UnFollow',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								from         : adminId,
							    to           : followUserId,
							    templateName : 'UnFollow',
							    variables    : msgvariable,
							}

							sendMailNotification(inputObj);
	                	}//userVar
				}
			});
		}else{
			Meteor.call('insertUserFollow',followUserId, function(error, result){
			if(error){
				// Bert.alert('Some technical issue happened... You couldn\'t follow', 'danger', 'growl-top-right');
			}else{
				var admin = Meteor.users.findOne({'roles':'admin'});
			    if(admin){
			    	var adminId = admin._id;
			    }//admin 
				var getResult = result;
				var followData = FollowUser.findOne({"_id":getResult});
              	if(followData){
                	var usermailId = followData.followUserId;
                	var userVar    = Meteor.users.findOne({'_id':usermailId});
                	if(userVar){
        				var username 	= userVar.profile.name;
                		var date 		= new Date();
                		var currentDate = moment(date).format('DD/MM/YYYY');
                		var msgvariable = {
							'[username]' 	: username,
		   					'[currentDate]'	: currentDate
		               	};
						var inputObj = {
						    to           : usermailId,
						    templateName : 'Follow',
						    variables    : msgvariable,
						}
						sendInAppNotification(inputObj);
						var inputObj = {
							from         : adminId,
						    to           : usermailId,
						    templateName : 'Follow',
						    variables    : msgvariable,
						}
						sendMailNotification(inputObj);
                	}//userVar
              	}//followData 
			}
		});
		}
	},
	'click .commentReply': function(event){
		event.preventDefault();
		$(event.currentTarget).parent().siblings('.commentReplyInputBox').toggle();
	},
	'click .usrCommentReply': function(event){
		event.preventDefault();
		$(event.currentTarget).parent().parent().siblings('.commentReplyInputBox').toggle();
	},
	'keypress .commentReplyInput': function(event){
		var businessUrl = FlowRouter.getParam('businessurl');
		var commentReply = $(event.currentTarget).val().trim();
		if(event.which == 13 && commentReply){
			var reviewId 		= $(event.currentTarget).attr("data-reviewId");
			var reviewUser  	= $(event.currentTarget).attr("data-reviewPostedBy");
			var commentId 		= $(event.currentTarget).attr("data-commentId");
			var businesslink 	= $(event.currentTarget).attr("data-businesslink");
			var currenCommtUser = $(event.currentTarget).attr('data-userCommentId');
			Meteor.call('insertCommentReply', commentReply, reviewId, reviewUser, commentId, businesslink, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your comment is not posted.', 'danger', 'growl-top-right');
				}else{
					$(event.currentTarget).val('');
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
	                var businessData = Business.findOne({"businessLink":businessUrl});
				    if(admin){
				    	var adminId = admin._id;
				    }
	                var reviewData = Review.findOne({"_id":reviewId});
	                if(reviewData){
	                  	if(businessData){
		                    var vendorId = businessData.businessOwnerId;
		                    var userDetail = Meteor.users.findOne({'_id':vendorId});
		                    if(userDetail){
								var userId 	= Meteor.userId();
								var userVar = Meteor.users.findOne({'_id':userId});
								var reviewUserVar   = Meteor.users.findOne({'_id':reviewUser});
								var reviewCmntRplyUsr   = Meteor.users.findOne({'_id':currenCommtUser});
								if(userVar&&reviewUserVar&&reviewCmntRplyUsr){
		                	  		var username 	= userDetail.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[LikeDate]'	: currentDate,
						   				'[businessName]': businessData.businessTitle
					               	};
									var inputObj = {
										notifPath	 : businessUrl,
									    to           : vendorId,
									    templateName : 'Vendor Review Comment Reply',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
									var inputObj = {
										notifPath	 : businessUrl,
										from         : adminId,
									    to           : vendorId,
									    templateName : 'Vendor Review Comment Reply',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
									var username 	= reviewUserVar.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[LikeDate]'	: currentDate,
						   				'[businessName]': businessData.businessTitle

					               	};
					               	if(userId!=reviewUser){
										var inputObj = {
											notifPath	 : businessUrl,
										    to           : reviewUser,
										    templateName : 'User Added Review and Rating',
										    variables    : msgvariable,
										}
										sendInAppNotification(inputObj);
										var inputObj = {
											notifPath	 : businessUrl,
											from         : adminId,
										    to           : reviewUser,
										    templateName : 'User Added Review and Rating',
										    variables    : msgvariable,
										}
										sendMailNotification(inputObj);
									}
									var username 	= reviewCmntRplyUsr.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[LikeDate]'	: currentDate,
						   				'[businessName]': businessData.businessTitle
					               	};
					               	if(userId!=currenCommtUser){
										var inputObj = {
											notifPath	 : businessUrl,
										    to           : currenCommtUser,
										    templateName : 'User Review Comment',
										    variables    : msgvariable,
										}
										sendInAppNotification(inputObj);
										var inputObj = {
											notifPath	 : businessUrl,
											from         : adminId,
										    to           : currenCommtUser,
										    templateName : 'User Review Comment',
										    variables    : msgvariable,
										}
										sendMailNotification(inputObj);
									}
									// Send Notification, Mail and SMS to Current User
									var username 	= userVar.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[LikeDate]'	: currentDate,
						   				'[businessName]': businessData.businessTitle
					               	};
									var inputObj = {
										notifPath	 : businessUrl,
										from         : adminId,
									    to           : userId,
									    templateName : 'Current User Review Comment Reply',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
			                    }
			                }
	                  	}
	                }
	                //============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
				}
			});
		}
	},

	'keypress .commentReplyEditInput': function(event){
		var replyComment = $(event.currentTarget).val();
		if(event.which === 13 && replyComment){
			var id = $(event.target).attr('id');
			var commentId = parseInt($(event.target).attr('data-replyId'));
			Meteor.call('updateReplyEdit', id, replyComment,commentId, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your comment is not posted.', 'danger', 'growl-top-right');
				}else{
					$('.userReplyText-'+commentId).css('display','block');
					$('.commentReplyInputBox-'+commentId).css('display','none');
					$('.reviewReplyCancel-'+commentId).css('display','none');
				}
			});
		}
	},

	'click .userRevCommentDel' : function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		var commentId = parseInt($(event.target).attr('data-commentid'));
		var reviewID = $(event.target).parent().parent().parent().parent().parent().siblings('.commentReplyInputBox').find('.commentReplyInput').attr('data-reviewId');
		var postedByID = $(event.target).parent().parent().parent().parent().parent().siblings('.commentReplyInputBox').find('.commentReplyInput').attr('data-reviewPostedBy');
		var businesLink = $(event.target).parent().parent().parent().parent().parent().siblings('.commentReplyInputBox').find('.commentReplyInput').attr('data-businesslink');
		Meteor.call('deletecomment',id,commentId,reviewID,postedByID,businesLink, function(error, result){
			if(error){
				Bert.alert('Some technical issue happened... You couldn\'t delete this review.', 'danger', 'growl-top-right');
			}else{
				$('.modal-backdrop').hide();
				$('.modaldelete').modal('hide');
			}
		});
	},

	'click .userReviewReplyDel' : function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		var commentId = parseInt($(event.target).attr('data-commentid'));
		var postedByID = $(event.target).attr('data-reviewPostedBy');
		var businesLink = $(event.target).attr('data-businesslink');
		var cId =  $(event.target).attr('data-cId');
		Meteor.call('deleteReply',id,commentId,cId,postedByID,businesLink, function(error, result){
			if(error){
				Bert.alert('Some technical issue happened... You couldn\'t delete this review.', 'danger', 'growl-top-right');
			}else{
				$('.modaldelete').modal('hide');
				$('.modal-backdrop').hide();
			}
		});
	},

	'click .userRevCommEdit':function(event){
		event.preventDefault();
		var id = event.target.id;
		$('.userTextComment_'+id).css('display','none');
		$('.editCommentBox_'+id).css('display','block');
		$('.reviewCommCancel-'+id).css('display','block');
	},

	'click .userRevRepEdit':function(event){
		event.preventDefault();
		var id = event.target.id;
		$('.userReplyText-'+id).css('display','none');
		$('.commentReplyInputBox-'+id).css('display','block');
		$('.reviewReplyCancel-'+id).css('display','block');
	},
	'click .userRevComEdit':function(event){
		// TO edit the Review
		event.preventDefault();
		var id = $(event.target).attr('id');
		$('.reviewImages-'+id).css('display','block');
		$('.userReviewTempcommTxt-'+id).css('display','none');
		$('.editBoxCommentRev-'+id).css('display','block');

		// $('#searchFrndsEdit').focus();
		// $('#searchFrndsEdit').focusout();

		// $('.editBoxCommentRev-'+id).children('.editReviewTextArea').focus();

		$('.tagFrnd-'+id).css('display','block');
		$('.starRatingblock-'+id).css('display','block');
		$('.reviewCancel-'+id).css('display','block');
		$('.reviewBusSave-'+id).css('display','block');
		$('.bus-page-edit-outer1-'+id).css('display','inline');
		$('.bus-page-edit-outerFrnd1-'+id).css('display','inline-block');
		$('.tagedFrndDivPre-'+id).css('display','none');
		$('.tagFrndUlFrieldList').css('display','none');
		$('.userRevTempImage1').css('display','none');
		$('.userCommRevTemp').css('display','none');

		

		// console.log("1tagedFriends: ",tagedFriends);

		tagedFriends = [];
		var userData = Review.findOne({"_id": id});
		for(i=0;i<userData.tagedFriends.length;i++){
			var userVar = Meteor.users.findOne({"_id":userData.tagedFriends[i]});
			var userImg = "";
			if(userVar.profile.userProfilePic){
				var imgData = UserProfileStoreS3New.findOne({"_id":userVar.profile.userProfilePic});
				if(imgData)	{
				var userImg = imgData.url();
				}else{
				var userImg = '/users/profile/profile_image_dummy.svg';
				}
			} else{
				var userImg = '/users/profile/profile_image_dummy.svg';
			}
			var obj = 	{
							'selectedUser':userVar.profile.name,
							'selectedUserId':userData.tagedFriends[i], 
							'userImage':userImg,
						}
			tagedFriends.push(obj);
		}
		// tagedFriends = [];
		tagFriend1.search('');
		
	},
	'click .bus-page-edit-outer1': function(event){
		var currentImage = $(event.currentTarget).attr('data-imgId');
		var currentId = $(event.currentTarget).attr('data-reviewId');
		if(currentImage && currentId){
			Meteor.call('removePublishedReviewImage', currentId, currentImage);
		}
	},
	'click .bus-page-edit-outerFrnd1': function(event){
		var taggeduser = $(event.currentTarget).attr('data-tagedId');
		var currentId = $(event.currentTarget).attr('data-reviewId');
		if(taggeduser && currentId){
			Meteor.call('removePublishedReviewUser', currentId, taggeduser);
		}
	},
	'click .reviewReplyCancel':function(event){
		event.preventDefault();
		var id = $(event.target).attr('id');
		$('.userReplyText-'+id).css('display','block');
		$('.commentReplyInputBox-'+id).css('display','none');
		$('.reviewReplyCancel-'+id).css('display','none');
		
	},
	'click .reviewCommCancel':function(event){
		event.preventDefault();
		var id = $(event.target).attr('id');
		$('.userTextComment_'+id).css('display','block');
		$('.editCommentBox_'+id).css('display','none');
		$('.reviewCommCancel-'+id).css('display','none');
	},
	'click .reviewCancel':function(event){
		event.preventDefault();
		var id = $(event.target).attr('id');
		$('.userReviewTempcommTxt-'+id).css('display','block');
		$('.editBoxCommentRev-'+id).css('display','none');
		$('.starRatingblock-'+id).css('display','none');
		$('.reviewCancel-'+id).css('display','none');
		$('.reviewBusSave-'+id).css('display','none');
		$('.bus-page-edit-outer1-'+id).css('display','none');
		$('.bus-page-edit-outerFrnd1-'+id).css('display','none');
		$('.tagFrnd-'+id).css('display','none');
		$('.tagFrnd').css('display','none');
		$('.tagedFrndDivPre-'+id).css('display','block');
		$('.reviewImages-'+id).css('display','none');
		$('.userRevTempImage1').css('display','block');
		$('.userCommRevTemp').css('display','block');
		$('#searchFrndsEdit').val('');

		tagedFriends = [];
	},
	'keypress .editReviewTextArea': function(event){
		var revComment = $(event.currentTarget).val();
		if(event.which === 13 && revComment){
			var id = event.currentTarget.id;
			var taggedPpl = tagedFriends;
			Meteor.call('updateRevCommentEdit', id, revComment, taggedPpl, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your review is not posted.', 'danger', 'growl-top-right');
				}else{
					$('.userReviewTempcommTxt-'+id).css('display','block');
					$('.editBoxCommentRev-'+id).css('display','none');
					$('.reviewCancel-'+id).css('display','none');
					$('.reviewBusSave-'+id).css('display','none');
					$('.bus-page-edit-outer1-'+id).css('display','none');
					$('.bus-page-edit-outerFrnd1-'+id).css('display','none');
					$('.tagFrnd-'+id).css('display','none');
					$('.tagFrnd').css('display','none');
					$('.tagedFrndDivPre-'+id).css('display','block');
					tagedFriends = [];
		
				}
			});
		}
	},


	'click .reviewBusSave': function(event){
		event.preventDefault();
		var revComment = $(event.currentTarget).parent().siblings('.editBoxComment').children('.editReviewTextArea').val();
		if(revComment){
			var id = event.currentTarget.id;
			var taggedPpl = tagedFriends;
			
			var starRating = $('.starRatingWrapper .fixStar1').length;
			// console.log('starRating description: ', starRating);
			starRating = starRating + $('.starRatingWrapper .fixStar2').length;
			// console.log('starRating: ', starRating);
			var rating = parseFloat(starRating) / 2;
			// console.log('rating: ', rating);
			// console.log("filesR: ",filesR)
			if(filesR){
				for(i = 0 ; i < filesR.length; i++){		
					Resizer.resize(filesR[i], {width: 300, height: 300, cropSquare: false}, function(err, file) {
						if(err){
							console.log('err ' , err.message);
						}else{
							UserReviewStoreS3New.insert(file, function (err, fileObj) {
						        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
						        if(err){
						        	console.log('Error : ' + err.message);
						        }else{
						        	var imgId =  fileObj._id ;
						        	// console.log("imgId: ",imgId);
							        Meteor.call("updateReviewBulkImg", id, imgId,
							          function(error1, result1) { 
							              if(error1) {
							                console.log ('Error Message: ' + error ); 
							              }else{
											// console.log('img upload ', fileObj._id);	
											// console.log('img added');
											$('.publishReview').show();
											$('.openReviewBox').hide();
											$('.reviewImages').hide();
											$('#searchFrndsEdit').val('');
											event.target.review.value	= '';
							              }
							        });

						        }
						    });
						}
					});
				}
				filesR = [];
				counterImg = 0;
				$('#reviewImglistEdit').empty();
				$('#reviewImgfilesEdit').val('');
			}
			if(revComment.length >=0 && revComment.length<=140){

				$('.passwordWrongSpans').text("Your comment is too short, please write min 140 characters.");
	            $('.passwordWrongSpans').addClass('passwordWrongWar');
				// $('.openReviewBox').show();
				// $('.publishReview').hide();
			}else{
				Meteor.call('updateRevCommentEdit', id, revComment, taggedPpl, rating, function(error, result){
					if(error){
						Bert.alert('Some technical issue happened... Your review is not posted.', 'danger', 'growl-top-right');
					}else{

						$('.userReviewTempcommTxt-'+id).css('display','block');
						$('.editBoxCommentRev-'+id).css('display','none');
						$('.reviewCancel-'+id).css('display','none');
						$('.starRatingblock-'+id).css('display','none');
						$('.reviewBusSave-'+id).css('display','none');
						$('.bus-page-edit-outer1-'+id).css('display','none');
						$('.bus-page-edit-outerFrnd1-'+id).css('display','none');
						$('.tagFrnd-'+id).css('display','none');
						$('.tagFrnd').css('display','none');
						$('.tagedFrndDivPre-'+id).css('display','block');
						$('.reviewImages-'+id).css('display','none');
						$('.userRevTempImage1').css('display','block');
						$('.userCommRevTemp').css('display','block');
						$('#searchFrndsEdit').val('');

						tagedFriends = [];
						// console.log('tagedFriends:',tagedFriends);
						
					}
				});
			}
		}else{
			swal({
			  title: 'Please write review to save!',
			  // text: 'You will not be able to recover this imaginary file!',
			  type: 'warning',
			  // showCancelButton: true,
			  confirmButtonColor: '#dd6b55',
			  // cancelButtonColor: '#d44',
			  confirmButtonText: 'Okey!',
			  // cancelButtonText: 'No, keet it',
			  closeOnConfirm: false
			});
		}
	},
	'keypress .editCommentInput': function(event){
		var userComment = $(event.currentTarget).val();
		if(event.which === 13 && userComment){
			var id = event.currentTarget.id;
			var finalId = id.split('-');
			var commentId = parseInt($(event.target).attr('data-commentId'));
			Meteor.call('updateCommentEdit', finalId[1], userComment,commentId, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your comment is not posted.', 'danger', 'growl-top-right');
				}else{
					$('.userTextComment_'+commentId).css('display','block');
					$('.editCommentBox_'+commentId).css('display','none');
					$('.reviewCommCancel-'+commentId).css('display','none');
				}
			});
		}
	},
});
Template.descriptionTabContent.events({
	'click .loadmore': function(event){
		event.preventDefault();
		if(Session.get('loadmore')){			
			var currentLimit = Session.get('loadmore');
			var newLimit = currentLimit + 5;
		}else{
			var newLimit = 10;
		}
		Session.set('loadmore',newLimit);
	},
});



$(document).on("click",function() {
    if( $(".tagFrndUlFrieldList").hasClass('searchDisplayShow')&&!($("#searchFrnds").is(":focus"))){
		$('.tagFrndUlFrieldList').addClass('searchDisplayHide').removeClass('searchDisplayShow');
	}
	if( $(".tagFrndUl").hasClass('searchDisplayShow')&&!($("#searchFrnds").is(":focus"))){
		$('.tagFrndUl').addClass('searchDisplayHide').removeClass('searchDisplayShow');
    }
});