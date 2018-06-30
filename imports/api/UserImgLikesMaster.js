import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
// import { Business } from './businessMaster.js';

export const UserImgLikes = new Mongo.Collection('userImgLikes');

if (Meteor.isServer) {
  // This code only runs on the server
  // Meteor.publish('userImgLikesCount', function() {
  // 	Counts.publish(this, 'userImgLikesCount', BussImgLikes.find({}));
  // });

  Meteor.publish('userImgLikes', function userImgLikes() {
	    return UserImgLikes.find({});
  });
}


Meteor.methods({
	'insertUserImgLikes':function(imgId,actInact){	
	if(actInact == 'activelike'){
		UserImgLikes.remove({'userid' : Meteor.userId(),"LikedImage":imgId});
	}else{
		UserImgLikes.insert({ 
		 	'userid'        : Meteor.userId(),
			"LikedImage"	: imgId,
			'createdAt'     : new Date(),
				}, function(error,result){
					if(error){
						console.log(error.message);
					}
					if(result){
						return result; 
					}
				}
			);			
		}		
	},
});