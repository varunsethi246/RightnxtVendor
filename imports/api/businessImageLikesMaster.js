import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import { Business } from './businessMaster.js';

export const BussImgLikes = new Mongo.Collection('bussImgLikes');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('busImageLikesCount', function() {
  	Counts.publish(this, 'busImageLikesCount', BussImgLikes.find({}));
  });

  Meteor.publish('bussImgLikes', function bussImgLikes() {
	    return BussImgLikes.find({});
  });
}


Meteor.methods({
	'insertBussImgLikes':function(formValues,actInact){	
	if(actInact == 'inactive'){
		BussImgLikes.remove({'userid' : Meteor.userId(),"LikedImage":formValues.LikedImage});
	}else{
		BussImgLikes.insert({ 
		 	'userid'        : Meteor.userId(),
		 	'businessurl'   : formValues.businessLink,
			"LikedImage"	: formValues.LikedImage,
			'createdAt'     : new Date(),
			// 'busLiked'		:'userNotliked',
				}, function(error,result){
					if(error){
						return error;
					}
					if(result){
						return result; 
					}
				}
			);			
		}		
	},
});