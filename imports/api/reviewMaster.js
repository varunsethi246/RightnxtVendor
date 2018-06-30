import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { ReviewCommentLikes } from './reviewCommentLikesMaster.js';
export const Review = new Mongo.Collection('review');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('review', function review(businessLink) {
    return Review.find({"businessLink": businessLink});
  });

  Meteor.publish('reviewUser', function() {
    return Review.find({"userId": this.userId});
  });

  Meteor.publish('allreviews', function allreviews() {
    return Review.find({});
  });

 Meteor.publish('businessReviewsCount', function() {
    return Review.find({});
 });


  Meteor.publish('businessListReview',function(){
  	return Review.find({},{fields:{"businessLink":1,"rating":1}});
  });

  Meteor.publish('reviewCount', function() {
  	Counts.publish(this, 'reviewCount', Review.find({}));
  });

  Meteor.publish('searchListReview',function(){
  	return Review.find({},{fields:{"businessLink":1,"rating":1}});
  });


}

Meteor.methods({
	'insertReview':function(formValues){
		return Review.insert({  
			"userId"  				: Meteor.userId(),  
			"businessLink"			: formValues.businessLink,
			"reviewDate"			: new Date(),
			"rating" 				: formValues.rating,
			"reviewComment" 		: formValues.reviewComment,
			"reviewImages"			: [],
			"tagedFriends"          : formValues.tagedFriends,
		});		
	},
	
	'updateReviewBulkImg' : function(reviewId,filePath){
		var imgData = {
			img : filePath,
		}
		// console.log(reviewId);

		Review.update(
			{"_id": reviewId},
			{$push : {"reviewImages": imgData}},
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);		
	},
	'removePublishedReviewImage': function(id, img){
		Review.update({"_id":id,"reviewImages.img":img},{$unset:{"reviewImages.$":1}},{"multi":true});
		Review.update({"_id":id},{$pull:{"reviewImages":null}},{"multi":true});
		
	},
	'removePublishedReviewUser': function(id, tagFrnd){
		Review.update({"_id":id},{$pull:{"tagedFriends":tagFrnd}});
	},

	'insertUserComment' : function(id, userComment){
		var reviews = Review.findOne({"_id":id});

		// console.log('id: ',id);
		if(reviews){
			if(reviews.userComments){
				if (reviews.userComments.length > 0) {
					var userComments  = reviews.userComments;
					userComments.sort(function (a,b){
									  if (a.userCommentId < b.userCommentId)
									    return 1;
									  if (a.userCommentId > b.userCommentId)
									    return -1;
									  return 0;
									});
					// console.log('userComments: ', userComments);
					var maxUserCommentId = userComments[0].userCommentId + 1;
					// console.log('maxUserCommentId1: ',maxUserCommentId);
				}else{
					var maxUserCommentId = 0;
					// console.log('maxUserCommentId2: ',maxUserCommentId);
				}
			}else{
				var maxUserCommentId = 0;
			}

			var userCommentObj = {
				"userCommentId"     : maxUserCommentId,
				"userComment" 		: userComment,
				"userCommentDate" 	: new Date(),
				"userId" 			: Meteor.userId(),
			};

			Review.update(
				{"_id" : id},
				{$push : {"userComments": userCommentObj }},
				function(error,result){
					if(error){
						console.log(error);
						return error;
					}
					if(result){
						return result;
					}
				}
			);

		}
		
	},

	'insertCommentReply' : function(commentReply, reviewId, reviewUser, commentId, businesslink){
		var reviews = Review.findOne({"_id":reviewId});
		if(reviews){
			if(reviews.commentReply){
				if (reviews.commentReply.length > 0) {
					var commentRep  = reviews.commentReply;
					commentRep.sort(function (a,b){
									  if (a.userReplyId < b.userReplyId)
									    return 1;
									  if (a.userReplyId > b.userReplyId)
									    return -1;
									  return 0;
									});
					// console.log('userComments: ', commentReply);
					var replyId = commentRep[0].userReplyId + 1;
					// console.log('maxUserCommentId1: ',replyId);
				}else{
					var replyId = 0;
					// console.log('maxUserCommentId2: ',replyId);
				}
			}else{
				var replyId = 0;
			}

			var userCommentObj = {
				"userReplyId"		: replyId,
				"userCommentId"     : commentId,
				"commentReply" 		: commentReply,
				"commentReplyDate" 	: new Date(),
				"userId" 			: Meteor.userId(),
			};

			Review.update(
				{"_id" : reviewId},
				{$push : {"commentReply": userCommentObj }},
				function(error,result){
					if(error){
						console.log(error);
						return error;
					}
					if(result){
						return result;
					}
				}
			);
		}
	},

	'insertOtherUserComment' : function(reviewid, userId,userComment){
		
		var userCommentObj = {
			"userComment" 		: userComment,
			"userCommentDate" 	: new Date(),
			"userId" 			: userId,
		};

		Review.update(
			{"_id" : reviewid},
			{$push : {"userComments": userCommentObj }},
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},

	'insertReviewLike' : function(id){
		var likeObj = {
			"likedByUser" : Meteor.userId(),
			"likeDate"    : new Date(),
		};
		Review.update(
			{"_id" : id},
			{$push : {"reviewLikes": likeObj }},
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},

	'removeReviewLike' : function(id){
		var likeObj = {
			"likedByUser" : Meteor.userId(),
		};
		Review.update(
			{"_id" : id},
			{$pull : {"reviewLikes": likeObj }},
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);		
	},
	'deleteReview' : function(id){
		var reviewData = Review.findOne({'_id': id});
		if(reviewData){
			if(reviewData.reviewImages){
				if (reviewData.reviewImages.length > 0){
					for (var i = 0; i < reviewData.reviewImages.length; i++) {
						UserReviewStoreS3New.remove({"_id": reviewData.reviewImages[i].img}); 
					}
				}
			}
			// if(reviewData.businesLink){
			// 	var businessData = Business.findOne({'businesLink': reviewData});
			// 	if(businessData){
			// 		Business.update(
			// 			{"_id" : businessData._id},
			// 			{$pull : {"latestRating": reviewData.rating}}
			// 		);
			// 	}
			// }
		}

		var reviewLikeData = ReviewCommentLikes.find({'reviewId':id}).fetch();
		if(reviewLikeData){
			for (var j = 0; j < reviewLikeData.length; j++) {
				ReviewCommentLikes.remove({"reviewId":id});
			}
		}

		Review.remove(
			{"_id" : id},
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		); 

	},

	'removeUserPhotos' : function(id,formValues){
		for(var i = 0; i<formValues.length; i++){
			Review.update(
				{"_id":id},
				{$pull: 
					{'reviewImages': formValues[i]
					}
				}
			);
		}
	},


	'deletecomment' : function(id,commentId,reviewID,postedByID,businesLink){
		if(Meteor.userId()){
			Review.update(
				{"_id" : id},
				{$pull: 
						{
							'userComments': {"userCommentId" : commentId }, 
						}
				}
			); 
		}
		var reviewData = Review.findOne({'_id': id});
		if(reviewData){
			if(reviewData.commentReply){
				for (var j = 0; j < reviewData.commentReply.length; j++) {
					if(reviewData.commentReply[j].userCommentId == commentId){
						// var index = j;
						Review.update(
							{"_id" : id},
							{$unset: 
									{
										['commentReply.'+j] : commentId , 
									}
							}
						); 
					}
				}
				Review.update(
							{"_id" : id},
							{$pull: 
									{
										'commentReply' : null , 
									}
							},
							{multi:true}
						); 
			}
		}

		var checkReviewCommentLike = ReviewCommentLikes.findOne({
			"reviewPostedBy"	: postedByID,
			"reviewId"			: reviewID,
			"commentId"			: commentId.toString(),
			"replyId"			: '',			  
		});
		
		if(checkReviewCommentLike){
			ReviewCommentLikes.remove({ "_id" : checkReviewCommentLike._id});
		}

		var checkReviewCommentReplyLike = ReviewCommentLikes.find({
			"businessLink"		: businesLink,
			"reviewPostedBy"	: postedByID,
			"reviewId"			: reviewID,		
			"commentId"			: commentId.toString(),
		}).fetch();

		if(checkReviewCommentReplyLike){
			for (var i = 0; i < checkReviewCommentReplyLike.length; i++) {
				ReviewCommentLikes.remove({ "_id" : checkReviewCommentReplyLike[i]._id});
			}
		}
	},

	'deleteReply' : function(id,commentId,cId,postedByID,businesLink){
		var reviewData = Review.findOne({'_id': id});
		if(reviewData){
			if(reviewData.commentReply){
				for (var j = 0; j < reviewData.commentReply.length; j++) {
					if(reviewData.commentReply[j].userReplyId == commentId){
						// var index = j;
						Review.update(
							{"_id" : id},
							{$unset: 
									{
										['commentReply.'+j] : commentId , 
									}
							}
						); 
					}
				}
				Review.update(
					{"_id" : id},
					{$pull: 
							{
								'commentReply' : null , 
							}
					}
				); 
			}
		}

		var checkReviewCommentReplyLike = ReviewCommentLikes.find({
			"businessLink"		: businesLink,
			"reviewPostedBy"	: postedByID,
			"reviewId"			: id,		
			"commentId"			: cId.toString(),
			"replyId"			: commentId.toString(),
		}).fetch();

		if(checkReviewCommentReplyLike){
			for (var i = 0; i < checkReviewCommentReplyLike.length; i++) {
				ReviewCommentLikes.remove({ "_id" : checkReviewCommentReplyLike[i]._id});
			}
		}
	},

	'updateCommentEdit':function(id,userComment,commentId){
		Review.update(
			{"_id" : id, "userComments.userCommentId" : commentId},
			{$set :{
					 'userComments.$.userComment' : userComment,
					 'userComments.$.userCommentDate' : new Date(),
			       }
			}
		);
	},

	'updateReplyEdit':function(id,userComment,commentId){
		Review.update(
			{"_id" : id, "commentReply.userReplyId" : commentId},
			{$set :{
					 'commentReply.$.commentReply' : userComment,
					 'commentReply.$.commentReplyDate' : new Date(),
			       }
			}
		);
	},

	'updateRevCommentEdit':function(id,revComment,taggedPpl,totalRating){
		var taggedArr = [];
		// console.log('in meteor call');
		for(i=0;i<taggedPpl.length;i++){
			taggedArr.push(taggedPpl[i].selectedUserId);
		}
		Review.update(
			{_id : id},
			{$set :{
					reviewComment 	: revComment,
					rating 			: totalRating,
					reviewDate 		: new Date(),
					tagedFriends	: taggedArr,
				}
			}
		);
	}

});
