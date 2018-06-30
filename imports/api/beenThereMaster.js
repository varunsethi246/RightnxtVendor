import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from './businessMaster.js';

export const BeenThere = new Mongo.Collection('beenThere');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('beenThere', function beenThere(businessLink) {
  	var businessObj = Business.findOne({"businessLink" : businessLink});
  	if(businessObj){
	    return BeenThere.find({"businessId":businessObj._id});  		
  	}
  });

  Meteor.publish('userBeenThere', function userBeenThere() {
	    return BeenThere.find({"userId":this.userId});  		
  });
  Meteor.publish('alluserBeenThere', function alluserBeenThere() {
	    return BeenThere.find({});  		
  });
  Meteor.publish('businessBeenThereCount', function businessBeenThereCount() {
	    return BeenThere.find({});  		
  });
}

Meteor.methods({
	'insertBeenThere':function(businessurl,actInact){

		var businessObj = Business.findOne({"businessLink":businessurl});
		if(businessObj){
			businessId 			= businessObj._id;
			if(actInact == 'inactive'){
				BeenThere.remove({'businessId':businessId});
			}else{
				BeenThere.insert({ 
				 	'userId'        	: Meteor.userId(),
				 	'businessId'		: businessId,
				 	'businessLink'		: businessurl,
					'createdAt'     	: new Date().toLocaleString(),
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