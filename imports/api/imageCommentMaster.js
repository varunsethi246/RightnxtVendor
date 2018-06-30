import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const ImageComment = new Mongo.Collection('imageComment');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('imageComment', function imageComment(businessLink) {
    return ImageComment.find({"businessLink": businessLink});
  });

  Meteor.publish('imgComment', function() {
    return ImageComment.find({"userId": this.userId});
  });
}

Meteor.methods({
	'insertImageComment' : function(formValues){
		ImageComment.insert({ 
			"imgcomment"			: formValues.imgcomment,
			"userId" 				: formValues.userId,
			"businessLink" 			: formValues.businessLink,
			"imgCommentDate" 		: new Date(),
			"imgId" 	 			: formValues.imgId,
			"imgMultiComment"		: [],
		}, function(error,result){
				if(error){
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},
	'insertImgCommntOfCmmnt':function(formValues){
		var imageComment = ImageComment.findOne({"_id":formValues.commentId});
		var replyId = '';
		if(imageComment.imgMultiComment){
			replyId = imageComment.imgMultiComment.length;
		}else{
			replyId = 0;
		}

		var multiComment = {
			"replyId"				: replyId,
			"imgcomment"			: formValues.imgcomment,
			"userId" 				: formValues.userId,
			"imgCommentDate" 		: new Date(),
		};

		ImageComment.update(
			{_id: formValues.commentId},
			{$push : { 
				"imgMultiComment"  : multiComment,
				}
			}, 
			function(error,result){
				if(error){
					return error;
				} 
				if(result){
					return result;
				}
			}
		);
	},
	'deleteImageComment': function(formValues){
		ImageComment.remove({"businessLink":formValues.businessLink,"imgId":formValues.imgId, "userId":formValues.userId});
	},
	'deleteReplyImageComment':function(formValues){
		ImageComment.update(
			{"_id": formValues.commentDocId},
			{$pull: 
					{
						"imgMultiComment": { "replyId":formValues.replyId} 
					} 
			},
			function(error,result){
				if(error){
					return error;
				} 
				if(result){
					return result;
				}
			}
		);
	},
	'updateImgCommnt':function(formValues){
		ImageComment.update(
			{"_id": formValues.commentId},
			{$set: 	{
						"imgcomment":formValues.imgcomment,
					}
			},
			function(error,result){
				if(error){
					return error;
				} 
				if(result){
					return result;
				}
			}
		);
	},
	'updateReplyImgCommnt':function(formValues){
       ImageComment.update({"_id": formValues.commentId,
					       	'imgMultiComment':
					                    {
					                        $elemMatch:
					                        { 
					                          'replyId' : formValues.replyId,
					                          // "imgMultiComment.userId":formValues.userId,
					                          }
					                    }
          },
          {$set:{ 
              ['imgMultiComment.$.imgcomment'] : formValues.imgcomment,
              
              }
          },
        );
	}
});


