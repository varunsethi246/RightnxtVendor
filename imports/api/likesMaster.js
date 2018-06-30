import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from './businessMaster.js';

export const Likes = new Mongo.Collection('likes');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('businessLikes', function businessLikes(businessLink) {
  	var businessObj = Business.findOne({"businessLink" : businessLink});
  	if(businessObj){
	    return Likes.find({"businessId":businessObj._id});  		
  	}
  });

  Meteor.publish('userBusinessLikes', function businessLikes() {

	    return Likes.find({"userid":this.userId});  		
  });
  
  Meteor.publish('businessLikesCount', function businessLikesCount() {
	    return Likes.find({});  		
  });
}


// _id :  xxxxxx,
// 	userid:  userId, meteor.userId
// 	businessId: xxxxxx,
// 	createdAt = new Date(),

Meteor.methods({
	'insertLikes':function(businessurl,actInact){
		var businessObj = Business.findOne({"businessLink":businessurl});
		
		if(businessObj){
			var businessId = businessObj._id;
			if(actInact == 'inactive'){
				Likes.remove({'businessId':businessId});
			}else{
				Likes.insert({ 
				 	'userid'        : Meteor.userId(),
				 	'username'		  : Meteor.user().profile.name,
				 	'businessId'	  : businessId,
				 	'businessLink'	: businessurl,
					'createdAt'     : new Date(),
					// 'busLiked'		:'userNotliked',
					}, function(error,result){
						if(error){
							return error;
						}else{
							if(result){
								return result; 
							}
						}
					}

				);				
			}
		}		
	
	},
});