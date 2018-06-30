import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const ReviewCommentLikes = new Mongo.Collection('reviewCommentLikes');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('reviewCommentLikes', function review(businessLink) {
    return ReviewCommentLikes.find({"businessLink": businessLink});
  });

  Meteor.publish('reviewCommLikes', function reviewCommLikes(){
    return ReviewCommentLikes.find({});
  });

}

Meteor.methods({
	'insertReviewCommentLike':function(businessLink, reviewPostedByUser,reviewId,commentId){
		var checkReviewCommentLike = ReviewCommentLikes.findOne({
			"businessLink"		: businessLink,
			"reviewPostedBy"	: reviewPostedByUser,
			"reviewId"			: reviewId,
			"commentId"			: commentId,
			"replyId"			: '',			
			"likedByUserId"		: Meteor.userId(),  
		});
		
		if(checkReviewCommentLike){
			return ReviewCommentLikes.remove({ "_id" : checkReviewCommentLike._id,});
		}else{
			return ReviewCommentLikes.insert({  
				"businessLink"		: businessLink,
				"reviewPostedBy"	: reviewPostedByUser,
				"reviewId"			: reviewId,
				"commentId"			: commentId,
				"replyId"			: '',
				"likedByUserId"		: Meteor.userId(),  
				"createdAt"			: new Date(),			
			});		
		}		
	},


	'insertReviewTimelineCommentLike':function(reviewPostedByUser,reviewId,commentId){
		var checkReviewCommentLike = ReviewCommentLikes.findOne({
			"reviewPostedBy"	: reviewPostedByUser,
			"reviewId"			: reviewId,
			"commentId"			: commentId,
			"replyId"			: '',			
			"likedByUserId"		: Meteor.userId(),  
		});
		
		if(checkReviewCommentLike){
			return ReviewCommentLikes.remove({ "_id" : checkReviewCommentLike._id,});
		}else{
			return ReviewCommentLikes.insert({  
				
				"reviewPostedBy"	: reviewPostedByUser,
				"reviewId"			: reviewId,
				"commentId"			: commentId,
				"replyId"			: '',
				"likedByUserId"		: Meteor.userId(),  
				"createdAt"			: new Date(),			
			});		
		}		
	},


	'insertReviewCommentReplyLike':function(businessLink,reviewPostedByUser,reviewId,replyId,commentId){
		var checkReviewCommentReplyLike = ReviewCommentLikes.findOne({
				"businessLink"		: businessLink,
				"reviewPostedBy"	: reviewPostedByUser,
				"reviewId"			: reviewId,
				"commentId"			: commentId,
				"replyId"			: replyId,			
				"likedByUserId"		: Meteor.userId(),
			});

		if(checkReviewCommentReplyLike){
			return ReviewCommentLikes.remove({ "_id" : checkReviewCommentReplyLike._id,});
		}else{
			return ReviewCommentLikes.insert({  
				"businessLink"		: businessLink,
				"reviewPostedBy"	: reviewPostedByUser,
				"reviewId"			: reviewId,
				"commentId"			: commentId,
				"replyId"			: replyId,
				"likedByUserId"		: Meteor.userId(),  
				"createdAt"			: new Date(),			
			});		
		}		

	},

});