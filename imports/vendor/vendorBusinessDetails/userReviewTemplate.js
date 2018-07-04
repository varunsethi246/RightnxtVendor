import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { ReviewCommentLikes } from '/imports/api/reviewCommentLikesMaster.js';
import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { UserProfileStoreS3New } from '/client/cfsjs/UserProfileS3.js';


var filesR = [];
var counterImg = 0;

Template.userReviewTemplate.helpers({
	userLoadmoreCmmnt(dataIndex){
		if(dataIndex < 2){
			return true;
		} else{
			return false;
		}
	},
	userLoadmoreCmmntBtn(data){
		if(data){
			if(data.length > 2){
				return true;
			} else{
				return false;
			}
		}else{
			return false;
		}
		
	},
});





Template.userReviewTemplate.events({
	'keydown .editReviewOneTime':function(event){
      setTimeout(function() {
         var comment = $('.editReviewOneTime').val();
         if(comment){
            var commentlen = comment.length;
            var remainText = 140 - commentlen;
            if(remainText < 0){
	            $('.textRemain').css('display','none');
            }else{
	            $('.textRemain').css('display','block');
	            $('.textRemain').text(remainText + ' /140');
            }
         }else{
            $('.textRemain').text('0 /140');
         }
      }, 1);
   },
	
	'click .showMoreCommntDiv': function(event){
		// To Expant All comments
		var currentClass = $(event.currentTarget).parent().siblings().children();
		currentClass.removeClass('showMoreCommntDivNone');

		// To Change Buttons
		$(event.currentTarget).parent().css('display','none');
		$(event.currentTarget).parent().siblings('showLessCommnt').css('display','block');
	},


	'click .review-read-more': function(event){
		$('.ownerDesc4').show();
		$('.review-read-less').show();
		$('.review-read-more').hide();
	},

	'click .review-read-less': function(event){
		$('.ownerDesc4').hide();
		$('.review-read-less').hide();
		$('.review-read-more').show();
	},


	'click .focusInput' : function(event){
		$('.commentReplyEditInput').focus();
	},
	'click .commentLike' : function(event){
		var businessLink 		= $(event.currentTarget).parent().parent().parent().parent().attr('data-businesslink');
		var reviewPostedByUser 	= $(event.currentTarget).parent().parent().parent().parent().attr('data-reviewpostedby');
		var reviewId 			= $(event.currentTarget).parent().parent().parent().parent().attr('data-reviewid');
		var commentId 			= $(event.currentTarget).parent().parent().parent().parent().attr('data-commentid');	
		// console.log('businessLink: '+businessLink+' | reviewPostedByUser: '+reviewPostedByUser+' | reviewId: '+reviewId+' | commentId: '+commentId+' |');	
		var currenCommtUser = $(event.currentTarget).attr('data-userCommentId');
		var userId 	= Meteor.userId();

		var checkReviewCommentLike = ReviewCommentLikes.findOne({
			"businessLink"		: businessLink,
			"reviewPostedBy"	: reviewPostedByUser,
			"reviewId"			: reviewId,
			"commentId"			: commentId,
			"replyId"			: '',			
			"likedByUserId"		: Meteor.userId(),  
		});
		
		Meteor.call('insertReviewCommentLike',businessLink,reviewPostedByUser,reviewId,commentId, function(err,rslt){
			if(err){
				console.log('Error: ', err);
			}else{
				if(!checkReviewCommentLike){
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
	                var businessData = Business.findOne({"businessLink":businessLink});
				    if(admin){
				    	var adminId = admin._id;
				    }


	              	if(businessData){
	                    var vendorId = businessData.businessOwnerId;
	                    var userDetail = Meteor.users.findOne({'_id':vendorId});
	                    if(userDetail){
							var userVar = Meteor.users.findOne({'_id':userId});
							var reviewUserVar   = Meteor.users.findOne({'_id':reviewPostedByUser});
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
									notifPath	 : businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment Like',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

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
									notifPath	 : businessLink,
									from         : adminId,
								    to           : userId,
								    templateName : 'Current User Review Comment Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								// Send Notification, Mail and SMS to Only User that added Review
								var username 	= reviewUserVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=reviewPostedByUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : reviewPostedByUser,
									    templateName : 'User Comment Review and Rating Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : reviewPostedByUser,
									    templateName : 'User Comment Review and Rating Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}


								// Send Notification, Mail and SMS to Only User that added Review Comment
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
										notifPath	 : businessLink,
									    to           : currenCommtUser,
									    templateName : 'User Review Comment Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : currenCommtUser,
									    templateName : 'User Review Comment Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}

								

		                    }
		                }
	              	}
				}
			}
		});
	},

	'click .commentReplyLike':function(event){
		var businessLink 		= $(event.currentTarget).parent().parent().parent().parent().parent().attr('data-businesslink');
		var reviewPostedByUser 	= $(event.currentTarget).parent().parent().parent().parent().parent().attr('data-reviewpostedby');
		var reviewId 			= $(event.currentTarget).parent().parent().parent().parent().parent().attr('data-reviewid');
		var commentId 			= $(event.currentTarget).parent().parent().parent().parent().parent().attr('data-commentid');		
		var replyId 			= $(event.currentTarget).parent().parent().attr('data-replyid');
		
		var commentPostedByUser = $(event.currentTarget).attr('data-commentPostedUser');
		var commentReplyPostedUser = $(event.currentTarget).attr('data-commentReplyPostedUser');
		var userId 	= Meteor.userId();
		var notofData =  ReviewCommentLikes.findOne({"businessLink":businessLink,"reviewPostedBy":reviewPostedByUser,"reviewId":reviewId,"likedByUserId":userId,"commentId":commentId,"replyId":replyId});
		
		Meteor.call('insertReviewCommentReplyLike',businessLink,reviewPostedByUser,reviewId,replyId,commentId, function(err,rslt){
			if(err){
				console.log('Error: ', err);
			}else{
				if(!notofData){
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
	                var businessData = Business.findOne({"businessLink":businessLink});
				    if(admin){
				    	var adminId = admin._id;
				    }

	              	if(businessData){
	                    var vendorId = businessData.businessOwnerId;
	                    var userDetail = Meteor.users.findOne({'_id':vendorId});
	                    if(userDetail){
							var reviewUserVar   = Meteor.users.findOne({'_id':reviewPostedByUser});
							var reviewCmntUsr   = Meteor.users.findOne({'_id':commentPostedByUser});
							var reviewCmntRplyUsr   = Meteor.users.findOne({'_id':commentReplyPostedUser});
							var userVar = Meteor.users.findOne({'_id':userId});

							
							// Send Notification, Mail and SMS to Vendor
							if(userVar&&reviewUserVar&&reviewCmntRplyUsr&&reviewCmntUsr){
	                	  		var username 	= userDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment SubReply Like',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment SubReply Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

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
									notifPath	 : businessLink,
									from         : adminId,
								    to           : userId,
								    templateName : 'Current User Review Comment Reply Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								// Send Notification, Mail and SMS to Only User that added Review
								var username 	= reviewUserVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=reviewPostedByUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : reviewPostedByUser,
									    templateName : 'User Added Review and Rating SubReply Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : reviewPostedByUser,
									    templateName : 'User Added Review and Rating SubReply Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}


								// Send Notification, Mail and SMS to Only User that added Review Comment
								var username 	= reviewCmntUsr.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=commentPostedByUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : commentPostedByUser,
									    templateName : 'User Review Comment SubReply Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : commentPostedByUser,
									    templateName : 'User Review Comment SubReply Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}

								// Send Notification, Mail and SMS to Only User that added Review Comment Reply
								var username 	= reviewCmntRplyUsr.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=commentReplyPostedUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : commentReplyPostedUser,
									    templateName : 'User Added Review Reply SubReply Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : commentReplyPostedUser,
									    templateName : 'User Added Review Reply SubReply Like',
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


			}
		});
	},

	'click .unuserLike': function(event){
		if(!Meteor.userId()){
			$('#loginModal').modal('show');
			$('.loginScreen').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.genLoginSignup').show();
			$('.thankyouscreen').hide();
			$('.signUpBox').hide();
		}
	},

	'click .busPagefbShare':function(event){
		var id = event.currentTarget.id;
		var url = window.location.href;
		var reviewData = Review.findOne({'_id':id});
		if(reviewData){
			var title       = reviewData.businessLink;
			var description = reviewData.reviewComment;

			var businessData = Business.findOne({'businessLink':title});
			if(businessData){
				if(businessData.businessImages){
					var pic = BusinessImgUploadS3.findOne({"_id":businessData.businessImages[0].img});
					if(pic){
						businessData.businessImages = pic.copies.businessImgS3.key;
					}else{
						businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
					}

				}else{
					businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
				}

				var img = businessData.businessImages;
				var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;
				
				fBshare(url,title,description,image);
			}//businessData
		}//reviewData
		
	},

	'click .busPagegpShare ':function(){
		var url = window.location.href;
		// googleplusshare(url);

		var id = $('.busPagegpShare').attr('id');
		var reviewData = Review.findOne({'_id':id});
		if(reviewData){
			var title       = reviewData.businessLink;
			var description = reviewData.reviewComment;

			var businessData = Business.findOne({'businessLink':title});
			if(businessData){
				if(businessData.businessImages){
					var pic = BusinessImgUploadS3.findOne({"_id":businessData.businessImages[0].img});
					if(pic){
						businessData.businessImages = pic.copies.businessImgS3.key;
					}else{
						businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
					}

				}else{
					businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
				}

				var img = businessData.businessImages;
				var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;

				
				shareToGooglePlus(url,title,description,image);
			}//businessData
		}//reviewData
	}

});
