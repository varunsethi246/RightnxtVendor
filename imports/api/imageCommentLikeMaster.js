import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import { ImageComment } from '/imports/api/imageCommentMaster.js';



export const ImageCommentLike = new Mongo.Collection('imageCommentLike');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('imageCommentLike', function imageCommentLike(businessLink) {
    return ImageCommentLike.find({"businessLink": businessLink});
  });

}

Meteor.methods({
	'insertImageCommentLike' : function(formValues){


		var selector = {
			"businessLink"		: formValues.businessLink,
			"imgId"				: formValues.imgId,
			"userId"			: Meteor.userId(),
			"replyId"			: '',
			"commentDocId"		: formValues.commentDocId,
		}
		var imageCommentLike = ImageCommentLike.findOne(selector);
		
		if(imageCommentLike){
			return ImageCommentLike.remove(selector);
		}else{
			return ImageCommentLike.insert({  
				"userId" 				: formValues.userId,
				"businessLink" 			: formValues.businessLink,
				"imgLikeDate" 			: new Date(),
				"replyId"				: '',
				"imgId" 	 			: formValues.imgId,
				"commentDocId"			: formValues.commentDocId,			
			});		
		}	
	},

	'insertCommentReplyLike':function(formValues){

		var selector = {
			"userId"			: Meteor.userId(),
			"businessLink"		: formValues.businessLink,
			"imgId"				: formValues.imgId,
			"replyId"			: formValues.commentId,			
			"commentDocId"		: formValues.commentDocId,
		}

		var checkCommentReplyLike = ImageCommentLike.findOne(selector);

		if(checkCommentReplyLike){
			return ImageCommentLike.remove(selector);
		}else{
			return ImageCommentLike.insert({  
				"userId"			: Meteor.userId(),
				"businessLink"		: formValues.businessLink,
				"imgLikeDate" 		: new Date(),
				"replyId"			: formValues.commentId,			
				"imgId"				: formValues.imgId,
				"commentDocId"		: formValues.commentDocId,			
			});		
		}

	},
	'deleteImageCommentLike': function(formValues){
		ImageCommentLike.remove({"businessLink":formValues.businessLink,"imgId":formValues.imgId, "commentDocId":formValues.commentDocId, "replyId":""});
	},
	'deleteReplyImageCommentLike':function(formValues){
		ImageCommentLike.remove({"businessLink":formValues.businessLink,"imgId":formValues.imgId, "commentDocId":formValues.commentDocId, "replyId":((formValues.replyId).toString())});
		
	}
	
});


