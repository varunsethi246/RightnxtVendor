import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from './businessMaster.js';

export const Bookmark = new Mongo.Collection('bookmark');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('bookmark', function bookmark(businessLink) {
  	var businessObj = Business.findOne({"businessLink" : businessLink});
  	if(businessObj){
	    return Bookmark.find({"businessId":businessObj._id});  		
  	}
  });

  Meteor.publish('userBookmark', function userBookmark() {
	    return Bookmark.find({"userId":this.userId});  		
  });

  Meteor.publish('allBookmark', function allBookmark() {
	    return Bookmark.find({});  		
  });
}

Meteor.methods({
	'insertBookmark':function(businessurl,actInact){

		var businessObj = Business.findOne({"businessLink":businessurl});
		if(businessObj){
			businessId 			= businessObj._id;
			if(actInact == 'inactive'){
				Bookmark.remove({'businessId':businessId});
			}else{
				Bookmark.insert({ 
				 	'userId'        	: Meteor.userId(),
				 	'businessId'		: businessId,
				 	'businessLink'		: businessurl,
					'createdAt'     	: new Date(),
					'date'				: moment().format('DD/MM/YYYY'),
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
		}		
	
	},
});